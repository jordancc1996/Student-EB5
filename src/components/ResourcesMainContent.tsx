import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, FileText, Download, ExternalLink, Video, type LucideIcon } from 'lucide-react';

const resourceCategories: {
  title: string;
  icon: LucideIcon;
  items: { name: string; description: string; url: string; external: boolean }[];
}[] = [
  {
    title: 'Official Documentation',
    icon: FileText,
    items: [
      {
        name: 'USCIS EB-5 Immigrant Investor Program',
        description: 'Official USCIS page with comprehensive program information',
        url: 'https://www.uscis.gov/working-in-the-united-states/permanent-workers/employment-based-immigration-fifth-preference-eb-5',
        external: true,
      },
      {
        name: 'EB-5 Reform and Integrity Act of 2022',
        description: 'Latest legislative updates to the EB-5 program',
        url: 'https://www.uscis.gov/working-in-the-united-states/permanent-workers/employment-based-immigration-fifth-preference-eb-5/eb-5-immigrant-investor-regional-center-program',
        external: true,
      },
    ],
  },
  {
    title: 'StudentEB5 Resources',
    icon: BookOpen,
    items: [
      {
        name: 'The U.S. International Student Playbook',
        description: 'Your complete guide to navigating the U.S. as an international student',
        url: '/student-playbook',
        external: false,
      },
      {
        name: 'EB-5 Investment Report',
        description: 'Download our comprehensive guide to EB-5 investments',
        url: '/eb5-report',
        external: false,
      },
      {
        name: 'Research Articles',
        description: 'Expert research and latest updates on EB-5 for students',
        url: '/research',
        external: false,
      },
    ],
  },
  {
    title: 'Forms & Templates',
    icon: Download,
    items: [
      {
        name: 'Form I-526 (Immigrant Petition)',
        description: 'Download the main EB-5 petition form from USCIS',
        url: 'https://www.uscis.gov/i-526',
        external: true,
      },
      {
        name: 'Form I-829 (Remove Conditions)',
        description: 'Form to remove conditions on permanent residence',
        url: 'https://www.uscis.gov/i-829',
        external: true,
      },
    ],
  },
  {
    title: 'Educational Videos',
    icon: Video,
    items: [
      {
        name: 'EB-5 Process Overview',
        description: 'Understanding the complete EB-5 application timeline',
        url: '#',
        external: false,
      },
      {
        name: 'Investment Strategies for Students',
        description: 'How international students can leverage EB-5',
        url: '#',
        external: false,
      },
    ],
  },
  {
    title: 'Immigration Data & Insights',
    icon: BookOpen,
    items: [
      {
        name: 'USCIS Processing Times',
        description: 'Current processing times for EB-5 petitions and applications',
        url: 'https://egov.uscis.gov/processing-times/',
        external: true,
      },
      {
        name: 'Department of State Visa Statistics',
        description: 'Annual reports on immigrant and non-immigrant visa issuances',
        url: 'https://travel.state.gov/content/travel/en/legal/visa-law0/visa-statistics.html',
        external: true,
      },
      {
        name: 'EB-5 Regional Center List',
        description: 'Official list of USCIS-designated regional centers',
        url: 'https://www.uscis.gov/working-in-the-united-states/permanent-workers/employment-based-immigration-fifth-preference-eb-5/eb-5-immigrant-investor-regional-center-program',
        external: true,
      },
      {
        name: 'Immigration Data Hub',
        description: 'Comprehensive immigration statistics and trend analysis',
        url: 'https://www.dhs.gov/immigration-statistics',
        external: true,
      },
    ],
  },
  {
    title: 'Visa Statistics',
    icon: FileText,
    items: [
      {
        name: 'Visa Bulletin',
        description: 'Monthly visa bulletin with priority dates and availability',
        url: 'https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin.html',
        external: true,
      },
      {
        name: 'EB-5 Visa Issuance Data',
        description: 'Historical data on EB-5 visa issuances by country and year',
        url: 'https://travel.state.gov/content/travel/en/legal/visa-law0/visa-statistics/annual-reports.html',
        external: true,
      },
      {
        name: 'USCIS EB-5 Statistics',
        description: 'Quarterly and annual statistics on EB-5 petitions',
        url: 'https://www.uscis.gov/tools/reports-and-studies/immigration-and-citizenship-data',
        external: true,
      },
      {
        name: 'Priority Date Movement Tracker',
        description: 'Track historical movement of EB-5 priority dates',
        url: 'https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin.html',
        external: true,
      },
    ],
  },
];

