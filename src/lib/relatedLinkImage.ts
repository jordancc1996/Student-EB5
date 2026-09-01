import type { ImageMetadata } from 'astro';
import type { CollectionEntry } from 'astro:content';
import { getPathwayCategoryHero, getPathwayHero } from '@/lib/pathwayHeroes';
import h1bPathwayHero from '@/assets/h1b-pathway-hero.jpg';
import studentPathwayHero from '@/assets/student-pathway-hero.jpg';

export interface RelatedLinkImage {
  image: ImageMetadata;
  imageAlt: string;
}

/** Slugs that share a category hero (same mapping as the landing pages). */
const PATHWAY_CATEGORY_BY_SLUG: Record<string, string> = {
  'eb5-business-income': 'source-of-funds',
  'eb5-gifted-funds': 'source-of-funds',
  'eb5-property-sale-funds': 'source-of-funds',
  'eb5-source-of-funds': 'source-of-funds',
};

/** Pillar pages use dedicated assets outside src/assets/pathways/. */
const PATHWAY_PILLAR_HEROES: Record<string, RelatedLinkImage> = {
  'h1b-to-green-card': {
    image: h1bPathwayHero,
    imageAlt: 'H-1B to green card pathway',
  },
  'f1-to-eb5-self-sponsored-green-card': {
    image: studentPathwayHero,
    imageAlt: 'F-1 to EB-5 self-sponsored green card pathway',
  },
};

/**
 * Resolve a Related Research card thumbnail from a link URL.
 * Missing / unknown targets return undefined — callers must render a placeholder.
 */
export function resolveRelatedLinkImage(
  url: string,
  blogPosts: CollectionEntry<'blog'>[],
): RelatedLinkImage | undefined {
  const pathname = normalizePathname(url);
  if (!pathname) return undefined;

  if (pathname.startsWith('/research/')) {
    const slug = pathname.slice('/research/'.length);
    if (!slug) return undefined;
    const post = blogPosts.find((entry) => entry.data.slug === slug);
    if (!post?.data.image) return undefined;
    return {
      image: post.data.image,
      imageAlt: post.data.imageAlt || post.data.title,
    };
  }

  if (pathname.startsWith('/pathways/')) {
    const slug = pathname.slice('/pathways/'.length);
    if (!slug || slug.includes('/')) return undefined;

    const unique = getPathwayHero(slug);
    if (unique.image) {
      return {
        image: unique.image,
        imageAlt: `EB-5 pathway: ${slug.replace(/-/g, ' ')}`,
      };
    }

    const categoryKey = PATHWAY_CATEGORY_BY_SLUG[slug];
    if (categoryKey) {
      const category = getPathwayCategoryHero(categoryKey);
      if (category.image) {
        return {
          image: category.image,
          imageAlt: `EB-5 pathway: ${slug.replace(/-/g, ' ')}`,
        };
      }
    }

    return PATHWAY_PILLAR_HEROES[slug];
  }

  return undefined;
}

function normalizePathname(url: string): string {
  try {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return new URL(url).pathname.replace(/\/$/, '') || '/';
    }
  } catch {
    return '';
  }
  const path = url.split('?')[0].split('#')[0];
  return path.replace(/\/$/, '') || '/';
}
