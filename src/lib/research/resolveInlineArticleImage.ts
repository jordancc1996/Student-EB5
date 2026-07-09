import type { ImageMetadata } from 'astro';

/** Basename → built asset URL from Astro's image pipeline. */
const assetUrlByBasename = new Map<string, string>();

const assetModules = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/*.{jpg,jpeg,png,webp,gif}',
  { eager: true, import: 'default' },
);

for (const [filePath, metadata] of Object.entries(assetModules)) {
  const basename = filePath.split('/').pop();
  if (basename && metadata?.src) {
    assetUrlByBasename.set(basename, metadata.src);
  }
}

function extractBasename(rawSrc: string): string | null {
  const trimmed = rawSrc.trim();
  if (!trimmed) return null;

  const withoutQuery = trimmed.split('?')[0].split('#')[0];
  const basename = withoutQuery.split('/').pop();
  return basename || null;
}

/**
 * Resolve inline article image paths to built /_astro/ URLs.
 * Supports dev-server export paths, relative content paths, and public /images/.
 */
export function resolveInlineArticleImageSrc(rawSrc: string): string {
  const trimmed = rawSrc.trim();

  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('/_astro/') ||
    trimmed.startsWith('/images/')
  ) {
    return trimmed;
  }

  const basename = extractBasename(trimmed);
  if (!basename) return trimmed;

  const built = assetUrlByBasename.get(basename);
  if (built) return built;

  return trimmed;
}

export function isUnbuiltArticleImageSrc(rawSrc: string): boolean {
  const trimmed = rawSrc.trim();
  return (
    trimmed.includes('/dev-server/') ||
    trimmed.includes('/src/assets/') ||
    trimmed.includes('/@fs/') ||
    /^\.\.\/.*assets\//.test(trimmed) ||
    /^assets\//.test(trimmed)
  );
}
