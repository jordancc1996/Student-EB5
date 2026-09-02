import { useCallback, useId, useRef, useState } from 'react';
import { X, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import FormcarryHoneypot from '@/components/FormcarryHoneypot';
import { FORM_FIELD_MAX, FORM_PHONE_FORMAT_ERROR, FORMCARRY_GENERIC_ERROR, isPermissivePhone, submitToFormcarry } from '@/lib/formcarry';
import { useFocusTrap } from '@/hooks/useFocusTrap';

interface StudentLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'tuition' | 'guide';
}

const MODAL_CONFIG = {
  tuition: {
    title: 'Calculate Your Tuition Savings',
    subtitle: 'Enter your details to see how much you could save with in-state tuition rates.',
    buttonText: 'Get My Results →',
    source: 'Tuition Calculator CTA',
  },
  guide: {
    title: "Download the Student's EB-5 Guide",
    subtitle: 'Get the complete guide to the EB-5 pathway for international students.',
    buttonText: 'Download My Guide →',
    source: 'Student Guide Download',
  },
};

const StudentLeadModal = ({ isOpen, onClose, mode }: StudentLeadModalProps) => {
  const titleId = useId();
  const descriptionId = useId();
  const submitErrorId = useId();
  const phoneErrorId = useId();
  const modalRef = useRef<HTMLDivElement>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [gotcha, setGotcha] = useState('');

  const config = MODAL_CONFIG[mode];

  const handleClose = useCallback(() => {
    onClose();
    setTimeout(() => {
      setSubmitted(false);
      setName('');
      setEmail('');
      setPhone('');
      setSubmitError('');
      setPhoneError('');
      setGotcha('');
    }, 300);
  }, [onClose]);

  useFocusTrap(isOpen, modalRef, handleClose);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPermissivePhone(phone)) {
      setPhoneError(FORM_PHONE_FORMAT_ERROR);
      return;
    }
    setSubmitting(true);
    setSubmitError('');
    const result = await submitToFormcarry({ name, email, phone, source: config.source, _gotcha: gotcha });
    if (result.ok) {
      if (mode === 'tuition') {
        window.location.href = '/tools/tuition-calculator';
        return;
      }
      setSubmitted(true);
      const link = document.createElement('a');
      link.href = '/StudentEB5_Guide_2026.pdf';
      link.download = 'Student-EB5-Green-Card-Guide-2026.pdf';
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
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={handleClose}>
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="relative bg-card border border-border rounded-2xl shadow-2xl max-w-md w-full p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" onClick={handleClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors" aria-label="Close">
          <X size={20} aria-hidden="true" />
        </button>

        {submitted ? (
          <div className="text-center py-4">
            <CheckCircle size={48} className="text-primary mx-auto mb-4" />
            <h3 id={titleId} className="font-serif font-bold text-xl text-foreground mb-2">Your Guide Is Downloading!</h3>
            <p id={descriptionId} className="text-muted-foreground text-sm">
              Check your downloads folder. We'll also send a copy to your email.
            </p>
          </div>
        ) : (
          <>
            <h2 id={titleId} className="font-serif font-bold text-xl md:text-2xl text-foreground mb-2">
              {config.title}
            </h2>
            <p id={descriptionId} className="text-muted-foreground text-sm mb-6">
              {config.subtitle}
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <FormcarryHoneypot value={gotcha} onChange={setGotcha} />
              <div className="space-y-1">
                <Label htmlFor="student-lead-name">Full Name *</Label>
                <Input id="student-lead-name" type="text" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} maxLength={FORM_FIELD_MAX.name} required className="h-11" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="student-lead-email">Email *</Label>
                <Input id="student-lead-email" type="email" placeholder="Personal email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={FORM_FIELD_MAX.email} required className="h-11" />
                <p className="text-xs text-muted-foreground mt-1">100% confidential. We never contact your employer.</p>
              </div>
              <div className="space-y-1">
                <Label htmlFor="student-lead-phone">Phone Number (optional)</Label>
                <Input
                  id="student-lead-phone"
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
                  <p id={phoneErrorId} role="alert" className="text-destructive text-sm">{phoneError}</p>
                ) : null}
              </div>
              {submitError ? (
                <p id={submitErrorId} role="alert" className="text-destructive text-sm">{submitError}</p>
              ) : null}
              <Button type="submit" disabled={submitting} className="w-full h-11 rounded-full font-semibold text-sm">
                {submitting ? 'Submitting...' : config.buttonText}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default StudentLeadModal;
