import { AlertTriangle, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import InvestorReportCard from '@/components/private-client/InvestorReportCard';

const products = [
  {
    title: 'EB-5 Due Diligence Checklist',
    summary:
      'A structured checklist of questions and document themes for evaluating projects and regional centers before engaging counsel.',
    price: 'Contact us for pricing',
  },
  {
    title: 'Source of Funds Checklist',
    summary:
      'Educational worksheet covering common lawful-source pathways, gift documentation themes, and organization tips.',
    price: 'Contact us for pricing',
  },
  {
    title: 'H-1B to EB-5 Planning Guide',
    summary:
      'Planning guide for professionals mapping concurrent filing concepts, timing pressure points, and advisor preparation.',
    price: 'Contact us for pricing',
  },
  {
    title: 'F-1 Student EB-5 Workbook',
    summary:
      'Workbook for international students and families organizing status milestones, capital questions, and next-step planning.',
    price: 'Contact us for pricing',
  },
  {
    title: 'Concurrent Filing Roadmap',
    summary:
      'Visual educational roadmap outlining how concurrent filing concepts typically sequence for eligible applicants.',
    price: 'Contact us for pricing',
  },
  {
    title: 'Visa Timeline Planner',
    summary:
      'Printable planner for tracking petition milestones, category considerations, and family-related timeline notes.',
    price: 'Contact us for pricing',
  },
  {
    title: 'Project Comparison Worksheet',
    summary:
      'Side-by-side worksheet for comparing offering terms, capital position, and diligence questions across opportunities.',
    price: 'Contact us for pricing',
  },
];

const InvestorResourceLibraryContent = () => {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
          <BookOpen className="h-10 w-10 text-primary" aria-hidden="true" />
        </div>
        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">
          Investor Resource Library
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Download professional planning resources, guides, worksheets, and educational tools created specifically for
          EB-5 investors.
        </p>
      </div>

      <section className="mb-20" aria-labelledby="library-products-heading">
        <h2 id="library-products-heading" className="text-2xl font-serif font-bold mb-2 text-center">
          Digital Resources
        </h2>
        <p className="text-muted-foreground text-center mb-10 max-w-2xl mx-auto">
          Placeholder catalog. Downloads are not yet available—each product shows Coming Soon until fulfillment is enabled.
        </p>
        <div className="grid md:grid-cols-2 gap-8">
          {products.map((product, i) => (
            <InvestorReportCard key={product.title} index={i + 1} {...product} />
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
                Educational Use Only
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              Library materials are educational planning aids. They do not constitute legal or financial advice and do not
              replace guidance from a licensed immigration attorney or a FINRA-registered financial advisor.
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
          about upcoming resource availability.
        </p>
      </div>
    </div>
  );
};

export default InvestorResourceLibraryContent;
