import fs from 'fs';
import path from 'path';

const dir = 'src/pages/pathways';
const files = fs
  .readdirSync(dir)
  .filter((f) => f.endsWith('.astro'))
  .filter((f) =>
    fs.readFileSync(path.join(dir, f), 'utf8').includes('PathwayLandingLayout'),
  );

const all = [];
for (const f of files.sort()) {
  const src = fs.readFileSync(path.join(dir, f), 'utf8');
  const re = /—/g;
  let m;
  while ((m = re.exec(src))) {
    const lineStart = src.lastIndexOf('\n', m.index) + 1;
    const lineEnd = src.indexOf('\n', m.index);
    const line = src.slice(lineStart, lineEnd === -1 ? src.length : lineEnd);
    const lineNo = src.slice(0, m.index).split('\n').length;
    all.push({
      f,
      lineNo,
      idx: m.index,
      line: line.trim(),
      before: src.slice(Math.max(0, m.index - 60), m.index).replace(/\s+/g, ' '),
      after: src.slice(m.index + 1, m.index + 61).replace(/\s+/g, ' '),
    });
  }
}
fs.writeFileSync('scripts/emdash-inventory.json', JSON.stringify(all, null, 2));
console.log(all.length);
