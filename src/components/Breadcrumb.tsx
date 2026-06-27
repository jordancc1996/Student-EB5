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
};

const pathOverrides: Record<string, string> = {
  'tools': '/eb5-investment-immigration-tools',
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
