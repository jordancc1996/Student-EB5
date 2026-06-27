import type { PageRoute } from "./types";

export const SITE_CONFIG = {
  name: 'StudentEB5',
  url: 'https://studenteb5.com',
  description: 'EB-5 resources for F-1 students and H-1B professionals. Expert guidance on investment immigration to secure US permanent residency.',
  logo: 'https://studenteb5.com/favicon.png',
  email: 'admin@studenteb5.com',
  defaultOgImage: 'https://studenteb5.com/og-image.jpg',
} as const;

export const DEFAULT_SEO = {
  title: `EB-5 Investment Immigration for Students | ${SITE_CONFIG.name}`,
  description: 'StudentEB5 helps international students and H-1B professionals navigate EB-5 investment immigration with expert guidance, tools, and resources.',
  ogType: 'website' as const,
  twitterCard: 'summary_large_image' as const,
};

export const PAGE_ROUTES: PageRoute[] = [
  {
    path: '/',
    title: 'EB-5 Green Card for H-1B & F-1 Students | StudentEB5',
    description: 'EB-5 for H-1B holders: green card without employer sponsorship via rural EB-5. Avoid the H-1B lottery. Exclusive permanent residency without sponsorship.',
    priority: 1.0,
    changefreq: 'daily',
  },
  {
    path: '/research',
    title: 'EB-5 Visa Research: Expert Immigration Insights | StudentEB5',
    description: 'Expert EB-5 visa research, success stories, and immigration strategies for students and H-1B professionals seeking US residency.',
    priority: 0.9,
    changefreq: 'daily',
  },
  {
    path: '/contact',
    title: 'Schedule EB-5 Consultation with Expert EB-5 Advisors',
    description: 'Schedule an EB-5 investment consultation with expert EB-5 broker and elite EB-5 immigration advisors. Start your EB-5 process with premium guidance today.',
    priority: 0.8,
    changefreq: 'monthly',
  },
  {
    path: '/faq',
    title: 'EB-5 FAQ: H-1B Grace Period, Rural EB-5, Concurrent Filing & Gifted Funds | StudentEB5',
    description: 'Answers to top EB-5 questions: Can H-1B holders self-sponsor? How does concurrent filing work? Can parents gift EB-5 funds? Rural EB-5 for Indians.',
    priority: 0.8,
    changefreq: 'weekly',
  },
  {
    path: '/resources',
    title: 'EB-5 Investor Resources: Attorney Filing Help & I-956F Project Guides',
    description: 'EB-5 filing assistance, how to document source of funds for EB-5, rural EB-5 India, and EB-5 projects with I-956F approval. Top-tier attorney guidance.',
    priority: 0.8,
    changefreq: 'weekly',
  },
  {
    path: '/about',
    title: 'Best EB-5 Consultants & Advisors for Indian Engineers',
    description: 'Best EB-5 consultant and elite EB-5 immigration advisors. Premier path for Indian software engineers seeking permanent residency without sponsorship.',
    priority: 0.8,
    changefreq: 'monthly',
  },
  {
    path: '/eb5-report',
    title: 'Free EB-5 Investor Report: Rural Strategy & Source of Funds Playbook',
    description: 'Rural EB-5 India report: best rural EB-5 strategy, best source of funds strategy for Indian EB-5 investors, and the fastest path to permanent residency.',
    priority: 0.7,
    changefreq: 'monthly',
  },
  {
    path: '/infographics',
    title: 'EB-5 Infographics: Timelines, Processing & Concurrent Filing Visuals',
    description: 'Rural EB-5 processing time, fastest green card via rural EB-5, EB-5 advance parole timeline, and how concurrent filing changes EB-5 for Indian nationals.',
    priority: 0.8,
    changefreq: 'weekly',
  },
  {
    path: '/privacy-policy',
    title: 'Privacy Policy | StudentEB5 EB-5 Immigration Advisors',
    description: 'StudentEB5 privacy policy: how our EB-5 immigration advisors collect, use, and safeguard your information with strict confidentiality and CCPA compliance.',
    priority: 0.3,
    changefreq: 'yearly',
  },
];
