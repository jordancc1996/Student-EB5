import {
  Baby,
  Briefcase,
  Calendar,
  Clock,
  Compass,
  Dice5,
  DollarSign,
  FileCheck,
  GraduationCap,
  List,
  ListChecks,
  ShieldCheck,
  Users,
  Wallet,
} from 'lucide-react';

export const navIcons = {
  Baby,
  Briefcase,
  Calendar,
  Clock,
  Compass,
  Dice5,
  DollarSign,
  FileCheck,
  GraduationCap,
  List,
  ListChecks,
  ShieldCheck,
  Users,
  Wallet,
} as const;

export type NavIconName = keyof typeof navIcons;

export interface NavLink {
  name: string;
  href: string;
  icon?: NavIconName;
}

export interface NavGroup {
  label: string;
  links: NavLink[];
}

export const homeLink: NavLink = { name: 'StudentEB5', href: '/' };

export const mainLinks: NavLink[] = [
  { name: 'Research', href: '/research' },
  { name: 'News', href: '/news' },
  { name: 'Tools', href: '/eb5-investment-immigration-tools' },
  { name: 'FAQ', href: '/faq' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

// New landing pages go in src/lib/pathwayRoutes.ts and surface via /pathways/view-all, not this list.
export const pathwayLinks: NavLink[] = [
  { name: 'Find Your EB-5 Path', href: '/pathways', icon: 'Compass' },
  { name: 'International Students', href: '/pathways/f1-to-eb5-self-sponsored-green-card', icon: 'GraduationCap' },
  { name: 'H-1B Professionals', href: '/pathways/h1b-to-green-card', icon: 'Briefcase' },
  { name: 'Parents & Families', href: '/pathways/parents-and-families', icon: 'Users' },
  { name: 'View All Pathways', href: '/pathways/view-all', icon: 'List' },
];

export const resourceCategories: NavGroup[] = [
  {
    label: 'For Students',
    links: [
      { name: 'The F-1 Student Guide', href: '/eb5-green-card-international-students-playbook' },
      { name: 'Student Timeline (Step-by-Step)', href: '/pathways/f1-to-eb5-self-sponsored-green-card' },
    ],
  },
  {
    label: 'For Professionals',
    links: [
      { name: 'The H-1B to EB-5 Guide', href: '/resources' },
      { name: 'H-1B Processing Timeline', href: '/pathways/h1b-to-green-card' },
      { name: 'EB-5 Processing Times', href: '/eb5-processing-times' },
    ],
  },
  {
    label: 'Financial',
    links: [
      { name: 'Source of Funds Strategies', href: '/tools/source-of-funds-calculator' },
    ],
  },
];

export const toolLinks: NavLink[] = [
  { name: 'H-1B Lottery Calculator', href: '/tools/h1b-lottery-odds-calculator', icon: 'Dice5' },
  { name: 'Tuition Savings Calculator', href: '/tools/tuition-calculator', icon: 'GraduationCap' },
  { name: 'Grandfathering Countdown', href: '/tools/grandfathering-countdown', icon: 'Clock' },
  { name: 'OPT Calculator', href: '/tools/opt-calculator', icon: 'Calendar' },
  { name: 'H-1B Grace Period Calculator', href: '/research/h1b-60-day-grace-period-layoff-guide', icon: 'Clock' },
  { name: 'EB-5 Feasibility Tool', href: '/tools/2026-eb5-investment-feasibility-calculator', icon: 'DollarSign' },
  { name: 'Source of Funds Calculator', href: '/tools/source-of-funds-calculator', icon: 'Wallet' },
  { name: 'Concurrent Filing Checker', href: '/tools/eb5-concurrent-filing-eligibility', icon: 'FileCheck' },
  { name: 'CSPA Age Calculator', href: '/tools/eb5-cspa-calculator', icon: 'Baby' },
  { name: 'Source of Funds Checklist', href: '/tools/eb5-source-of-funds-checklist', icon: 'ListChecks' },
  { name: 'Regional Center Scorecard', href: '/tools/eb5-regional-center-scorecard', icon: 'ShieldCheck' },
];

export const desktopBarBefore = mainLinks.filter((link) => link.name === 'Research' || link.name === 'News');
export const desktopBarAfter = mainLinks.filter((link) => link.name === 'About' || link.name === 'Contact');
