import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { submitToFormcarry } from '@/lib/formcarry';
import {
  PDF_GUIDE_DWELL_MS,
  PDF_GUIDE_HARD_FLOOR_MS,
  PDF_GUIDE_OFFER_COPY,
  PDF_GUIDE_SCROLL_THRESHOLD,
  getNormalizedPathname,
  hasMarketingConsentForPopup,
  isPdfGuidePopupExcludedPath,
  isPdfGuidePopupSuppressed,
  hasShownPdfGuidePopupThisSession,
  hasSubmittedPdfGuidePopupThisSession,
  markPdfGuidePopupShownSession,
  markPdfGuidePopupSubmittedSession,
  resolvePdfGuideCategory,
  setPdfGuidePopupSuppressionCookie,
  shouldEnablePdfGuidePopupTriggers,
  trackPdfGuidePopupEvent,
  triggerPlaceholderPdfDownload,
  type PdfGuideCategory,
} from '@/lib/pdfGuidePopup';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  );
}

const PdfGuideOfferPopup = () => {
  const titleId = useId();
  const descriptionId = useId();
  const mountTimeRef = useRef(Date.now());
  const firedRef = useRef(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  const [category, setCategory] = useState<PdfGuideCategory>('investor');
  const [triggersEnabled, setTriggersEnabled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const refreshEligibility = useCallback(() => {
    const pathname = getNormalizedPathname();
    setCategory(resolvePdfGuideCategory(pathname));
    setTriggersEnabled(shouldEnablePdfGuidePopupTriggers());
  }, []);

  useEffect(() => {
    refreshEligibility();

    const onConsentUpdated = () => refreshEligibility();
    window.addEventListener('cookie-consent-updated', onConsentUpdated);
    return () => window.removeEventListener('cookie-consent-updated', onConsentUpdated);
  }, [refreshEligibility]);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setPrefersReducedMotion(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  const openPopup = useCallback(() => {
    if (firedRef.current) return;
    if (isPdfGuidePopupExcludedPath()) return;
    if (isPdfGuidePopupSuppressed()) return;
    if (hasShownPdfGuidePopupThisSession()) return;
    if (hasSubmittedPdfGuidePopupThisSession()) return;
    if (!hasMarketingConsentForPopup()) return;

    firedRef.current = true;
    const resolvedCategory = resolvePdfGuideCategory();
    setCategory(resolvedCategory);
    setPdfGuidePopupSuppressionCookie();
    markPdfGuidePopupShownSession();
    setIsOpen(true);
    trackPdfGuidePopupEvent('popup_shown', resolvedCategory);
  }, []);

  useEffect(() => {
    if (!triggersEnabled || isOpen) return;

    mountTimeRef.current = Date.now();
    firedRef.current = false;

    let dwellMs = 0;
    let lastVisibleAt = Date.now();
    let ticking = false;

    const elapsedSinceMount = () => Date.now() - mountTimeRef.current;

    const tryOpen = () => {
      if (firedRef.current) return;
      if (elapsedSinceMount() < PDF_GUIDE_HARD_FLOOR_MS) return;
      if (!shouldEnablePdfGuidePopupTriggers()) return;
      openPopup();
    };

    const syncDwell = () => {
      if (document.hidden || firedRef.current) return;
      const now = Date.now();
      dwellMs += now - lastVisibleAt;
      lastVisibleAt = now;
      if (dwellMs >= PDF_GUIDE_DWELL_MS) tryOpen();
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        syncDwell();
        return;
      }
      lastVisibleAt = Date.now();
    };

    const onScroll = () => {
      if (firedRef.current || ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        ticking = false;
        if (firedRef.current) return;
        const doc = document.documentElement;
        const scrollable = doc.scrollHeight - window.innerHeight;
        const ratio =
          scrollable <= 0 ? 1 : (window.scrollY + window.innerHeight) / doc.scrollHeight;
        if (ratio >= PDF_GUIDE_SCROLL_THRESHOLD) tryOpen();
      });
    };

    const dwellInterval = window.setInterval(syncDwell, 1000);
    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      window.clearInterval(dwellInterval);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('scroll', onScroll);
    };
  }, [triggersEnabled, isOpen, openPopup]);

  const closePopup = useCallback(
    (reason: 'dismiss' | 'success') => {
      setIsOpen(false);
      if (reason === 'dismiss') {
        trackPdfGuidePopupEvent('popup_dismissed', category);
      }
      setTriggersEnabled(false);
    },
    [category],
  );

  const handleDismiss = useCallback(() => {
    closePopup('dismiss');
  }, [closePopup]);

  useEffect(() => {
    if (!isOpen) return;

    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
    const modal = modalRef.current;
    if (!modal) return;

    const focusables = getFocusableElements(modal);
    focusables[0]?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        handleDismiss();
        return;
      }

      if (event.key !== 'Tab' || !modal) return;

      const items = getFocusableElements(modal);
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      previouslyFocusedRef.current?.focus();
    };
  }, [isOpen, handleDismiss]);

  const validateEmail = (value: string) => {
    if (!EMAIL_PATTERN.test(value.trim())) {
      setEmailError('Please enter a valid email address.');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateEmail(email)) return;

    setSubmitting(true);
    const copy = PDF_GUIDE_OFFER_COPY[category];

    await submitToFormcarry({
      email: email.trim(),
      source: copy.formSource,
      formType: 'pdf_guide_popup',
      pageCategory: category,
      pagePath: getNormalizedPathname(),
    });

    setPdfGuidePopupSuppressionCookie();
    markPdfGuidePopupSubmittedSession();
    trackPdfGuidePopupEvent('popup_submitted', category);
    triggerPlaceholderPdfDownload(copy.placeholderPdfPath, copy.placeholderDownloadName);

    setSubmitted(true);
    setSubmitting(false);
  };

  if (!isOpen) return null;

  const copy = PDF_GUIDE_OFFER_COPY[category];
  const motionClass = prefersReducedMotion
    ? ''
    : 'animate-in fade-in-0 duration-200';

  return (
    <div
      className={`fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4 sm:p-6 bg-foreground/25 backdrop-blur-[2px] ${motionClass}`}
      onClick={handleDismiss}
      data-popup-type="pdf_guide_offer"
      data-page-category={category}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className={`relative w-full max-w-[440px] rounded-2xl border border-border bg-card shadow-xl px-8 py-8 sm:px-10 sm:py-10 ${motionClass}`}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label="Close guide offer"
        >
          <X size={20} aria-hidden="true" />
        </button>

        {submitted ? (
          <div className="pt-2 text-center">
            <h2 id={titleId} className="font-serif text-xl md:text-2xl font-bold text-foreground leading-snug mb-3">
              Check your inbox
            </h2>
            <p id={descriptionId} className="text-muted-foreground text-base leading-relaxed">
              The guide is on its way. If it does not appear shortly, check your downloads folder.
            </p>
            <Button
              type="button"
              className="mt-6 w-full h-11 font-semibold"
              onClick={() => closePopup('success')}
            >
              Close
            </Button>
          </div>
        ) : (
          <>
            <h2
              id={titleId}
              className="font-serif text-xl md:text-2xl font-bold text-foreground leading-snug pr-10 mb-3"
            >
              {copy.headline}
            </h2>
            <p id={descriptionId} className="text-muted-foreground text-base leading-relaxed mb-6">
              {copy.subhead}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setEmailError('');
                  }}
                  required
                  className="h-11 text-base"
                />
                <p className="text-muted-foreground text-xs mt-2 leading-relaxed">
                  100% confidential. We never contact your employer.
                </p>
                {emailError ? (
                  <p className="text-destructive text-xs mt-1">{emailError}</p>
                ) : null}
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="w-full h-11 font-semibold text-sm"
              >
                {submitting ? 'Sending…' : 'Send me the guide'}
              </Button>

              <button
                type="button"
                onClick={handleDismiss}
                className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
              >
                Maybe later
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default PdfGuideOfferPopup;
