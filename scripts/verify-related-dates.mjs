import fs from 'fs';
import path from 'path';

const blogDir = 'src/content/blog';

function walk(dir) {
  const out = [];
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) out.push(...walk(p));
    else if (ent.name.endsWith('.md')) out.push(p);
  }
  return out;
}

function parseFrontmatter(file) {
  const raw = fs.readFileSync(file, 'utf8');
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return null;
  const fm = m[1];
  const slug = fm.match(/^slug:\s*"?([^"\n]+)"?/m)?.[1];
  const date = fm.match(/^date:\s*"?([^"\n]+)"?/m)?.[1];
  const titleMatch = fm.match(/^title:\s*"([^"]+)"/m) ?? fm.match(/^title:\s*(.+)$/m);
  const title = titleMatch?.[1]?.trim();
  return { file, slug, date, title };
}

const posts = walk(blogDir).map(parseFrontmatter).filter(Boolean);
const badDates = posts.filter((p) => Number.isNaN(new Date(p.date).getTime()));

console.log('=== DATE PARSE AUDIT ===');
console.log('Total posts:', posts.length);
console.log('NaN dates:', badDates.length);
if (badDates.length) badDates.forEach((p) => console.log(' BAD:', p.slug, p.date));

const sampleSlugs = [
  'regional-center-shutdown-eb5-investor-protections',
  'f1-students/f1-to-eb5-green-card',
  'investment/eb5-pre-investment-checklist-part-1-f1-h1b',
  'comparisons/h1b-vs-eb5-lifetime-cost-indian-chinese-students',
  'complete-2027-eb5-guide',
];

function relatedFor(slug) {
  return posts
    .filter((p) => p.slug !== slug)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);
}

console.log('\n=== RELATED POSTS (newest first, exclude current) ===');
for (const slug of sampleSlugs) {
  const rel = relatedFor(slug);
  console.log('\nArticle:', slug);
  rel.forEach((p, i) => {
    const t = new Date(p.date).getTime();
    console.log(`  ${i + 1} | ${p.date} | ts=${t} | ${p.title?.slice(0, 70)}`);
  });
  const ts = rel.map((p) => new Date(p.date).getTime());
  const sorted = [...ts].sort((a, b) => b - a);
  const ok = JSON.stringify(ts) === JSON.stringify(sorted);
  console.log(`  order OK: ${ok} | count: ${rel.length}`);
}

console.log('\n=== LISTING TOP 5 (newest first) ===');
posts
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  .slice(0, 5)
  .forEach((p, i) => {
    console.log(`${i + 1}. ${p.date} — ${p.slug}`);
  });
