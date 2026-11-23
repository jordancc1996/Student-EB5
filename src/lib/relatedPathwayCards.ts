import { getImage, type ImageMetadata } from 'astro:assets';
import h1bHero from '@/assets/h1b-pathway-hero.jpg';
import h1bHeroWebp from '@/assets/h1b-pathway-hero.webp';
import studentHero from '@/assets/student-pathway-hero.jpg';
import studentHeroWebp from '@/assets/student-pathway-hero.webp';
import { getPlacementsForPath } from '@/data/photoRegistry';
import { getPathwayCategoryHero, getPathwayHero } from '@/lib/pathwayHeroes';
import { photoAssets } from '@/lib/photos/photoAssets';
import { landingPages, type LandingPage } from '@/lib/pathwayRoutes';
import { getRelatedPathways, type RelatedPathwayLink } from '@/lib/relatedPathways';

export interface RelatedPathwayCard extends RelatedPathwayLink {
  image: ImageMetadata;
  imageWebp?: ImageMetadata;
  imageAlt: string;
}

/** Category hero used by the landing page when it has no unique file. */
const CATEGORY_BY_SLUG: Record<string, string> = {
  'eb5-vs-eb2-niw': 'visa-comparison',
  'eb5-vs-h1b': 'visa-comparison',
  'eb5-vs-other-visa-options': 'visa-comparison',
  'eb2-to-eb5': 'status-transition',
  'eb3-to-eb5': 'status-transition',
  'eb5-source-of-funds': 'source-of-funds',
  'eb5-gifted-funds': 'source-of-funds',
  'eb5-property-sale-funds': 'source-of-funds',
  'eb5-business-income': 'source-of-funds',
  'rural-eb5': 'project-due-diligence',
  'eb5-risk-and-due-diligence': 'project-due-diligence',
  'eb5-project-due-diligence': 'project-due-diligence',
  'i956f-approved-eb5-projects': 'project-due-diligence',
  'eb5-concurrent-filing': 'process-mechanics',
  'eb5-child-aging-out': 'process-mechanics',
};

const ALT_BY_SLUG: Record<string, string> = {
  'eb5-for-indian-h1b': 'Indian H-1B professional reviewing EB-5 green card options',
  'eb5-for-korean-investors': 'South Korean investor comparing EB-5 green card routes',
  'eb5-for-chinese-investors': 'Chinese investor reviewing EB-5 capital and visa timing',
  'eb5-for-chinese-students': 'Chinese student weighing EB-5 while studying in the United States',
  'eb5-for-chinese-families': 'Chinese family funding an EB-5 investment for a relative in the United States',
  'eb5-for-indian-students': 'Indian student weighing EB-5 during study in the United States',
  'eb5-for-indian-investors': 'Indian investor reviewing an EB-5 project and visa timing',
  'eb5-for-indian-families': 'Indian family funding an EB-5 investment',
  'eb5-for-vietnamese-investors': 'Vietnamese investor reviewing an EB-5 green card investment',
  'eb5-for-taiwanese-investors': 'Taiwanese investor reviewing an EB-5 green card investment',
  'eb5-for-opt-students': 'Student on OPT comparing EB-5 with temporary work status',
  'eb5-for-graduate-students': 'Graduate student comparing EB-5 with a temporary student visa',
  'eb5-for-h4-families': 'H-4 family reviewing EB-5 as a path off dependent status',
  'eb5-for-l1': 'L-1 professional comparing an intracompany transfer with EB-5',
  'eb5-for-j1': 'J-1 exchange visitor comparing EB-5 with a temporary program',
  'eb5-for-tech-workers': 'Technology worker comparing employer sponsorship with EB-5',
  'eb5-for-startup-founders': 'Startup founder reviewing EB-5 alongside a new company',
  'eb5-for-entrepreneurs': 'Entrepreneur reviewing EB-5 as a self-sponsored green card route',
  'eb5-for-families-with-us-students': 'Family with a student in the United States reviewing EB-5',
  'eb5-for-wealthy-families': 'Family reviewing EB-5 for a long-term move to the United States',
  'parents-and-families': 'Parents reviewing EB-5 for a child studying in the United States',
  'h1b-to-green-card': 'H-1B professional reviewing a self-sponsored EB-5 green card',
  'h1b-60-day-clock': 'H-1B worker in the 60-day grace period reviewing EB-5 timing',
  'f1-to-eb5-self-sponsored-green-card': 'International student reviewing a self-sponsored EB-5 green card',
  'eb5-vs-h1b': 'Side-by-side of H-1B employment status and an EB-5 investment green card',
  'eb5-vs-eb2-niw': 'Side-by-side of EB-2 NIW and an EB-5 investment green card',
  'eb5-vs-other-visa-options': 'Side-by-side of EB-5 and other U.S. visa categories',
  'eb2-to-eb5': 'Professional moving from an EB-2 queue to an EB-5 filing',
  'eb3-to-eb5': 'Professional moving from an EB-3 queue to an EB-5 filing',
  'eb5-source-of-funds': 'Documents used to show the lawful source of EB-5 capital',
  'eb5-gifted-funds': 'Gifted funds documented as the source of an EB-5 investment',
  'eb5-property-sale-funds': 'Property sale proceeds documented as EB-5 capital',
  'eb5-business-income': 'Business income documented as the source of EB-5 capital',
  'rural-eb5': 'Rural EB-5 project under review for a targeted employment area',
  'eb5-risk-and-due-diligence': 'EB-5 project risk and due diligence review',
  'eb5-project-due-diligence': 'EB-5 project documents laid out for due diligence',
  'i956f-approved-eb5-projects': 'EB-5 project with an I-956F filing under review',
  'eb5-concurrent-filing': 'Concurrent I-526E and I-485 filing for an investor already in the United States',
  'eb5-child-aging-out': 'Family reviewing whether a child ages out of an EB-5 petition',
};

