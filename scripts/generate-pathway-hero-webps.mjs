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
const MAX_LONG_EDGE = 1920;
const WEBP_QUALITY = 82;

/** Portrait sources (height > width): cap height. Landscape/square: cap width. */
function resizeOptions(meta) {
  const w = meta.width ?? 0;
  const h = meta.height ?? 0;
  const isPortrait = h > w;
  return {
    ...(isPortrait ? { height: MAX_LONG_EDGE } : { width: MAX_LONG_EDGE }),
    withoutEnlargement: true,
    fit: 'inside',
  };
}

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
    .resize(resizeOptions(meta))
    .webp({ quality: WEBP_QUALITY, effort: 4 })
    .toFile(webpPath);

  const webpStat = fs.statSync(webpPath);
  const outMeta = await sharp(webpPath).metadata();
  const jpgStatAfter = fs.statSync(jpgPath);

  if (jpgStatAfter.size !== jpgStatBefore.size) {
    console.error(`JPG CHANGED unexpectedly: ${basename}.jpg`);
    process.exitCode = 1;
  }

  const srcW = meta.width ?? 0;
  const srcH = meta.height ?? 0;
  rows.push({
    name: basename,
    jpgBytes: jpgStatBefore.size,
    webpBytes: webpStat.size,
    srcW,
    srcH,
    outW: outMeta.width ?? 0,
    outH: outMeta.height ?? 0,
    orient: srcH > srcW ? 'portrait' : srcW > srcH ? 'landscape' : 'square',
  });
}

console.log(
  [
    'basename'.padEnd(48),
    'orient'.padStart(9),
    'src WxH'.padStart(12),
    'out WxH'.padStart(12),
    'WebP'.padStart(10),
  ].join('  '),
);
console.log('-'.repeat(100));

let webpTotal = 0;
for (const row of rows) {
  webpTotal += row.webpBytes;
  console.log(
    [
      row.name.padEnd(48),
      row.orient.padStart(9),
      `${row.srcW}x${row.srcH}`.padStart(12),
      `${row.outW}x${row.outH}`.padStart(12),
      formatBytes(row.webpBytes).padStart(10),
    ].join('  '),
  );
}

console.log('-'.repeat(100));
console.log(['TOTAL'.padEnd(48), ''.padStart(9), ''.padStart(12), ''.padStart(12), formatBytes(webpTotal).padStart(10)].join('  '));
console.log(`\nWrote ${rows.length} WebP files (max long edge ${MAX_LONG_EDGE}px, quality ${WEBP_QUALITY}).`);
console.log('Original JPGs left unchanged.');