const ResourcesMainContent = () => {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
          <BookOpen className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
          EB-5 Immigration Resources and Tools for Students
        </h1>
        <p className="text-xl text-muted-foreground mb-4">
          Comprehensive guides, forms, and materials for your EB-5 journey
        </p>
        <p className="text-lg text-muted-foreground">
          New to EB-5? Explore our{' '}
          <a href="/research" className="text-primary hover:underline font-medium">
            research articles
          </a>{' '}
          for expert insights or download our{' '}
          <a href="/eb5-report" className="text-primary hover:underline font-medium">
            EB-5 Investment Report
          </a>
          . Have questions? Check our{' '}
          <a href="/faq" className="text-primary hover:underline font-medium">
            FAQ page
          </a>{' '}
          or{' '}
          <a href="/contact" className="text-primary hover:underline font-medium">
            contact us
          </a>{' '}
          for personalized guidance.
        </p>
      </div>

      {/* Resource Categories */}
      <div className="space-y-12">
        {resourceCategories.map((category, idx) => (
          <div key={idx}>
            <div className="flex items-center gap-3 mb-6">
              <category.icon className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-serif font-bold">{category.title}</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {category.items.map((item, itemIdx) => (
                <Card key={itemIdx} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-start justify-between gap-2">
                      <span>{item.name}</span>
                      {item.external ? (
                        <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-1" />
                      ) : (
                        <Download className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-1" />
                      )}
                    </CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {item.external ? (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline font-medium inline-flex items-center gap-2"
                      >
                        Visit Resource
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    ) : (
                      <a
                        href={item.url}
                        className="text-primary hover:underline font-medium inline-flex items-center gap-2"
                      >
                        Access Resource
                        <span>→</span>
                      </a>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* H-1B Professional Hub Section - Cluster Links */}
      <div className="mt-16">
        <h2 className="text-2xl font-serif font-bold mb-2 text-center">
          H-1B to EB-5 Transition Resources
        </h2>
        <p className="text-center text-muted-foreground mb-8">
          Essential guides and tools for H-1B professionals exploring permanent residency
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <a
            href="/timelines/h1b-eb5-processing-timeline"
            className="p-5 bg-primary/5 border border-primary/20 rounded-lg hover:shadow-md transition-shadow"
          >
            <span className="text-xs font-medium text-primary uppercase">Timeline</span>
            <h3 className="font-semibold text-foreground mt-1 mb-2">H-1B Concurrent Filing Timeline</h3>
            <p className="text-sm text-muted-foreground">Visual guide to processing milestones and EAD arrival.</p>
          </a>
          <a
            href="/research/5-reasons-switch-h1b-to-eb5"
            className="p-5 bg-card border border-border rounded-lg hover:shadow-md transition-shadow"
          >
            <span className="text-xs font-medium text-muted-foreground uppercase">Article</span>
            <h3 className="font-semibold text-foreground mt-1 mb-2">5 Reasons to Switch H-1B to EB-5</h3>
            <p className="text-sm text-muted-foreground">Key benefits of transitioning to investment immigration.</p>
          </a>
          <a
            href="/research/eb5-lifeline-h1b-workers"
            className="p-5 bg-card border border-border rounded-lg hover:shadow-md transition-shadow"
          >
            <span className="text-xs font-medium text-muted-foreground uppercase">Article</span>
            <h3 className="font-semibold text-foreground mt-1 mb-2">EB-5: A Lifeline for H-1B Workers</h3>
            <p className="text-sm text-muted-foreground">How EB-5 provides stability amid visa uncertainty.</p>
          </a>
          <a
            href="/tools/source-of-funds-calculator"
            className="p-5 bg-card border border-border rounded-lg hover:shadow-md transition-shadow"
          >
            <span className="text-xs font-medium text-muted-foreground uppercase">Tool</span>
            <h3 className="font-semibold text-foreground mt-1 mb-2">Source of Funds Calculator</h3>
            <p className="text-sm text-muted-foreground">Plan and document your investment funding strategy.</p>
          </a>
          <a
            href="/research/h1b-eb5-financial-planning"
            className="p-5 bg-card border border-border rounded-lg hover:shadow-md transition-shadow"
          >
            <span className="text-xs font-medium text-muted-foreground uppercase">Article</span>
            <h3 className="font-semibold text-foreground mt-1 mb-2">H-1B to EB-5 Financial Planning</h3>
            <p className="text-sm text-muted-foreground">Strategic financial considerations for the transition.</p>
          </a>
          <a
            href="/infographics"
            className="p-5 bg-card border border-border rounded-lg hover:shadow-md transition-shadow"
          >
            <span className="text-xs font-medium text-muted-foreground uppercase">Visual Guide</span>
            <h3 className="font-semibold text-foreground mt-1 mb-2">EB-5 Infographics Library</h3>
            <p className="text-sm text-muted-foreground">Downloadable charts, timelines, and comparisons.</p>
          </a>
        </div>
      </div>

      {/* Cross-Pillar Links */}
      <div className="mt-12 p-8 bg-primary/5 rounded-lg border border-primary/20">
        <h2 className="text-2xl font-serif font-bold mb-4 text-center">
          Explore All EB-5 Resource Hubs
        </h2>
        <p className="text-center text-muted-foreground mb-6">
          Navigate to resources tailored for your situation
        </p>
        <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          <a
            href="/student-playbook"
            className="p-4 bg-card rounded-lg hover:shadow-md transition-shadow text-center"
          >
            <span className="text-xs font-medium text-primary uppercase">For Students</span>
            <h3 className="font-semibold mb-2 mt-1">F-1 Student Playbook</h3>
            <p className="text-sm text-muted-foreground">Complete guide for international students</p>
          </a>
          <a
            href="/tools/source-of-funds-calculator"
            className="p-4 bg-card rounded-lg hover:shadow-md transition-shadow text-center"
          >
            <span className="text-xs font-medium text-primary uppercase">Financial</span>
            <h3 className="font-semibold mb-2 mt-1">Source of Funds Strategies</h3>
            <p className="text-sm text-muted-foreground">Investment funding and documentation</p>
          </a>
          <a
            href="/infographics"
            className="p-4 bg-card rounded-lg hover:shadow-md transition-shadow text-center"
          >
            <span className="text-xs font-medium text-primary uppercase">Visual</span>
            <h3 className="font-semibold mb-2 mt-1">Infographics Library</h3>
            <p className="text-sm text-muted-foreground">Charts, timelines, and visual guides</p>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ResourcesMainContent;
