import {
  AlertTriangle,
  Briefcase,
  CheckCircle,
  DollarSign,
  FileText,
  Route,
  Shield,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import InvestorReportCard from '@/components/private-client/InvestorReportCard';

const reports = [
  {
    title: 'EB-5 Project Intelligence Report',
    summary:
      'Educational framework for reviewing project structure, job-creation methodology, timeline risk, and documentation standards before engaging counsel.',
    price: 'Contact us for pricing',
    updatedDate: 'July 2026',
    reportLength: '28–35 pages',
  },
  {
    title: 'Regional Center Intelligence Report',
    summary:
      'Independent overview of how to evaluate regional center track record, integrity-act compliance themes, and governance considerations.',
    price: 'Contact us for pricing',
    updatedDate: 'July 2026',
    reportLength: '22–28 pages',
  },
  {
    title: 'Rural EB-5 Market Report',
    summary:
      'Context on rural set-aside dynamics, processing expectations, and market structure for investors comparing reserved-category pathways.',
    price: 'Contact us for pricing',
    updatedDate: 'June 2026',
    reportLength: '18–24 pages',
  },
  {
    title: 'Project Comparison Report',
    summary:
      'Side-by-side educational template for comparing offering terms, capital position, exit assumptions, and diligence questions across opportunities.',
    price: 'Contact us for pricing',
    updatedDate: 'July 2026',
    reportLength: '30–40 pages',
  },
  {
    title: 'Capital Stack Analysis Report',
    summary:
      'Plain-language analysis of senior debt, mezzanine, and EB-5 equity positioning—focused on risk hierarchy, not investment recommendations.',
    price: 'Contact us for pricing',
    updatedDate: 'June 2026',
    reportLength: '20–26 pages',
  },
];

const analyzeItems = [
  {
    icon: FileText,
    title: 'Offering Structures',
    description: 'How capital is organized, what documents typically disclose, and which terms warrant closer review with professionals.',
  },
  {
    icon: ShieldCheck,
    title: 'Regional Center Context',
    description: 'Integrity Act themes, governance signals, and educational criteria investors use when assessing a regional center.',
  },
  {
    icon: TrendingUp,
    title: 'Market & Category Dynamics',
    description: 'Reserved vs. unreserved categories, rural TEA considerations, and how timing interacts with filing strategy.',
  },
  {
    icon: Briefcase,
    title: 'Project Diligence Themes',
    description: 'Job creation, construction risk, developer experience, and other diligence lenses used in serious evaluations.',
  },
];

const preparationSteps = [
  {
    icon: CheckCircle,
    title: 'Source Public Record',
    description: 'Reports draw on statutes, USCIS guidance, industry filings, and established educational research—not promotional decks alone.',
  },
  {
    icon: FileText,
    title: 'Structure for Decision Support',
    description: 'Each brief organizes questions and frameworks so readers can prepare focused conversations with attorneys and advisors.',
  },
  {
    icon: Shield,
    title: 'Remain Educational',
    description: 'We do not sell projects or solicit investments. Analysis is designed to inform—not to recommend a specific opportunity.',
  },
];

const audienceItems = [
  {
    title: 'Prospective EB-5 Investors',
    description: 'Individuals and families evaluating whether and how to approach the EB-5 process with clearer diligence questions.',
  },
  {
    title: 'H-1B & F-1 Pathways Readers',
    description: 'Professionals and students already following StudentEB5 research who need deeper project and structure literacy.',
  },
  {
    title: 'Family Capital Decision-Makers',
    description: 'Parents or principals coordinating gifted funds who want structured educational materials before engaging counsel.',
  },
];

const InvestorIntelligenceReportsContent = () => {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
          <FileText className="h-10 w-10 text-primary" aria-hidden="true" />
        </div>
        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">
          Investor Intelligence Reports
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Independent educational research designed to help prospective EB-5 investors better understand projects,
          regional centers, offering structures, and important due diligence considerations.
        </p>
      </div>

      <section className="mb-20" aria-labelledby="report-library-heading">
        <h2 id="report-library-heading" className="text-2xl font-serif font-bold mb-2 text-center">
          Report Library
        </h2>
        <p className="text-muted-foreground text-center mb-10 max-w-2xl mx-auto">
          Placeholder catalog. Purchase fulfillment is not yet available—each report shows Coming Soon until checkout is enabled.
        </p>
        <div className="grid md:grid-cols-2 gap-8">
          {reports.map((report, i) => (
            <InvestorReportCard key={report.title} index={i + 1} {...report} />
          ))}
        </div>
      </section>

      <section className="mb-20" aria-labelledby="what-we-analyze-heading">
        <h2 id="what-we-analyze-heading" className="text-2xl font-serif font-bold mb-8 text-center">
          What We Analyze
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {analyzeItems.map((item) => (
            <Card key={item.title} className="rounded-lg border border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <item.icon className="h-6 w-6 text-primary" aria-hidden="true" />
                </div>
                <CardTitle className="font-serif text-xl">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-20" aria-labelledby="how-prepared-heading">
        <div className="bg-primary/5 rounded-lg p-8 border border-primary/20">
          <h2 id="how-prepared-heading" className="text-2xl font-serif font-bold mb-8 text-center">
            How Reports Are Prepared
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {preparationSteps.map((step) => (
              <div key={step.title} className="p-5 bg-card rounded-lg border border-border">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <step.icon className="h-5 w-5 text-primary" aria-hidden="true" />
                </div>
                <h3 className="font-serif font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mb-20" aria-labelledby="who-for-heading">
        <h2 id="who-for-heading" className="text-2xl font-serif font-bold mb-8 text-center">
          Who These Reports Are For
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {audienceItems.map((item, i) => (
            <Card key={item.title} className="rounded-lg border border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <span className="block text-sm font-medium text-muted-foreground tracking-wider mb-3">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <CardTitle className="font-serif text-lg">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-16" aria-labelledby="disclaimers-heading">
        <Card className="bg-muted/50 rounded-lg border border-border">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-primary" aria-hidden="true" />
              </div>
              <CardTitle id="disclaimers-heading" className="font-serif text-2xl">
                Important Disclaimers
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              Investor Intelligence Reports are educational resources only. They do not constitute legal, tax,
              investment, or immigration advice and should not be relied upon as a substitute for professional counsel.
            </p>
            <p>
              StudentEB5 does not endorse specific projects, regional centers, attorneys, or broker-dealers. Any capital
              placed in an EB-5 offering is at risk and is not guaranteed to be returned. Processing times and policy
              conditions change.
            </p>
            <p>
              Before taking action, consult a licensed immigration attorney and a FINRA-registered financial advisor
              regarding your specific circumstances.
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
          with questions about upcoming report availability.
        </p>
      </div>
    </div>
  );
};

export default InvestorIntelligenceReportsContent;
