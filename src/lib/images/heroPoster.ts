import { getImage } from 'astro:assets';
import heroBackground from '../../assets/hero-background.jpg';

export interface HeroPoster {
  src: string;
  srcset: string;
  src828: string;
  src1280: string;
  width: number;
  height: number;
}

export async function getHeroPoster(): Promise<HeroPoster> {
  const result = await getImage({
    src: heroBackground,
    widths: [828, 1280],
    format: 'webp',
    quality: 80,
  });
  const srcset =
    result.srcSet.attribute ||
    result.srcSet.values.map((item) => `${item.url} ${item.descriptor ?? ''}`.trim()).join(', ');
  const byWidth = new Map(
    result.srcSet.values.map((item) => [Number.parseInt(item.descriptor || '', 10), item.url]),
  );
  return {
    src: byWidth.get(828) || result.src,
    srcset,
    src828: byWidth.get(828) || result.src,
    src1280: byWidth.get(1280) || result.src,
    width: heroBackground.width,
    height: heroBackground.height,
  };
}
