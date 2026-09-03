/**
 * Central mapping: research article slug → pathway landing page id.
 * Override per article via frontmatter `pathwaySlug` when needed.
 */
export const ARTICLE_PATHWAY_MAP: Record<string, string> = {
  '19-questions-rural-eb5-project-due-diligence': 'rural-eb5',
  '5-reasons-switch-h1b-to-eb5': 'h1b-to-green-card',
  'best-alternative-to-h1b-o1-eb1-eb5': 'eb5-for-tech-workers',
  'best-immigration-backup-plan-indian-tech-workers-2026': 'eb5-for-indian-h1b',
  'best-opportunity-investment-migration-2026': 'eb5-for-wealthy-families',
  'choosing-rural-eb5-regional-center-guide': 'rural-eb5',
  'comparisons/is-eb5-worth-it-indian-chinese-students': 'f1-to-eb5-self-sponsored-green-card',
  'complete-2027-eb5-guide': 'eb5-vs-other-visa-options',
  'eb5-2026-official-white-paper': 'h1b-to-green-card',
  'eb5-capital-stack': 'eb5-project-due-diligence',
  'eb5-comprehensive-faq-timeline-international-students': 'f1-to-eb5-self-sponsored-green-card',
  'eb5-cryptocurrency-source-of-funds': 'eb5-source-of-funds',
  'eb5-economic-calculus-investment-cost': 'eb5-for-wealthy-families',
  'eb5-grandfathering-2026-2027-deadlines': 'eb5-concurrent-filing',
  'eb5-guide-indian-professionals-2026': 'eb5-for-indian-h1b',
  'eb5-investments-africa-mena-regions': 'eb5-for-wealthy-families',
  'eb5-investor-qa-part-1': 'eb5-vs-other-visa-options',
  'eb5-lifeline-h1b-workers': 'eb5-concurrent-filing',
  'eb5-timing-risks-petition-invalidation': 'eb5-concurrent-filing',
  'eb5-visa-aging-out-crisis-solution': 'eb5-child-aging-out',
  'eb5-vs-trump-gold-card-2026': 'eb5-vs-other-visa-options',
  'evaluating-eb5-projects-pending-i956f': 'i956f-approved-eb5-projects',
  'f1-students/eb5-funding-strategies-students': 'eb5-for-families-with-us-students',
  'f1-students/eb5-indian-chinese-students-f1-stem-opt': 'eb5-for-opt-students',
  'f1-students/f1-to-eb5-green-card': 'f1-to-eb5-self-sponsored-green-card',
  'golden-visa-global-education-student-stories': 'eb5-for-wealthy-families',
  'golden-visas-vs-eb5-elite-students': 'f1-to-eb5-self-sponsored-green-card',
  'h1b-60-day-grace-period-layoff-guide': 'h1b-60-day-clock',
  'h1b-eb5-financial-planning': 'h1b-to-green-card',
  'h1b-tech-layoffs-eb5-entrepreneurship': 'eb5-for-tech-workers',
  'how-eb5-visa-transforms-us-education-experience': 'f1-to-eb5-self-sponsored-green-card',
  'investment/what-to-know-before-investing-in-eb5': 'eb5-risk-and-due-diligence',
  'investment/eb5-i526e-filing-attorney-cost-part-2-f1-h1b': 'eb5-concurrent-filing',
  'j1-f1-h1b-eb5-concurrent-filing': 'eb5-concurrent-filing',
  'post-reform-integrity-act-analysis': 'eb5-concurrent-filing',
  'regional-center-shutdown-eb5-investor-protections': 'eb5-risk-and-due-diligence',
  'ways-to-fund-eb5-investment-2026': 'eb5-source-of-funds',
};

export function getMappedPathwayId(articleSlug: string, overridePathwaySlug?: string): string | undefined {
  if (overridePathwaySlug) return overridePathwaySlug;
  return ARTICLE_PATHWAY_MAP[articleSlug];
}
