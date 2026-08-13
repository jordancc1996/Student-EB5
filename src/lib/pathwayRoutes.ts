// SOURCE OF TRUTH for all /pathways routing. Any new landing page must be
// added here before it can appear in the pathway finder, the "View All
// Pathways" directory, or the Parents & Families hub.

export type ImmigrationStatus =
  | 'f1'
  | 'opt-stem-opt'
  | 'h1b'
  | 'j1'
  | 'l1'
  | 'h4'
  | 'other-visa'
  | 'outside-us'
  | 'not-sure';

export type Situation =
  | 'international-student'
  | 'h1b-lottery-worry'
  | 'h1b-backlog'
  | 'h1b-layoff'
  | 'parents-funding'
  | 'parent-exploring'
  | 'comparing-paths'
  | 'investor-primary'
  | 'not-sure'
  | 'opt-stem-opt'
  | 'graduate-student'
  | 'eb2-backlog'
  | 'eb3-backlog'
  | 'aging-out-child'
  | 'concurrent-filing-interest'
  | 'tech-worker'
  | 'startup-founder'
  | 'business-owner-entrepreneur'
  | 'high-net-worth-family'
  | 'comparing-eb5-eb2niw'
  | 'comparing-visa-options';

export type CountryOfBirth =
  | 'china'
  | 'india'
  | 'south-korea'
  | 'vietnam'
  | 'taiwan'
  | 'rest-of-world';

export interface LandingPage {
  id: string;
  url: string;
  title: string;
  applicableWhen: {
    statuses?: ImmigrationStatus[];
    situations?: Situation[];
    countries?: CountryOfBirth[];
  };
  specificity: 1 | 2 | 3 | 4;
  secondaryLinks: string[];
  hasDedicatedContent: boolean;
  isRouterPage?: boolean;
  lastReviewed: string;
  /** ISO date (YYYY-MM-DD) when this page becomes indexable, or null if not yet scheduled. */
  publishDate: string | null;
  /**
   * Computed via isIndexable(page) — do not hand-set on entries.
   * True when publishDate is set and today's date is on or after publishDate.
   */
  readonly indexable?: boolean;
}

export const immigrationStatuses: ImmigrationStatus[] = [
  'f1',
  'opt-stem-opt',
  'h1b',
  'j1',
  'l1',
  'h4',
  'other-visa',
  'outside-us',
  'not-sure',
];

export const situations: Situation[] = [
  'international-student',
  'h1b-lottery-worry',
  'h1b-backlog',
  'h1b-layoff',
  'parents-funding',
  'parent-exploring',
  'comparing-paths',
  'investor-primary',
  'not-sure',
  'opt-stem-opt',
  'graduate-student',
  'eb2-backlog',
  'eb3-backlog',
  'aging-out-child',
  'concurrent-filing-interest',
  'tech-worker',
  'startup-founder',
  'business-owner-entrepreneur',
  'high-net-worth-family',
  'comparing-eb5-eb2niw',
  'comparing-visa-options',
];

/** Country config for pathway finder. hasDedicatedContent stays false until matching .astro pages exist under src/pages/pathways/. */
export const countriesOfBirth: Record<
  CountryOfBirth,
  { label: string; hasDedicatedContent: boolean }
> = {
  china: { label: 'China', hasDedicatedContent: true },
  india: { label: 'India', hasDedicatedContent: true },
  'south-korea': { label: 'South Korea', hasDedicatedContent: true },
  vietnam: { label: 'Vietnam', hasDedicatedContent: true },
  taiwan: { label: 'Taiwan', hasDedicatedContent: true },
  'rest-of-world': { label: 'Rest of world', hasDedicatedContent: false },
};

const LAST_REVIEWED = '2026-08-12';
/** Already-live pathway pages — keep indexable; do not pull from search. */
const PUBLISH_DATE_ALREADY_LIVE = '2026-01-01';
/** Default for newly built pages; edit per-page dates when staggering the release. */
const PUBLISH_DATE_DEFAULT = '2026-08-12';

/**
 * Pathway landing pages. Add an entry here before a new /pathways page can appear
 * in the finder, View All directory, or Parents & Families hub.
 */
