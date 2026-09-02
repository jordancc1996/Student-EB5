import { useState, useEffect, useCallback, useId, useRef } from 'react';
import { X, CheckCircle, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import FormcarryHoneypot from '@/components/FormcarryHoneypot';
import { FORM_FIELD_MAX, FORM_PHONE_FORMAT_ERROR, FORMCARRY_GENERIC_ERROR, isPermissivePhone, submitToFormcarry } from '@/lib/formcarry';
import { useFocusTrap } from '@/hooks/useFocusTrap';

const BLOCKED_DOMAINS = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'aol.com', 'icloud.com'];

const SuccessMessage = ({ name, onClose, titleId, descriptionId }: { name: string; onClose: () => void; titleId: string; descriptionId: string }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
      setTimeout(() => {
        document.getElementById('consultation-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="text-center py-4">
      <CheckCircle size={48} className="text-primary mx-auto mb-4" />
      <h3 id={titleId} className="font-serif font-bold text-xl text-foreground mb-2">Your Guide Is Downloading!</h3>
      <p id={descriptionId} className="text-muted-foreground text-sm">
        Thanks, {name}! Your H-1B to EB-5 Guide should be downloading now. Check your downloads folder.
      </p>
    </div>
  );
};

interface GuideDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GuideDownloadModal = ({ isOpen, onClose }: GuideDownloadModalProps) => {
  const titleId = useId();
  const descriptionId = useId();
  const emailErrorId = useId();
  const submitErrorId = useId();
  const phoneErrorId = useId();
  const modalRef = useRef<HTMLDivElement>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [occupation, setOccupation] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [gotcha, setGotcha] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setSubmitted(false);
      setName('');
      setEmail('');
      setPhone('');
      setOccupation('');
      setEmailError('');
      setSubmitError('');
      setPhoneError('');
      setGotcha('');
    }
  }, [isOpen]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  useFocusTrap(isOpen, modalRef, handleClose);

  const validateEmail = (value: string) => {
    const domain = value.split('@')[1]?.toLowerCase();
    if (domain && BLOCKED_DOMAINS.includes(domain)) {
      setEmailError('Please use your work or educational email address to access premium EB-5 updates');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) return;
    if (!isPermissivePhone(phone)) {
      setPhoneError(FORM_PHONE_FORMAT_ERROR);
      return;
    }

    setSubmitting(true);
    setSubmitError('');
    const result = await submitToFormcarry({
      name,
      email,
      phone,
      occupation,
      source: 'H1B Guide Download',
      _gotcha: gotcha,
    });
    if (result.ok) {
      setSubmitted(true);
      const link = document.createElement('a');
      link.href = '/StudentEB5_H1B_Guide_2026.pdf';
      link.download = 'H1B-to-Green-Card-EB-5-Guide-2026.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      setSubmitError(result.message || FORMCARRY_GENERIC_ERROR);
    }
    setSubmitting(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={handleClose}>
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="relative bg-card border border-border rounded-2xl shadow-2xl max-w-md w-full p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Close"
        >
          <X size={20} aria-hidden="true" />
        </button>

        {!submitted ? (
          <>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Download size={20} className="text-primary" />
              </div>
              <h2 id={titleId} className="font-serif font-bold text-xl md:text-2xl text-foreground leading-tight">
                Download the EB-5 Guide
              </h2>
            </div>
            <p id={descriptionId} className="text-muted-foreground text-sm mb-6 leading-relaxed">
              Enter your details below to get instant access to the H-1B to EB-5 Guide.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <FormcarryHoneypot value={gotcha} onChange={setGotcha} />
              <div className="space-y-1">
                <Label htmlFor="guide-name">Full Name *</Label>
                <Input
                  id="guide-name"
                  type="text"
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={FORM_FIELD_MAX.name}
                  required
                  className="h-11"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="guide-email">Work or School Email *</Label>
                <Input
                  id="guide-email"
                  type="email"
                  placeholder="Work or school email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError('');
                  }}
                  required
                  maxLength={FORM_FIELD_MAX.email}
                  aria-invalid={emailError ? true : undefined}
                  aria-describedby={emailError ? emailErrorId : undefined}
                  className={`h-11 ${emailError ? 'border-destructive' : ''}`}
                />
                <p className="text-muted-foreground text-xs mt-1">100% confidential. We never contact your employer.</p>
                {emailError ? (
                  <p id={emailErrorId} role="alert" className="text-destructive text-xs mt-1">{emailError}</p>
                ) : null}
              </div>
              <div className="space-y-1">
                <Label htmlFor="guide-phone">Phone Number (optional)</Label>
                <Input
                  id="guide-phone"
                  type="tel"
                  placeholder="Phone number (optional)"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    setPhoneError('');
                  }}
                  maxLength={FORM_FIELD_MAX.phone}
                  aria-invalid={phoneError ? true : undefined}
                  aria-describedby={phoneError ? phoneErrorId : undefined}
                  className="h-11"
                />
                {phoneError ? (
                  <p id={phoneErrorId} role="alert" className="text-destructive text-xs mt-1">{phoneError}</p>
                ) : null}
              </div>
              <div className="space-y-1">
                <Label htmlFor="guide-occupation">Occupation *</Label>
                <Input
                  id="guide-occupation"
                  type="text"
                  placeholder="Occupation (e.g., Software Engineer)"
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
              {submitError ? (
                <p id={submitErrorId} role="alert" className="text-destructive text-xs mt-1">{submitError}</p>
              ) : null}
              <Button
                type="submit"
                disabled={submitting}
                className="w-full h-11 font-semibold text-sm uppercase tracking-wide"
              >
                {submitting ? 'Submitting...' : 'Get the Guide'}
              </Button>
            </form>
          </>
        ) : (
          <SuccessMessage name={name} onClose={handleClose} titleId={titleId} descriptionId={descriptionId} />
        )}
      </div>
    </div>
  );
};

export default GuideDownloadModal;
