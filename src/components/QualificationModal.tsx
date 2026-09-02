import { useState, useEffect, useCallback, useId, useRef } from 'react';
import { X, CheckCircle, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FORMCARRY_GENERIC_ERROR, submitToFormcarry } from '@/lib/formcarry';
import { useFocusTrap } from '@/hooks/useFocusTrap';

const BLOCKED_DOMAINS = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'aol.com', 'icloud.com'];

interface QualificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QualificationModal = ({ isOpen, onClose }: QualificationModalProps) => {
  const titleId = useId();
  const descriptionId = useId();
  const emailErrorId = useId();
  const investmentErrorId = useId();
  const visaErrorId = useId();
  const submitErrorId = useId();
  const modalRef = useRef<HTMLDivElement>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [visaStatus, setVisaStatus] = useState('');
  const [country, setCountry] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [investmentError, setInvestmentError] = useState('');
  const [visaError, setVisaError] = useState('');
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setSubmitted(false);
      setName('');
      setEmail('');
      setPhone('');
      setInvestmentAmount('');
      setVisaStatus('');
      setCountry('');
      setEmailError('');
      setInvestmentError('');
      setVisaError('');
      setSubmitError('');
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
    const emailOk = validateEmail(email);
    let selectsOk = true;

    if (!investmentAmount) {
      setInvestmentError('Please select an investment amount.');
      selectsOk = false;
    }
    if (!visaStatus) {
      setVisaError('Please select your current visa status.');
      selectsOk = false;
    }
    if (!emailOk || !selectsOk) return;

    setSubmitting(true);
    setSubmitError('');
    const result = await submitToFormcarry({
      name,
      email,
      phone,
      investmentAmount,
      visaStatus,
      country,
      source: 'Concurrent Filing Qualification',
    });
    if (result.ok) {
      setSubmitted(true);
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
                <FileText size={20} className="text-primary" />
              </div>
              <h2 id={titleId} className="font-serif font-bold text-xl md:text-2xl text-foreground leading-tight">
                Check Your Concurrent Filing Eligibility
              </h2>
            </div>
            <p id={descriptionId} className="text-muted-foreground text-sm mb-6 leading-relaxed">
              Enter your details and an experienced EB-5 attorney will review your eligibility for concurrent I-526E and I-485 filing within one business day.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="qual-name">Full Name *</Label>
                <Input
                  id="qual-name"
                  type="text"
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="qual-email">Work or School Email *</Label>
                <Input
                  id="qual-email"
                  type="email"
                  placeholder="Work or educational email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setEmailError(''); }}
                  required
                  aria-invalid={emailError ? true : undefined}
                  aria-describedby={emailError ? emailErrorId : undefined}
                  className={`h-11 ${emailError ? 'border-destructive' : ''}`}
                />
                {emailError ? (
                  <p id={emailErrorId} role="alert" className="text-destructive text-xs mt-1">{emailError}</p>
                ) : null}
              </div>
              <div className="space-y-1">
                <Label htmlFor="qual-phone">Phone Number (optional)</Label>
                <Input
                  id="qual-phone"
                  type="tel"
                  placeholder="Phone number (optional)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-11"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="qual-investment">Investment Amount *</Label>
                <Select
                  value={investmentAmount}
                  onValueChange={(value) => {
                    setInvestmentAmount(value);
                    setInvestmentError('');
                  }}
                >
                  <SelectTrigger
                    id="qual-investment"
                    className={`h-11 ${investmentError ? 'border-destructive' : ''}`}
                    aria-invalid={investmentError ? true : undefined}
                    aria-describedby={investmentError ? investmentErrorId : undefined}
                  >
                    <SelectValue placeholder="Investment amount" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="$800,000 (TEA)">$800,000 (TEA)</SelectItem>
                    <SelectItem value="$1,050,000 (Standard)">$1,050,000 (Standard)</SelectItem>
                    <SelectItem value="Not sure yet">Not sure yet</SelectItem>
                  </SelectContent>
                </Select>
                {investmentError ? (
                  <p id={investmentErrorId} role="alert" className="text-destructive text-xs mt-1">{investmentError}</p>
                ) : null}
              </div>
              <div className="space-y-1">
                <Label htmlFor="qual-visa">Current Visa Status *</Label>
                <Select
                  value={visaStatus}
                  onValueChange={(value) => {
                    setVisaStatus(value);
                    setVisaError('');
                  }}
                >
                  <SelectTrigger
                    id="qual-visa"
                    className={`h-11 ${visaError ? 'border-destructive' : ''}`}
                    aria-invalid={visaError ? true : undefined}
                    aria-describedby={visaError ? visaErrorId : undefined}
                  >
                    <SelectValue placeholder="Current visa status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="H-1B">H-1B</SelectItem>
                    <SelectItem value="H-4">H-4</SelectItem>
                    <SelectItem value="L-1">L-1</SelectItem>
                    <SelectItem value="F-1 / OPT">F-1 / OPT</SelectItem>
                    <SelectItem value="O-1">O-1</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {visaError ? (
                  <p id={visaErrorId} role="alert" className="text-destructive text-xs mt-1">{visaError}</p>
                ) : null}
              </div>
              <div className="space-y-1">
                <Label htmlFor="qual-country">Country of Birth *</Label>
                <Input
                  id="qual-country"
                  type="text"
                  placeholder="Country of birth"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
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
                {submitting ? 'Submitting...' : 'Check My Eligibility'}
              </Button>
            </form>
          </>
        ) : (
          <div className="text-center py-4">
            <CheckCircle size={48} className="text-primary mx-auto mb-4" />
            <h3 id={titleId} className="font-serif font-bold text-xl text-foreground mb-2">
              Thank You, {name}!
            </h3>
            <p id={descriptionId} className="text-muted-foreground text-sm leading-relaxed">
              Someone from our team will reach out to you within one business day.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QualificationModal;
