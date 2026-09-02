import { useId, useState } from 'react';
import { Link } from '@/components/RouterLink';
import { ArrowRight, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FORMCARRY_GENERIC_ERROR, submitToFormcarry } from '@/lib/formcarry';
import type { ArticlePathwayCta } from '@/lib/research/resolveArticlePathway';

interface MidArticleCTAProps {
  mid: ArticlePathwayCta['mid'];
  pathwayContext: string;
}

const MidArticleCTA = ({ mid, pathwayContext }: MidArticleCTAProps) => {
  const submitErrorId = useId();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    setSubmitError('');
    const result = await submitToFormcarry({
      fullName,
      email,
      phone,
      source: `Mid-Article CTA – ${pathwayContext}`,
      pathwayContext,
    });
    if (result.ok) {
      setSubmitted(true);
    } else {
      setSubmitError(result.message || FORMCARRY_GENERIC_ERROR);
    }
    setSubmitting(false);
  };

  return (
    <div className="article-page-form my-10 rounded-lg border border-border bg-muted/40 p-6 md:p-8 not-prose">
      <div className="flex flex-col gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-1">
            {mid.eyebrow}
          </p>
          <h3 className="article-form-headline font-serif font-bold text-foreground leading-snug">
            {mid.headline}
          </h3>
          <p className="text-base text-muted-foreground mt-1">{mid.body}</p>
        </div>

        <Link
          to={mid.href}
          className="inline-flex w-full sm:w-auto items-center justify-center rounded-md bg-cta-navy px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-cta-navy/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          {mid.pathwayLinkLabel}
          <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
        </Link>

        {submitted ? (
          <div className="text-base text-foreground font-medium">
            ✓ You're in!{' '}
            <Link to={mid.href} className="text-primary underline underline-offset-2 font-semibold">
              Continue to your pathway →
            </Link>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground m-0">{mid.formPrompt}</p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1 space-y-1">
                  <Label htmlFor="mid-name">Full Name *</Label>
                  <Input
                    id="mid-name"
                    type="text"
                    placeholder="Full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="h-10 text-base"
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <Label htmlFor="mid-email">Email *</Label>
                  <Input
                    id="mid-email"
                    type="email"
                    placeholder="Personal email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-10 text-base"
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1 space-y-1">
                  <Label htmlFor="mid-phone">Phone Number (optional)</Label>
                  <Input
                    id="mid-phone"
                    type="tel"
                    placeholder="Phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="h-10 text-base"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={submitting}
                  size="sm"
                  className="h-10 px-5 whitespace-nowrap font-semibold text-base sm:self-end"
                >
                  {submitting ? 'Sending…' : 'Get My Free Evaluation'}
                  {!submitting && <ArrowRight className="ml-1.5 h-3.5 w-3.5" />}
                </Button>
              </div>
              {submitError ? (
                <p id={submitErrorId} role="alert" className="text-sm text-destructive">{submitError}</p>
              ) : null}
            </form>
          </>
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
