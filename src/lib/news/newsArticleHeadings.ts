import {
  type ArticleH2,
  type TocItem,
  buildTocItems,
  slugifyHeading,
} from '@/lib/research/articleHeadings';

const newsHeadingTexts: Record<string, string[]> = {
  'july-2026-visa-bulletin-eb5-q3-outlook': [
    'Unreserved Category is Exhausted',
    'The Importance of Current Priority Dates',
    'How to Read the Visa Bulletin',
    'Visa Supply and Carryover Dynamics',
    'Priority Processing and Future Outlook',
    'Frequently Asked Questions',
  ],
  'uscis-adjustment-of-status-memo-eb5-investors': [
    'The Core Message of the Memo',
    'What Are the Implications for EB-5 Investors?',
    'Strategic Considerations for Pending and Future Applicants',
    'Memo Final Thoughts',
  ],
  'eb5-visa-landscape-news-update-may-2026': [
    'Analyzing the Data Surge',
    'Regional Center Dominance and the Rise of Rural Projects',
    'The Gold Card Created Political Urgency',
    'Direct EB-5 vs. Regional Center: Risk vs. Reward',
    'The Shift Toward Bespoke Projects and Financial Transparency',
    'USCIS Productivity and the Adjudication Bottleneck',
    'The Role of Mandamus Litigation in Processing Times',
    '2026 and 2027 Countdowns',
    'The Strategic Advantage for H-1B and F-1 Holders',
    'Navigating the Next 12 to 18 Months',
    'The Global Perspective: China, India, and Beyond',
    'Final Thoughts',
    'Frequently Asked Questions',
  ],
};

function toArticleH2s(texts: string[]): ArticleH2[] {
  const counts = new Map<string, number>();
  return texts.map((text) => {
    const base = slugifyHeading(text);
    const seen = counts.get(base) ?? 0;
    counts.set(base, seen + 1);
    const slug = seen === 0 ? base : `${base}-${seen + 1}`;
    return { text, slug };
  });
}

export function getNewsArticleH2s(slug: string): ArticleH2[] {
  const texts = newsHeadingTexts[slug];
  if (!texts) return [];
  return toArticleH2s(texts);
}

export function getNewsTocItems(
  slug: string,
  tocLabels?: Record<string, string>,
): TocItem[] {
  return buildTocItems(getNewsArticleH2s(slug), tocLabels);
}
