const BASE = process.argv[2] ?? 'http://localhost:4321';

const paths = [
  '/research',
  '/research/regional-center-shutdown-eb5-investor-protections',
  '/research/f1-students/f1-to-eb5-green-card',
  '/research/investment/eb5-pre-investment-checklist-part-1-f1-h1b',
  '/research/comparisons/h1b-vs-eb5-lifetime-cost-indian-chinese-students',
  '/research/complete-2027-eb5-guide',
];

function checkHtml(path, html) {
  const issues = [];
  if (!html.includes('<!DOCTYPE html>') && !html.includes('<html')) {
    issues.push('missing html doctype/root');
  }
  if (html.includes('/@fs/')) issues.push('contains /@fs/ dev path');
  if (html.match(/(?:src|href)=["']\/src\/assets\//)) {
    issues.push('contains /src/assets/ in src/href');
  }
  const islandCount = (html.match(/astro-island/g) ?? []).length;
  const relatedMatch = html.match(/Related Articles[\s\S]*?<\/section>/);
  let relatedCount = 0;
  if (relatedMatch) {
    relatedCount = (relatedMatch[0].match(/href="\/research\//g) ?? []).length;
  }
  return { status: 'ok', islandCount, relatedCount, issues };
}

console.log(`=== HTTP CHECK (${BASE}) ===\n`);
let failed = 0;

for (const p of paths) {
  const url = `${BASE}${p}`;
  try {
    const res = await fetch(url);
    const html = await res.text();
    const result = checkHtml(p, html);
    if (!res.ok) {
      result.status = 'HTTP ' + res.status;
      failed++;
    }
    if (result.issues.length) failed++;
    console.log(`${p}`);
    console.log(`  HTTP: ${res.status} | islands: ${result.islandCount} | related links: ${result.relatedCount}`);
    if (result.issues.length) console.log(`  ISSUES: ${result.issues.join(', ')}`);
    else console.log('  ISSUES: none');
    console.log('');
  } catch (err) {
    failed++;
    console.log(`${p}`);
    console.log(`  FETCH ERROR: ${err.message}\n`);
  }
}

process.exit(failed > 0 ? 1 : 0);