interface Visual {
  image: ImageMetadata;
  imageWebp?: ImageMetadata;
  key: string;
}

const pathwayPages = landingPages.filter(
  (page) => page.hasDedicatedContent && page.url.startsWith('/pathways/'),
);

function slugOf(url: string): string {
  return url.replace(/\/$/, '').split('/').pop() ?? '';
}

function visual(image: ImageMetadata, imageWebp?: ImageMetadata): Visual {
  return { image, imageWebp, key: image.src };
}

function ownedVisuals(slug: string): Visual[] {
  const options: Visual[] = [];
  const seen = new Set<string>();
  const add = (item: Visual | null) => {
    if (!item || seen.has(item.key)) return;
    seen.add(item.key);
    options.push(item);
  };

  const unique = getPathwayHero(slug);
  if (unique.image) add(visual(unique.image, unique.webp));

  if (slug === 'h1b-to-green-card' || slug === 'h1b-60-day-clock') add(visual(h1bHero, h1bHeroWebp));
  if (slug === 'f1-to-eb5-self-sponsored-green-card') add(visual(studentHero, studentHeroWebp));

  const category = CATEGORY_BY_SLUG[slug];
  if (category) {
    const shared = getPathwayCategoryHero(category);
    if (shared.image) add(visual(shared.image, shared.webp));
  }

  for (const placement of getPlacementsForPath(`/pathways/${slug}`)) {
    const asset = photoAssets[placement.id];
    if (asset) add(visual(asset));
  }

  return options;
}

function withUniqueHero(page: LandingPage): Visual | null {
  const hero = getPathwayHero(slugOf(page.url));
  if (!hero.image) return null;
  return visual(hero.image, hero.webp);
}

/** Next same-category page whose file is pathway-{slug}-hero, then any other unique hero. */
function borrowVisuals(slug: string, blockedKeys: Set<string>): Visual[] {
  const category = CATEGORY_BY_SLUG[slug];
  const uniquePages = pathwayPages
    .map((page) => ({ page, visual: withUniqueHero(page) }))
    .filter((item): item is { page: LandingPage; visual: Visual } => item.visual != null && !blockedKeys.has(item.visual.key))
    .sort((a, b) => a.page.url.localeCompare(b.page.url));

  const inCategory = category
    ? uniquePages.filter((item) => CATEGORY_BY_SLUG[slugOf(item.page.url)] === category)
    : [];
  const rest = uniquePages.filter((item) => !inCategory.includes(item));
  return [...inCategory, ...rest].map((item) => item.visual);
}

function assignVisuals(links: RelatedPathwayLink[]): Visual[] {
  const options = links.map((link) => ownedVisuals(slugOf(link.url)));
  const chosen: Visual[] = [];

  function search(index: number, used: Set<string>): boolean {
    if (index === links.length) return true;
    for (const option of options[index]) {
      if (used.has(option.key)) continue;
      used.add(option.key);
      chosen[index] = option;
      if (search(index + 1, used)) return true;
      used.delete(option.key);
    }
    return false;
  }

  if (!search(0, new Set())) {
    const used = new Set(chosen.filter(Boolean).map((item) => item.key));
    links.forEach((link, index) => {
      options[index].push(...borrowVisuals(slugOf(link.url), used));
    });
    chosen.length = 0;
    if (!search(0, new Set())) {
      throw new Error('Related pathway cards could not be given distinct photos');
    }
  }

  return chosen;
}

async function withWebp(item: Visual): Promise<Visual> {
  if (item.imageWebp) return item;
  const webp = await getImage({
    src: item.image,
    format: 'webp',
    width: item.image.width,
    quality: 75,
  });
  return {
    ...item,
    imageWebp: {
      src: webp.src,
      width: item.image.width,
      height: item.image.height,
      format: 'webp',
    },
  };
}

export async function getRelatedPathwayCards(pathname: string): Promise<RelatedPathwayCard[]> {
  const links = getRelatedPathways(pathname);
  const visuals = assignVisuals(links);
  const cards: RelatedPathwayCard[] = [];
  for (let index = 0; index < links.length; index += 1) {
    const ready = await withWebp(visuals[index]);
    const slug = slugOf(links[index].url);
    cards.push({
      title: links[index].title,
      url: links[index].url,
      image: ready.image,
      imageWebp: ready.imageWebp,
      imageAlt: ALT_BY_SLUG[slug] ?? 'EB-5 pathway page',
    });
  }
  return cards;
}
