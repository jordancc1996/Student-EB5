export const TOC_PATHWAYS_HUB_URL = '/pathways';

export interface TocCta {
  href: string;
  label: string;
}

export const UNIVERSAL_TOC_CTA: TocCta = {
  href: TOC_PATHWAYS_HUB_URL,
  label: 'See your path from visa to green card →',
};

/**
 * Category routing — bypassed in favor of UNIVERSAL_TOC_CTA.
 * Re-enable by returning resolveTocCtaFromCategory(category) below.
 */
/*
function resolveTocCtaFromCategory(category?: string): TocCta {
  const normalized = category?.toLowerCase() ?? '';
  const isStudentArticle =
    normalized.includes('student') || normalized.includes('education');

  if (isStudentArticle) {
    return {
      href: '/pathways/f1-to-eb5-self-sponsored-green-card',
      label: 'See your path from student visa to green card →',
    };
  }

  return {
    href: '/pathways/h1b-to-green-card',
    label: 'See your path from H-1B to green card →',
  };
}
*/

export function resolveTocCta(_category?: string): TocCta {
  return UNIVERSAL_TOC_CTA;
}
