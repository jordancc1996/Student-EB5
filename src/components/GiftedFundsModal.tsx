import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle } from 'lucide-react';

const pathwayFont = "'Inter', 'Helvetica Neue', sans-serif";

interface GiftedFundsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const GiftedFundsModal = ({ open, onOpenChange }: GiftedFundsModalProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [assets, setAssets] = useState('');
  const [visaStatus, setVisaStatus] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    setSubmitting(true);
    try {
      await fetch('https://formcarry.com/s/PGtefNg4eIv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          parentCountry: country,
          investableAssets: assets,
          visaStatus,
          source: 'Gifted Funds Eligibility',
        }),
      });
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = (val: boolean) => {
    onOpenChange(val);
    if (!val) {
      setTimeout(() => {
        setName('');
        setEmail('');
        setPhone('');
        setCountry('');
        setAssets('');
        setVisaStatus('');
        setSubmitted(false);
      }, 300);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md" style={{ fontFamily: pathwayFont }}>
        {submitted ? (
          <div className="text-center py-8">
            <CheckCircle className="mx-auto mb-4 text-primary" size={48} />
            <h3 className="text-xl font-medium text-foreground mb-2">We've Got Your Details!</h3>
            <p className="text-muted-foreground text-sm">
              Someone from our team will reach out to you within one business day to discuss your family's eligibility.
            </p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-sans text-xl font-medium text-foreground">
                See If Your Family Qualifies
              </DialogTitle>
              <p className="text-muted-foreground text-sm mt-1">
                100% confidential. We never contact your employer.
              </p>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <Label htmlFor="gf-name" className="text-sm font-medium">Student Name *</Label>
                <Input id="gf-name" value={name} onChange={e => setName(e.target.value)} required placeholder="Full name" />
              </div>
              <div>
                <Label htmlFor="gf-email" className="text-sm font-medium">Student Email *</Label>
                <Input id="gf-email" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="Personal email preferred" />
              </div>
              <div>
                <Label htmlFor="gf-phone" className="text-sm font-medium">Phone Number (optional)</Label>
                <Input id="gf-phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+1 (555) 123-4567" />
              </div>
              <div>
                <Label htmlFor="gf-country" className="text-sm font-medium">Parent's Country of Origin</Label>
                <Input id="gf-country" value={country} onChange={e => setCountry(e.target.value)} placeholder="e.g. India, China, Brazil" />
              </div>
              <div>
                <Label className="text-sm font-medium">Estimated Family Investable Assets</Label>
                <Select value={assets} onValueChange={setAssets}>
                  <SelectTrigger><SelectValue placeholder="Select range" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Under $500K">Under $500K</SelectItem>
                    <SelectItem value="$500K–$800K">$500K–$800K</SelectItem>
                    <SelectItem value="$800K–$1M">$800K–$1M</SelectItem>
                    <SelectItem value="$1M+">$1M+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-medium">Current Visa Status</Label>
                <Select value={visaStatus} onValueChange={setVisaStatus}>
                  <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="F-1">F-1</SelectItem>
                    <SelectItem value="OPT">OPT</SelectItem>
                    <SelectItem value="J-1">J-1</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Check Our Eligibility'}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default GiftedFundsModal;
