import fs from 'node:fs';
import path from 'node:path';

const DIST = 'dist';

const astroSrc = fs.readFileSync('astro.config.mjs', 'utf8');
const redirectDest = new Map();
const pairRe =
  /['"](\/[^'"]+)['"]\s*:\s*(?:['"](\/[^'"]+)['"]|\{\s*status:\s*\d+,\s*destination:\s*['"](\/[^'"]+)['"]\s*\})/g;
let m;
while ((m = pairRe.exec(astroSrc))) {
  redirectDest.set(m[1], m[2] || m[3]);
}
try {
  const vercel = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
  for (const r of vercel.redirects ?? []) {
    if (!redirectDest.has(r.source)) redirectDest.set(r.source, r.destination);
  }
} catch {
  // vercel.json optional
}

function walkHtml(dir, files = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walkHtml(p, files);
    else if (e.name.endsWith('.html')) files.push(p);
  }
  return files;
}

function routeExists(route) {
  const clean = route.replace(/\/+$/, '') || '/';
  if (clean === '/') return fs.existsSync(path.join(DIST, 'index.html'));
  const asFile = path.join(DIST, `${clean.slice(1)}.html`);
  const asIndex = path.join(DIST, clean.slice(1), 'index.html');
  return fs.existsSync(asFile) || fs.existsSync(asIndex);
}

function resolveInternal(href) {
  const noHash = href.split('#')[0].split('?')[0];
  if (!noHash.startsWith('/')) return { skip: true };
  if (
    noHash.startsWith('/_astro/') ||
    noHash.startsWith('/images/') ||
    noHash.startsWith('/fonts/') ||
    noHash.startsWith('/favicon')
  ) {
    return { skip: true };
  }
  const dest =
    redirectDest.get(noHash) ||
    redirectDest.get(noHash.replace(/\/+$/, '')) ||
    redirectDest.get(`${noHash.replace(/\/+$/, '')}/`);
  if (dest) return { ok: routeExists(dest) };
  return { ok: routeExists(noHash) };
}

if (!fs.existsSync(DIST)) {
  console.error('dist/ missing — run npm run build first');
  process.exit(1);
}

const broken = [];
const checked = new Set();
for (const file of walkHtml(DIST)) {
  const html = fs.readFileSync(file, 'utf8');
  const hrefs = html.match(/href="(\/[^"]*)"/g) ?? [];
  for (const raw of hrefs) {
    const href = raw.slice(6, -1);
    if (checked.has(href)) continue;
    checked.add(href);
    const result = resolveInternal(href);
    if (result.skip) continue;
    if (!result.ok) broken.push({ href, from: file.replace(/\\/g, '/') });
  }
}

if (broken.length) {
  console.error(`FAIL: ${broken.length} broken internal link(s)`);
  for (const b of broken.slice(0, 50)) console.error(`  ${b.href}  (seen in ${b.from})`);
  process.exit(1);
}

console.log(`PASS: ${checked.size} unique internal hrefs resolve in dist or via redirects`);
