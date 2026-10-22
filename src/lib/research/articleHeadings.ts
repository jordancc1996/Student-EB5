export interface ArticleH2 {
  text: string;
  slug: string;
}

export interface ArticleHeading extends ArticleH2 {
  level: 2 | 3;
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

function parseHeadingLine(line: string): { level: 2 | 3; raw: string } | null {
  if (line.startsWith('### ')) return { level: 3, raw: line.slice(4) };
  if (line.startsWith('## ')) return { level: 2, raw: line.slice(3) };
  const html = line.trim().match(/^<h([23])(?:\s[^>]*)?>(.+)<\/h\1>$/i);
  if (html) {
    return { level: Number(html[1]) as 2 | 3, raw: html[2] };
  }
  return null;
}

/** Ordered H2/H3 slugs; duplicates get -2, -3, … suffixes. */
export function extractArticleHeadings(content: string): ArticleHeading[] {
  const counts = new Map<string, number>();
  const results: ArticleHeading[] = [];

  for (const line of content.split('\n')) {
    const parsed = parseHeadingLine(line);
    if (!parsed) continue;

    const text = stripMarkdownInline(parsed.raw).trim();
    const base = slugifyHeading(text);
    if (!base) continue;

    const seen = counts.get(base) ?? 0;
    counts.set(base, seen + 1);
    const slug = seen === 0 ? base : `${base}-${seen + 1}`;
    results.push({ text, slug, level: parsed.level });
  }

  return results;
}

/** Ordered H2 slugs from `##` lines; duplicates get -2, -3, … suffixes. */
export function extractArticleH2s(content: string): ArticleH2[] {
  return extractArticleHeadings(content)
    .filter((heading) => heading.level === 2)
    .map(({ text, slug }) => ({ text, slug }));
}

export function truncateTocLabel(label: string, maxLength = 64): string {
  if (label.length <= maxLength) return label;
  return `${label.slice(0, maxLength - 1).trimEnd()}…`;
}

export interface TocItem {
  slug: string;
  label: string;
  level: 2 | 3;
}

export function buildTocItems(
  headings: Array<ArticleH2 | ArticleHeading>,
  tocLabels?: Record<string, string>,
): TocItem[] {
  return headings.map((heading) => ({
    slug: heading.slug,
    label: truncateTocLabel(tocLabels?.[heading.slug] ?? heading.text),
    level: 'level' in heading ? heading.level : 2,
  }));
}
