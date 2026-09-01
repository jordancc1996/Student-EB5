import fs from 'fs';
import path from 'path';

function walk(dir, acc = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, acc);
    else if (ent.name.endsWith('.astro')) acc.push(p);
  }
  return acc;
}

const importLine = "import PreferredSourcesCTA from '@/components/PreferredSourcesCTA.astro';\n";
const fixed = [];

for (const fp of walk('src')) {
  let src = fs.readFileSync(fp, 'utf8');
  if (!/<PreferredSourcesCTA\b/.test(src)) continue;
  if (src.includes("from '@/components/PreferredSourcesCTA.astro'")) continue;

  const siteFooter = "import SiteFooter from '@/components/SiteFooter.astro';\n";
  const header = "import Header from '@/components/Header';\n";
  if (src.includes(siteFooter)) {
    src = src.replace(siteFooter, siteFooter + importLine);
  } else if (src.includes(header)) {
    src = src.replace(header, header + importLine);
  } else {
    src = src.replace(/^---\n/, `---\n${importLine}`);
  }
  fs.writeFileSync(fp, src);
  fixed.push(fp);
}

console.log(fixed.length ? fixed.join('\n') : 'none needed');
