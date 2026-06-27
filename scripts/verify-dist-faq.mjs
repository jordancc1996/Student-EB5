/**
 * Verify FAQ dist pages have no dev-only asset paths.
 */
import fs from 'fs';
import path from 'path';

const distDir = 'dist';
const sampleFiles = [
  'faq/index.html',
  'faq/what-is-eb5-visa-program/index.html',
  'faq/family-members-included/index.html',
  'faq/h1b-grace-period-eb5-options/index.html',
];

const attrPattern = /(?:src|href)=["']([^"']*(?:\/@fs\/|\/src\/assets\/)[^"']*)["']/g;

console.log('=== FAQ DIST ASSET PATH CHECK ===\n');
let issues = 0;

for (const rel of sampleFiles) {
  const file = path.join(distDir, rel);
  const html = fs.readFileSync(file, 'utf8');
  const matches = [...html.matchAll(attrPattern)].map((m) => m[1]);
  console.log(rel);
  if (matches.length) {
    issues++;
    console.log('  BAD attr paths:', matches);
  } else {
    console.log('  attr paths: clean');
  }
  console.log(`  has /@fs/ anywhere: ${html.includes('/@fs/')}`);
  console.log('');
}

process.exit(issues > 0 ? 1 : 0);
