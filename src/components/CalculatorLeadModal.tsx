import { useCallback, useId, useRef, useState } from 'react';
import { X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import FormcarryHoneypot from '@/components/FormcarryHoneypot';
import { FORM_FIELD_MAX, FORM_PHONE_FORMAT_ERROR, FORMCARRY_GENERIC_ERROR, isPermissivePhone, submitToFormcarry } from '@/lib/formcarry';
import { useFocusTrap } from '@/hooks/useFocusTrap';

interface CalculatorLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CalculatorLeadModal = ({ isOpen, onClose }: CalculatorLeadModalProps) => {
  const titleId = useId();
  const descriptionId = useId();
  const submitErrorId = useId();
  const phoneErrorId = useId();
  const modalRef = useRef<HTMLDivElement>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [gotcha, setGotcha] = useState('');

  const handleClose = useCallback(() => {
    onClose();
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
    const result = await submitToFormcarry({
      name,
      email,
      phone,
      source: 'EB-5 Calculator CTA',
      _gotcha: gotcha,
    });
    if (result.ok) {
      window.location.href = '/tools/2026-eb5-investment-feasibility-calculator';
      return;
    }
    setSubmitError(result.message || FORMCARRY_GENERIC_ERROR);
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

        <h2 id={titleId} className="font-serif font-bold text-xl md:text-2xl text-foreground mb-2">
          Check Your EB-5 Feasibility
        </h2>
        <p id={descriptionId} className="text-muted-foreground text-sm mb-6">
          Enter your details to access the calculator.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <FormcarryHoneypot value={gotcha} onChange={setGotcha} />
          <div className="space-y-1">
            <Label htmlFor="calc-lead-name">Full Name *</Label>
            <Input
              id="calc-lead-name"
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
            <Label htmlFor="calc-lead-email">Email Address *</Label>
            <Input
              id="calc-lead-email"
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              maxLength={FORM_FIELD_MAX.email}
              required
              className="h-11"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="calc-lead-phone">Phone Number (optional)</Label>
            <Input
              id="calc-lead-phone"
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
          <Button type="submit" disabled={submitting} className="w-full h-11 font-semibold text-sm">
            {submitting ? 'Submitting...' : 'Get My Results'}
            {!submitting && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CalculatorLeadModal;
