import { chromium } from 'playwright';

const BASE = process.argv[2] ?? 'http://localhost:4322';
const BOGUS_PATH = '/this-page-does-not-exist-xyz123';
const BOGUS_URL = `${BASE}${BOGUS_PATH}`;

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

const consoleMessages = [];
const pageErrors = [];

page.on('console', (msg) => {
  consoleMessages.push({ type: msg.type(), text: msg.text() });
});
page.on('pageerror', (err) => pageErrors.push(err.message));

function hydrationIssues() {
  return [...consoleMessages.filter((m) => m.type === 'error'), ...pageErrors].filter(
    (e) => {
      const text = typeof e === 'string' ? e : e.text;
      return (
        /hydrat/i.test(text) ||
        /mismatch/i.test(text) ||
        /did not match/i.test(text) ||
        /Recoverable/i.test(text)
      );
    }
  );
}

console.log(`=== 404 verification @ ${BASE} ===\n`);
console.log(`Bogus URL: ${BOGUS_URL}\n`);

const response = await page.goto(BOGUS_URL, { waitUntil: 'networkidle' });
await page.waitForTimeout(800);

const status = response?.status();
const h1Text = await page.locator('h1').first().textContent().catch(() => null);
const h2Text = await page.locator('h2').first().textContent().catch(() => null);
const page404Visible = h1Text?.trim() === '404' && h2Text?.includes('Page Not Found');

console.log('Step 2 — 404 page renders:');
console.log(`  HTTP status: ${status}`);
console.log(`  h1: "${h1Text?.trim()}"`);
console.log(`  h2: "${h2Text?.trim()}"`);
console.log(`  404 UI visible: ${page404Visible ? 'YES' : 'NO'}`);

const log404 = consoleMessages.find((m) => m.text.includes('404 Error: User attempted to access non-existent route:'));
console.log('\nStep 3 — console.error log:');
if (log404) {
  console.log(`  found: YES`);
  console.log(`  message: ${log404.text}`);
  console.log(`  path matches ${BOGUS_PATH}: ${log404.text.includes(BOGUS_PATH) ? 'YES' : 'NO'}`);
} else {
  console.log('  found: NO');
  console.log('  console messages:', consoleMessages.map((m) => `[${m.type}] ${m.text}`).join('\n    '));
}

const islandEls = page.locator('astro-island');
const count = await islandEls.count();
console.log('\nStep 4 — islands & hydration:');
for (let i = 0; i < count; i++) {
  const el = islandEls.nth(i);
  const client = (await el.getAttribute('client')) ?? '(none)';
  const url = (await el.getAttribute('component-url')) ?? '';
  const name = url.split('/').pop()?.replace(/\.tsx$/, '') ?? `island-${i}`;
  console.log(`  ${name}: client:${client}`);
}
const hydr = hydrationIssues();
console.log(`  hydration issues: ${hydr.length ? 'YES' : 'none'}`);
hydr.forEach((h) => console.log(`    - ${typeof h === 'string' ? h : h.text}`));

console.log('\nStep 5 — link navigation:');

await page.goto(BOGUS_URL, { waitUntil: 'networkidle' });
await page.waitForTimeout(500);

await page.getByRole('link', { name: 'Return to Home' }).click();
await page.waitForURL('**/');
const homeOk = page.url().replace(/\/$/, '').endsWith(BASE.replace(/\/$/, '')) || page.url().endsWith('/');
console.log(`  Return to Home → ${page.url()} : ${homeOk ? 'PASS' : 'FAIL'}`);

await page.goto(BOGUS_URL, { waitUntil: 'networkidle' });
await page.getByRole('link', { name: 'Contact Us' }).click();
await page.waitForURL('**/contact**');
const contactOk = page.url().includes('/contact');
console.log(`  Contact Us → ${page.url()} : ${contactOk ? 'PASS' : 'FAIL'}`);

await page.goto(BOGUS_URL, { waitUntil: 'networkidle' });
const popularSection = page.getByText('Popular pages you might be looking for:').locator('..');
await popularSection.getByRole('link', { name: 'Research' }).click();
await page.waitForURL('**/research**');
const researchOk = page.url().includes('/research');
console.log(`  Research (popular link) → ${page.url()} : ${researchOk ? 'PASS' : 'FAIL'}`);

await browser.close();

const pass =
  page404Visible &&
  log404 &&
  log404.text.includes(BOGUS_PATH) &&
  hydr.length === 0 &&
  homeOk &&
  contactOk &&
  researchOk;

process.exit(pass ? 0 : 1);
