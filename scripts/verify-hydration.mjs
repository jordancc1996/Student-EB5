import { chromium } from 'playwright';

const BASE = process.argv[2] ?? 'http://localhost:4322';

const defaultPaths = [
  '/research',
  '/research/regional-center-shutdown-eb5-investor-protections',
  '/research/f1-students/f1-to-eb5-green-card',
  '/research/investment/eb5-pre-investment-checklist-part-1-f1-h1b',
  '/research/comparisons/h1b-vs-eb5-lifetime-cost-indian-chinese-students',
  '/research/complete-2027-eb5-guide',
];

const paths = process.argv.length > 3 ? process.argv.slice(3) : defaultPaths;

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

const consoleErrors = [];
const pageErrors = [];

page.on('console', (msg) => {
  if (msg.type() === 'error') consoleErrors.push(msg.text());
});
page.on('pageerror', (err) => pageErrors.push(err.message));

console.log(`=== BROWSER HYDRATION CHECK (${BASE}) ===\n`);
let failed = 0;

for (const p of paths) {
  consoleErrors.length = 0;
  pageErrors.length = 0;

  await page.goto(`${BASE}${p}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  const islands = await page.locator('astro-island').count();
  const hydrated = await page.locator('astro-island[client="load"], astro-island[client="visible"], astro-island[client="idle"]').count();

  const hydrationLike = [...consoleErrors, ...pageErrors].filter(
    (e) =>
      /hydrat/i.test(e) ||
      /mismatch/i.test(e) ||
      /did not match/i.test(e) ||
      /Recoverable/i.test(e)
  );

  console.log(p);
  console.log(`  islands: ${islands} | console errors: ${consoleErrors.length} | page errors: ${pageErrors.length}`);
  if (hydrationLike.length) {
    failed++;
    console.log('  HYDRATION ISSUES:');
    hydrationLike.forEach((e) => console.log('   -', e));
  } else if (consoleErrors.length || pageErrors.length) {
    console.log('  other errors:');
    [...consoleErrors, ...pageErrors].forEach((e) => console.log('   -', e));
  } else {
    console.log('  hydration: clean');
  }
  console.log('');
}

await browser.close();
process.exit(failed > 0 ? 1 : 0);
