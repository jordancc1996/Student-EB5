import fs from 'fs';
import path from 'path';

const dir = 'src/pages/pathways';
const files = fs
  .readdirSync(dir)
  .filter((f) => f.endsWith('.astro'))
  .filter((f) =>
    fs.readFileSync(path.join(dir, f), 'utf8').includes('PathwayLandingLayout'),
  );

function splitFm(src) {
  const parts = src.split(/^---$/m);
  if (parts.length < 3) return { fm: '', body: src };
  return { fm: parts[1], body: parts.slice(2).join('---') };
}

const byFile = [];
let total = 0;
let inFm = 0;
let inBody = 0;
const samples = [];

for (const f of files.sort()) {
  const src = fs.readFileSync(path.join(dir, f), 'utf8');
  const { fm, body } = splitFm(src);
  const fmN = (fm.match(/—/g) || []).length;
  const bodyN = (body.match(/—/g) || []).length;
  const n = fmN + bodyN;
  total += n;
  inFm += fmN;
  inBody += bodyN;
  byFile.push({ f, n, fmN, bodyN });

  // collect sample sentences from body
  const re = /—/g;
  let m;
  while ((m = re.exec(body)) && samples.length < 40) {
    const start = Math.max(0, m.index - 100);
    const end = Math.min(body.length, m.index + 100);
    let ctx = body
      .slice(start, end)
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    samples.push({ f, ctx });
  }
}

console.log('TOTAL', total, '(frontmatter strings:', inFm, '/ markup+body:', inBody, ')');
console.log('BY_FILE');
byFile
  .filter((x) => x.n)
  .sort((a, b) => b.n - a.n)
  .forEach((x) =>
    console.log(`${String(x.n).padStart(3)} (${x.fmN}fm/${x.bodyN}body) ${x.f}`),
  );

// concat scan
console.log('CONCAT');
for (const f of files) {
  const src = fs.readFileSync(path.join(dir, f), 'utf8');
  const text = src.replace(/<[^>]+>/g, ' ');
  const hits = text.match(/\$[0-9,]+[A-Za-z]+/g);
  if (hits) console.log(f, hits);
}
console.log('concat done');

// print unique-ish samples for proposal
const pick = [
  'program\'s rules — including',
  'standard amount — see our',
  'timing — what',
  'categories — including rural',
  'factor — not the only',
  'package — including applications',
  'remembered number — check',
  'if a green card is the goal — by a separate',
  'tolerance — review with',
  'outside the United States — for example',
];
for (const p of pick) {
  const hit = samples.find((s) => s.ctx.includes(p.split('—')[0].slice(0, 20)));
}
