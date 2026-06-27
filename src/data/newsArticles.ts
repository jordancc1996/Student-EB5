import type { ImageMetadata } from 'astro';
import julyBulletinAsset from '@/assets/studenteb5-eb5-july-2026-visa-bulletin.jpg';
import imgAdjustmentMemo from '@/assets/blog-uscis-adjustment-memo.jpg';
import imgLandscapeUpdate from '@/assets/eb5-landscape-update-2026.jpg';

export interface NewsArticleMeta {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  datePublished: string;
  readTime: string;
  image: ImageMetadata;
  heroImage: ImageMetadata;
  imageAlt: string;
  heroImageAlt: string;
  href: string;
  metaTitle: string;
  metaDescription: string;
  heroSubtitle: string;
  breadcrumbLabel: string;
  keywords: string[];
  schemaKeywords: string;
  heroMinHeightClass: string;
  heroTitleClass: string;
  ctaTitle: string;
  ctaDescription: string;
  ctaHref: string;
  ctaLabel: string;
}

export const newsArticles: NewsArticleMeta[] = [
  {
    id: 'july-2026-visa-bulletin-eb5-q3-outlook',
    slug: 'july-2026-visa-bulletin-eb5-q3-outlook',
    title: 'EB-5 Investor Outlook for Q3 & Understanding the July 2026 Visa Bulletin',
    excerpt:
      'The July 2026 Visa Bulletin shows India\u2019s unreserved EB-5 category has reached its annual limit. Here is what Q3 means for reserved categories, priority dates, and filing strategy.',
    category: 'Visa Bulletin',
    date: 'June 24, 2026',
    datePublished: '2026-06-24',
    readTime: '9 min read',
    image: julyBulletinAsset,
    heroImage: julyBulletinAsset,
    imageAlt: 'Statue of Liberty under a clear blue sky representing the July 2026 EB-5 visa bulletin Q3 outlook',
    heroImageAlt: 'July 2026 Visa Bulletin analysis for EB-5 Q3 investor outlook',
    href: '/news/july-2026-visa-bulletin-eb5-q3-outlook',
    metaTitle: 'July 2026 Visa Bulletin: EB-5 Q3 Investor Outlook | StudentEB5',
    metaDescription:
      'The July 2026 Visa Bulletin shows India unreserved EB-5 has reached its annual limit. Review what Q3 means for reserved categories, priority dates, and filing strategy.',
    heroSubtitle:
      'India\'s unreserved EB-5 category has reached its annual limit. Here is what Q3 means for reserved categories, priority dates, and filing strategy.',
    breadcrumbLabel: 'July 2026 Visa Bulletin',
    keywords: [
      'July 2026 visa bulletin',
      'EB-5 Q3 outlook',
      'India EB-5 unreserved exhausted',
      'EB-5 reserved categories',
      'EB-5 priority date',
      'EB-5 visa supply carryover',
    ],
    schemaKeywords:
      'July 2026 visa bulletin, EB-5 Q3 outlook, India EB-5 unreserved, EB-5 reserved categories, EB-5 priority date, EB-5 visa supply carryover',
    heroMinHeightClass: 'min-h-[60vh]',
    heroTitleClass: 'text-4xl md:text-6xl font-serif font-bold mb-6 leading-tight text-white drop-shadow-lg',
    ctaTitle: 'Plan Your Q3 EB-5 Filing Strategy',
    ctaDescription:
      'Understand how the July 2026 Visa Bulletin affects your reserved category options, priority date, and concurrent filing strategy.',
    ctaHref: '/contact',
    ctaLabel: 'Book a Consultation',
  },
  {
    id: 'uscis-adjustment-of-status-memo-eb5-investors',
    slug: 'uscis-adjustment-of-status-memo-eb5-investors',
    title: 'Navigating the USCIS Adjustment of Status Memo & Impacts for EB-5 Investors',
    excerpt:
      'The USCIS adjustment of status policy memo introduces discretionary review for I-485 applicants. For EB-5 investors on H-1B, L-1, or F-1, the statutory foundation and concurrent filing rights remain intact, with strategy adjustments for documentation and consular processing.',
    category: 'Policy Update',
    date: 'June 9, 2026',
    datePublished: '2026-06-09',
    readTime: '8 min read',
    image: imgAdjustmentMemo,
    heroImage: imgAdjustmentMemo,
    imageAlt: 'USCIS adjustment of status policy memo impact on EB-5 investors',
    heroImageAlt: 'USCIS adjustment of status policy memo and implications for EB-5 investors',
    href: '/news/uscis-adjustment-of-status-memo-eb5-investors',
    metaTitle: 'USCIS Adjustment of Status Memo: EB-5 Investor Impact | StudentEB5',
    metaDescription:
      'How the USCIS adjustment of status policy memo affects EB-5 investors on H-1B, L-1, and F-1, including discretionary review, vulnerable categories, and consular processing alternatives.',
    heroSubtitle:
      'The USCIS policy memo introduces discretionary review to the adjustment of status process, but the statutory foundation of EB-5 and concurrent filing remains intact.',
    breadcrumbLabel: 'USCIS Adjustment of Status Memo',
    keywords: [
      'USCIS adjustment of status memo',
      'EB-5 I-485 adjustment of status',
      'EB-5 concurrent filing',
      'H-1B adjustment of status EB-5',
      'consular processing EB-5',
      'USCIS discretionary review I-485',
    ],
    schemaKeywords:
      'USCIS adjustment of status memo, EB-5 I-485, concurrent filing EB-5, H-1B adjustment of status, consular processing EB-5, USCIS discretion adjustment of status',
    heroMinHeightClass: 'min-h-[60vh]',
    heroTitleClass: 'text-4xl md:text-6xl font-serif font-bold mb-6 leading-tight text-white drop-shadow-lg',
    ctaTitle: 'Talk to an EB-5 Advisor Today',
    ctaDescription:
      'Understand how the USCIS adjustment of status memo affects your filing strategy and whether concurrent filing or consular processing is the right path for your situation.',
    ctaHref: '/pathways/h1b-to-green-card',
    ctaLabel: 'Talk to an EB-5 Advisor',
  },
  {
    id: 'eb5-visa-landscape-news-update-may-2026',
    slug: 'eb5-visa-landscape-news-update-may-2026',
    title: 'EB-5 Visa Landscape News Update May 2026',
    excerpt:
      'A data-driven look at post-RIA EB-5 demand, rural project priority processing, 2026 and 2027 statutory deadlines, and the strategic opportunity for H-1B and F-1 holders.',
    category: 'Market Update',
    date: 'May 2026',
    datePublished: '2026-05-01',
    readTime: '12 min read',
    image: imgLandscapeUpdate,
    heroImage: imgLandscapeUpdate,
    imageAlt: 'EB-5 visa landscape news update for May 2026',
    heroImageAlt: 'Stone stairway symbolizing the EB-5 visa landscape and investor pathway in 2026',
    href: '/news/eb5-visa-landscape-news-update-may-2026',
    metaTitle: 'EB-5 Visa Landscape News Update May 2026 | StudentEB5',
    metaDescription:
      'A May 2026 EB-5 market update covering post-RIA demand, rural project processing, investor deadlines, concurrent filing, and due diligence trends.',
    heroSubtitle:
      'A data-driven look at post-RIA demand, rural project processing, investor deadlines, concurrent filing, and due diligence trends.',
    breadcrumbLabel: 'May 2026 Update',
    keywords: [
      'EB-5 visa news',
      'EB-5 May 2026',
      'rural EB-5 projects',
      'EB-5 grandfathering deadline',
      'EB-5 concurrent filing',
    ],
    schemaKeywords:
      'EB-5 visa news, EB-5 May 2026, EB-5 Reform and Integrity Act, rural EB-5 projects, EB-5 deadlines',
    heroMinHeightClass: 'min-h-[68vh]',
    heroTitleClass: 'text-4xl md:text-6xl lg:text-7xl font-serif font-bold mb-6 leading-tight text-white drop-shadow-lg',
    ctaTitle: 'Stay Ahead of EB-5 Developments',
    ctaDescription:
      'StudentEB5 provides analysis for serious investors evaluating deadlines, project risk, and filing strategy.',
    ctaHref: '/contact',
    ctaLabel: 'Book a Consultation',
  },
];

export const newsArticleSlugs = newsArticles.map((article) => article.slug);

export function getNewsArticle(slug: string): NewsArticleMeta | undefined {
  return newsArticles.find((article) => article.slug === slug);
}
