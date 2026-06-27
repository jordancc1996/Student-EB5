import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BookOpen,
  GraduationCap,
  Briefcase,
  DollarSign,
  Globe,
  FileText,
  ArrowRight,
  type LucideIcon,
} from 'lucide-react';

const playbookSections: {
  icon: LucideIcon;
  title: string;
  description: string;
  link: string;
}[] = [
  {
    icon: GraduationCap,
    title: 'Understanding Your Visa Status',
    description:
      'Learn about F-1, OPT, STEM OPT, and how your current status affects your immigration options.',
    link: '/research/f1-students/f1-to-eb5-green-card',
  },
  {
    icon: Briefcase,
    title: 'Career Path Planning',
    description: 'Navigate H-1B lotteries, cap-exempt employers, and alternative work authorization strategies.',
    link: '/tools/h1bwagemap',
  },
  {
    icon: DollarSign,
    title: 'Financial Considerations',
    description: 'Compare tuition costs, understand investment requirements, and plan your funding strategy.',
    link: '/tools/tuition-calculator',
  },
  {
    icon: Globe,
    title: 'EB-5 as a Pathway',
    description: 'Discover how EB-5 investment immigration can provide a direct path to permanent residency.',
    link: '/eb5-report',
  },
  {
    icon: FileText,
    title: 'Timeline & Deadlines',
    description: 'Critical dates for OPT applications, visa transitions, and EB-5 grandfathering provisions.',
    link: '/timelines/f1-student-eb5-timeline',
  },
];

const relatedClusterContent = [
  {
    title: 'F-1 to Green Card Visual Timeline',
    description: 'Step-by-step visual guide from F-1 graduation to EB-5 green card approval.',
    link: '/timelines/f1-student-eb5-timeline',
    type: 'Timeline',
  },
  {
    title: 'EB-5 Infographics for Students',
    description: 'Visual comparison charts and process flowcharts for student immigration.',
    link: '/infographics',
    type: 'Visual Guide',
  },
  {
    title: 'Complete 2027 EB-5 Guide',
    description: 'Comprehensive guide covering investment requirements and green card strategies.',
    link: '/research/complete-2027-eb5-guide',
    type: 'Guide',
  },
  {
    title: 'F-1 OPT Students: Why EB-5 Now',
    description: 'Strategic analysis for F-1 students considering EB-5 investment.',
    link: '/research/f1-students/f1-to-eb5-green-card',
    type: 'Article',
  },
  {
    title: 'Aging Out Crisis Explained',
    description: 'Understanding the risks for dependent children and how EB-5 protects families.',
    link: '/research/eb5-aging-out-crisis-families',
    type: 'Article',
  },
  {
    title: 'Source of Funds Strategies',
    description: 'Essential guidance on documenting investment funds for EB-5 applications.',
    link: '/tools/source-of-funds-calculator',
    type: 'Tool',
  },
];

const StudentPlaybookMainContent = () => {
  return (
    <div className="max-w-5xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
          <BookOpen className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">
          The U.S. International Student Playbook
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-4">
          Your comprehensive guide to navigating the American education system, building a career, and securing
          your long-term future in the United States.
        </p>
        <p className="text-lg text-muted-foreground">
          Whether you're an{' '}
          <a href="/tools/opt-calculator" className="text-primary hover:underline font-medium">
            F-1 student on OPT
          </a>{' '}
          or exploring{' '}
          <a href="/research" className="text-primary hover:underline font-medium">
            EB-5 investment options
          </a>
          , this playbook provides the strategic insights you need.
        </p>
      </div>

      {/* Playbook Sections Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {playbookSections.map((section, idx) => (
          <Card key={idx} className="hover:shadow-lg transition-shadow group">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <section.icon className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-lg">{section.title}</CardTitle>
              <CardDescription>{section.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <a
                href={section.link}
                className="text-primary hover:underline font-medium inline-flex items-center gap-2"
              >
                Learn More
                <ArrowRight className="h-4 w-4" />
              </a>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Key Resources Section */}
      <div className="bg-primary/5 rounded-xl p-8 mb-16 border border-primary/20">
        <h2 className="text-2xl font-serif font-bold mb-6 text-center">Essential Tools for Your Journey</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <a
            href="/tools/opt-calculator"
            className="p-4 bg-card rounded-lg hover:shadow-md transition-shadow flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">OPT Timeline Calculator</h3>
              <p className="text-sm text-muted-foreground">Track your work authorization deadlines</p>
            </div>
          </a>
          <a
            href="/tools/tuition-calculator"
            className="p-4 bg-card rounded-lg hover:shadow-md transition-shadow flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Tuition Savings Calculator</h3>
              <p className="text-sm text-muted-foreground">Compare costs as an international vs. resident</p>
            </div>
          </a>
          <a
            href="/tools/2026-eb5-investment-feasibility-calculator"
            className="p-4 bg-card rounded-lg hover:shadow-md transition-shadow flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Globe className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">EB-5 Feasibility Tool</h3>
              <p className="text-sm text-muted-foreground">Evaluate your EB-5 investment readiness</p>
            </div>
          </a>
          <a
            href="/tools/visa-backlog-checker"
            className="p-4 bg-card rounded-lg hover:shadow-md transition-shadow flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Briefcase className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Visa Backlog Checker</h3>
              <p className="text-sm text-muted-foreground">Check current wait times by country</p>
            </div>
          </a>
        </div>
      </div>

      {/* Related Cluster Content - Hub Links */}
      <div className="mb-16">
        <h2 className="text-2xl font-serif font-bold mb-2 text-center">F-1 Student EB-5 Resources</h2>
        <p className="text-muted-foreground text-center mb-8">
          Explore our complete library of guides, timelines, and tools for international students
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {relatedClusterContent.map((item, idx) => (
            <a
              key={idx}
              href={item.link}
              className="p-5 bg-card border border-border rounded-lg hover:shadow-md hover:border-primary/30 transition-all group"
            >
              <span className="text-xs font-medium text-primary uppercase tracking-wide">{item.type}</span>
              <h3 className="font-semibold text-foreground mt-1 mb-2 group-hover:text-primary transition-colors">
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </a>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center">
        <h2 className="text-2xl font-serif font-bold mb-4">Ready to Take the Next Step?</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Get personalized guidance on your immigration journey. Our team specializes in helping international
          students and professionals navigate the path to permanent residency.
        </p>
        <a
          href="/contact"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          Schedule a Consultation
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
};

export default StudentPlaybookMainContent;
