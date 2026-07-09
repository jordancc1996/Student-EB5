import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Clock, Users } from 'lucide-react';

const BLOCKED_DOMAINS = [
  'gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'aol.com', 
  'icloud.com', 'mail.com', 'protonmail.com', 'yandex.com', 'zoho.com',
  'gmx.com', 'live.com', 'msn.com', 'inbox.com', 'me.com'
];

const VISA_STATUS_OPTIONS = [
  'H-1B', 'L-1', 'F-1', 'J-1', 'E-2', 'O-1', 'TN', 'B-1/B-2', 
  'Green Card Holder', 'US Citizen', 'Other'
];

interface ConsultationCTAProps {
  articleForm?: boolean;
}

export const ConsultationCTA = ({ articleForm = false }: ConsultationCTAProps) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [visaStatus, setVisaStatus] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedName, setSubmittedName] = useState('');
  const [submittedEmail, setSubmittedEmail] = useState('');
  const { toast } = useToast();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }

    const domain = email.split('@')[1]?.toLowerCase();
    if (BLOCKED_DOMAINS.includes(domain)) {
      setEmailError('Please use your work or educational email address');
      return false;
    }

    setEmailError('');
    return true;
  };

  const handleStepOne = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast({ title: "Error", description: "Please enter your name.", variant: "destructive" });
      return;
    }
    if (!validateEmail(email)) return;
    setStep(2);
  };

  const handleStepTwo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!visaStatus) {
      toast({ title: "Error", description: "Please select your visa status.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('https://formcarry.com/s/PGtefNg4eIv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email, name, phone, visaStatus, message, formType: 'consultation_request' }),
      });

      if (response.ok) {
        setSubmittedName(name.split(' ')[0]);
        setSubmittedEmail(email);
        setIsSubmitted(true);
      } else {
        throw new Error('Submission failed');
      }
    } catch {
      toast({ title: "Error", description: "Failed to submit request. Please try again.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <section id="consultation-form" className="py-16 bg-primary/5">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <div className="bg-background rounded-2xl p-8 shadow-lg">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Thank You{submittedName ? `, ${submittedName}` : ''}!</h3>
            <p className="text-muted-foreground">
              We'll reach out to <span className="font-medium text-foreground">{submittedEmail}</span> within 1 business day to schedule your free 30-minute consultation.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="consultation-form" className={`py-16 bg-primary/5${articleForm ? ' article-page-form' : ''}`}>
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div className="space-y-6">
            <h2 className={articleForm ? 'article-form-headline font-medium' : 'text-3xl md:text-4xl font-medium'}>
              Talk to Someone Who Knows EB-5
            </h2>
            <p className="text-lg text-muted-foreground">
              Skip the research rabbit hole. Book a free 30-minute call and get a straight answer on whether you qualify and what your next step is.
            </p>
            
            <div className="space-y-3">
              <p className="font-medium">Honest assessment of your situation</p>
              <p className="font-medium">We'll tell you if it's not a fit</p>
              <p className="font-medium">No obligation</p>
            </div>
          </div>

          {/* Right side - Form */}
            <div className="bg-background rounded-2xl p-6 md:p-8 shadow-lg">
              {step === 1 && (
                <form onSubmit={handleStepOne} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="consultation-name" className={articleForm ? 'text-base' : undefined}>Full Name *</Label>
                    <Input
                      id="consultation-name"
                      type="text"
                      placeholder="Your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className={articleForm ? 'text-base md:text-base' : undefined}
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="consultation-email" className={articleForm ? 'text-base' : undefined}>Personal Email *</Label>
                    <Input
                      id="consultation-email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setEmailError('');
                      }}
                      required
                      className={articleForm ? 'text-base md:text-base' : undefined}
                    />
                    <p className={articleForm ? 'article-form-microcopy text-muted-foreground' : 'text-xs text-muted-foreground'}>100% confidential. We never contact your employer.</p>
                    {emailError && (
                      <p className="text-sm text-destructive animate-fade-in">{emailError}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="consultation-phone" className={articleForm ? 'text-base' : undefined}>Phone Number (optional)</Label>
                    <Input
                      id="consultation-phone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={articleForm ? 'text-base md:text-base' : undefined}
                    />
                  </div>

                  <Button type="submit" className="w-full" size="lg">
                    Get My Free Evaluation
                  </Button>

                  <p className={articleForm ? 'article-form-microcopy text-muted-foreground text-center' : 'text-xs text-muted-foreground text-center'}>
                    By submitting, you agree to receive communications about EB-5 programs.
                  </p>
                </form>
              )}

              {step === 2 && (
                <form onSubmit={handleStepTwo} className="space-y-4">
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-2">
                    <p className="text-foreground font-medium text-center">
                      Great, you're one step away!
                    </p>
                    <p className="text-sm text-muted-foreground text-center mt-1">
                      Tell us a bit more so we can tailor your consultation.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="consultation-visa">Current Visa Status *</Label>
                    <Select value={visaStatus} onValueChange={setVisaStatus} required>
                      <SelectTrigger aria-label="Select your visa status">
                        <SelectValue placeholder="Select your visa status" />
                      </SelectTrigger>
                      <SelectContent>
                        {VISA_STATUS_OPTIONS.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="consultation-message">Tell us about your situation (optional)</Label>
                    <Textarea
                      id="consultation-message"
                      placeholder="Brief description of your immigration goals..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full"
                    size="lg"
                  >
                    {isSubmitting ? 'Submitting...' : 'Complete Request'}
                  </Button>
                </form>
              )}
          </div>
        </div>
      </div>
    </section>
  );
};