export const landingPages: LandingPage[] = [
  {
    id: 'h1b-to-green-card',
    url: '/pathways/h1b-to-green-card',
    title: 'H-1B to Green Card via EB-5',
    applicableWhen: {
      statuses: ['h1b'],
      situations: [
        'h1b-lottery-worry',
        'h1b-backlog',
        'h1b-layoff',
        'concurrent-filing-interest',
        'tech-worker',
        'eb2-backlog',
        'eb3-backlog',
        'comparing-paths',
        'comparing-eb5-eb2niw',
        'aging-out-child',
      ],
      countries: ['china', 'india', 'south-korea', 'vietnam', 'taiwan', 'rest-of-world'],
    },
    specificity: 3,
    secondaryLinks: [
      '/pathways/h1b-60-day-clock',
      '/pathways/f1-to-eb5-self-sponsored-green-card',
      '/research/eb5-lifeline-h1b-workers',
    ],
    hasDedicatedContent: true,
    lastReviewed: LAST_REVIEWED,
    publishDate: PUBLISH_DATE_ALREADY_LIVE,
  },
  {
    id: 'f1-to-eb5-self-sponsored-green-card',
    url: '/pathways/f1-to-eb5-self-sponsored-green-card',
    title: 'F-1 Student to EB-5 Self-Sponsored Green Card',
    applicableWhen: {
      statuses: ['f1', 'opt-stem-opt'],
      situations: [
        'international-student',
        'opt-stem-opt',
        'graduate-student',
        'parents-funding',
        'parent-exploring',
        'h1b-lottery-worry',
        'comparing-paths',
      ],
      countries: ['china', 'india', 'south-korea', 'vietnam', 'taiwan', 'rest-of-world'],
    },
    specificity: 3,
    secondaryLinks: [
      '/pathways/h1b-to-green-card',
      '/eb5-green-card-international-students-playbook',
      '/research/f1-students/f1-to-eb5-green-card',
    ],
    hasDedicatedContent: true,
    lastReviewed: LAST_REVIEWED,
    publishDate: PUBLISH_DATE_ALREADY_LIVE,
  },
  {
    id: 'h1b-60-day-clock',
    url: '/pathways/h1b-60-day-clock',
    title: 'H-1B 60-Day Grace Period Guide',
    applicableWhen: {
      statuses: ['h1b'],
      situations: ['h1b-layoff'],
      countries: ['china', 'india', 'south-korea', 'vietnam', 'taiwan', 'rest-of-world'],
    },
    specificity: 4,
    secondaryLinks: [
      '/pathways/h1b-to-green-card',
      '/research/h1b-60-day-grace-period-layoff-guide',
      '/research/h1b-tech-layoffs-eb5-entrepreneurship',
    ],
    hasDedicatedContent: true,
    lastReviewed: LAST_REVIEWED,
    publishDate: PUBLISH_DATE_ALREADY_LIVE,
  },
  {
    id: 'eb5-for-chinese-students',
    url: '/pathways/eb5-for-chinese-students',
    title: 'EB-5 for Chinese International Students Studying in the U.S.',
    applicableWhen: {
      statuses: ['f1', 'opt-stem-opt'],
      situations: [
        'international-student',
        'opt-stem-opt',
        'graduate-student',
        'parents-funding',
        'parent-exploring',
        'h1b-lottery-worry',
        'comparing-paths',
      ],
      countries: ['china'],
    },
    specificity: 4,
    secondaryLinks: [
      '/research/f1-students/stem-opt-eb5-indian-chinese',
      '/research/comparisons/h1b-vs-eb5-lifetime-cost-indian-chinese-students',
      '/research/f1-students/f1-to-eb5-green-card',
      '/eb5-green-card-international-students-playbook',
    ],
    hasDedicatedContent: true,
    lastReviewed: LAST_REVIEWED,
    publishDate: PUBLISH_DATE_ALREADY_LIVE,
  },
  {
    id: 'eb5-for-chinese-families',
    url: '/pathways/eb5-for-chinese-families',
    title: 'How Chinese Parents Can Fund an EB-5 Investment for a Child in the U.S.',
    applicableWhen: {
      statuses: ['f1', 'opt-stem-opt', 'outside-us', 'not-sure'],
      situations: ['parents-funding', 'parent-exploring', 'high-net-worth-family', 'international-student'],
      countries: ['china'],
    },
    specificity: 4,
    secondaryLinks: [
      '/research/ways-to-fund-eb5-investment-2026',
      '/research/investment/eb5-pre-investment-checklist-part-1-f1-h1b',
      '/pathways/eb5-for-chinese-students',
    ],
    hasDedicatedContent: true,
    lastReviewed: LAST_REVIEWED,
    publishDate: PUBLISH_DATE_ALREADY_LIVE,
  },
  {
    id: 'eb5-for-chinese-investors',
    url: '/pathways/eb5-for-chinese-investors',
    title: 'EB-5 Visa for Chinese Investors: A 2026 Guide',
    applicableWhen: {
      statuses: ['f1', 'h1b', 'j1', 'l1', 'h4', 'other-visa', 'outside-us', 'not-sure', 'opt-stem-opt'],
      situations: [
        'investor-primary',
        'comparing-paths',
        'high-net-worth-family',
        'business-owner-entrepreneur',
        'concurrent-filing-interest',
      ],
      countries: ['china'],
    },
    specificity: 3,
    secondaryLinks: [
      '/research/eb5-cryptocurrency-source-of-funds',
      '/research/evaluating-eb5-projects-pending-i956f',
      '/research/complete-2027-eb5-guide',
    ],
    hasDedicatedContent: true,
    lastReviewed: LAST_REVIEWED,
    publishDate: PUBLISH_DATE_ALREADY_LIVE,
  },
  {
    id: 'eb5-for-opt-students',
    url: '/pathways/eb5-for-opt-students',
    title: 'EB-5 for OPT and STEM OPT Students',
    applicableWhen: {
      statuses: ['f1', 'opt-stem-opt'],
      situations: ['opt-stem-opt', 'international-student', 'h1b-lottery-worry', 'concurrent-filing-interest'],
    },
    specificity: 3,
    secondaryLinks: [
      '/pathways/f1-to-eb5-self-sponsored-green-card',
      '/research/f1-students/stem-opt-eb5-indian-chinese',
    ],
    hasDedicatedContent: true,
    lastReviewed: LAST_REVIEWED,
    publishDate: null,
  },
  {
    id: 'eb5-for-graduate-students',
    url: '/pathways/eb5-for-graduate-students',
    title: 'EB-5 for Graduate Students',
    applicableWhen: {
      statuses: ['f1', 'j1', 'opt-stem-opt'],
      situations: ['graduate-student', 'international-student', 'concurrent-filing-interest'],
    },
    specificity: 3,
    secondaryLinks: [
      '/pathways/f1-to-eb5-self-sponsored-green-card',
      '/eb5-green-card-international-students-playbook',
    ],
    hasDedicatedContent: true,
    lastReviewed: LAST_REVIEWED,
    publishDate: null,
  },
  {
    id: 'eb5-for-h4-families',
    url: '/pathways/eb5-for-h4-families',
    title: 'EB-5 for H-4 Families & Dependents',
    applicableWhen: {
      statuses: ['h4', 'h1b'],
      situations: ['aging-out-child', 'high-net-worth-family', 'concurrent-filing-interest', 'h1b-backlog'],
    },
    specificity: 3,
    secondaryLinks: ['/pathways/h1b-to-green-card'],
    hasDedicatedContent: true,
    lastReviewed: LAST_REVIEWED,
    publishDate: null,
  },
  {
    id: 'eb5-for-l1',
    url: '/pathways/eb5-for-l1',
    title: 'EB-5 for L-1 Visa Holders',
    applicableWhen: {
      statuses: ['l1'],
      situations: [
        'comparing-paths',
        'concurrent-filing-interest',
        'investor-primary',
        'tech-worker',
        'business-owner-entrepreneur',
      ],
    },
    specificity: 3,
    secondaryLinks: ['/pathways/h1b-to-green-card', '/eb5-investment-process'],
    hasDedicatedContent: true,
    lastReviewed: LAST_REVIEWED,
    publishDate: null,
  },
  {
    id: 'eb5-for-j1',
    url: '/pathways/eb5-for-j1',
    title: 'EB-5 for J-1 Visa Holders',
    applicableWhen: {
      statuses: ['j1'],
      situations: [
        'international-student',
        'graduate-student',
        'concurrent-filing-interest',
        'comparing-paths',
      ],
    },
    specificity: 3,
    secondaryLinks: ['/research/j1-f1-h1b-eb5-concurrent-filing'],
    hasDedicatedContent: true,
    lastReviewed: LAST_REVIEWED,
    publishDate: null,
  },
  {
    id: 'eb5-for-indian-investors',
    url: '/pathways/eb5-for-indian-investors',
    title: 'EB-5 Visa for Indian Investors: A 2026 Guide for Indian Nationals',
    applicableWhen: {
      statuses: ['f1', 'h1b', 'j1', 'l1', 'h4', 'other-visa', 'outside-us', 'not-sure', 'opt-stem-opt'],
      situations: [
        'investor-primary',
        'comparing-paths',
        'high-net-worth-family',
        'business-owner-entrepreneur',
        'concurrent-filing-interest',
        'eb2-backlog',
        'eb3-backlog',
        'tech-worker',
      ],
      countries: ['india'],
    },
    specificity: 3,
    secondaryLinks: [
      '/research/eb5-guide-indian-professionals-2026',
      '/research/best-immigration-backup-plan-indian-tech-workers-2026',
    ],
    hasDedicatedContent: true,
    lastReviewed: LAST_REVIEWED,
    publishDate: PUBLISH_DATE_DEFAULT,
  },
  {
    id: 'eb5-for-indian-students',
    url: '/pathways/eb5-for-indian-students',
    title: 'EB-5 for Indian International Students',
    applicableWhen: {
      statuses: ['f1', 'opt-stem-opt'],
      situations: [
        'international-student',
        'opt-stem-opt',
        'graduate-student',
        'parents-funding',
        'parent-exploring',
        'h1b-lottery-worry',
        'comparing-paths',
      ],
      countries: ['india'],
    },
    specificity: 4,
    secondaryLinks: [
      '/research/comparisons/h1b-vs-eb5-lifetime-cost-indian-chinese-students',
      '/research/f1-students/stem-opt-eb5-indian-chinese',
    ],
    hasDedicatedContent: true,
    lastReviewed: LAST_REVIEWED,
    publishDate: PUBLISH_DATE_DEFAULT,
  },
  {
    id: 'eb5-for-indian-h1b',
    url: '/pathways/eb5-for-indian-h1b',
    title: 'EB-5 for Indian H-1B Professionals',
    applicableWhen: {
      statuses: ['h1b'],
      situations: [
        'h1b-lottery-worry',
        'h1b-backlog',
        'h1b-layoff',
        'eb2-backlog',
        'eb3-backlog',
        'tech-worker',
        'concurrent-filing-interest',
        'comparing-paths',
        'comparing-eb5-eb2niw',
      ],
      countries: ['india'],
    },
    specificity: 4,
    secondaryLinks: [
      '/research/best-immigration-backup-plan-indian-tech-workers-2026',
      '/pathways/h1b-to-green-card',
    ],
    hasDedicatedContent: true,
    lastReviewed: LAST_REVIEWED,
    publishDate: PUBLISH_DATE_DEFAULT,
  },
  {
    id: 'eb5-for-indian-families',
    url: '/pathways/eb5-for-indian-families',
    title: 'How Indian Families Can Fund an EB-5 Investment',
    applicableWhen: {
      statuses: ['f1', 'opt-stem-opt', 'h1b', 'outside-us', 'not-sure'],
      situations: ['parents-funding', 'parent-exploring', 'high-net-worth-family', 'international-student'],
      countries: ['india'],
    },
    specificity: 4,
    secondaryLinks: [
      '/pathways/eb5-for-indian-students',
      '/research/ways-to-fund-eb5-investment-2026',
      '/research/investment/eb5-pre-investment-checklist-part-1-f1-h1b',
    ],
    hasDedicatedContent: true,
    lastReviewed: LAST_REVIEWED,
    publishDate: PUBLISH_DATE_DEFAULT,
  },
  {
    id: 'eb5-for-korean-investors',
    url: '/pathways/eb5-for-korean-investors',
    title: 'EB-5 Visa for South Korean Investors',
    applicableWhen: {
      statuses: ['f1', 'h1b', 'j1', 'l1', 'h4', 'other-visa', 'outside-us', 'not-sure', 'opt-stem-opt'],
      situations: [
        'investor-primary',
        'international-student',
        'parents-funding',
        'parent-exploring',
        'comparing-paths',
        'concurrent-filing-interest',
        'high-net-worth-family',
      ],
      countries: ['south-korea'],
    },
    specificity: 3,
    secondaryLinks: ['/research/complete-2027-eb5-guide'],
    hasDedicatedContent: true,
    lastReviewed: LAST_REVIEWED,
    publishDate: null,
  },
  {
    id: 'eb5-for-vietnamese-investors',
    url: '/pathways/eb5-for-vietnamese-investors',
    title: 'EB-5 Visa for Vietnamese Investors',
    applicableWhen: {
      statuses: ['f1', 'h1b', 'j1', 'l1', 'h4', 'other-visa', 'outside-us', 'not-sure', 'opt-stem-opt'],
      situations: [
        'investor-primary',
        'international-student',
        'parents-funding',
        'parent-exploring',
        'comparing-paths',
        'concurrent-filing-interest',
        'high-net-worth-family',
      ],
      countries: ['vietnam'],
    },
    specificity: 3,
    secondaryLinks: [
      '/research/eb5-cryptocurrency-source-of-funds',
      '/research/complete-2027-eb5-guide',
    ],
    hasDedicatedContent: true,
    lastReviewed: LAST_REVIEWED,
    publishDate: null,
  },
  {
    id: 'eb5-for-taiwanese-investors',
    url: '/pathways/eb5-for-taiwanese-investors',
    title: 'EB-5 Visa for Taiwanese Investors',
    applicableWhen: {
      statuses: ['f1', 'h1b', 'j1', 'l1', 'h4', 'other-visa', 'outside-us', 'not-sure', 'opt-stem-opt'],
      situations: [
        'investor-primary',
        'international-student',
        'parents-funding',
        'parent-exploring',
        'comparing-paths',
        'concurrent-filing-interest',
        'high-net-worth-family',
      ],
      countries: ['taiwan'],
    },
    specificity: 3,
    secondaryLinks: ['/research/complete-2027-eb5-guide', '/eb5-investment-process'],
    hasDedicatedContent: true,
    lastReviewed: LAST_REVIEWED,
    publishDate: null,
  },
  {
    id: 'eb2-to-eb5',
    url: '/pathways/eb2-to-eb5',
    title: 'EB-5 for EB-2 Backlog Applicants',
    applicableWhen: {
      statuses: ['h1b', 'l1', 'h4', 'other-visa', 'not-sure'],
      situations: ['eb2-backlog', 'comparing-eb5-eb2niw', 'concurrent-filing-interest', 'comparing-paths', 'tech-worker'],
    },
    specificity: 3,
    secondaryLinks: ['/research/complete-2027-eb5-guide', '/pathways/h1b-to-green-card'],
    hasDedicatedContent: true,
    lastReviewed: LAST_REVIEWED,
    publishDate: null,
  },
  {
    id: 'eb3-to-eb5',
    url: '/pathways/eb3-to-eb5',
    title: 'EB-5 for EB-3 Backlog Applicants',
    applicableWhen: {
      statuses: ['h1b', 'l1', 'h4', 'other-visa', 'not-sure'],
      situations: ['eb3-backlog', 'concurrent-filing-interest', 'comparing-paths', 'tech-worker', 'h1b-backlog'],
    },
    specificity: 3,
    secondaryLinks: ['/research/complete-2027-eb5-guide', '/pathways/h1b-to-green-card'],
    hasDedicatedContent: true,
    lastReviewed: LAST_REVIEWED,
    publishDate: null,
  },
  {
    id: 'eb5-child-aging-out',
    url: '/pathways/eb5-child-aging-out',
    title: 'EB-5 for Families With Children Aging Out',
    applicableWhen: {
      statuses: ['h1b', 'h4', 'l1', 'f1', 'other-visa', 'not-sure'],
      situations: ['aging-out-child', 'high-net-worth-family', 'eb2-backlog', 'eb3-backlog', 'h1b-backlog'],
    },
    specificity: 3,
    secondaryLinks: ['/pathways/eb5-for-h4-families', '/eb5-investment-process'],
    hasDedicatedContent: true,
    lastReviewed: LAST_REVIEWED,
    publishDate: null,
  },
  {
    id: 'eb5-concurrent-filing',
    url: '/pathways/eb5-concurrent-filing',
    title: 'EB-5 Concurrent Filing for U.S. Visa Holders',
    applicableWhen: {
      statuses: ['f1', 'opt-stem-opt', 'h1b', 'j1', 'l1', 'h4', 'other-visa'],
      situations: ['concurrent-filing-interest', 'comparing-paths', 'h1b-lottery-worry', 'international-student'],
    },
    specificity: 3,
    secondaryLinks: [
      '/research/j1-f1-h1b-eb5-concurrent-filing',
      '/eb5-investment-process',
    ],
    hasDedicatedContent: true,
    lastReviewed: LAST_REVIEWED,
    publishDate: null,
  },
  {
    id: 'eb5-for-families-with-us-students',
    url: '/pathways/eb5-for-families-with-us-students',
    title: 'EB-5 for Families With Children Studying in America',
    applicableWhen: {
      statuses: ['f1', 'opt-stem-opt', 'outside-us', 'not-sure'],
      situations: [
        'parents-funding',
        'parent-exploring',
        'international-student',
        'high-net-worth-family',
        'comparing-paths',
      ],
    },
    specificity: 3,
    secondaryLinks: [
      '/pathways/eb5-for-chinese-families',
      '/pathways/eb5-for-indian-families',
      '/eb5-green-card-international-students-playbook',
    ],
    hasDedicatedContent: true,
    lastReviewed: LAST_REVIEWED,
    publishDate: null,
  },
  {
    id: 'eb5-for-wealthy-families',
    url: '/pathways/eb5-for-wealthy-families',
    title: 'EB-5 for High-Net-Worth Families',
    applicableWhen: {
      statuses: ['f1', 'h1b', 'outside-us', 'other-visa', 'not-sure', 'h4'],
      situations: ['high-net-worth-family', 'parents-funding', 'parent-exploring', 'comparing-paths', 'investor-primary'],
    },
    specificity: 3,
    secondaryLinks: [
      '/research/golden-visas-vs-eb5-elite-students',
      '/research/golden-visa-global-education-student-stories',
    ],
    hasDedicatedContent: true,
    lastReviewed: LAST_REVIEWED,
    publishDate: null,
  },
  {
    id: 'eb5-for-tech-workers',
    url: '/pathways/eb5-for-tech-workers',
    title: 'EB-5 for Tech Workers',
    applicableWhen: {
      statuses: ['h1b', 'l1', 'opt-stem-opt', 'other-visa'],
      situations: [
        'tech-worker',
        'h1b-layoff',
        'h1b-lottery-worry',
        'h1b-backlog',
        'concurrent-filing-interest',
        'comparing-paths',
      ],
    },
    specificity: 3,
    secondaryLinks: [
      '/research/h1b-tech-layoffs-eb5-entrepreneurship',
      '/research/best-immigration-backup-plan-indian-tech-workers-2026',
    ],
    hasDedicatedContent: true,
    lastReviewed: LAST_REVIEWED,
    publishDate: null,
  },
  {
    id: 'eb5-for-startup-founders',
    url: '/pathways/eb5-for-startup-founders',
    title: 'EB-5 for Startup Founders',
    applicableWhen: {
      statuses: ['h1b', 'l1', 'other-visa', 'outside-us', 'f1', 'opt-stem-opt'],
      situations: ['startup-founder', 'business-owner-entrepreneur', 'comparing-paths', 'investor-primary'],
    },
    specificity: 3,
    secondaryLinks: ['/eb5-investment-process'],
    hasDedicatedContent: true,
    lastReviewed: LAST_REVIEWED,
    publishDate: null,
  },
  {
    id: 'eb5-for-entrepreneurs',
    url: '/pathways/eb5-for-entrepreneurs',
    title: 'EB-5 for Entrepreneurs & Business Owners',
    applicableWhen: {
      statuses: ['h1b', 'l1', 'other-visa', 'outside-us', 'not-sure'],
      situations: ['business-owner-entrepreneur', 'investor-primary', 'high-net-worth-family', 'comparing-paths'],
    },
    specificity: 3,
    secondaryLinks: [
      '/pathways/eb5-business-income',
      '/research/ways-to-fund-eb5-investment-2026',
    ],
    hasDedicatedContent: true,
    lastReviewed: LAST_REVIEWED,
    publishDate: null,
  },
  {
    id: 'rural-eb5',
    url: '/pathways/rural-eb5',
    title: 'Rural EB-5',
    applicableWhen: {
      statuses: ['f1', 'opt-stem-opt', 'h1b', 'j1', 'l1', 'h4', 'other-visa', 'outside-us', 'not-sure'],
      situations: [
        'investor-primary',
        'comparing-paths',
        'concurrent-filing-interest',
        'eb2-backlog',
        'eb3-backlog',
        'high-net-worth-family',
      ],
    },
    specificity: 3,
    secondaryLinks: [
      '/research/choosing-rural-eb5-regional-center-guide',
      '/research/19-questions-rural-eb5-project-due-diligence',
    ],
    hasDedicatedContent: true,
    lastReviewed: LAST_REVIEWED,
    publishDate: null,
  },
  {
    id: 'eb5-risk-and-due-diligence',
    url: '/pathways/eb5-risk-and-due-diligence',
    title: 'Is EB-5 Worth It? Understanding Risk, Due Diligence, and Capital Requirements',
    applicableWhen: {
      statuses: ['f1', 'opt-stem-opt', 'h1b', 'j1', 'l1', 'h4', 'other-visa', 'outside-us', 'not-sure'],
      situations: [
        'comparing-paths',
        'investor-primary',
        'not-sure',
        'high-net-worth-family',
        'concurrent-filing-interest',
        'business-owner-entrepreneur',
      ],
    },
    specificity: 2,
    secondaryLinks: [
      '/research/19-questions-rural-eb5-project-due-diligence',
      '/research/choosing-rural-eb5-regional-center-guide',
      '/research/evaluating-eb5-projects-pending-i956f',
      '/research/eb5-capital-stack',
    ],
    hasDedicatedContent: true,
    lastReviewed: LAST_REVIEWED,
    publishDate: null,
  },
  {
    id: 'eb5-project-due-diligence',
    url: '/pathways/eb5-project-due-diligence',
    title: 'EB-5 Project Due Diligence',
    applicableWhen: {
      statuses: ['f1', 'h1b', 'outside-us', 'other-visa', 'not-sure'],
      situations: ['investor-primary', 'comparing-paths', 'high-net-worth-family'],
    },
    specificity: 2,
    secondaryLinks: ['/research/19-questions-rural-eb5-project-due-diligence'],
    hasDedicatedContent: true,
    isRouterPage: true,
    lastReviewed: LAST_REVIEWED,
    publishDate: null,
  },
  {
    id: 'i956f-approved-eb5-projects',
    url: '/pathways/i956f-approved-eb5-projects',
    title: 'EB-5 Projects With I-956F Approval',
    applicableWhen: {
      statuses: ['f1', 'h1b', 'outside-us', 'other-visa', 'not-sure'],
      situations: ['investor-primary', 'comparing-paths'],
    },
    specificity: 2,
    secondaryLinks: ['/research/evaluating-eb5-projects-pending-i956f'],
    hasDedicatedContent: true,
    isRouterPage: true,
    lastReviewed: LAST_REVIEWED,
    publishDate: null,
  },
  {
    id: 'eb5-source-of-funds',
    url: '/pathways/eb5-source-of-funds',
    title: 'EB-5 Source of Funds',
    applicableWhen: {
      statuses: ['f1', 'opt-stem-opt', 'h1b', 'outside-us', 'not-sure', 'other-visa'],
      situations: [
        'parents-funding',
        'parent-exploring',
        'investor-primary',
        'business-owner-entrepreneur',
        'high-net-worth-family',
      ],
    },
    specificity: 2,
    secondaryLinks: [
      '/research/ways-to-fund-eb5-investment-2026',
      '/pathways/eb5-gifted-funds',
      '/pathways/eb5-property-sale-funds',
      '/pathways/eb5-business-income',
    ],
    hasDedicatedContent: true,
    isRouterPage: true,
    lastReviewed: LAST_REVIEWED,
    publishDate: null,
  },
  {
    id: 'eb5-gifted-funds',
    url: '/pathways/eb5-gifted-funds',
    title: 'EB-5 With Gifted Funds',
    applicableWhen: {
      statuses: ['f1', 'opt-stem-opt', 'outside-us', 'not-sure'],
      situations: ['parents-funding', 'parent-exploring', 'international-student', 'high-net-worth-family'],
    },
    specificity: 3,
    secondaryLinks: [
      '/pathways/eb5-for-chinese-families',
      '/pathways/eb5-for-indian-families',
      '/research/ways-to-fund-eb5-investment-2026',
    ],
    hasDedicatedContent: true,
    isRouterPage: true,
    lastReviewed: LAST_REVIEWED,
    publishDate: null,
  },
  {
    id: 'eb5-property-sale-funds',
    url: '/pathways/eb5-property-sale-funds',
    title: 'EB-5 With Proceeds From Property Sale',
    applicableWhen: {
      statuses: ['f1', 'h1b', 'outside-us', 'other-visa', 'not-sure'],
      situations: ['investor-primary', 'parents-funding', 'high-net-worth-family', 'business-owner-entrepreneur'],
    },
    specificity: 3,
    secondaryLinks: ['/research/ways-to-fund-eb5-investment-2026'],
    hasDedicatedContent: true,
    isRouterPage: true,
    lastReviewed: LAST_REVIEWED,
    publishDate: null,
  },
  {
    id: 'eb5-business-income',
    url: '/pathways/eb5-business-income',
    title: 'EB-5 With Business Income',
    applicableWhen: {
      statuses: ['h1b', 'l1', 'other-visa', 'outside-us', 'not-sure'],
      situations: ['business-owner-entrepreneur', 'investor-primary', 'startup-founder'],
    },
    specificity: 3,
    secondaryLinks: [
      '/pathways/eb5-for-entrepreneurs',
      '/research/ways-to-fund-eb5-investment-2026',
    ],
    hasDedicatedContent: true,
    isRouterPage: true,
    lastReviewed: LAST_REVIEWED,
    publishDate: null,
  },
  {
    id: 'eb5-vs-eb2-niw',
    url: '/pathways/eb5-vs-eb2-niw',
    title: 'EB-5 vs. EB-2 NIW',
    applicableWhen: {
      statuses: ['h1b', 'l1', 'other-visa', 'outside-us', 'not-sure', 'f1'],
      situations: ['comparing-eb5-eb2niw', 'comparing-paths', 'eb2-backlog', 'tech-worker', 'investor-primary'],
    },
    specificity: 3,
    secondaryLinks: ['/research/complete-2027-eb5-guide'],
    hasDedicatedContent: true,
    lastReviewed: LAST_REVIEWED,
    publishDate: null,
  },
  {
    id: 'eb5-vs-h1b',
    url: '/pathways/eb5-vs-h1b',
    title: 'EB-5 vs. H-1B',
    applicableWhen: {
      statuses: ['f1', 'opt-stem-opt', 'h1b', 'not-sure', 'outside-us'],
      situations: [
        'comparing-paths',
        'comparing-visa-options',
        'h1b-lottery-worry',
        'international-student',
        'tech-worker',
      ],
    },
    specificity: 3,
    secondaryLinks: [
      '/research/comparisons/h1b-vs-eb5-lifetime-cost-indian-chinese-students',
      '/pathways/h1b-to-green-card',
    ],
    hasDedicatedContent: true,
    lastReviewed: LAST_REVIEWED,
    publishDate: null,
  },
  {
    id: 'eb5-vs-other-visa-options',
    url: '/pathways/eb5-vs-other-visa-options',
    title: 'EB-5 vs. E-2, L-1, O-1, and Global Residency Options',
    applicableWhen: {
      statuses: ['f1', 'h1b', 'l1', 'other-visa', 'outside-us', 'not-sure', 'j1'],
      situations: [
        'comparing-visa-options',
        'comparing-paths',
        'investor-primary',
        'business-owner-entrepreneur',
        'high-net-worth-family',
      ],
    },
    specificity: 3,
    secondaryLinks: [
      '/research/golden-visas-vs-eb5-elite-students',
      '/pathways/eb5-for-l1',
    ],
    hasDedicatedContent: true,
    lastReviewed: LAST_REVIEWED,
    publishDate: null,
  },
  {
    id: 'general-start',
    url: '/pathways',
    title: 'EB-5 Green Card Pathways',
    applicableWhen: {},
    specificity: 1,
    secondaryLinks: [
      '/pathways/h1b-to-green-card',
      '/pathways/f1-to-eb5-self-sponsored-green-card',
      '/eb5-investment-process',
    ],
    hasDedicatedContent: true,
    lastReviewed: LAST_REVIEWED,
    publishDate: PUBLISH_DATE_ALREADY_LIVE,
  },
];

