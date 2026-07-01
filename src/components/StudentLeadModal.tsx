import { useState } from 'react';
import { X, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface StudentLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'tuition' | 'guide';
}

const MODAL_CONFIG = {
  tuition: {
    title: 'Calculate Your Tuition Savings',
    subtitle: 'Enter your details to see how much you could save with in-state tuition rates.',
    buttonText: 'Get My Results →',
    source: 'Tuition Calculator CTA',
  },
  guide: {
    title: "Download the Student's EB-5 Guide",
    subtitle: 'Get the complete guide to the EB-5 pathway for international students.',
    buttonText: 'Download My Guide →',
    source: 'Student Guide Download',
  },
};

const StudentLeadModal = ({ isOpen, onClose, mode }: StudentLeadModalProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const config = MODAL_CONFIG[mode];

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setSubmitted(false);
      setName('');
      setEmail('');
      setPhone('');
    }, 300);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await fetch('https://formcarry.com/s/PGtefNg4eIv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ name, email, phone, source: config.source }),
      });
    } catch {
      // Proceed regardless
    }

    if (mode === 'tuition') {
      window.location.href = '/tools/tuition-calculator';
    } else {
      setSubmitting(false);
      setSubmitted(true);
      // Trigger guide download
      const link = document.createElement('a');
      link.href = '/StudentEB5_Guide_2026.pdf';
      link.download = 'Student-EB5-Green-Card-Guide-2026.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={handleClose}>
      <div className="relative bg-card border border-border rounded-2xl shadow-2xl max-w-md w-full p-8" onClick={(e) => e.stopPropagation()}>
        <button onClick={handleClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors" aria-label="Close">
          <X size={20} />
        </button>

        {submitted ? (
          <div className="text-center py-4">
            <CheckCircle size={48} className="text-primary mx-auto mb-4" />
            <h3 className="font-serif font-bold text-xl text-foreground mb-2">Your Guide Is Downloading!</h3>
            <p className="text-muted-foreground text-sm">
              Check your downloads folder. We'll also send a copy to your email.
            </p>
          </div>
        ) : (
          <>
            <h2 className="font-serif font-bold text-xl md:text-2xl text-foreground mb-2">
              {config.title}
            </h2>
            <p className="text-muted-foreground text-sm mb-6">
              {config.subtitle}
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <Input type="text" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} required className="h-11" />
              <div>
                <Input type="email" placeholder="Personal email" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-11" />
                <p className="text-xs text-muted-foreground mt-1">100% confidential. We never contact your employer.</p>
              </div>
              <Input type="tel" placeholder="Phone number (optional)" value={phone} onChange={(e) => setPhone(e.target.value)} className="h-11" />
              <Button type="submit" disabled={submitting} className="w-full h-11 rounded-full font-semibold text-sm">
                {submitting ? 'Submitting...' : config.buttonText}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default StudentLeadModal;
