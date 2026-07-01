import { useState, useEffect, useCallback } from 'react';
import { X, CheckCircle, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const BLOCKED_DOMAINS = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'aol.com', 'icloud.com'];

const SuccessMessage = ({ name, onClose }: { name: string; onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
      setTimeout(() => {
        document.getElementById('consultation-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="text-center py-4">
      <CheckCircle size={48} className="text-primary mx-auto mb-4" />
      <h3 className="font-serif font-bold text-xl text-foreground mb-2">Your Guide Is Downloading!</h3>
      <p className="text-muted-foreground text-sm">
        Thanks, {name}! Your H-1B to EB-5 Guide should be downloading now. Check your downloads folder.
      </p>
    </div>
  );
};

interface GuideDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GuideDownloadModal = ({ isOpen, onClose }: GuideDownloadModalProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [occupation, setOccupation] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [emailError, setEmailError] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setSubmitted(false);
      setName('');
      setEmail('');
      setPhone('');
      setOccupation('');
      setEmailError('');
    }
  }, [isOpen]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const validateEmail = (value: string) => {
    const domain = value.split('@')[1]?.toLowerCase();
    if (domain && BLOCKED_DOMAINS.includes(domain)) {
      setEmailError('Please use your work or educational email address to access premium EB-5 updates');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) return;

    setSubmitting(true);
    try {
      await fetch('https://formcarry.com/s/PGtefNg4eIv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ name, email, phone, occupation, source: 'H1B Guide Download' }),
      });
    } catch {
      // Still allow download even if form submission fails
    }

    setSubmitted(true);
    setSubmitting(false);

    const link = document.createElement('a');
    link.href = '/StudentEB5_H1B_Guide_2026.pdf';
    link.download = 'H1B-to-Green-Card-EB-5-Guide-2026.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={handleClose}>
      <div className="relative bg-card border border-border rounded-2xl shadow-2xl max-w-md w-full p-8" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {!submitted ? (
          <>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Download size={20} className="text-primary" />
              </div>
              <h2 className="font-serif font-bold text-xl md:text-2xl text-foreground leading-tight">
                Download the EB-5 Guide
              </h2>
            </div>
            <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
              Enter your details below to get instant access to the H-1B to EB-5 Guide.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <Input
                type="text"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="h-11"
              />
              <div>
                <Input
                  type="email"
                  placeholder="Personal email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError('');
                  }}
                  required
                  className={`h-11 ${emailError ? 'border-destructive' : ''}`}
                />
                <p className="text-muted-foreground text-xs mt-1">100% confidential. We never contact your employer.</p>
                {emailError && <p className="text-destructive text-xs mt-1">{emailError}</p>}
              </div>
              <Input
                type="tel"
                placeholder="Phone number (optional)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-11"
              />
              <Input
                type="text"
                placeholder="Occupation (e.g., Software Engineer)"
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                required
                className="h-11"
              />
              <Button
                type="submit"
                disabled={submitting}
                className="w-full h-11 font-semibold text-sm uppercase tracking-wide"
              >
                {submitting ? 'Submitting...' : 'Get the Guide'}
              </Button>
            </form>
          </>
        ) : (
          <SuccessMessage name={name} onClose={handleClose} />
        )}
      </div>
    </div>
  );
};

export default GuideDownloadModal;
