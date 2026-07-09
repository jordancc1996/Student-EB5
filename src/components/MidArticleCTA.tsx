import { useState } from 'react';
import { Link } from '@/components/RouterLink';
import { ArrowRight, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface MidArticleCTAProps {
  category?: string;
}

const MidArticleCTA = ({ category }: MidArticleCTAProps) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isStudentArticle = category?.toLowerCase().includes('student') || category?.toLowerCase().includes('education');
  const pathwayUrl = isStudentArticle ? '/pathways/f1-to-eb5-self-sponsored-green-card' : '/pathways/h1b-to-green-card';
  const headline = isStudentArticle
    ? 'Your Path from Student Visa to Green Card'
    : 'Your H-1B to Green Card Pathway';
  const description = isStudentArticle
    ? 'See how EB-5 can secure your future in the U.S. after graduation.'
    : 'Escape the backlog. Explore how EB-5 gives you permanent freedom.';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    try {
      await fetch('https://formcarry.com/s/PGtefNg4eIv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ fullName, email, phone, source: `Mid-Article CTA – ${category || 'General'}` }),
      });
    } catch {
      // allow redirect even on failure
    }
    setSubmitted(true);
    setSubmitting(false);
  };

  return (
    <div className="article-page-form my-10 rounded-lg border border-border bg-muted/40 p-6 md:p-8 not-prose">
      <div className="flex flex-col gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-1">Free Resource</p>
          <h3 className="article-form-headline font-serif font-bold text-foreground leading-snug">{headline}</h3>
          <p className="text-base text-muted-foreground mt-1">{description}</p>
        </div>

        {submitted ? (
          <div className="text-base text-foreground font-medium">
            ✓ You're in! <Link to={pathwayUrl} className="text-primary underline underline-offset-2 font-semibold">Explore your pathway now →</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                type="text"
                placeholder="Full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="h-10 flex-1 text-base"
              />
              <Input
                type="email"
                placeholder="Personal email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-10 flex-1 text-base"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                type="tel"
                placeholder="Phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-10 flex-1 text-base"
              />
              <Button type="submit" disabled={submitting} size="sm" className="h-10 px-5 whitespace-nowrap font-semibold text-base">
                {submitting ? 'Sending…' : 'Get My Free Guide'}
                {!submitting && <ArrowRight className="ml-1.5 h-3.5 w-3.5" />}
              </Button>
            </div>
          </form>
        )}

        <div className="article-form-microcopy flex items-center gap-1.5 text-muted-foreground">
          <Shield className="h-3 w-3" />
          <span>100% confidential. We never contact your employer.</span>
        </div>
      </div>
    </div>
  );
};

export default MidArticleCTA;
