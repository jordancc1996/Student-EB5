import { getMappedPathwayId } from './articlePathwayMap';
import { getPathwayCtaCopy, type PathwayCtaCopy } from './pathwayCtaCopy';
import { UNIVERSAL_TOC_CTA, type TocCta } from './tocCta';

export interface ArticlePathwayCta {
  pathwayId: string;
  url: string;
  isPathwaySpecific: boolean;
  toc: TocCta;
  postIntro: {
    headline: string;
    body: string;
    buttonLabel: string;
    href: string;
  };
  mid: {
    eyebrow: string;
    headline: string;
    body: string;
    pathwayLinkLabel: string;
    href: string;
    formPrompt: string;
  };
  form: {
    headline: string;
    subheadline: string;
    buttonLabel: string;
    pathwayContext: string;
  };
}

const LEGACY_MID_STUDENT = {
  eyebrow: 'Free Resource',
  headline: 'Your Path from Student Visa to Green Card',
  body: 'See how EB-5 can secure your future in the U.S. after graduation.',
  pathwayLinkLabel: 'Explore your student EB-5 pathway →',
  href: '/pathways/f1-to-eb5-self-sponsored-green-card',
  formPrompt: 'Or request a free 30-minute evaluation below.',
};

const LEGACY_MID_H1B = {
  eyebrow: 'Free Resource',
  headline: 'Your H-1B to Green Card Pathway',
  body: 'Escape the backlog. Explore how EB-5 gives you permanent freedom.',
  pathwayLinkLabel: 'Explore your H-1B to green card pathway →',
  href: '/pathways/h1b-to-green-card',
  formPrompt: 'Or request a free 30-minute evaluation below.',
};

const LEGACY_POST_INTRO = {
  headline: 'Considering EB-5? See Your Next Step',
  body: 'Explore the EB-5 pathway based on your current U.S. immigration status and goals.',
  buttonLabel: 'See Your EB-5 Path',
  href: '/pathways',
};

const LEGACY_FORM = {
  headline: 'Talk to Someone Who Knows EB-5',
  subheadline:
    'Book a free 30-minute consultation. Find out if EB-5 fits your situation and learn the next step.',
  buttonLabel: 'Get My Free Evaluation',
  pathwayContext: 'general',
};

function pathwayLinkLabel(copy: PathwayCtaCopy): string {
  return `Explore EB-5 for ${copy.audienceLabel} →`;
}

function tocLabel(copy: PathwayCtaCopy): string {
  return `See the EB-5 path for ${copy.audienceLabel} →`;
}

function buildFromPathway(copy: PathwayCtaCopy): ArticlePathwayCta {
  return {
    pathwayId: copy.id,
    url: copy.url,
    isPathwaySpecific: true,
    toc: {
      href: copy.url,
      label: tocLabel(copy),
    },
    postIntro: {
      headline: copy.postIntroHeadline,
      body: copy.postIntroBody,
      buttonLabel: pathwayLinkLabel(copy),
      href: copy.url,
    },
    mid: {
      eyebrow: 'Your Next Step',
      headline: copy.midHeadline,
      body: copy.midBody,
      pathwayLinkLabel: pathwayLinkLabel(copy),
      href: copy.url,
      formPrompt: 'Or request a free 30-minute evaluation below.',
    },
    form: {
      headline: copy.formHeadline,
      subheadline: copy.formSubheadline,
      buttonLabel: 'Get My Free Evaluation',
      pathwayContext: copy.id,
    },
  };
}

function legacyFromCategory(category?: string): ArticlePathwayCta {
  const isStudentArticle =
    category?.toLowerCase().includes('student') || category?.toLowerCase().includes('education');
  const mid = isStudentArticle ? LEGACY_MID_STUDENT : LEGACY_MID_H1B;

  return {
    pathwayId: isStudentArticle ? 'f1-to-eb5-self-sponsored-green-card' : 'h1b-to-green-card',
    url: mid.href,
    isPathwaySpecific: false,
    toc: UNIVERSAL_TOC_CTA,
    postIntro: LEGACY_POST_INTRO,
    mid,
    form: LEGACY_FORM,
  };
}

/**
 * Resolve pathway CTAs for a research article from the central map (or frontmatter override).
 */
export function resolveArticlePathway(
  articleSlug: string,
  options?: { pathwaySlug?: string; category?: string },
): ArticlePathwayCta {
  const pathwayId = getMappedPathwayId(articleSlug, options?.pathwaySlug);
  const copy = pathwayId ? getPathwayCtaCopy(pathwayId) : undefined;

  if (copy) {
    return buildFromPathway(copy);
  }

  return legacyFromCategory(options?.category);
}
