import { landingPages, type LandingPage } from './pathwayRoutes';

export interface RelatedPathwayLink {
  title: string;
  url: string;
}

const VISA_COMPARISON = new Set([
  'eb5-vs-eb2-niw',
  'eb5-vs-h1b',
  'eb5-vs-other-visa-options',
  'eb2-to-eb5',
  'eb3-to-eb5',
]);

const GROUP_BY_ID: Record<string, string> = {
  'f1-to-eb5-self-sponsored-green-card': 'student',
  'eb5-for-opt-students': 'student',
  'eb5-for-graduate-students': 'student',
  'h1b-to-green-card': 'h1b',
  'h1b-60-day-clock': 'h1b',
  'parents-and-families': 'family',
  'eb5-for-families-with-us-students': 'family',
  'eb5-for-wealthy-families': 'family',
  'eb5-for-h4-families': 'family',
  'eb5-child-aging-out': 'family',
  'eb5-source-of-funds': 'funds',
  'eb5-gifted-funds': 'funds',
  'eb5-property-sale-funds': 'funds',
  'eb5-business-income': 'funds',
  'rural-eb5': 'project',
  'eb5-risk-and-due-diligence': 'project',
  'eb5-project-due-diligence': 'project',
  'i956f-approved-eb5-projects': 'project',
  'eb5-for-l1': 'professional',
  'eb5-for-j1': 'professional',
  'eb5-for-tech-workers': 'professional',
  'eb5-for-startup-founders': 'professional',
  'eb5-for-entrepreneurs': 'professional',
  'eb5-concurrent-filing': 'professional',
};

function countryOf(id: string): string | null {
  if (id.includes('chinese')) return 'china';
  if (id.includes('indian')) return 'india';
  if (id.includes('korean')) return 'korea';
  if (id.includes('vietnamese')) return 'vietnam';
  if (id.includes('taiwanese')) return 'taiwan';
  return null;
}

function roleOf(id: string): string {
  if (id.includes('student')) return 'student';
  if (id.includes('h1b')) return 'h1b';
  if (id.includes('famil')) return 'family';
  if (id.includes('investor')) return 'investor';
  return 'other';
}

function groupOf(page: LandingPage): string {
  if (countryOf(page.id)) return 'country';
  if (VISA_COMPARISON.has(page.id)) return 'visa-comparison';
  return GROUP_BY_ID[page.id] ?? 'general';
}

function overlap(a: LandingPage, b: LandingPage): number {
  const shared = (left: string[] | undefined, right: string[] | undefined) =>
    (left ?? []).filter((item) => (right ?? []).includes(item)).length;
  return (
    shared(a.applicableWhen.statuses, b.applicableWhen.statuses) +
    shared(a.applicableWhen.situations, b.applicableWhen.situations) +
    shared(a.applicableWhen.countries, b.applicableWhen.countries)
  );
}

function byUrl(a: LandingPage, b: LandingPage): number {
  return a.url.localeCompare(b.url);
}

/** Same category first. Country pages prefer the same country, then the same role. */
function categoryRanked(current: LandingPage, others: LandingPage[]): LandingPage[] {
  const same = others.filter((page) => groupOf(page) === groupOf(current));
  if (groupOf(current) === 'country') {
    return same.sort((a, b) => {
      const bucket = (page: LandingPage) => {
        if (countryOf(page.id) === countryOf(current.id)) return 0;
        if (roleOf(page.id) === roleOf(current.id)) return 1;
        return 2;
      };
      const delta = bucket(a) - bucket(b);
      return delta !== 0 ? delta : byUrl(a, b);
    });
  }
  const ordered = [...same, current].sort(byUrl);
  const start = ordered.findIndex((page) => page.url === current.url);
  const rotated: LandingPage[] = [];
  for (let step = 1; step < ordered.length; step += 1) {
    rotated.push(ordered[(start + step) % ordered.length]);
  }
  return rotated;
}

function audienceRanked(current: LandingPage, others: LandingPage[]): LandingPage[] {
  return others
    .filter((page) => groupOf(page) !== groupOf(current))
    .sort((a, b) => {
      const shared = overlap(current, b) - overlap(current, a);
      return shared !== 0 ? shared : byUrl(a, b);
    });
}

const pathwayPages = landingPages.filter(
  (page) => page.hasDedicatedContent && page.url.startsWith('/pathways/'),
);

export function getRelatedPathways(pathname: string): RelatedPathwayLink[] {
  const currentUrl = pathname.replace(/\/$/, '') || '/';
  const current = pathwayPages.find((page) => page.url === currentUrl);
  if (!current) {
    return [...pathwayPages]
      .sort(byUrl)
      .slice(0, 4)
      .map((page) => ({ title: page.title, url: page.url }));
  }
  const others = pathwayPages.filter((page) => page.url !== current.url);
  const ranked = [...categoryRanked(current, others), ...audienceRanked(current, others)];
  const picked: LandingPage[] = [];
  for (const page of ranked) {
    if (picked.length === 4) break;
    if (!picked.some((item) => item.url === page.url)) picked.push(page);
  }
  return picked.map((page) => ({ title: page.title, url: page.url }));
}
