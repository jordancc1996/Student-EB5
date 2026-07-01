import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Calendar } from 'lucide-react';

const STUDENT_VISA_OPTIONS = ['F-1', 'OPT', 'J-1', 'Other'];

interface StudentBottomFormProps {
  onSubmitted?: () => void;
}

const StudentBottomForm = ({ onSubmitted }: StudentBottomFormProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [visaStatus, setVisaStatus] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!visaStatus) {
      toast({ title: 'Error', description: 'Please select your visa status.', variant: 'destructive' });
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch('https://formcarry.com/s/PGtefNg4eIv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ name, email, phone, visaStatus, message, source: 'Student Page - Bottom Form' }),
      });
      if (response.ok) {
        setIsSubmitted(true);
        onSubmitted?.();
      } else {
        throw new Error('Submission failed');
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to submit. Please try again.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-background rounded-2xl p-8 shadow-lg text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Calendar className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-2xl font-bold mb-2">Thank You{name ? `, ${name.split(' ')[0]}` : ''}!</h3>
        <p className="text-muted-foreground">
          We'll reach out to <span className="font-medium text-foreground">{email}</span> within 1 business day to schedule your free 30-minute consultation.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-background rounded-2xl p-6 md:p-8 shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="student-name">Full Name *</Label>
          <Input id="student-name" type="text" placeholder="Your full name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="space-y-1">
          <Label htmlFor="student-email">Personal Email *</Label>
          <Input id="student-email" type="email" placeholder="your.email@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <p className="text-xs text-muted-foreground">100% confidential. We never contact your employer.</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="student-phone">Phone Number (optional)</Label>
          <Input id="student-phone" type="tel" placeholder="+1 (555) 123-4567" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Current Visa Status *</Label>
          <Select value={visaStatus} onValueChange={setVisaStatus}>
            <SelectTrigger aria-label="Select your visa status">
              <SelectValue placeholder="Select your visa status" />
            </SelectTrigger>
            <SelectContent>
              {STUDENT_VISA_OPTIONS.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="student-message">Tell us about your situation (optional)</Label>
          <Textarea id="student-message" placeholder="Brief description of your immigration goals..." value={message} onChange={(e) => setMessage(e.target.value)} rows={3} />
        </div>
        <Button type="submit" disabled={isSubmitting} className="w-full" size="lg">
          {isSubmitting ? 'Submitting...' : 'Get My Free Evaluation'}
        </Button>
        <p className="text-xs text-muted-foreground text-center">By submitting, you agree to receive communications about EB-5 programs.</p>
      </form>
    </div>
  );
};

export default StudentBottomForm;
