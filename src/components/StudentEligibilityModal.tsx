import { useState } from 'react';
import { X, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const VISA_OPTIONS = ['F-1', 'OPT', 'J-1', 'Other'];
const ASSET_OPTIONS = ['Under $500K', '$500K–$800K', '$800K–$1M', '$1M+'];
const TIMELINE_OPTIONS = ['ASAP', '1–2 years', 'Just exploring'];

interface StudentEligibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const StudentEligibilityModal = ({ isOpen, onClose }: StudentEligibilityModalProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [visaStatus, setVisaStatus] = useState('');
  const [country, setCountry] = useState('');
  const [inUS, setInUS] = useState('');
  const [assets, setAssets] = useState('');
  const [timeline, setTimeline] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setSubmitted(false);
      setName('');
      setEmail('');
      setPhone('');
      setVisaStatus('');
      setCountry('');
      setInUS('');
      setAssets('');
      setTimeline('');
    }, 300);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await fetch('https://formcarry.com/s/PGtefNg4eIv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name, email, phone, visaStatus, countryOfBirth: country, currentlyInUS: inUS,
          investableAssets: assets, timeline, source: 'Student Eligibility Check',
        }),
      });
    } catch {
      // Proceed regardless
    }

    setSubmitting(false);
    setSubmitted(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={handleClose}>
      <div className="relative bg-card border border-border rounded-2xl shadow-2xl max-w-md w-full p-8 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <button onClick={handleClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors" aria-label="Close">
          <X size={20} />
        </button>

        {submitted ? (
          <div className="text-center py-4">
            <CheckCircle size={48} className="text-primary mx-auto mb-4" />
            <h3 className="font-serif font-bold text-xl text-foreground mb-2">We've Got Your Details!</h3>
            <p className="text-muted-foreground text-sm">
              Someone from our team will reach out to you within one business day to discuss your eligibility.
            </p>
          </div>
        ) : (
          <>
            <h2 className="font-serif font-bold text-xl md:text-2xl text-foreground mb-2">
              Check Your Eligibility
            </h2>
            <p className="text-muted-foreground text-sm mb-6">
              Answer a few quick questions so we can evaluate your EB-5 pathway.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <Input type="text" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} required className="h-11" />
              <div>
                <Input type="email" placeholder="Personal email" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-11" />
                <p className="text-xs text-muted-foreground mt-1">100% confidential. We never contact your employer.</p>
              </div>
              <Input type="tel" placeholder="Phone number (optional)" value={phone} onChange={(e) => setPhone(e.target.value)} className="h-11" />
              <Select value={visaStatus} onValueChange={setVisaStatus} required>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Current visa status" />
                </SelectTrigger>
                <SelectContent>
                  {VISA_OPTIONS.map((v) => (
                    <SelectItem key={v} value={v}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input type="text" placeholder="Country of birth" value={country} onChange={(e) => setCountry(e.target.value)} className="h-11" />
              <Select value={inUS} onValueChange={setInUS} required>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Currently in the US?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
              <Select value={assets} onValueChange={setAssets} required>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Investable family assets" />
                </SelectTrigger>
                <SelectContent>
                  {ASSET_OPTIONS.map((a) => (
                    <SelectItem key={a} value={a}>{a}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={timeline} onValueChange={setTimeline} required>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Your timeline" />
                </SelectTrigger>
                <SelectContent>
                  {TIMELINE_OPTIONS.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button type="submit" disabled={submitting} className="w-full h-11 rounded-full font-semibold text-sm">
                {submitting ? 'Submitting...' : 'Check My Eligibility'}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default StudentEligibilityModal;
