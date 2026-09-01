import fs from 'fs';
import path from 'path';

const dir = 'src/pages/pathways';
const assets = new Set(
  fs.readdirSync('src/assets/pathways').filter((f) => f.endsWith('.jpg')),
);

const unique = [
  'eb5-for-chinese-investors',
  'eb5-for-chinese-students',
  'eb5-for-chinese-families',
  'eb5-for-indian-investors',
  'eb5-for-indian-students',
  'eb5-for-indian-h1b',
  'eb5-for-indian-families',
  'eb5-for-korean-investors',
  'eb5-for-taiwanese-investors',
  'eb5-for-vietnamese-investors',
  'eb5-for-opt-students',
  'eb5-for-graduate-students',
  'eb5-for-h4-families',
  'eb5-for-j1',
  'eb5-for-l1',
  'eb5-for-tech-workers',
  'eb5-for-entrepreneurs',
  'eb5-for-startup-founders',
  'eb5-for-wealthy-families',
  'eb5-for-families-with-us-students',
  'parents-and-families',
];

const category = {
  'eb5-vs-h1b': 'visa-comparison',
  'eb5-vs-eb2-niw': 'visa-comparison',
  'eb5-vs-other-visa-options': 'visa-comparison',
  'eb2-to-eb5': 'status-transition',
  'eb3-to-eb5': 'status-transition',
  'eb5-source-of-funds': 'source-of-funds',
  'eb5-gifted-funds': 'source-of-funds',
  'eb5-property-sale-funds': 'source-of-funds',
  'eb5-business-income': 'source-of-funds',
  'rural-eb5': 'project-due-diligence',
  'i956f-approved-eb5-projects': 'project-due-diligence',
  'eb5-project-due-diligence': 'project-due-diligence',
  'eb5-risk-and-due-diligence': 'project-due-diligence',
  'eb5-concurrent-filing': 'process-mechanics',
  'eb5-child-aging-out': 'process-mechanics',
};

const expected = new Set([...unique, ...Object.keys(category)]);
const flags = [];

for (const slug of [...expected].sort()) {
  const fp = path.join(dir, `${slug}.astro`);
  if (!fs.existsSync(fp)) {
    flags.push(`MISSING PAGE: ${slug}`);
    continue;
  }
  const src = fs.readFileSync(fp, 'utf8');
  const isUnique = unique.includes(slug);
  const cat = category[slug];
  const hasFn = isUnique
    ? src.includes(`getPathwayHero('${slug}')`)
    : src.includes(`getPathwayCategoryHero('${cat}')`);
  const hasProps =
    src.includes('heroImage={hero.image}') &&
    src.includes('heroImageWebp={hero.webp}') &&
    src.includes('heroImageAlt=');

  if (!hasFn) flags.push(`HELPER CALL MISMATCH: ${slug}`);
  if (!hasProps) flags.push(`MISSING HERO PROPS: ${slug}`);

  const asset = isUnique
    ? `pathway-${slug}-hero.jpg`
    : `pathway-category-${cat}-hero.jpg`;
  if (!assets.has(asset)) flags.push(`MISSING ASSET for ${slug}: ${asset}`);
}

const landing = fs
  .readdirSync(dir)
  .filter((f) => f.endsWith('.astro'))
  .filter((f) =>
    fs.readFileSync(path.join(dir, f), 'utf8').includes('PathwayLandingLayout'),
  )
  .map((f) => f.replace(/\.astro$/, ''));

for (const slug of landing) {
  if (!expected.has(slug)) {
    flags.push(`PathwayLanding page NOT in wire map: ${slug}`);
  }
}

console.log(`expected=${expected.size} pathwayLandingPages=${landing.length}`);
console.log(flags.length ? flags.join('\n') : 'FLAGS: none');
