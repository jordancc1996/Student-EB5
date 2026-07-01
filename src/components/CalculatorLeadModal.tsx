import { useState } from 'react';
import { X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface CalculatorLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CalculatorLeadModal = ({ isOpen, onClose }: CalculatorLeadModalProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await fetch('https://formcarry.com/s/PGtefNg4eIv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ name, email, phone, source: 'EB-5 Calculator CTA' }),
      });
    } catch {
      // Allow redirect even if submission fails
    }

    window.location.href = '/tools/2026-eb5-investment-feasibility-calculator';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="relative bg-card border border-border rounded-2xl shadow-2xl max-w-md w-full p-8" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <h2 className="font-serif font-bold text-xl md:text-2xl text-foreground mb-2">
          Check Your EB-5 Feasibility
        </h2>
        <p className="text-muted-foreground text-sm mb-6">
          Enter your details to access the calculator.
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
          <Input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-11"
          />
          <Input
            type="tel"
            placeholder="Phone number (optional)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="h-11"
          />
          <Button type="submit" disabled={submitting} className="w-full h-11 font-semibold text-sm">
            {submitting ? 'Submitting...' : 'Get My Results'}
            {!submitting && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CalculatorLeadModal;
