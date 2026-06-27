import fs from 'fs';
import path from 'path';

const files = ['about/index.html', 'faq/index.html'];
const attrPattern = /(?:src|href)=["']([^"']*(?:\/@fs\/|\/src\/assets\/)[^"']*)["']/g;

console.log('=== DIST ASSET PATH CHECK (about + faq) ===\n');
let issues = 0;

for (const rel of files) {
  const file = path.join('dist', rel);
  const html = fs.readFileSync(file, 'utf8');
  const matches = [...html.matchAll(attrPattern)].map((m) => m[1]);
  console.log(rel);
  console.log(`  has /@fs/ anywhere: ${html.includes('/@fs/')}`);
  if (matches.length) {
    issues++;
    console.log('  BAD attr paths:', matches);
  } else {
    console.log('  attr paths: clean');
  }
  console.log('');
}

process.exit(issues > 0 ? 1 : 0);
