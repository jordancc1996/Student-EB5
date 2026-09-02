import { useCallback, useId, useRef, useState } from 'react';
import { X, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import FormcarryHoneypot from '@/components/FormcarryHoneypot';
import { FORM_FIELD_MAX, FORM_PHONE_FORMAT_ERROR, FORMCARRY_GENERIC_ERROR, isPermissivePhone, submitToFormcarry } from '@/lib/formcarry';
import { useFocusTrap } from '@/hooks/useFocusTrap';

const VISA_OPTIONS = ['F-1', 'OPT', 'J-1', 'Other'];
const ASSET_OPTIONS = ['Under $500K', '$500K–$800K', '$800K–$1M', '$1M+'];
const TIMELINE_OPTIONS = ['ASAP', '1–2 years', 'Just exploring'];

interface StudentEligibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const StudentEligibilityModal = ({ isOpen, onClose }: StudentEligibilityModalProps) => {
  const titleId = useId();
  const descriptionId = useId();
  const visaErrorId = useId();
  const inUSErrorId = useId();
  const assetsErrorId = useId();
  const timelineErrorId = useId();
  const submitErrorId = useId();
  const phoneErrorId = useId();
  const modalRef = useRef<HTMLDivElement>(null);

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
  const [submitError, setSubmitError] = useState('');
  const [visaError, setVisaError] = useState('');
  const [inUSError, setInUSError] = useState('');
  const [assetsError, setAssetsError] = useState('');
  const [timelineError, setTimelineError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [gotcha, setGotcha] = useState('');

  const handleClose = useCallback(() => {
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
      setSubmitError('');
      setVisaError('');
      setInUSError('');
      setAssetsError('');
      setTimelineError('');
      setPhoneError('');
      setGotcha('');
    }, 300);
  }, [onClose]);

  useFocusTrap(isOpen, modalRef, handleClose);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let selectsOk = true;
    if (!visaStatus) {
      setVisaError('Please select your current visa status.');
      selectsOk = false;
    }
    if (!inUS) {
      setInUSError('Please select whether you are currently in the US.');
      selectsOk = false;
    }
    if (!assets) {
      setAssetsError('Please select your investable family assets.');
      selectsOk = false;
    }
    if (!timeline) {
      setTimelineError('Please select your timeline.');
      selectsOk = false;
    }
    if (!selectsOk) return;
    if (!isPermissivePhone(phone)) {
      setPhoneError(FORM_PHONE_FORMAT_ERROR);
      return;
    }

    setSubmitting(true);
    setSubmitError('');
    const result = await submitToFormcarry({
      name,
      email,
      phone,
      visaStatus,
      countryOfBirth: country,
      currentlyInUS: inUS,
      investableAssets: assets,
      timeline,
      source: 'Student Eligibility Check',
      _gotcha: gotcha,
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
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={handleClose}>
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="relative bg-card border border-border rounded-2xl shadow-2xl max-w-md w-full p-8 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" onClick={handleClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors" aria-label="Close">
          <X size={20} aria-hidden="true" />
        </button>

        {submitted ? (
          <div className="text-center py-4">
            <CheckCircle size={48} className="text-primary mx-auto mb-4" />
            <h3 id={titleId} className="font-serif font-bold text-xl text-foreground mb-2">We've Got Your Details!</h3>
            <p id={descriptionId} className="text-muted-foreground text-sm">
              Someone from our team will reach out to you within one business day to discuss your eligibility.
            </p>
          </div>
        ) : (
          <>
            <h2 id={titleId} className="font-serif font-bold text-xl md:text-2xl text-foreground mb-2">
              Check Your Eligibility
            </h2>
            <p id={descriptionId} className="text-muted-foreground text-sm mb-6">
              Answer a few quick questions so we can evaluate your EB-5 pathway.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <FormcarryHoneypot value={gotcha} onChange={setGotcha} />
              <div className="space-y-1">
                <Label htmlFor="elig-name">Full Name *</Label>
                <Input id="elig-name" type="text" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} maxLength={FORM_FIELD_MAX.name} required className="h-11" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="elig-email">Email *</Label>
                <Input id="elig-email" type="email" placeholder="Personal email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={FORM_FIELD_MAX.email} required className="h-11" />
                <p className="text-xs text-muted-foreground mt-1">100% confidential. We never contact your employer.</p>
              </div>
              <div className="space-y-1">
                <Label htmlFor="elig-phone">Phone Number (optional)</Label>
                <Input
                  id="elig-phone"
                  type="tel"
                  placeholder="Phone number (optional)"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    setPhoneError('');
                  }}
                  maxLength={FORM_FIELD_MAX.phone}
                  aria-invalid={phoneError ? true : undefined}
                  aria-describedby={phoneError ? phoneErrorId : undefined}
                  className="h-11"
                />
                {phoneError ? (
                  <p id={phoneErrorId} role="alert" className="text-destructive text-sm">{phoneError}</p>
                ) : null}
              </div>
              <div className="space-y-1">
                <Label htmlFor="elig-visa">Current Visa Status *</Label>
                <Select
                  value={visaStatus}
                  onValueChange={(value) => {
                    setVisaStatus(value);
                    setVisaError('');
                  }}
                >
                  <SelectTrigger
                    id="elig-visa"
                    className={`h-11 ${visaError ? 'border-destructive' : ''}`}
                    aria-invalid={visaError ? true : undefined}
                    aria-describedby={visaError ? visaErrorId : undefined}
                  >
                    <SelectValue placeholder="Current visa status" />
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
              <div className="space-y-1">
                <Label htmlFor="elig-country">Country of Birth</Label>
                <Input id="elig-country" type="text" placeholder="Country of birth" value={country} onChange={(e) => setCountry(e.target.value)} className="h-11" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="elig-inus">Currently in the US? *</Label>
                <Select
                  value={inUS}
                  onValueChange={(value) => {
                    setInUS(value);
                    setInUSError('');
                  }}
                >
                  <SelectTrigger
                    id="elig-inus"
                    className={`h-11 ${inUSError ? 'border-destructive' : ''}`}
                    aria-invalid={inUSError ? true : undefined}
                    aria-describedby={inUSError ? inUSErrorId : undefined}
                  >
                    <SelectValue placeholder="Currently in the US?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
                {inUSError ? (
                  <p id={inUSErrorId} role="alert" className="text-destructive text-sm">{inUSError}</p>
                ) : null}
              </div>
              <div className="space-y-1">
                <Label htmlFor="elig-assets">Investable Family Assets *</Label>
                <Select
                  value={assets}
                  onValueChange={(value) => {
                    setAssets(value);
                    setAssetsError('');
                  }}
                >
                  <SelectTrigger
                    id="elig-assets"
                    className={`h-11 ${assetsError ? 'border-destructive' : ''}`}
                    aria-invalid={assetsError ? true : undefined}
                    aria-describedby={assetsError ? assetsErrorId : undefined}
                  >
                    <SelectValue placeholder="Investable family assets" />
                  </SelectTrigger>
                  <SelectContent>
                    {ASSET_OPTIONS.map((a) => (
                      <SelectItem key={a} value={a}>{a}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {assetsError ? (
                  <p id={assetsErrorId} role="alert" className="text-destructive text-sm">{assetsError}</p>
                ) : null}
              </div>
              <div className="space-y-1">
                <Label htmlFor="elig-timeline">Your Timeline *</Label>
                <Select
                  value={timeline}
                  onValueChange={(value) => {
                    setTimeline(value);
                    setTimelineError('');
                  }}
                >
                  <SelectTrigger
                    id="elig-timeline"
                    className={`h-11 ${timelineError ? 'border-destructive' : ''}`}
                    aria-invalid={timelineError ? true : undefined}
                    aria-describedby={timelineError ? timelineErrorId : undefined}
                  >
                    <SelectValue placeholder="Your timeline" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIMELINE_OPTIONS.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {timelineError ? (
                  <p id={timelineErrorId} role="alert" className="text-destructive text-sm">{timelineError}</p>
                ) : null}
              </div>
              {submitError ? (
                <p id={submitErrorId} role="alert" className="text-destructive text-sm">{submitError}</p>
              ) : null}
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
