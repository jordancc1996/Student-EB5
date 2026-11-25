import { getImage, type ImageMetadata } from 'astro:assets';

export const RESEARCH_HERO_SIZES = '100vw';

export interface ResearchHero {
  src: string;
  srcset: string;
  sizes: string;
  width: number;
  height: number;
}

function srcsetAttribute(result: Awaited<ReturnType<typeof getImage>>): string {
  return (
    result.srcSet.attribute ||
    result.srcSet.values.map((item) => `${item.url} ${item.descriptor ?? ''}`.trim()).join(', ')
  );
}

/** WebP srcset for a full-bleed research hero. Includes 828 and 1280 when the source is at least that wide. */
export async function getResearchHero(
  image: ImageMetadata,
  sizes = RESEARCH_HERO_SIZES,
  extraWidths: number[] = [],
): Promise<ResearchHero> {
  const widths = [828, 1280, image.width, ...extraWidths]
    .filter((width, index, all) => width > 0 && width <= image.width && all.indexOf(width) === index)
    .sort((a, b) => a - b);
  const result = await getImage({
    src: image,
    widths,
    sizes,
    format: 'webp',
    quality: 80,
  });
  const srcset = srcsetAttribute(result);
  const byWidth = new Map(
    result.srcSet.values.map((item) => [Number.parseInt(item.descriptor || '', 10), item.url]),
  );
  const src = byWidth.get(828) || byWidth.get(widths[0]) || result.src;
  return {
    src,
    srcset,
    sizes,
    width: image.width,
    height: image.height,
  };
}
