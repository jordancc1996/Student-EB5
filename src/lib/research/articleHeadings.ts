export interface ArticleH2 {
  text: string;
  slug: string;
}

export function stripMarkdownInline(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
}

export function slugifyHeading(text: string): string {
  return stripMarkdownInline(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Ordered H2 slugs from `#` / `##` lines; duplicates get -2, -3, … suffixes. */
export function extractArticleH2s(content: string): ArticleH2[] {
  const counts = new Map<string, number>();
  const results: ArticleH2[] = [];

  for (const line of content.split('\n')) {
    if (!line.startsWith('## ') && !line.startsWith('# ')) continue;

    const raw = line.startsWith('## ') ? line.slice(3) : line.slice(2);
    const text = stripMarkdownInline(raw).trim();
    const base = slugifyHeading(text);
    if (!base) continue;

    const seen = counts.get(base) ?? 0;
    counts.set(base, seen + 1);
    const slug = seen === 0 ? base : `${base}-${seen + 1}`;
    results.push({ text, slug });
  }

  return results;
}

export function truncateTocLabel(label: string, maxLength = 64): string {
  if (label.length <= maxLength) return label;
  return `${label.slice(0, maxLength - 1).trimEnd()}…`;
}

export interface TocItem {
  slug: string;
  label: string;
}

export function buildTocItems(
  h2s: ArticleH2[],
  tocLabels?: Record<string, string>,
): TocItem[] {
  return h2s.map(({ text, slug }) => ({
    slug,
    label: truncateTocLabel(tocLabels?.[slug] ?? text),
  }));
}
