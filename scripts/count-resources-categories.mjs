import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const require = createRequire(import.meta.url);

// Reference: parse by evaluating the array literal from the TSX file via regex extraction
const refPath = path.resolve(
  '../student-visa-launchpad-REFERENCE/src/pages/Resources.tsx'
);
const migratedPath = path.resolve('src/components/ResourcesMainContent.tsx');

function extractCounts(filePath, label) {
  const src = require('fs').readFileSync(filePath, 'utf8');
  const block = src.match(/const resourceCategories[^=]*=\s*\[([\s\S]*?)\n\s*\];/)?.[1] ?? '';
  const categoryCount = (block.match(/^\s+title:/gm) ?? []).length;
  const itemCount = (block.match(/^\s+name:/gm) ?? []).length;
  console.log(`${label}:`);
  console.log(`  resourceCategories.length = ${categoryCount}`);
  console.log(`  total items = ${itemCount}`);
  console.log('');
  return { categoryCount, itemCount };
}

const ref = extractCounts(refPath, 'REFERENCE Resources.tsx');
const mig = extractCounts(migratedPath, 'STUDENT-EB5 ResourcesMainContent.tsx');
console.log(
  `MATCH: ${ref.categoryCount === mig.categoryCount && ref.itemCount === mig.itemCount ? 'YES' : 'NO'}`
);
process.exit(ref.categoryCount === mig.categoryCount && ref.itemCount === mig.itemCount ? 0 : 1);
