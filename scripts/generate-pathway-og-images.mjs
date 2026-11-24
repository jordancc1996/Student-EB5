/**
 * 1200x630 cover crops of each pathway page hero.
 * These are the og:image and twitter:image files for those pages.
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const categoryHero = {
  'eb5-gifted-funds': 'source-of-funds',
  'eb5-business-income': 'source-of-funds',
  'eb5-property-sale-funds': 'source-of-funds',
  'eb5-source-of-funds': 'source-of-funds',
  'eb5-project-due-diligence': 'project-due-diligence',
  'i956f-approved-eb5-projects': 'project-due-diligence',
  'eb5-risk-and-due-diligence': 'project-due-diligence',
  'rural-eb5': 'project-due-diligence',
  'eb5-concurrent-filing': 'process-mechanics',
  'eb5-child-aging-out': 'process-mechanics',
  'eb2-to-eb5': 'status-transition',
  'eb3-to-eb5': 'status-transition',
  'eb5-vs-h1b': 'visa-comparison',
  'eb5-vs-eb2-niw': 'visa-comparison',
  'eb5-vs-other-visa-options': 'visa-comparison',
};
const directHero = {
  'h1b-to-green-card': 'src/assets/h1b-pathway-hero.jpg',
  'h1b-60-day-clock': 'src/assets/h1b-pathway-hero.jpg',
  'f1-to-eb5-self-sponsored-green-card': 'src/assets/student-pathway-hero.jpg',
};
const pageDir = path.join(root, 'src/pages/pathways');
const slugs = fs
  .readdirSync(pageDir)
  .filter((name) => name.endsWith('.astro') && name !== 'index.astro' && name !== 'view-all.astro')
  .map((name) => name.replace(/\.astro$/, ''))
  .sort();
const outDir = path.join(root, 'public/images/pathways/og');
fs.mkdirSync(outDir, { recursive: true });

for (const slug of slugs) {
  const input = directHero[slug]
    ? path.join(root, directHero[slug])
    : path.join(
        root,
        'src/assets/pathways',
        categoryHero[slug] ? `pathway-category-${categoryHero[slug]}-hero.jpg` : `pathway-${slug}-hero.jpg`,
      );
  if (!fs.existsSync(input)) throw new Error(`Missing hero for ${slug}: ${input}`);
  const output = path.join(outDir, `${slug}.jpg`);
  await sharp(input, { limitInputPixels: false })
    .rotate()
    .resize(1200, 630, { fit: 'cover', position: 'centre' })
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile(output);
  const meta = await sharp(output).metadata();
  if (meta.width !== 1200 || meta.height !== 630) {
    throw new Error(`${slug} crop is ${meta.width}x${meta.height}`);
  }
  console.log(slug, meta.width, meta.height, fs.statSync(output).size);
}
