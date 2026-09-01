import fs from 'fs';
import path from 'path';

const dir = 'src/pages/pathways';

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

function titleCaseSlug(slug) {
  return slug
    .replace(/^eb5-/, 'EB-5 ')
    .replace(/-/g, ' ')
    .replace(/\bvs\b/g, 'vs')
    .replace(/\bh1b\b/gi, 'H-1B')
    .replace(/\bh4\b/gi, 'H-4')
    .replace(/\bj1\b/gi, 'J-1')
    .replace(/\bl1\b/gi, 'L-1')
    .replace(/\beb2\b/gi, 'EB-2')
    .replace(/\beb3\b/gi, 'EB-3')
    .replace(/\bniw\b/gi, 'NIW')
    .replace(/\bi956f\b/gi, 'I-956F')
    .replace(/\bus\b/gi, 'US');
}

let wired = 0;
let skipped = 0;

for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.astro'))) {
  const slug = file.replace(/\.astro$/, '');
  const isUnique = unique.includes(slug);
  const cat = category[slug];
  if (!isUnique && !cat) continue;

  const fp = path.join(dir, file);
  let src = fs.readFileSync(fp, 'utf8');
  if (!src.includes('PathwayLandingLayout')) {
    skipped++;
    continue;
  }
  if (src.includes('getPathwayHero') || src.includes('getPathwayCategoryHero')) {
    skipped++;
    console.log('skip (already wired)', slug);
    continue;
  }

  const importLine = isUnique
    ? "import { getPathwayHero } from '@/lib/pathwayHeroes';\n"
    : "import { getPathwayCategoryHero } from '@/lib/pathwayHeroes';\n";

  src = src.replace(
    /(import PathwayLandingLayout from '[^']+';\n)/,
    `$1${importLine}`,
  );

  const heroConst = isUnique
    ? `\nconst hero = getPathwayHero('${slug}');\n`
    : `\nconst hero = getPathwayCategoryHero('${cat}');\n`;

  const layoutIdx = src.indexOf('<PathwayLandingLayout');
  if (layoutIdx < 0) throw new Error('no layout ' + slug);
  const fmEnd = src.lastIndexOf('\n---\n', layoutIdx);
  if (fmEnd < 0) throw new Error('no fm end ' + slug);
  src = src.slice(0, fmEnd) + heroConst + src.slice(fmEnd);

  const alt = `EB-5 pathway: ${titleCaseSlug(slug)}`;
  if (src.includes('heroImage=')) {
    skipped++;
    continue;
  }

  if (/breadcrumbTitle=\{[^}]+\}/.test(src)) {
    src = src.replace(
      /(breadcrumbTitle=\{[^}]+\}\n)/,
      `$1  heroImage={hero.image}\n  heroImageWebp={hero.webp}\n  heroImageAlt="${alt}"\n`,
    );
  } else {
    src = src.replace(
      /(subhead=\{subhead\}\n)/,
      `$1  heroImage={hero.image}\n  heroImageWebp={hero.webp}\n  heroImageAlt="${alt}"\n`,
    );
  }

  fs.writeFileSync(fp, src);
  wired++;
  console.log('wired', slug, isUnique ? 'unique' : `category:${cat}`);
}

console.log({ wired, skipped });
