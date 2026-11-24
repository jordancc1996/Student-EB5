/**
 * 1200x630 cover crops of the seven country pathway heroes.
 * These are the og:image and twitter:image files for those pages.
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const slugs = [
  'eb5-for-indian-students',
  'eb5-for-chinese-students',
  'eb5-for-indian-families',
  'eb5-for-chinese-families',
  'eb5-for-indian-investors',
  'eb5-for-chinese-investors',
  'eb5-for-indian-h1b',
];
const outDir = path.join(root, 'public/images/pathways/og');
fs.mkdirSync(outDir, { recursive: true });

for (const slug of slugs) {
  const input = path.join(root, 'src/assets/pathways', `pathway-${slug}-hero.jpg`);
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
