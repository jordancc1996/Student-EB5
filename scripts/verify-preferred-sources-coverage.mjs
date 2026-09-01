import fs from 'fs';
import path from 'path';

function walk(dir, acc = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, acc);
    else if (ent.name.endsWith('.astro') || ent.name.endsWith('.tsx')) acc.push(p);
  }
  return acc;
}

const files = walk('src');
const rows = [];

for (const fp of files) {
  const src = fs.readFileSync(fp, 'utf8');
  const count = (src.match(/<PreferredSourcesCTA\b/g) || []).length;
  if (count > 0 || fp.includes('SiteFooter')) {
    rows.push({
      file: fp.replace(/\\/g, '/'),
      count,
      viaSiteFooter: /SiteFooter/.test(src) && fp.includes('SiteFooter') === false,
    });
  }
}

const siteFooter = fs.readFileSync('src/components/SiteFooter.astro', 'utf8');
console.log('SiteFooter has CTA:', /PreferredSourcesCTA/.test(siteFooter));
console.log('--- files with PreferredSourcesCTA markup ---');
const withCta = rows.filter((r) => r.count > 0);
for (const r of withCta.sort((a, b) => a.file.localeCompare(b.file))) {
  console.log(`${r.count}x  ${r.file}`);
}
const dups = withCta.filter((r) => r.count > 1);
console.log('---');
console.log('templates with CTA:', withCta.length);
console.log('duplicates:', dups.length ? dups : 'none');

// privacy / 404
for (const p of ['src/pages/privacy-policy.astro', 'src/pages/404.astro']) {
  const s = fs.readFileSync(p, 'utf8');
  console.log(
    p,
    'CTA=',
    (s.match(/<PreferredSourcesCTA\b/g) || []).length,
    'SiteFooter=',
    /SiteFooter/.test(s),
  );
}
