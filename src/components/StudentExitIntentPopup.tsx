import { useState, useEffect, useCallback, useId, useRef } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FORMCARRY_GENERIC_ERROR, submitToFormcarry } from '@/lib/formcarry';
import { useFocusTrap } from '@/hooks/useFocusTrap';

const VISA_OPTIONS = ['F-1', 'OPT', 'J-1', 'Other'];
const SESSION_KEY = 'student-exit-intent-shown';

interface StudentExitIntentPopupProps {
  hasSubmittedForm: boolean;
}

const StudentExitIntentPopup = ({ hasSubmittedForm }: StudentExitIntentPopupProps) => {
  const titleId = useId();
  const descriptionId = useId();
  const visaErrorId = useId();
  const submitErrorId = useId();
  const modalRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [visaStatus, setVisaStatus] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [visaError, setVisaError] = useState('');

  const show = useCallback(() => {
    if (hasSubmittedForm) return;
    if (sessionStorage.getItem(SESSION_KEY)) return;
    sessionStorage.setItem(SESSION_KEY, '1');
    setIsOpen(true);
  }, [hasSubmittedForm]);

  useEffect(() => {
    if (hasSubmittedForm) return;
    if (sessionStorage.getItem(SESSION_KEY)) return;

    const isMobile = window.matchMedia('(pointer: coarse)').matches;

    if (isMobile) {
      const timer = setTimeout(() => show(), 30000);
      return () => clearTimeout(timer);
    } else {
      const handleMouseLeave = (e: MouseEvent) => {
        if (e.clientY < 10) show();
      };
      document.addEventListener('mouseout', handleMouseLeave);
      return () => document.removeEventListener('mouseout', handleMouseLeave);
    }
  }, [hasSubmittedForm, show]);

  const handleClose = useCallback(() => setIsOpen(false), []);

  useFocusTrap(isOpen, modalRef, handleClose);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!visaStatus) {
      setVisaError('Please select your current visa status.');
      return;
    }
    setSubmitting(true);
    setSubmitError('');
    setVisaError('');
    const result = await submitToFormcarry({
      name,
      email,
      phone,
      visaStatus,
      source: 'Student Page - Exit Intent',
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
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={handleClose}>
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
            <h3 id={titleId} className="font-serif font-bold text-xl text-foreground mb-2">You're All Set!</h3>
            <p id={descriptionId} className="text-muted-foreground text-sm">
              Someone from our team will be in touch shortly.
            </p>
          </div>
        ) : (
          <>
            <h2 id={titleId} className="font-serif font-bold text-xl md:text-2xl text-foreground mb-2">
              Before You Go — Don't Leave Your Future to the H-1B Lottery.
            </h2>
            <p id={descriptionId} className="text-muted-foreground text-sm mb-6">
              Get a free personalized assessment of your EB-5 eligibility. Takes 30 seconds.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="exit-name">Full Name *</Label>
                <Input id="exit-name" type="text" placeholder="Your full name" value={name} onChange={(e) => setName(e.target.value)} required className="h-11" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="exit-email">Email *</Label>
                <Input id="exit-email" type="email" placeholder="your.email@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-11" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="exit-phone">Phone Number (optional)</Label>
                <Input id="exit-phone" type="tel" placeholder="+1 (555) 123-4567" value={phone} onChange={(e) => setPhone(e.target.value)} className="h-11" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="exit-visa">Current Visa Status *</Label>
                <Select
                  value={visaStatus}
                  onValueChange={(value) => {
                    setVisaStatus(value);
                    setVisaError('');
                  }}
                >
                  <SelectTrigger
                    id="exit-visa"
                    className={`h-11 ${visaError ? 'border-destructive' : ''}`}
                    aria-invalid={visaError ? true : undefined}
                    aria-describedby={visaError ? visaErrorId : undefined}
                  >
                    <SelectValue placeholder="Select your visa status" />
                  </SelectTrigger>
                  <SelectContent>
                    {VISA_OPTIONS.map((v) => (
                      <SelectItem key={v} value={v}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {visaError ? (
                  <p id={visaErrorId} role="alert" className="text-destructive text-sm">{visaError}</p>
                ) : null}
              </div>
              {submitError ? (
                <p id={submitErrorId} role="alert" className="text-destructive text-sm">{submitError}</p>
              ) : null}
              <Button type="submit" disabled={submitting} className="w-full h-11 font-semibold text-sm">
                {submitting ? 'Submitting...' : 'Get My Free Assessment'}
              </Button>
            </form>

            <button type="button" onClick={handleClose} className="block mx-auto mt-4 text-xs text-muted-foreground hover:text-foreground underline transition-colors">
              No thanks, I'll figure it out on my own.
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default StudentExitIntentPopup;
