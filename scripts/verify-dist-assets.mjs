import fs from 'fs';
import path from 'path';

const distDir = 'dist';
const sampleFiles = [
  'research/index.html',
  'research/regional-center-shutdown-eb5-investor-protections/index.html',
  'research/f1-students/f1-to-eb5-green-card/index.html',
  'research/investment/eb5-pre-investment-checklist-part-1-f1-h1b/index.html',
];

const attrPattern = /(?:src|href)=["']([^"']*(?:\/@fs\/|\/src\/assets\/)[^"']*)["']/g;

console.log('=== DIST ASSET PATH CHECK ===\n');
let issues = 0;

for (const rel of sampleFiles) {
  const file = path.join(distDir, rel);
  const html = fs.readFileSync(file, 'utf8');
  const matches = [...html.matchAll(attrPattern)].map((m) => m[1]);
  const bodyMention = html.includes('/src/assets/') || html.includes('/@fs/');
  console.log(rel);
  if (matches.length) {
    issues++;
    console.log('  BAD attr paths:', matches);
  } else {
    console.log('  attr paths: clean');
  }
  if (bodyMention && !matches.length) {
    console.log('  note: string appears in body text only (not in src/href)');
  }
  const related = html.match(/Related Articles[\s\S]*?<\/section>/);
  const relatedCount = related ? (related[0].match(/href="\/research\//g) ?? []).length : 0;
  console.log(`  related article links: ${relatedCount}`);
  console.log('');
}

process.exit(issues > 0 ? 1 : 0);
