import {
  CheckCircle,
  Clock,
  FileText,
  ListChecks,
  MessageSquare,
  AlertTriangle,
  UserCheck,
  Video,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const includedFeatures = [
  { icon: Clock, label: '60 Minute Session' },
  { icon: Video, label: 'Private Video Meeting' },
  { icon: FileText, label: 'Written Follow-up Summary' },
  { icon: UserCheck, label: 'Educational Planning Guidance' },
  { icon: MessageSquare, label: 'General Process Overview' },
  { icon: ListChecks, label: 'Question Preparation' },
  { icon: CheckCircle, label: 'Document Planning' },
];

/**
 * Reserved booking region for a future Calendly (or similar) embed.
 * Pass `schedulingUrl` when ready — until then the slot stays inert and
 * the CTA routes to /contact rather than opening a live scheduler.
 */
interface SchedulingEmbedSlotProps {
  schedulingUrl?: string;
  provider?: 'calendly' | 'other';
}

const SchedulingEmbedSlot = ({
  schedulingUrl = '',
  provider = 'calendly',
}: SchedulingEmbedSlotProps) => {
  const isConfigured = Boolean(schedulingUrl);

  return (
    <Card
      id="private-strategy-scheduling"
      className="rounded-lg border border-border"
      data-scheduling-provider={provider}
      data-scheduling-url={schedulingUrl || undefined}
      data-scheduling-ready={isConfigured ? 'true' : 'false'}
      aria-label="Consultation booking"
    >
      <CardHeader className="text-center">
        <CardTitle className="font-serif text-2xl">Book Consultation</CardTitle>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto pt-2">
          {isConfigured
            ? 'Select a time that works for you.'
            : 'Online scheduling will appear here once a booking calendar is connected. Until then, request a session through our contact form.'}
        </p>
      </CardHeader>
      <CardContent>
        {/* Future embed mounts into this container when schedulingUrl is set. */}
        <div
          id="private-strategy-scheduling-embed"
          className="min-h-[120px] rounded-lg border border-dashed border-border bg-muted/30 flex items-center justify-center mb-6 px-4"
          aria-hidden={!isConfigured}
        >
          {isConfigured ? (
            <p className="text-sm text-muted-foreground text-center">
              Scheduling widget loads here ({provider}).
            </p>
          ) : (
            <p className="text-sm text-muted-foreground text-center">
              Scheduling embed placeholder — Calendly or equivalent integration pending.
            </p>
          )}
        </div>

        <div className="text-center">
          {isConfigured ? (
            <Button asChild className="h-11 px-8">
              <a href={schedulingUrl} target="_blank" rel="noopener noreferrer">
                Book Consultation
              </a>
            </Button>
          ) : (
            <Button asChild className="h-11 px-8">
              <a href="/contact">Book Consultation</a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const PrivateStrategySessionsContent = () => {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
          <UserCheck className="h-10 w-10 text-primary" aria-hidden="true" />
        </div>
        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">
          Private Strategy Sessions
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          One-on-one educational consultations designed to help prospective EB-5 investors organize their planning
          before engaging legal and financial professionals.
        </p>
      </div>

      <section className="mb-20" aria-labelledby="session-card-heading">
        <Card className="rounded-lg border border-border hover:shadow-lg transition-shadow overflow-hidden">
          <CardHeader className="text-center pb-4 border-b border-border bg-primary/5">
            <Badge variant="outline" className="mx-auto mb-4 w-fit">
              Private Client
            </Badge>
            <CardTitle id="session-card-heading" className="font-serif text-3xl">
              Strategy Session
            </CardTitle>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              A structured educational briefing—not legal representation or investment advice.
            </p>
          </CardHeader>
          <CardContent className="pt-8">
            <ul className="grid sm:grid-cols-2 gap-6">
              {includedFeatures.map((feature) => (
                <li key={feature.label} className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="h-6 w-6 text-primary" aria-hidden="true" />
                  </div>
                  <span className="pt-3 font-medium text-foreground">{feature.label}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>

      <section className="mb-20" aria-labelledby="booking-heading">
        <h2 id="booking-heading" className="sr-only">
          Book a consultation
        </h2>
        <SchedulingEmbedSlot />
      </section>

      <section className="mb-16" aria-labelledby="disclaimers-heading">
        <Card className="bg-muted/50 rounded-lg border border-border">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-primary" aria-hidden="true" />
              </div>
              <CardTitle id="disclaimers-heading" className="font-serif text-2xl">
                Important Note
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              Strategy sessions are educational only. They do not create an attorney-client relationship and do not
              replace counsel from a licensed immigration attorney or a FINRA-registered financial advisor.
            </p>
            <p>
              StudentEB5 does not solicit investments or recommend specific projects during these sessions.
            </p>
          </CardContent>
        </Card>
      </section>

      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-4">
          Return to{' '}
          <a href="/private-client-services" className="text-primary hover:underline font-medium">
            Private Client Services
          </a>
          {' '}or{' '}
          <a href="/contact" className="text-primary hover:underline font-medium">
            contact us
          </a>{' '}
          to request a session.
        </p>
      </div>
    </div>
  );
};

export default PrivateStrategySessionsContent;
