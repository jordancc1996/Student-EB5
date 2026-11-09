export interface RelatedResearchCandidate {
  title: string;
  href: string;
  date: string;
  category: string;
  keywords: string[];
  timestamp: number;
}

export interface RelatedResearchLink {
  title: string;
  href: string;
  date: string;
  dateTime?: string;
}

function normalize(value: string): string {
  return value.toLowerCase().replace(/\s+/g, ' ').trim();
}

function dateTimeFromLabel(date: string): string | undefined {
  const parsed = Date.parse(date);
  if (Number.isNaN(parsed)) return undefined;
  return new Date(parsed).toISOString().slice(0, 10);
}

/**
 * 3–5 related research links.
 * Same category or shared keywords come first, then more recent posts fill the list.
 */
export function selectRelatedResearch(
  current: { href: string; category: string; keywords: string[] },
  candidates: RelatedResearchCandidate[],
  limit = 5,
): RelatedResearchLink[] {
  const currentKeywords = new Set(current.keywords.map(normalize).filter(Boolean));
  const currentCategory = normalize(current.category);

  const ranked = candidates
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
    });

  return ranked.slice(0, limit).map(({ candidate }) => ({
    title: candidate.title,
    href: candidate.href,
    date: candidate.date,
    dateTime: dateTimeFromLabel(candidate.date),
  }));
}