/** Calendar date YYYY-MM-DD in local time. */
function todayIsoDate(now = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Whether a pathway landing page should be indexed and listed on discovery surfaces.
 * False when publishDate is null (not yet scheduled). Otherwise true when today's date
 * is on or after page.publishDate.
 */
export function isIndexable(page: LandingPage, now = new Date()): boolean {
  if (page.publishDate == null) return false;
  return todayIsoDate(now) >= page.publishDate;
}

export function getIndexableLandingPages(now = new Date()): LandingPage[] {
  return landingPages.filter((page) => isIndexable(page, now));
}

export function findLandingPageByUrl(pathname: string): LandingPage | undefined {
  const normalized = pathname.replace(/\/$/, '') || '/';
  return landingPages.find((page) => page.url === normalized);
}

/** parents-funding and parent-exploring resolve to the same branch. */
function situationEquivalents(situation: Situation): Situation[] {
  if (situation === 'parents-funding' || situation === 'parent-exploring') {
    return ['parents-funding', 'parent-exploring'];
  }
  return [situation];
}

function dimensionMatch(
  values: string[] | undefined,
  answer: string,
  answerAliases: string[] = [answer],
): { constrained: boolean; matched: boolean } {
  if (!values || values.length === 0) {
    return { constrained: false, matched: false };
  }
  return {
    constrained: true,
    matched: values.some((v) => answerAliases.includes(v)),
  };
}

function scoreLandingPage(
  page: LandingPage,
  status: ImmigrationStatus,
  country: CountryOfBirth,
  situation: Situation,
): { matchCount: number; constrainedCount: number; passesHardFilter: boolean } {
  const sitAliases = situationEquivalents(situation);
  const statusDim = dimensionMatch(page.applicableWhen.statuses, status);
  const situationDim = dimensionMatch(page.applicableWhen.situations, situation, sitAliases);
  const countryDim = dimensionMatch(page.applicableWhen.countries, country);

  const dims = [statusDim, situationDim, countryDim];
  const constrainedCount = dims.filter((d) => d.constrained).length;
  const matchCount = dims.filter((d) => d.constrained && d.matched).length;

  // Hard filter: every constrained dimension must match (partial score still ranks among passers).
  // Unconstrained dimensions (empty applicableWhen fields) do not block.
  const passesHardFilter =
    constrainedCount === 0 || dims.every((d) => !d.constrained || d.matched);

  return { matchCount, constrainedCount, passesHardFilter };
}

/**
 * Resolve the best pathway landing page for a finder answer set.
 * Prefer higher match counts, then higher specificity. Always returns a primary.
 */
export function resolvePathway(
  status: ImmigrationStatus,
  country: CountryOfBirth,
  situation: Situation,
): { primary: LandingPage; secondary: LandingPage[] } {
  const generalFallback =
    landingPages.find((p) => p.id === 'general-start') ?? landingPages[landingPages.length - 1];

  const scored = landingPages
    .map((page) => {
      const { matchCount, constrainedCount, passesHardFilter } = scoreLandingPage(
        page,
        status,
        country,
        situation,
      );
      return { page, matchCount, constrainedCount, passesHardFilter };
    })
    .filter((row) => row.passesHardFilter);

  scored.sort((a, b) => {
    if (b.matchCount !== a.matchCount) return b.matchCount - a.matchCount;
    if (b.page.specificity !== a.page.specificity) return b.page.specificity - a.page.specificity;
    return a.page.id.localeCompare(b.page.id);
  });

  // Prefer situation+country (matchCount >= 2 with both those dims), then situation-only, then status-only.
  const withMatches = scored.filter((row) => row.matchCount > 0 && row.page.id !== 'general-start');

  let ranked = withMatches.length > 0 ? withMatches : scored;
  if (ranked.length === 0) {
    return { primary: generalFallback, secondary: [] };
  }

  const primary = ranked[0].page;
  const secondary = ranked
    .slice(1)
    .filter((row) => row.page.id !== primary.id && row.page.id !== 'general-start')
    .slice(0, 3)
    .map((row) => row.page);

  // If somehow primary was general and better options exist only in full list, still never return null.
  return {
    primary: primary ?? generalFallback,
    secondary,
  };
}
