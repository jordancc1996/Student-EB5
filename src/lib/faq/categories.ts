export const faqCategories = [
  'General',
  'Investment',
  'Process',
  'Eligibility',
  'Regional Centers',
] as const;

export type FaqCategory = (typeof faqCategories)[number];
