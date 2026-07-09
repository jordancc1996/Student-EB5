/**
 * Post-build gate: fail if dist/ contains dev-only or unprocessed asset URLs,
 * or if /_astro/ and /images/ refs do not resolve to real files on disk.
 *
 * Usage: node scripts/verify-dist-asset-urls.mjs [distDir]
 */
import fs from 'node:fs';
import path from 'node:path';

const distDir = process.argv[2] ?? 'dist';

const FORBIDDEN_PATTERNS = [
  { name: 'dev-server path', regex: /\/dev-server\//g },
  { name: 'raw src/assets path', regex: /\/src\/assets\//g },
  { name: 'Vite @fs path', regex: /\/@fs\//g },
  {
    name: 'relative assets path in img/src',
    regex: /(?:src|href)=["'][^"']*(?:\.\.\/)+assets\/[^"']*["']/g,
  },
  {
    name: 'unprefixed assets path in img/src',
    regex: /(?:src|href)=["']assets\/[^"']*["']/g,
  },
];

/** Built pipeline + public image URLs that must exist under dist/. */
const RESOLVABLE_ASSET_ATTR =
  /(?:src|content|href)=["']([^"']*(?:\/_astro\/|\/images\/)[^"']+\.(?:jpg|jpeg|png|webp|gif|svg|avif|mp4|webm))["']/gi;

const OG_IMAGE_ATTR =
  /(?:src|content|href)=["']([^"']*\/og-image\.jpg)["']/gi;

function walkHtmlFiles(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkHtmlFiles(full));
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      files.push(full);
    }
  }
  return files;
}

function toDistRelativePath(rawUrl) {
  let url = rawUrl.trim();
  if (url.startsWith('http://') || url.startsWith('https://')) {
    try {
      url = new URL(url).pathname;
    } catch {
      return null;
    }
  }
  if (!url.startsWith('/')) return null;
  return url.replace(/^\//, '').split('?')[0].split('#')[0];
}

if (!fs.existsSync(distDir)) {
  console.error(`FAIL: dist directory not found: ${distDir}`);
  process.exit(1);
}

const htmlFiles = walkHtmlFiles(distDir);
const findings = [];
const missingFiles = [];
const missingOg = [];

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  const rel = path.relative(distDir, file).replace(/\\/g, '/');

  for (const { name, regex } of FORBIDDEN_PATTERNS) {
    regex.lastIndex = 0;
    const matches = [...html.matchAll(regex)].map((m) => m[0]);
    if (matches.length) {
      findings.push({ file: rel, pattern: name, matches: [...new Set(matches)].slice(0, 5) });
    }
  }

  RESOLVABLE_ASSET_ATTR.lastIndex = 0;
  for (const match of html.matchAll(RESOLVABLE_ASSET_ATTR)) {
    const raw = match[1];
    const distRel = toDistRelativePath(raw);
    if (!distRel) continue;
    if (!fs.existsSync(path.join(distDir, distRel))) {
      missingFiles.push({ file: rel, url: raw, expected: distRel });
    }
  }

  OG_IMAGE_ATTR.lastIndex = 0;
  for (const match of html.matchAll(OG_IMAGE_ATTR)) {
    const raw = match[1];
    const distRel = toDistRelativePath(raw);
    if (!distRel) continue;
    if (!fs.existsSync(path.join(distDir, distRel))) {
      missingOg.push({ file: rel, url: raw });
    }
  }
}

function uniqueByKey(items, keyFn) {
  const out = [];
  const seen = new Set();
  for (const item of items) {
    const key = keyFn(item);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
}

const uniqueMissing = uniqueByKey(missingFiles, (m) => `${m.file}|${m.url}`);
const uniqueOg = uniqueByKey(missingOg, (m) => m.url);

if (uniqueOg.length) {
  console.warn(
    `WARN: ${uniqueOg.length} missing default OG image path(s) (pre-existing; not a /dev-server leak):`,
  );
  for (const m of uniqueOg) {
    console.warn(`  ${m.url} (first seen in ${missingOg[0]?.file ?? 'dist'})`);
  }
  console.warn(
    '  → Add public/og-image.jpg (or retarget meta tags) in a follow-up. Continuing.\n',
  );
}

if (findings.length === 0 && uniqueMissing.length === 0) {
  console.log(
    `PASS: scanned ${htmlFiles.length} HTML files in ${distDir} — no forbidden asset URLs; all /_astro/ and /images/ refs resolve`,
  );
  process.exit(0);
}

if (findings.length) {
  console.error(`FAIL: forbidden asset URLs in ${findings.length} file(s):\n`);
  for (const f of findings) {
    console.error(`  ${f.file}`);
    console.error(`    ${f.pattern}: ${f.matches.join(' | ')}`);
  }
}

if (uniqueMissing.length) {
  console.error(`\nFAIL: ${uniqueMissing.length} missing built asset file(s):\n`);
  for (const m of uniqueMissing.slice(0, 40)) {
    console.error(`  ${m.file}`);
    console.error(`    ${m.url} → expected dist/${m.expected}`);
  }
  if (uniqueMissing.length > 40) {
    console.error(`  … and ${uniqueMissing.length - 40} more`);
  }
}

process.exit(1);
