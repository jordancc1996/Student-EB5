import { useId, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import FormcarryHoneypot from '@/components/FormcarryHoneypot';
import { FORM_FIELD_MAX, FORM_PHONE_FORMAT_ERROR, isPermissivePhone, submitToFormcarry } from '@/lib/formcarry';

interface MultiStepLeadCaptureProps {
  className?: string;
  buttonText?: string;
  inputClassName?: string;
  buttonClassName?: string;
  showLabel?: boolean;
  labelText?: string;
  onSuccess?: () => void;
}

const BLOCKED_DOMAINS = [
  'gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'aol.com', 
  'icloud.com', 'mail.com', 'protonmail.com', 'yandex.com', 'zoho.com',
  'gmx.com', 'live.com', 'msn.com', 'inbox.com', 'me.com'
];

const VISA_STATUS_OPTIONS = [
  'H-1B', 'L-1', 'F-1', 'J-1', 'E-2', 'O-1', 'TN', 'B-1/B-2', 
  'Green Card Holder', 'US Citizen', 'Other'
];

export const MultiStepLeadCapture = ({
  className = '',
  buttonText = 'Subscribe',
  inputClassName = '',
  buttonClassName = '',
  showLabel = true,
  labelText = 'Subscribe for Current EB-5 News',
  onSuccess
}: MultiStepLeadCaptureProps) => {
  const emailErrorId = useId();
  const visaErrorId = useId();
  const phoneErrorId = useId();
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [visaStatus, setVisaStatus] = useState('');
  const [occupation, setOccupation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [visaError, setVisaError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [gotcha, setGotcha] = useState('');
  const { toast } = useToast();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }

    const domain = email.split('@')[1]?.toLowerCase();
    if (BLOCKED_DOMAINS.includes(domain)) {
      setEmailError('Please use your work or educational email address to access premium EB-5 updates');
      return false;
    }

    setEmailError('');
    return true;
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      return;
    }

    setStep(2);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!visaStatus) {
      setVisaError('Please select your visa status.');
      return;
    }

    if (!name || !occupation) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (!isPermissivePhone(phone)) {
      setPhoneError(FORM_PHONE_FORMAT_ERROR);
      return;
    }

    setIsSubmitting(true);
    const result = await submitToFormcarry({
      email,
      name,
      phone,
      visaStatus,
      occupation,
      source: 'Footer Newsletter',
      formType: 'footer_newsletter',
      _gotcha: gotcha,
    });
    if (result.ok) {
      setIsSubmitted(true);
      if (onSuccess) {
        onSuccess();
      }
    } else {
      toast({
        title: "Error",
        description: "Failed to subscribe. Please try again.",
        variant: "destructive",
      });
    }
    setIsSubmitting(false);
  };

  if (isSubmitted) {
    return (
      <div className={`${className} animate-fade-in`}>
        <div className="bg-secondary/50 border border-border rounded-lg p-5 text-center space-y-2">
          <p className="font-semibold text-foreground">You're subscribed!</p>
          <p className="text-sm text-muted-foreground">
            Check your inbox for your welcome email with your free EB-5 Quick Start Guide.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {showLabel && step === 1 && (
        <h3 className="text-lg font-semibold mb-4">
          {labelText}
        </h3>
      )}
      
      {step === 1 ? (
        <form onSubmit={handleEmailSubmit} className="space-y-3 animate-fade-in">
          <FormcarryHoneypot value={gotcha} onChange={setGotcha} />
          <div className="space-y-1">
            <Label htmlFor="footer-email" className="text-sm font-medium">
              Work or School Email *
            </Label>
            <Input
              id="footer-email"
              type="email"
              placeholder="Enter your work or educational email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError('');
              }}
              required
              maxLength={FORM_FIELD_MAX.email}
              aria-invalid={emailError ? true : undefined}
              aria-describedby={emailError ? emailErrorId : undefined}
              className={inputClassName}
            />
            {emailError ? (
              <p id={emailErrorId} role="alert" className="text-sm text-destructive mt-1 animate-fade-in">{emailError}</p>
            ) : null}
          </div>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className={`w-full ${buttonClassName}`}
          >
            {buttonText}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleFinalSubmit} className="space-y-4 animate-fade-in">
          <FormcarryHoneypot value={gotcha} onChange={setGotcha} />
          <div className="space-y-2">
            <Label htmlFor="footer-name" className="text-sm font-medium">
              Full Name *
            </Label>
            <Input
              id="footer-name"
              type="text"
              placeholder="Your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={FORM_FIELD_MAX.name}
              required
              className={inputClassName}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="footer-phone" className="text-sm font-medium">
              Phone Number (optional)
            </Label>
            <Input
              id="footer-phone"
              type="tel"
              placeholder="+1 (555) 123-4567"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                setPhoneError('');
              }}
              maxLength={FORM_FIELD_MAX.phone}
              aria-invalid={phoneError ? true : undefined}
              aria-describedby={phoneError ? phoneErrorId : undefined}
              className={inputClassName}
            />
            {phoneError ? (
              <p id={phoneErrorId} role="alert" className="text-sm text-destructive">{phoneError}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="footer-visa" className="text-sm font-medium">
              Current Visa Status *
            </Label>
            <Select
              value={visaStatus}
              onValueChange={(value) => {
                setVisaStatus(value);
                setVisaError('');
              }}
            >
              <SelectTrigger
                id="footer-visa"
                className={`${inputClassName} ${visaError ? 'border-destructive' : ''}`}
                aria-invalid={visaError ? true : undefined}
                aria-describedby={visaError ? visaErrorId : undefined}
              >
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
            {visaError ? (
              <p id={visaErrorId} role="alert" className="text-sm text-destructive">{visaError}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="footer-occupation" className="text-sm font-medium">
              Occupation/Industry *
            </Label>
            <Input
              id="footer-occupation"
              type="text"
              placeholder="e.g., Software Engineer, Healthcare"
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
              required
              className={inputClassName}
            />
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              onClick={() => setStep(1)}
              className="flex-1"
            >
              Back
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className={`flex-1 ${buttonClassName}`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};
