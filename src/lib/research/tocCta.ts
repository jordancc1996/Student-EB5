export const TOC_PATHWAYS_HUB_URL = '/pathways';

export interface TocCta {
  href: string;
  label: string;
}

export const UNIVERSAL_TOC_CTA: TocCta = {
  href: TOC_PATHWAYS_HUB_URL,
  label: 'See your path from visa to green card →',
};

export function resolveTocCta(pathway?: TocCta): TocCta {
  return pathway ?? UNIVERSAL_TOC_CTA;
}
