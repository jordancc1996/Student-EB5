import fs from 'fs';
import path from 'path';

const dir = 'src/pages/pathways';

/** Approved alts; #26/#28/#29 drop redundant second "EB-5". */
const alts = {
  'eb5-for-chinese-students': 'EB-5 pathway for Chinese students',
  'eb5-for-chinese-families': 'EB-5 pathway for Chinese families',
  'eb5-for-indian-investors': 'EB-5 pathway for Indian investors',
  'eb5-for-indian-students': 'EB-5 pathway for Indian students',
  'eb5-for-indian-h1b': 'EB-5 pathway for Indian H-1B professionals',
  'eb5-for-indian-families': 'EB-5 pathway for Indian families',
  'eb5-for-korean-investors': 'EB-5 pathway for Korean investors',
  'eb5-for-taiwanese-investors': 'EB-5 pathway for Taiwanese investors',
  'eb5-for-vietnamese-investors': 'EB-5 pathway for Vietnamese investors',
  'eb5-for-opt-students': 'EB-5 pathway for OPT students',
  'eb5-for-graduate-students': 'EB-5 pathway for graduate students',
  'eb5-for-h4-families': 'EB-5 pathway for H-4 families',
  'eb5-for-j1': 'EB-5 pathway for J-1 visa holders',
  'eb5-for-l1': 'EB-5 pathway for L-1 visa holders',
  'eb5-for-tech-workers': 'EB-5 pathway for tech workers',
  'eb5-for-entrepreneurs': 'EB-5 pathway for entrepreneurs',
  'eb5-for-startup-founders': 'EB-5 pathway for startup founders',
  'eb5-for-wealthy-families': 'EB-5 pathway for wealthy families',
  'eb5-for-families-with-us-students': 'EB-5 pathway for families with US students',
  'parents-and-families': 'EB-5 pathway for parents and families',
  'eb5-vs-h1b': 'EB-5 pathway comparing EB-5 and H-1B visas',
  'eb5-vs-eb2-niw': 'EB-5 pathway comparing EB-5 and EB-2 NIW',
  'eb5-vs-other-visa-options': 'EB-5 pathway comparing EB-5 and other visa options',
  'eb2-to-eb5': 'EB-5 pathway for transitioning from EB-2 to EB-5',
  'eb3-to-eb5': 'EB-5 pathway for transitioning from EB-3 to EB-5',
  'eb5-source-of-funds': 'EB-5 pathway for source of funds',
  'eb5-gifted-funds': 'EB-5 pathway for gifted EB-5 funds',
  'eb5-property-sale-funds': 'EB-5 pathway for property-sale funds',
  'eb5-business-income': 'EB-5 pathway for business-income funds',
  'rural-eb5': 'EB-5 pathway for rural investment',
  'i956f-approved-eb5-projects': 'EB-5 pathway for I-956F approved projects',
  'eb5-project-due-diligence': 'EB-5 pathway for EB-5 project due diligence',
  'eb5-risk-and-due-diligence': 'EB-5 pathway for EB-5 risk and due diligence',
  'eb5-concurrent-filing': 'EB-5 pathway for EB-5 concurrent filing',
  'eb5-child-aging-out': 'EB-5 pathway addressing EB-5 child aging out',
};

let patched = 0;
const missing = [];
const unchangedChinese = [];

for (const [slug, alt] of Object.entries(alts)) {
  const fp = path.join(dir, `${slug}.astro`);
  if (!fs.existsSync(fp)) {
    missing.push(slug);
    continue;
  }
  let src = fs.readFileSync(fp, 'utf8');
  if (!/heroImageAlt="[^"]*"/.test(src)) {
    missing.push(`${slug} (no heroImageAlt)`);
    continue;
  }
  const next = src.replace(/heroImageAlt="[^"]*"/, `heroImageAlt="${alt}"`);
  if (next === src) {
    missing.push(`${slug} (replace failed or already exact)`);
    continue;
  }
  fs.writeFileSync(fp, next);
  patched++;
}

// Confirm chinese investors untouched
const cn = fs.readFileSync(path.join(dir, 'eb5-for-chinese-investors.astro'), 'utf8');
const cnAlt = cn.match(/heroImageAlt="([^"]*)"/)?.[1];
if (cnAlt !== 'EB-5 pathway for Chinese investors') {
  unchangedChinese.push(`UNEXPECTED chinese alt: ${cnAlt}`);
}

console.log(JSON.stringify({ patched, missing, chineseAlt: cnAlt }, null, 2));
