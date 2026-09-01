/**
 * Convert pathway hero JPGs to resized WebP siblings.
 * Does not modify or overwrite source JPGs.
 *
 * Usage: node scripts/generate-pathway-hero-webps.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const DIR = path.resolve('src/assets/pathways');
const MAX_WIDTH = 1920;
const WEBP_QUALITY = 82;

const TARGETS = [
  'pathway-category-process-mechanics-hero',
  'pathway-category-project-due-diligence-hero',
  'pathway-category-source-of-funds-hero',
  'pathway-category-status-transition-hero',
  'pathway-category-visa-comparison-hero',
  'pathway-eb5-for-chinese-families-hero',
  'pathway-eb5-for-chinese-investors-hero',
  'pathway-eb5-for-chinese-students-hero',
  'pathway-eb5-for-entrepreneurs-hero',
  'pathway-eb5-for-families-with-us-students-hero',
  'pathway-eb5-for-graduate-students-hero',
  'pathway-eb5-for-h4-families-hero',
  'pathway-eb5-for-indian-families-hero',
  'pathway-eb5-for-indian-h1b-hero',
  'pathway-eb5-for-indian-investors-hero',
  'pathway-eb5-for-indian-students-hero',
  'pathway-eb5-for-j1-hero',
  'pathway-eb5-for-korean-investors-hero',
  'pathway-eb5-for-l1-hero',
  'pathway-eb5-for-opt-students-hero',
  'pathway-eb5-for-startup-founders-hero',
  'pathway-eb5-for-taiwanese-investors-hero',
  'pathway-eb5-for-tech-workers-hero',
  'pathway-eb5-for-vietnamese-investors-hero',
  'pathway-eb5-for-wealthy-families-hero',
  'pathway-parents-and-families-hero',
  'pathway-view-all-hero',
  'pathway-pathways-index-hero',
];

function formatBytes(n) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

const rows = [];

for (const basename of TARGETS) {
  const jpgPath = path.join(DIR, `${basename}.jpg`);
  const webpPath = path.join(DIR, `${basename}.webp`);

  if (!fs.existsSync(jpgPath)) {
    console.error(`MISSING JPG: ${basename}.jpg`);
    process.exitCode = 1;
    continue;
  }

  const jpgStatBefore = fs.statSync(jpgPath);
  const meta = await sharp(jpgPath).metadata();

  await sharp(jpgPath)
    .rotate()
    .resize({
      width: MAX_WIDTH,
      withoutEnlargement: true,
      fit: 'inside',
    })
    .webp({ quality: WEBP_QUALITY, effort: 4 })
    .toFile(webpPath);

  const webpStat = fs.statSync(webpPath);
  const jpgStatAfter = fs.statSync(jpgPath);

  if (jpgStatAfter.size !== jpgStatBefore.size) {
    console.error(`JPG CHANGED unexpectedly: ${basename}.jpg`);
    process.exitCode = 1;
  }

  rows.push({
    name: basename,
    jpgBytes: jpgStatBefore.size,
    webpBytes: webpStat.size,
    srcW: meta.width ?? 0,
    srcH: meta.height ?? 0,
  });
}

console.log(
  [
    'basename'.padEnd(48),
    'JPG'.padStart(10),
    'WebP'.padStart(10),
    'ratio'.padStart(8),
    'src WxH'.padStart(14),
  ].join('  '),
);
console.log('-'.repeat(96));

let jpgTotal = 0;
let webpTotal = 0;
for (const row of rows) {
  jpgTotal += row.jpgBytes;
  webpTotal += row.webpBytes;
  const ratio = ((row.webpBytes / row.jpgBytes) * 100).toFixed(1) + '%';
  console.log(
    [
      row.name.padEnd(48),
      formatBytes(row.jpgBytes).padStart(10),
      formatBytes(row.webpBytes).padStart(10),
      ratio.padStart(8),
      `${row.srcW}x${row.srcH}`.padStart(14),
    ].join('  '),
  );
}

console.log('-'.repeat(96));
console.log(
  [
    'TOTAL'.padEnd(48),
    formatBytes(jpgTotal).padStart(10),
    formatBytes(webpTotal).padStart(10),
    ((webpTotal / jpgTotal) * 100).toFixed(1) + '%',
  ].join('  '),
);
console.log(`\nWrote ${rows.length} WebP files (max width ${MAX_WIDTH}px, quality ${WEBP_QUALITY}).`);
console.log('Original JPGs left unchanged.');
