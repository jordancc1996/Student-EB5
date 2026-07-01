import { useState, useEffect, useCallback } from 'react';
import { X, CheckCircle, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

const BLOCKED_DOMAINS = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'aol.com', 'icloud.com'];

interface FeasibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FeasibilityModal = ({ isOpen, onClose }: FeasibilityModalProps) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [emailError, setEmailError] = useState('');
  const [country, setCountry] = useState('');
  const [inUS, setInUS] = useState('');
  const [visaType, setVisaType] = useState('');
  const [validI94, setValidI94] = useState('');
  const [assets, setAssets] = useState('');
  const [sourceOfFunds, setSourceOfFunds] = useState('');
  const [projectIdentified, setProjectIdentified] = useState('');
  const [removalProceedings, setRemovalProceedings] = useState('');
  const [priorViolations, setPriorViolations] = useState('');
  const [timeline, setTimeline] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setSubmitted(false);
      setName('');
      setEmail('');
      setPhone('');
      setEmailError('');
      setCountry('');
      setInUS('');
      setVisaType('');
      setValidI94('');
      setAssets('');
      setSourceOfFunds('');
      setProjectIdentified('');
      setRemovalProceedings('');
      setPriorViolations('');
      setTimeline('');
    }
  }, [isOpen]);

  const handleClose = useCallback(() => onClose(), [onClose]);

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setEmailError('Please enter a valid email address.');
      return;
    }
    const domain = trimmed.split('@')[1]?.toLowerCase();
    if (domain && BLOCKED_DOMAINS.includes(domain)) {
      setEmailError('Please use your work or educational email address to access premium EB-5 updates');
      return;
    }
    setStep(2);
  };

  const handleStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch('https://formcarry.com/s/PGtefNg4eIv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name,
          email: email.trim(),
          phone,
          country,
          currently_in_us: inUS,
          visa_type: visaType,
          valid_i94: validI94,
          investable_assets: assets,
          source_of_funds: sourceOfFunds,
          eb5_project_identified: projectIdentified,
          removal_proceedings: removalProceedings,
          prior_visa_violations: priorViolations,
          timeline,
          source: 'Feasibility Check Modal',
        }),
      });
    } catch {
      // submit silently
    }
    setSubmitting(false);
    setSubmitted(true);
    setStep(3);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={handleClose}>
      <div
        className="relative bg-card border border-border rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {step === 1 && (
          <>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <BarChart3 size={20} className="text-primary" />
              </div>
              <h2 className="font-serif font-bold text-xl md:text-2xl text-foreground leading-tight">
                Check Your EB-5 Feasibility
              </h2>
            </div>
            <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
              Enter your details and an experienced EB-5 advisor will review your eligibility within one business day.
            </p>
            <form onSubmit={handleStep1} className="space-y-3">
              <Input type="text" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} required className="h-11" />
              <div>
                <Input
                  type="email"
                  placeholder="Work or educational email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setEmailError(''); }}
                  required
                  className={`h-11 ${emailError ? 'border-destructive' : ''}`}
                />
                {emailError && <p className="text-destructive text-xs mt-1">{emailError}</p>}
              </div>
              <Input
                type="tel"
                placeholder="Phone number (optional)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-11"
              />
              <Button type="submit" className="w-full h-11 font-semibold text-sm uppercase tracking-wide">
                Continue
              </Button>
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="font-serif font-bold text-xl text-foreground mb-1">Great, {name}!</h2>
            <p className="text-muted-foreground text-sm mb-5">Answer a few questions so we can assess your eligibility.</p>
            <form onSubmit={handleStep2} className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-foreground">Country of birth</Label>
                <Input type="text" placeholder="e.g. India" value={country} onChange={(e) => setCountry(e.target.value)} required className="h-11 mt-1" />
              </div>

              <div>
                <Label className="text-sm font-medium text-foreground">Currently in the US?</Label>
                <RadioGroup value={inUS} onValueChange={setInUS} className="flex gap-4 mt-1" required>
                  <div className="flex items-center gap-2"><RadioGroupItem value="Yes" id="inUS-yes" /><Label htmlFor="inUS-yes">Yes</Label></div>
                  <div className="flex items-center gap-2"><RadioGroupItem value="No" id="inUS-no" /><Label htmlFor="inUS-no">No</Label></div>
                </RadioGroup>
              </div>

              <div>
                <Label className="text-sm font-medium text-foreground">Current visa type</Label>
                <Select value={visaType} onValueChange={setVisaType} required>
                  <SelectTrigger className="h-11 mt-1"><SelectValue placeholder="Select visa type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="H-1B">H-1B</SelectItem>
                    <SelectItem value="H-4">H-4</SelectItem>
                    <SelectItem value="L-1">L-1</SelectItem>
                    <SelectItem value="F-1 / OPT">F-1 / OPT</SelectItem>
                    <SelectItem value="O-1">O-1</SelectItem>
                    <SelectItem value="B-1/B-2">B-1/B-2</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium text-foreground">Valid I-94 / authorized stay?</Label>
                <RadioGroup value={validI94} onValueChange={setValidI94} className="flex gap-4 mt-1" required>
                  <div className="flex items-center gap-2"><RadioGroupItem value="Yes" id="i94-yes" /><Label htmlFor="i94-yes">Yes</Label></div>
                  <div className="flex items-center gap-2"><RadioGroupItem value="No" id="i94-no" /><Label htmlFor="i94-no">No</Label></div>
                </RadioGroup>
              </div>

              <div>
                <Label className="text-sm font-medium text-foreground">Investable assets</Label>
                <Select value={assets} onValueChange={setAssets} required>
                  <SelectTrigger className="h-11 mt-1"><SelectValue placeholder="Select range" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="$500K–$800K">$500K–$800K</SelectItem>
                    <SelectItem value="$800K–$1M">$800K–$1M</SelectItem>
                    <SelectItem value="$1M+">$1M+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium text-foreground">Source of funds</Label>
                <Select value={sourceOfFunds} onValueChange={setSourceOfFunds} required>
                  <SelectTrigger className="h-11 mt-1"><SelectValue placeholder="Select source" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Earnings">Earnings</SelectItem>
                    <SelectItem value="Inheritance">Inheritance</SelectItem>
                    <SelectItem value="Gift">Gift</SelectItem>
                    <SelectItem value="Business sale">Business sale</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium text-foreground">EB-5 project identified?</Label>
                <Select value={projectIdentified} onValueChange={setProjectIdentified} required>
                  <SelectTrigger className="h-11 mt-1"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                    <SelectItem value="Need help">Need help</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium text-foreground">In removal proceedings?</Label>
                <RadioGroup value={removalProceedings} onValueChange={setRemovalProceedings} className="flex gap-4 mt-1" required>
                  <div className="flex items-center gap-2"><RadioGroupItem value="Yes" id="removal-yes" /><Label htmlFor="removal-yes">Yes</Label></div>
                  <div className="flex items-center gap-2"><RadioGroupItem value="No" id="removal-no" /><Label htmlFor="removal-no">No</Label></div>
                </RadioGroup>
              </div>

              <div>
                <Label className="text-sm font-medium text-foreground">Prior visa violations?</Label>
                <RadioGroup value={priorViolations} onValueChange={setPriorViolations} className="flex gap-4 mt-1" required>
                  <div className="flex items-center gap-2"><RadioGroupItem value="Yes" id="violations-yes" /><Label htmlFor="violations-yes">Yes</Label></div>
                  <div className="flex items-center gap-2"><RadioGroupItem value="No" id="violations-no" /><Label htmlFor="violations-no">No</Label></div>
                </RadioGroup>
              </div>

              <div>
                <Label className="text-sm font-medium text-foreground">Timeline</Label>
                <Select value={timeline} onValueChange={setTimeline} required>
                  <SelectTrigger className="h-11 mt-1"><SelectValue placeholder="Select timeline" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ASAP">ASAP</SelectItem>
                    <SelectItem value="1–2 years">1–2 years</SelectItem>
                    <SelectItem value="Just exploring">Just exploring</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" disabled={submitting} className="w-full h-11 font-semibold text-sm uppercase tracking-wide mt-2">
                {submitting ? 'Submitting...' : 'Submit My Feasibility Check'}
              </Button>
            </form>
          </>
        )}

        {step === 3 && submitted && (
          <div className="text-center py-4">
            <CheckCircle size={48} className="text-primary mx-auto mb-4" />
            <h3 className="font-serif font-bold text-xl text-foreground mb-2">
              Thank You, {name}!
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Someone from our team will reach out to you within one business day.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeasibilityModal;
