/**
 * Verify every blog slug in ARTICLE_PATHWAY_MAP resolves to known pathway copy.
 * Usage: node scripts/verify-pathway-cta-map.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
process.chdir(root);

const mapSrc = fs.readFileSync('src/lib/research/articlePathwayMap.ts', 'utf8');
const copySrc = fs.readFileSync('src/lib/research/pathwayCtaCopy.ts', 'utf8');

const mapBlock = mapSrc.match(/ARTICLE_PATHWAY_MAP[\s\S]*?=\s*\{([\s\S]*?)\};/)?.[1] ?? '';
const copyBlock = copySrc.match(/PATHWAY_CTA_COPY[\s\S]*?=\s*\{([\s\S]*?)\};/)?.[1] ?? '';

const slugMatches = [...mapBlock.matchAll(/'([^']+)':\s*'([^']+)'/g)];
const copyIds = new Set([...copyBlock.matchAll(/'([^']+)':\s*\{/g)].map((m) => m[1]));

function walk(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else if (e.name.endsWith('.md')) out.push(p);
  }
  return out;
}

const articleSlugs = new Set();
for (const f of walk('src/content/blog')) {
  const raw = fs.readFileSync(f, 'utf8');
  const m = raw.match(/^slug:\s*(.+)$/m);
  if (m) articleSlugs.add(m[1].replace(/^["']|["']$/g, ''));
}

const mappedSlugs = new Set(slugMatches.map((m) => m[1]));
let failed = false;

for (const slug of [...articleSlugs].sort()) {
  if (!mappedSlugs.has(slug)) {
    console.error(`MISSING MAP: ${slug}`);
    failed = true;
  }
}

for (const slug of mappedSlugs) {
  if (!articleSlugs.has(slug)) {
    console.error(`STALE MAP: ${slug}`);
    failed = true;
  }
}

for (const [, , pathwayId] of slugMatches) {
  if (!copyIds.has(pathwayId)) {
    console.error(`MISSING COPY: ${pathwayId}`);
    failed = true;
  }
}

if (failed) process.exit(1);
console.log(`PASS: ${mappedSlugs.size} articles mapped to ${copyIds.size} pathway copy entries.`);
