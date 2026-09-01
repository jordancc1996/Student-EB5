import type { ImageMetadata } from 'astro';

/**
 * Eager glob of pathway hero assets. Missing files simply omit keys —
 * pages can resolve by slug/category without failing the build.
 */
const heroModules = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/pathways/*.{jpg,jpeg,png,webp}',
  { eager: true },
);

function findHero(basename: string): {
  image?: ImageMetadata;
  webp?: ImageMetadata;
} {
  const jpg =
    heroModules[`/src/assets/pathways/${basename}.jpg`]?.default ??
    heroModules[`/src/assets/pathways/${basename}.jpeg`]?.default ??
    heroModules[`/src/assets/pathways/${basename}.png`]?.default;
  const webp = heroModules[`/src/assets/pathways/${basename}.webp`]?.default;
  return { image: jpg, webp };
}

/** Unique per-page hero: pathway-{slug}-hero.jpg */
export function getPathwayHero(slug: string) {
  return findHero(`pathway-${slug}-hero`);
}

/** Shared category hero: pathway-category-{key}-hero.jpg */
export function getPathwayCategoryHero(categoryKey: string) {
  return findHero(`pathway-category-${categoryKey}-hero`);
}

/** Pathways hub at /pathways (index.astro) */
export function getPathwaysIndexHero() {
  return findHero('pathway-pathways-index-hero');
}
