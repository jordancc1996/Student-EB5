import fs from 'fs';
import path from 'path';

const dir = 'src/pages/pathways';
let fixed = 0;

for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.astro'))) {
  const fp = path.join(dir, file);
  let src = fs.readFileSync(fp, 'utf8');
  const next = src.replace(
    /heroImageAlt="EB-5 pathway: EB 5 /g,
    'heroImageAlt="EB-5 pathway: EB-5 ',
  );
  if (next !== src) {
    fs.writeFileSync(fp, next);
    fixed++;
    console.log('fixed', file);
  }
}

console.log({ fixed });
