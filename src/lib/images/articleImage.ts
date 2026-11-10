import { getImage, type ImageMetadata } from 'astro:assets';

const CANDIDATE_WIDTHS = [480, 720, 800, 1200, 1600];

export const ARTICLE_IMAGE_SIZES = '(min-width: 2400px) 792px, (min-width: 1920px) 768px, (min-width: 1680px) 716px, (min-width: 1440px) 728px, (min-width: 1024px) 720px, 100vw';

export interface OptimizedArticleImage {
  src: string;
  srcset: string;
  sizes: string;
  width: number;
  height: number;
  orientation: 'portrait' | 'landscape';
}

const byBasename = new Map<string, ImageMetadata>();
const byPublicPath = new Map<string, ImageMetadata>();

function asMetadata(value: unknown): ImageMetadata | null {
  if (!value || typeof value !== 'object') return null;
  const image = value as ImageMetadata;
  if (typeof image.src !== 'string' || typeof image.width !== 'number' || typeof image.height !== 'number') {
    return null;
  }
  return image;
}

function basename(filePath: string): string {
  const normalized = filePath.replace(/\\/g, '/');
  return normalized.split('/').pop() || '';
}

function remember(filePath: string, value: unknown, publicPath?: string) {
  const image = asMetadata(value);
  if (!image) return;
  const name = basename(filePath);
  if (name) byBasename.set(name, image);
  if (publicPath) byPublicPath.set(publicPath, image);
}

const assetModules = import.meta.glob<ImageMetadata>(
  '/src/assets/**/*.{jpg,jpeg,png,webp,gif}',
  { eager: true, import: 'default' },
);
const publicModules = import.meta.glob<ImageMetadata>(
  '/public/images/**/*.{jpg,jpeg,png,webp,gif}',
  { eager: true, import: 'default' },
);

for (const [filePath, value] of Object.entries(assetModules)) remember(filePath, value);
for (const [filePath, value] of Object.entries(publicModules)) {
  const normalized = filePath.replace(/\\/g, '/');
  const marker = '/public/images/';
  const index = normalized.indexOf(marker);
  const publicPath = index === -1 ? null : normalized.slice(index + '/public'.length);
  remember(filePath, value, publicPath ?? undefined);
}

export function lookupArticleImage(rawSrc: string): ImageMetadata | null {
  const trimmed = rawSrc.trim().split('?')[0].split('#')[0];
  if (!trimmed || trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('/_astro/')) {
    return null;
  }
  if (trimmed.startsWith('/images/')) {
    return byPublicPath.get(trimmed) ?? byBasename.get(basename(trimmed)) ?? null;
  }
  return byBasename.get(basename(trimmed)) ?? null;
}

const optimizedCache = new Map<string, Promise<OptimizedArticleImage>>();

function widthsFor(image: ImageMetadata): number[] {
  const widths = CANDIDATE_WIDTHS.filter((width) => width < image.width);
  widths.push(image.width);
  return [...new Set(widths)].sort((a, b) => a - b);
}

async function buildOptimizedArticleImage(image: ImageMetadata): Promise<OptimizedArticleImage> {
  const result = await getImage({
    src: image,
    widths: widthsFor(image),
    sizes: ARTICLE_IMAGE_SIZES,
    format: 'webp',
    quality: 75,
  });
  const srcset =
    result.srcSet.attribute ||
    result.srcSet.values.map((item) => `${item.url} ${item.descriptor ?? ''}`.trim()).join(', ');
  return {
    src: result.src,
    srcset,
    sizes: ARTICLE_IMAGE_SIZES,
    width: image.width,
    height: image.height,
    orientation: image.height > image.width ? 'portrait' : 'landscape',
  };
}

export function optimizeArticleImage(image: ImageMetadata): Promise<OptimizedArticleImage> {
  const key = `${image.src}:${image.width}x${image.height}`;
  let pending = optimizedCache.get(key);
  if (!pending) {
    pending = buildOptimizedArticleImage(image);
    optimizedCache.set(key, pending);
  }
  return pending;
}

function escapeAttribute(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

export function articleImageTag(image: OptimizedArticleImage, alt: string, className?: string): string {
  const classAttr = className ? ` class="${escapeAttribute(className)}"` : '';
  return `<img src="${escapeAttribute(image.src)}" srcset="${escapeAttribute(image.srcset)}" sizes="${escapeAttribute(image.sizes)}" width="${image.width}" height="${image.height}" alt="${escapeAttribute(alt)}" loading="lazy" decoding="async" data-orientation="${image.orientation}"${classAttr} />`;
}

function withIntrinsicImage(tag: string, image: OptimizedArticleImage): string {
  const cleaned = tag
    .replace(/\s(?:width|height|srcset|sizes|loading|decoding|data-orientation)="[^"]*"/gi, '')
    .replace(/\ssrc="[^"]*"/i, ` src="${escapeAttribute(image.src)}"`);
  const attrs = ` srcset="${escapeAttribute(image.srcset)}" sizes="${escapeAttribute(image.sizes)}" width="${image.width}" height="${image.height}" loading="lazy" decoding="async" data-orientation="${image.orientation}"`;
  if (cleaned.endsWith('/>')) return `${cleaned.slice(0, -2)}${attrs} />`;
  return `${cleaned.slice(0, -1)}${attrs}>`;
}

/** Add intrinsic size and srcset to raw <img> tags. Existing alt text is left as written. */
export async function upgradeRawArticleImages(html: string): Promise<string> {
  const tags = [...html.matchAll(/<img\b[^>]*>/gi)];
  let next = html;
  for (const match of tags) {
    const tag = match[0];
    if (/\swidth=/.test(tag) && /\ssrcset=/.test(tag)) continue;
    const src = tag.match(/\ssrc="([^"]+)"/i)?.[1];
    if (!src) continue;
    const metadata = lookupArticleImage(src);
    if (!metadata) {
      throw new Error(`Article image is not in the image pipeline: ${src}`);
    }
    const image = await optimizeArticleImage(metadata);
    next = next.replace(tag, withIntrinsicImage(tag, image));
  }
  return next;
}
