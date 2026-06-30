import { useState } from 'react';
import type { FormEvent } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { useToast } from '@/hooks/use-toast';

const BLOCKED_DOMAINS = [
  'gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'aol.com', 
  'icloud.com', 'mail.com', 'protonmail.com', 'yandex.com', 'zoho.com',
  'gmx.com', 'live.com', 'msn.com', 'inbox.com', 'me.com'
];

const VISA_STATUS_OPTIONS = [
  'H-1B', 'L-1', 'F-1', 'J-1', 'E-2', 'O-1', 'TN', 'B-1/B-2', 
  'Green Card Holder', 'US Citizen', 'Other'
];

interface ScheduleCallCTAProps {
  lowOdds?: boolean;
}

export const ScheduleCallCTA = ({ lowOdds = false }: ScheduleCallCTAProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [visaStatus, setVisaStatus] = useState('');
  
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }

    const domain = email.split('@')[1]?.toLowerCase();
    if (BLOCKED_DOMAINS.includes(domain)) {
      setEmailError('Please use your work or educational email');
      return false;
    }

    setEmailError('');
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      return;
    }

    if (!firstName || !lastName || !visaStatus) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch('https://formcarry.com/s/PGtefNg4eIv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          visaStatus,
          phone,
          formType: 'h1b_calculator_schedule_call'
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        toast({
          title: "Thank you!",
          description: "We'll be in touch within 24-48 hours.",
        });
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setVisaStatus('');
    
    setPhone('');
    setEmailError('');
    setIsSubmitted(false);
  };

  return (
    <>
      {/* Compact CTA Section */}
      <section className="bg-background border-t py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            {/* Top label */}
            <p className="text-primary text-sm font-medium tracking-widest uppercase mb-4">
              {lowOdds ? 'Your Odds Are Low' : 'Beyond the H-1B Lottery'}
            </p>
            
            {/* Main headline */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-foreground mb-8 leading-tight">
              {lowOdds
                ? 'Tired of the lottery? Explore the EB-5 alternative.'
                : 'Discover how EB-5 can be your path forward beyond H-1B.'}
            </h2>
            
            {/* What Now section */}
            <div className="flex flex-col md:flex-row md:items-start gap-4 mb-8">
              <p className="text-sm font-medium tracking-widest uppercase text-muted-foreground md:w-32 flex-shrink-0">
                Why EB-5
              </p>
              <p className="text-lg text-muted-foreground">
                {lowOdds
                  ? 'With odds below 30%, the lottery is stacked against you. EB-5 offers a direct path to permanent residency with no lottery, no employer sponsorship, and no visa caps.'
                  : 'No lottery, no employer sponsorship, no visa caps. Learn how EB-5 offers a direct path to permanent residency.'}
              </p>
            </div>
            
            {/* Start Today section */}
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <p className="text-sm font-medium tracking-widest uppercase text-muted-foreground md:w-32 flex-shrink-0">
                Start Today
              </p>
              {lowOdds ? (
                <a
                  href="/pathways/h1b-to-green-card"
                  className="inline-flex items-center bg-foreground text-background hover:bg-foreground/90 rounded-full px-6 py-3 text-sm font-medium tracking-wide gap-3 transition-colors"
                >
                  Explore the EB-5 Pathway
                  <span className="bg-primary text-primary-foreground rounded-full p-1">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </a>
              ) : (
                <Button 
                  onClick={() => {
                    setIsOpen(true);
                    if (isSubmitted) resetForm();
                  }}
                  className="bg-foreground text-background hover:bg-foreground/90 rounded-full px-6 py-6 text-sm font-medium tracking-wide uppercase gap-3"
                >
                  Schedule a Call
                  <span className="bg-primary text-primary-foreground rounded-full p-1">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Slide-out Sheet Form */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader className="mb-6">
            <SheetDescription className="text-xs text-muted-foreground flex items-center gap-1">
              <span className="inline-block w-3 h-3 border border-muted-foreground rounded-full" />
              For employees or job seekers exploring visa options.
            </SheetDescription>
            <SheetTitle className="text-4xl font-serif text-foreground">
              Get In Touch
            </SheetTitle>
          </SheetHeader>

          {isSubmitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <ArrowRight className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Thank You!</h3>
              <p className="text-muted-foreground mb-4">
                We'll contact you within 24-48 hours.
              </p>
              <Button 
                variant="outline" 
                onClick={() => setIsOpen(false)}
              >
                Close
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="firstName" className="sr-only">First Name</Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-foreground"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="lastName" className="sr-only">Last Name</Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-foreground"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="email" className="sr-only">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailError('');
                    }}
                    className="border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-foreground"
                    required
                  />
                  {emailError && (
                    <p className="text-xs text-destructive">{emailError}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="visaStatus" className="sr-only">Current Visa Status</Label>
                  <Select value={visaStatus} onValueChange={setVisaStatus} required>
                    <SelectTrigger 
                      className="border-0 border-b border-border rounded-none px-0 focus:ring-0 focus-visible:ring-0 focus:border-foreground"
                      aria-label="Current Visa Status"
                    >
                      <SelectValue placeholder="Current Visa Status" />
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
              </div>


              <div className="space-y-1">
                <Label htmlFor="phone" className="sr-only">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-foreground"
                />
              </div>

              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-foreground text-background hover:bg-foreground/90 rounded-full py-6 text-sm font-medium tracking-wide uppercase gap-3 mt-8"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Your Inquiry'}
                <span className="bg-primary text-primary-foreground rounded-full p-1">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Button>
            </form>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};
