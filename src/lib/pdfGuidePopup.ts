import { getConsentPreferences } from '@/lib/cookieConsent';

export type PdfGuideCategory = 'h1b' | 'student' | 'investor';

export const PDF_GUIDE_POPUP_COOKIE = 'seb5_pdf_guide_popup';
export const PDF_GUIDE_POPUP_SUBMITTED_SESSION = 'seb5_pdf_guide_submitted';
export const PDF_GUIDE_POPUP_SESSION = 'seb5_pdf_guide_shown_session';
export const PDF_GUIDE_POPUP_COOKIE_DAYS = 30;

export const PDF_GUIDE_HARD_FLOOR_MS = 20_000;
export const PDF_GUIDE_DWELL_MS = 60_000;
export const PDF_GUIDE_SCROLL_THRESHOLD = 0.6;

export interface PdfGuideOfferCopy {
  headline: string;
  subhead: string;
  formSource: string;
  /** Placeholder — finalized after user supplies PDF assets */
  placeholderPdfPath: string;
  placeholderDownloadName: string;
}

export const PDF_GUIDE_OFFER_COPY: Record<PdfGuideCategory, PdfGuideOfferCopy> = {
  h1b: {
    headline: 'Your H-1B to Green Card guide',
    subhead: 'A concise EB-5 roadmap for professionals ready to move beyond visa uncertainty.',
    formSource: 'PDF Guide Popup – H-1B',
    placeholderPdfPath: '/StudentEB5_Guide_2026.pdf',
    placeholderDownloadName: 'H1B-to-Green-Card-EB-5-Guide-2026.pdf',
  },
  student: {
    headline: 'Your F-1 to Green Card guide',
    subhead: 'See how self-sponsored EB-5 can secure your future after graduation.',
    formSource: 'PDF Guide Popup – F-1 Student',
    placeholderPdfPath: '/StudentEB5_Guide_2026.pdf',
    placeholderDownloadName: 'F1-to-Green-Card-EB-5-Guide-2026.pdf',
  },
  investor: {
    headline: "The EB-5 investor's guide",
    subhead: 'Clear due-diligence framing for families evaluating a U.S. green card through investment.',
    formSource: 'PDF Guide Popup – Investor',
    placeholderPdfPath: '/StudentEB5_Guide_2026.pdf',
    placeholderDownloadName: 'EB-5-Investors-Guide-2026.pdf',
  },
};

const EXCLUDED_PATH_PREFIXES = ['/contact'];

export function getNormalizedPathname(): string {
  if (typeof window === 'undefined') return '/';
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  return path.toLowerCase();
}

export function isPdfGuidePopupExcludedPath(pathname = getNormalizedPathname()): boolean {
  return EXCLUDED_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function hasSubmittedPdfGuidePopupThisSession(): boolean {
  try {
    return sessionStorage.getItem(PDF_GUIDE_POPUP_SUBMITTED_SESSION) === '1';
  } catch {
    return false;
  }
}

export function markPdfGuidePopupSubmittedSession(): void {
  try {
    sessionStorage.setItem(PDF_GUIDE_POPUP_SUBMITTED_SESSION, '1');
  } catch {
    // ignore
  }
}

export function hasShownPdfGuidePopupThisSession(): boolean {
  try {
    return sessionStorage.getItem(PDF_GUIDE_POPUP_SESSION) === '1';
  } catch {
    return false;
  }
}

export function markPdfGuidePopupShownSession(): void {
  try {
    sessionStorage.setItem(PDF_GUIDE_POPUP_SESSION, '1');
  } catch {
    // ignore
  }
}

export function isPdfGuidePopupSuppressed(): boolean {
  if (typeof document === 'undefined') return true;
  const match = document.cookie.match(
    new RegExp(`(?:^|;\\s*)${PDF_GUIDE_POPUP_COOKIE}=([^;]*)`),
  );
  return Boolean(match?.[1]);
}

export function setPdfGuidePopupSuppressionCookie(): void {
  const expires = new Date(
    Date.now() + PDF_GUIDE_POPUP_COOKIE_DAYS * 86_400_000,
  ).toUTCString();
  document.cookie = `${PDF_GUIDE_POPUP_COOKIE}=1;expires=${expires};path=/;SameSite=Lax`;
}

export function hasMarketingConsentForPopup(): boolean {
  const prefs = getConsentPreferences();
  return prefs?.marketing === true;
}

export function resolvePdfGuideCategory(pathname = getNormalizedPathname()): PdfGuideCategory {
  const path = pathname.toLowerCase();

  if (
    path === '/student-playbook' ||
    path.startsWith('/pathways/f1') ||
    path.includes('/f1-students/') ||
    path.includes('/f1-to-') ||
    path.endsWith('/opt-calculator') ||
    path.endsWith('/tuition-calculator')
  ) {
    return 'student';
  }

  if (
    path.startsWith('/pathways/h1b') ||
    path.endsWith('/h1b-lottery-odds-calculator') ||
    /\/h1b[-/]/.test(path) ||
    path.includes('-h1b') ||
    path.includes('h1b-')
  ) {
    return 'h1b';
  }

  return 'investor';
}

export function shouldEnablePdfGuidePopupTriggers(): boolean {
  if (isPdfGuidePopupExcludedPath()) return false;
  if (isPdfGuidePopupSuppressed()) return false;
  if (hasShownPdfGuidePopupThisSession()) return false;
  if (hasSubmittedPdfGuidePopupThisSession()) return false;
  if (!hasMarketingConsentForPopup()) return false;
  return true;
}

type PopupAnalyticsEvent = 'popup_shown' | 'popup_dismissed' | 'popup_submitted';

export function trackPdfGuidePopupEvent(
  event: PopupAnalyticsEvent,
  category: PdfGuideCategory,
): void {
  if (typeof window === 'undefined') return;

  const payload = {
    event,
    page_category: category,
    popup_type: 'pdf_guide_offer',
  };

  const dataLayer = (window as Window & { dataLayer?: Record<string, unknown>[] }).dataLayer;
  dataLayer?.push(payload);

  const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
  gtag?.('event', event, {
    page_category: category,
    popup_type: 'pdf_guide_offer',
  });
}

export function triggerPlaceholderPdfDownload(pdfPath: string, downloadName: string): void {
  const link = document.createElement('a');
  link.href = pdfPath;
  link.download = downloadName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
