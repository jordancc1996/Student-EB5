import { SITE_CONFIG } from './config';

export const DEFAULT_OG_IMAGE = SITE_CONFIG.defaultOgImage;
export const DEFAULT_OG_ALT =
  'StudentEB5: EB-5 for international students graduating in the USA';
export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

/** Force share URLs onto the production origin, never a preview host. */
export function absoluteShareImageUrl(src: string): string {
  if (src.startsWith('http://') || src.startsWith('https://')) {
    const parsed = new URL(src);
    return `${SITE_CONFIG.url}${parsed.pathname}${parsed.search}`;
  }
  return `${SITE_CONFIG.url}${src.startsWith('/') ? src : `/${src}`}`;
}
