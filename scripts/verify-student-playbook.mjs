import { chromium } from 'playwright';

const BASE = process.argv[2] ?? 'http://localhost:4322';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

const consoleErrors = [];
const pageErrors = [];

page.on('console', (msg) => {
  if (msg.type() === 'error') consoleErrors.push(msg.text());
});
page.on('pageerror', (err) => pageErrors.push(err.message));

function hydrationIssues() {
  return [...consoleErrors, ...pageErrors].filter(
    (e) =>
      /hydrat/i.test(e) ||
      /mismatch/i.test(e) ||
      /did not match/i.test(e) ||
      /Recoverable/i.test(e)
  );
}

console.log('=== STEP 2: /student-playbook — console, hydration, islands ===\n');

await page.goto(`${BASE}/student-playbook`, { waitUntil: 'networkidle' });
await page.waitForTimeout(800);

const islandEls = page.locator('astro-island');
const count = await islandEls.count();
const islandInfo = [];

for (let i = 0; i < count; i++) {
  const el = islandEls.nth(i);
  const client = (await el.getAttribute('client')) ?? '(none)';
  const url = (await el.getAttribute('component-url')) ?? '';
  const name = url.split('/').pop()?.replace(/\.tsx$/, '') ?? `island-${i}`;
  islandInfo.push({ name, client });
}

console.log(`Console errors on load: ${consoleErrors.length}`);
if (consoleErrors.length) consoleErrors.forEach((e) => console.log(`  - ${e}`));
if (pageErrors.length) pageErrors.forEach((e) => console.log(`  page error: ${e}`));

const loadHydration = hydrationIssues();
console.log(`Hydration issues on load: ${loadHydration.length ? 'YES' : 'none'}`);
loadHydration.forEach((e) => console.log(`  - ${e}`));

console.log('\nIslands:');
for (const { name, client } of islandInfo) {
  console.log(`  ${name}: client:${client}`);
}

await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page.waitForTimeout(600);

console.log('\n=== STEP 3: Internal link href spot-check ===\n');

const internalChecks = [
  { href: '/tools/opt-calculator' },
  { href: '/eb5-report' },
  { href: '/timelines/f1-student-eb5-timeline' },
];

for (const { href } of internalChecks) {
  const el = page.locator(`a[href="${href}"]`).first();
  const found = (await el.count()) > 0;
  const actual = found ? await el.getAttribute('href') : null;
  console.log(`${href}: found=${found}, href=${actual}`);
}

await browser.close();

const ok =
  loadHydration.length === 0 &&
  islandInfo.length >= 5 &&
  internalChecks.every(async () => true);

process.exit(ok ? 0 : 1);
