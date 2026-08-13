import { useState, useEffect } from 'react';
import { Link } from '@/components/RouterLink';
import { ChevronRight, Home } from 'lucide-react';

const routeNames: Record<string, string> = {
  '': 'Home',
  'research': 'Research',
  'faq': 'FAQ',
  'about': 'About',
  'contact': 'Contact',
  'resources': 'Resources',
  'eb5-report': 'EB-5 Report',
  'privacy-policy': 'Privacy Policy',
  'tools': 'Tools',
  'eb5-investment-immigration-tools': 'Tools',
  'h1bwagemap': 'H-1B Wage Map',
  'h1b-jobdatahub': 'H-1B Job Datahub',
  'tuition-calculator': 'Tuition Savings Calculator',
  'grandfathering-countdown': 'Grandfathering Countdown',
  'tea-project-explorer': 'TEA Project Explorer',
  'visa-backlog-checker': 'Visa Backlog Checker',
  'opt-calculator': 'OPT Calculator',
  '2026-eb5-investment-feasibility-calculator': 'EB-5 Feasibility Calculator',
  'source-of-funds-calculator': 'Source of Funds Calculator',
  'h1b-lottery-odds-calculator': 'H-1B Lottery Odds Calculator',
  'eb5-direct-vs-regional-center': 'Direct vs. Regional Center',
  'eb5-concurrent-filing-eligibility': 'Concurrent Filing Eligibility',
  'eb5-cspa-calculator': 'CSPA Calculator',
  'eb5-source-of-funds-checklist': 'Source of Funds Checklist',
  'eb5-i829-lifecycle-tracker': 'I-829 Lifecycle Tracker',
  'eb5-regional-center-scorecard': 'Regional Center Scorecard',
  'pathways': 'Pathways',
  'h1b-to-green-card': 'H-1B to Green Card',
  'f1-to-eb5-self-sponsored-green-card': 'F-1 to Green Card',
  'h1b-60-day-clock': 'H-1B 60-Day Clock',
  'eb5-for-chinese-students': 'EB-5 for Chinese Students',
  'eb5-for-chinese-families': 'EB-5 for Chinese Families',
  'eb5-for-chinese-investors': 'EB-5 for Chinese Investors',
  'eb5-for-opt-students': 'EB-5 for OPT Students',
  'eb5-for-graduate-students': 'EB-5 for Graduate Students',
  'eb5-for-h4-families': 'EB-5 for H-4 Families',
  'eb5-for-l1': 'EB-5 for L-1 Visa Holders',
  'eb5-for-j1': 'EB-5 for J-1 Visa Holders',
  'eb5-for-indian-investors': 'EB-5 for Indian Investors',
  'eb5-for-indian-students': 'EB-5 for Indian Students',
  'eb5-for-indian-h1b': 'EB-5 for Indian H-1B',
  'eb5-for-indian-families': 'EB-5 for Indian Families',
  'eb5-for-korean-investors': 'EB-5 for South Korean Investors',
  'eb5-for-vietnamese-investors': 'EB-5 for Vietnamese Investors',
  'eb5-for-taiwanese-investors': 'EB-5 for Taiwanese Investors',
  'eb2-to-eb5': 'EB-5 for EB-2 Backlog',
  'eb3-to-eb5': 'EB-5 for EB-3 Backlog',
  'eb5-child-aging-out': 'EB-5 Child Aging Out',
  'eb5-concurrent-filing': 'EB-5 Concurrent Filing',
  'eb5-for-families-with-us-students': 'EB-5 for Families With U.S. Students',
  'eb5-for-wealthy-families': 'EB-5 for High-Net-Worth Families',
  'eb5-for-tech-workers': 'EB-5 for Tech Workers',
  'eb5-for-startup-founders': 'EB-5 for Startup Founders',
  'eb5-for-entrepreneurs': 'EB-5 for Entrepreneurs',
  'rural-eb5': 'Rural EB-5',
  'eb5-risk-and-due-diligence': 'EB-5 Risk and Due Diligence',
  'eb5-project-due-diligence': 'EB-5 Project Due Diligence',
  'i956f-approved-eb5-projects': 'I-956F Approved EB-5 Projects',
  'eb5-source-of-funds': 'EB-5 Source of Funds',
  'eb5-gifted-funds': 'EB-5 Gifted Funds',
  'eb5-property-sale-funds': 'EB-5 Property Sale Funds',
  'eb5-business-income': 'EB-5 Business Income',
  'eb5-vs-eb2-niw': 'EB-5 vs. EB-2 NIW',
  'eb5-vs-h1b': 'EB-5 vs. H-1B',
  'eb5-vs-other-visa-options': 'EB-5 vs. Other Visa Options',
  'eb5-investment-process': 'EB-5 Investment Process',
  'process': 'EB-5 Investment Process',
  'private-client-services': 'Private Client Services',
  'investor-intelligence-reports': 'Investor Intelligence Reports',
  'private-strategy-sessions': 'Private Strategy Sessions',
  'investor-resource-library': 'Investor Resource Library',
  'eb5-green-card-international-students-playbook':
    'EB-5 Green Card International Students Playbook',
};

const pathOverrides: Record<string, string> = {
  'tools': '/eb5-investment-immigration-tools',
  'process': '/eb5-investment-process',
};

interface BreadcrumbProps {
  customTitle?: string;
  variant?: 'light' | 'dark';
  initialPathname?: string;
}

const Breadcrumb = ({ customTitle, variant = 'light', initialPathname }: BreadcrumbProps) => {
  const [pathname, setPathname] = useState(initialPathname ?? '/');

  useEffect(() => {
    setPathname(window.location.pathname);
  }, []);

  const pathSegments = pathname.split('/').filter(Boolean);

  if (pathSegments.length === 0) {
    return null;
  }

  const breadcrumbs = [
    { name: 'Home', path: '/' },
    ...pathSegments.map((segment, index) => {
      const path = '/' + pathSegments.slice(0, index + 1).join('/');
      const isLast = index === pathSegments.length - 1;
      const name = isLast && customTitle ? customTitle : (routeNames[segment] || segment.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()));
      const linkPath = pathOverrides[segment] || path;
      return { name, path: linkPath };
    }),
  ];

  const isDark = variant === 'dark';

  return (
    <nav aria-label="Breadcrumb" className="py-4">
      <ol className={`flex flex-wrap items-center gap-2 text-sm ${isDark ? 'text-white/60' : 'text-muted-foreground'}`}>
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          
          return (
            <li key={crumb.path + index} className="flex items-center">
              {index > 0 && (
                <ChevronRight className={`w-4 h-4 mx-2 ${isDark ? 'text-white/30' : 'text-muted-foreground/50'}`} />
              )}
              
              {isLast ? (
                <span className={`font-medium ${isDark ? 'text-white' : 'text-foreground'}`}>
                  {index === 0 && <Home className="w-4 h-4 inline mr-1" />}
                  {crumb.name}
                </span>
              ) : (
                <Link
                  to={crumb.path}
                  className={`transition-colors hover:underline ${isDark ? 'hover:text-white' : 'hover:text-primary'}`}
                >
                  {index === 0 && <Home className="w-4 h-4 inline mr-1" />}
                  {crumb.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
