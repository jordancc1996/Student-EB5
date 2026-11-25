import type { ImageMetadata } from 'astro';

export interface RelatedResearchCandidate {
  title: string;
  href: string;
  date: string;
  category: string;
  keywords: string[];
  timestamp: number;
  image?: ImageMetadata;
}

export interface RelatedArticleCandidate extends RelatedResearchCandidate {
  slug: string;
}

export interface RelatedResearchLink {
  title: string;
  href: string;
  date: string;
  dateTime?: string;
  image?: ImageMetadata;
}

export type RelatedPickSource = 'curated' | 'ranked';

export interface BottomRelatedPick {
  slug: string;
  href: string;
  source: RelatedPickSource;
}

function normalize(value: string): string {
  return value.toLowerCase().replace(/\s+/g, ' ').trim();
}

function dateTimeFromLabel(date: string): string | undefined {
  const parsed = Date.parse(date);
  if (Number.isNaN(parsed)) return undefined;
  return new Date(parsed).toISOString().slice(0, 10);
}

function toLink(candidate: RelatedResearchCandidate): RelatedResearchLink {
  return {
    title: candidate.title,
    href: candidate.href,
    date: candidate.date,
    dateTime: dateTimeFromLabel(candidate.date),
    image: candidate.image,
  };
}

function rankRelatedCandidates<T extends RelatedResearchCandidate>(
  current: { href: string; category: string; keywords: string[] },
  candidates: T[],
): T[] {
  const currentKeywords = new Set(current.keywords.map(normalize).filter(Boolean));
  const currentCategory = normalize(current.category);

  return candidates
    .filter((candidate) => candidate.href !== current.href)
    .map((candidate) => {
      const sameCategory =
        currentCategory.length > 0 && normalize(candidate.category) === currentCategory;
      const overlap = candidate.keywords.reduce(
        (count, keyword) => count + (currentKeywords.has(normalize(keyword)) ? 1 : 0),
        0,
      );
      return {
        candidate,
        priority: sameCategory || overlap > 0,
        sameCategory,
        overlap,
      };
    })
    .sort((a, b) => {
      if (a.priority !== b.priority) return a.priority ? -1 : 1;
      if (a.sameCategory !== b.sameCategory) return a.sameCategory ? -1 : 1;
      if (a.overlap !== b.overlap) return b.overlap - a.overlap;
      return b.candidate.timestamp - a.candidate.timestamp;
    })
    .map(({ candidate }) => candidate);
}

/**
 * Four related research links.
 * Same category or shared keywords come first, then more recent posts fill the list.
 */
export function selectRelatedResearch(
  current: { href: string; category: string; keywords: string[] },
  candidates: RelatedResearchCandidate[],
  limit = 4,
): RelatedResearchLink[] {
  return rankRelatedCandidates(current, candidates).slice(0, limit).map(toLink);
}

/**
 * Three posts for the bottom Related Articles section.
 * Curated frontmatter slugs come first. Ranking fills any remaining slots.
 */
export function selectBottomRelatedPosts(
  current: { href: string; slug: string; category: string; keywords: string[] },
  curatedSlugs: readonly string[] | undefined,
  candidates: RelatedArticleCandidate[],
  limit = 3,
): BottomRelatedPick[] {
  const bySlug = new Map<string, RelatedArticleCandidate>();
  for (const candidate of candidates) {
    if (!bySlug.has(candidate.slug)) bySlug.set(candidate.slug, candidate);
  }

  const seen = new Set<string>([current.slug]);
  const picks: BottomRelatedPick[] = [];

  for (const raw of curatedSlugs ?? []) {
    if (picks.length >= limit) break;
    const slug = raw.trim();
    if (!slug || seen.has(slug) || !bySlug.has(slug)) continue;
    seen.add(slug);
    picks.push({ slug, href: `/research/${slug}`, source: 'curated' });
  }

  if (picks.length < limit) {
    for (const candidate of rankRelatedCandidates(current, candidates)) {
      if (picks.length >= limit) break;
      if (!candidate.slug || seen.has(candidate.slug)) continue;
      seen.add(candidate.slug);
      picks.push({ slug: candidate.slug, href: candidate.href, source: 'ranked' });
    }
  }

  return picks;
}

/**
 * Side-rail links. Bottom-section posts are excluded so the two lists do not repeat.
 * If that pool cannot fill the rail, the remaining slots come from the full ranking.
 */
export function selectRailRelatedResearch(
  current: { href: string; category: string; keywords: string[] },
  candidates: RelatedResearchCandidate[],
  excludeHrefs: readonly string[],
  limit = 4,
): RelatedResearchLink[] {
  const excluded = new Set(excludeHrefs);
  const pool = candidates.filter((candidate) => !excluded.has(candidate.href));
  const primary = selectRelatedResearch(current, pool, limit);
  if (primary.length >= limit) return primary;

  const seen = new Set(primary.map((item) => item.href));
  const filled = [...primary];
  for (const item of selectRelatedResearch(current, candidates, candidates.length)) {
    if (filled.length >= limit) break;
    if (seen.has(item.href)) continue;
    seen.add(item.href);
    filled.push(item);
  }
  return filled;
}
