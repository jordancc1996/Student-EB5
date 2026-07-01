import { useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { TEA_INVESTMENT_THRESHOLD } from '@/lib/eb5-investment';

const FREE_EMAIL_DOMAINS = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'aol.com', 'icloud.com'];

const fields = [
  { key: 'rsu', label: 'RSU Value ($)' },
  { key: 'k401', label: '401(k) Balance ($)' },
  { key: 'equity', label: 'Home Equity ($)' },
  { key: 'savings', label: 'Liquid Savings ($)' },
] as const;

const GatedFeasibilityCalculator = () => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [values, setValues] = useState({ rsu: '', k401: '', equity: '', savings: '' });
  const [total, setTotal] = useState(0);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [emailError, setEmailError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleCalculate = () => {
    const sum = Object.values(values).reduce((acc, v) => acc + (parseFloat(v) || 0), 0);
    setTotal(sum);
    setStep(2);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');

    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setEmailError('Please enter a valid email address.');
      return;
    }

    const domain = trimmed.split('@')[1]?.toLowerCase();
    if (FREE_EMAIL_DOMAINS.includes(domain)) {
      setEmailError('Please use your work or educational email address to access premium EB-5 updates');
      return;
    }

    setSubmitting(true);
    try {
      await fetch('https://formcarry.com/s/PGtefNg4eIv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          email: trimmed,
          phone,
          source: 'gated-feasibility-calculator',
          rsu_value: values.rsu,
          k401_balance: values.k401,
          home_equity: values.equity,
          liquid_savings: values.savings,
          total_identified: total,
        }),
      });
    } catch {
      // submit silently
    }
    setSubmitting(false);
    setStep(3);
  };

  const pct = Math.min((total / TEA_INVESTMENT_THRESHOLD) * 100, 100);

  return (
    <div className="mt-12 bg-card border border-border rounded-xl p-6 md:p-8 max-w-2xl mx-auto">
      <h3 className="font-sans text-xl md:text-2xl font-medium text-foreground mb-2 text-center">
        You May Already Have the $800K. Find Out in 60 Seconds.
      </h3>
      <p className="text-muted-foreground text-sm text-center mb-6">
        Enter your assets below to see where you stand.
      </p>

      {step === 1 && (
        <div className="space-y-4">
          {fields.map((f) => (
            <div key={f.key}>
              <Label htmlFor={`calc-${f.key}`} className="text-sm font-medium text-foreground">
                {f.label}
              </Label>
              <Input
                id={`calc-${f.key}`}
                type="number"
                min="0"
                placeholder="0"
                value={values[f.key]}
                onChange={(e) => setValues((prev) => ({ ...prev, [f.key]: e.target.value }))}
                className="mt-1"
              />
            </div>
          ))}
          <Button onClick={handleCalculate} className="w-full mt-2">
            Calculate
          </Button>

          <div className="mt-6 border border-dashed border-border rounded-lg p-5 bg-muted/30">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Your Report Will Include:</p>
            <ul className="space-y-2">
              {[
                'Total assets identified vs. $800K threshold',
                'Visual progress bar showing your funding gap',
                'Personalized next-step recommendation',
                'Source-of-funds breakdown for your I-526E petition',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle size={14} className="text-primary mt-0.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div>
            <Progress value={pct} className="h-5" />
            <p className="text-foreground font-medium text-center mt-3">
              You have identified{' '}
              <span className={total >= TEA_INVESTMENT_THRESHOLD ? 'text-primary' : 'text-destructive'}>
                ${total.toLocaleString()}
              </span>{' '}
              of the required $800,000.
            </p>
            {total >= TEA_INVESTMENT_THRESHOLD && (
              <p className="text-primary text-sm text-center mt-1 font-medium">
                You meet the minimum investment threshold!
              </p>
            )}
          </div>

          <form onSubmit={handleEmailSubmit} className="space-y-3 border-t border-border pt-6">
            <p className="text-sm text-muted-foreground text-center">
              Enter your work email to unlock your personalized feasibility report.
            </p>
            <Input
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="tel"
              placeholder="Phone number (optional)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            {emailError && <p className="text-destructive text-sm">{emailError}</p>}
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? 'Submitting…' : 'Unlock Full Feasibility Report'}
            </Button>
          </form>
        </div>
      )}

      {step === 3 && (
        <div className="text-center space-y-4 py-4">
          <CheckCircle className="mx-auto text-primary" size={40} />
          <p className="text-foreground font-medium text-lg">
            Your report is on its way!
          </p>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Check your inbox for your personalized EB-5 feasibility breakdown. In the meantime, take the next step:
          </p>
          <a
            href="#consultation-form"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('consultation-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-md text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            Schedule a Free Consultation <ArrowRight size={16} />
          </a>
        </div>
      )}
    </div>
  );
};

export default GatedFeasibilityCalculator;
