import { useState, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const VISA_OPTIONS = ['F-1', 'OPT', 'J-1', 'Other'];
const SESSION_KEY = 'student-exit-intent-shown';

interface StudentExitIntentPopupProps {
  hasSubmittedForm: boolean;
}

const StudentExitIntentPopup = ({ hasSubmittedForm }: StudentExitIntentPopupProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [visaStatus, setVisaStatus] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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

  const handleClose = () => setIsOpen(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!visaStatus) return;
    setSubmitting(true);
    try {
      await fetch('https://formcarry.com/s/PGtefNg4eIv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ name, email, phone, visaStatus, source: 'Student Page - Exit Intent' }),
      });
    } catch {
      // allow success state
    }
    setSubmitting(false);
    setSubmitted(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={handleClose}>
      <div className="relative bg-card border border-border rounded-2xl shadow-2xl max-w-md w-full p-8" onClick={(e) => e.stopPropagation()}>
        <button onClick={handleClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors" aria-label="Close">
          <X size={20} />
        </button>

        {submitted ? (
          <div className="text-center py-4">
            <h3 className="font-serif font-bold text-xl text-foreground mb-2">You're All Set!</h3>
            <p className="text-muted-foreground text-sm">
              Someone from our team will be in touch shortly.
            </p>
          </div>
        ) : (
          <>
            <h2 className="font-serif font-bold text-xl md:text-2xl text-foreground mb-2">
              Before You Go — Don't Leave Your Future to the H-1B Lottery.
            </h2>
            <p className="text-muted-foreground text-sm mb-6">
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
                <Label>Current Visa Status *</Label>
                <Select value={visaStatus} onValueChange={setVisaStatus} required>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select your visa status" />
                  </SelectTrigger>
                  <SelectContent>
                    {VISA_OPTIONS.map((v) => (
                      <SelectItem key={v} value={v}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" disabled={submitting} className="w-full h-11 font-semibold text-sm">
                {submitting ? 'Submitting...' : 'Get My Free Assessment'}
              </Button>
            </form>

            <button onClick={handleClose} className="block mx-auto mt-4 text-xs text-muted-foreground hover:text-foreground underline transition-colors">
              No thanks, I'll figure it out on my own.
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default StudentExitIntentPopup;
