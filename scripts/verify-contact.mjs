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

console.log('=== STEP 2: /contact — console, hydration, islands ===\n');

await page.goto(`${BASE}/contact`, { waitUntil: 'networkidle' });
await page.waitForTimeout(800);

const islandEls = page.locator('astro-island');
const count = await islandEls.count();
const islandInfo = [];

for (let i = 0; i < count; i++) {
  const el = islandEls.nth(i);
  const client = (await el.getAttribute('client')) ?? '(none)';
  const url = (await el.getAttribute('component-url')) ?? '';
  const name = url.split('/').pop()?.replace(/\.tsx$/, '') ?? `island-${i}`;
  islandInfo.push({ name, client, url });
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

console.log('\n=== STEP 3: Interactive form flow ===\n');

// 3a — validation toast (bypass native required to hit JS branch)
consoleErrors.length = 0;
pageErrors.length = 0;

await page.goto(`${BASE}/contact`, { waitUntil: 'networkidle' });
await page.waitForTimeout(500);

await page.evaluate(() => {
  document.querySelectorAll('input[required]').forEach((el) => el.removeAttribute('required'));
});
await page.getByRole('button', { name: 'Start My Journey' }).click();
await page.waitForTimeout(800);

const validationToast = page.locator('[role="status"], [data-state="open"]').filter({
  hasText: 'Please fill in required fields',
});
const validationVisible = await validationToast.count();
console.log('3a Validation toast (empty required fields):');
console.log(`  destructive toast visible: ${validationVisible > 0 ? 'YES' : 'NO'}`);
if (validationVisible > 0) {
  const text = await validationToast.first().textContent();
  console.log(`  text includes "First name, last name, and email are required": ${text?.includes('First name, last name, and email are required')}`);
}

// 3b — success submit
consoleErrors.length = 0;
pageErrors.length = 0;

await page.goto(`${BASE}/contact`, { waitUntil: 'networkidle' });
await page.waitForTimeout(500);

const testFirst = 'VerifyTest';
const testLast = 'User';
const testEmail = 'verify.test@example.com';

await page.locator('#firstName').fill(testFirst);
await page.locator('#lastName').fill(testLast);
await page.locator('#email').fill(testEmail);

let formcarryStatus = null;
page.on('response', (resp) => {
  if (resp.url().includes('formcarry.com')) formcarryStatus = resp.status();
});

await page.getByRole('button', { name: 'Start My Journey' }).click();
await page.waitForTimeout(3000);

const successHeading = page.getByRole('heading', { name: `Thank You, ${testFirst}!` });
const successVisible = await successHeading.isVisible().catch(() => false);

console.log('\n3b Form submit (Formcarry POST):');
console.log(`  Formcarry response status: ${formcarryStatus ?? 'no request observed'}`);

let submitOutcomeOk = false;

if (successVisible) {
  console.log('  outcome: SUCCESS state rendered');
  console.log(`  heading "Thank You, ${testFirst}!": YES`);
  const bodyText = await page.locator('main').textContent();
  console.log(`  submitted email "${testEmail}" in body: ${bodyText?.includes(testEmail)}`);
  submitOutcomeOk = true;
} else {
  const errorToast = page.locator('[role="status"], [data-state="open"]').filter({
    hasText: 'Something went wrong',
  });
  const errorVisible = (await errorToast.count()) > 0;
  console.log('  outcome: success state NOT shown');
  console.log(`  error toast "Something went wrong": ${errorVisible ? 'YES' : 'NO'}`);
  if (errorVisible) {
    const text = await errorToast.first().textContent();
    console.log(`  includes "Please try again or contact us directly": ${text?.includes('Please try again or contact us directly')}`);
    submitOutcomeOk = true;
  }
  if (consoleErrors.length || pageErrors.length) {
    console.log('  console/page errors after submit:');
    [...consoleErrors, ...pageErrors].forEach((e) => console.log(`    - ${e}`));
  }
}

const finalHydration = hydrationIssues();
console.log(`\nHydration issues after interactions: ${finalHydration.length ? 'YES' : 'none'}`);
finalHydration.forEach((e) => console.log(`  - ${e}`));

await browser.close();

const failed =
  loadHydration.length > 0 ||
  finalHydration.length > 0 ||
  validationVisible === 0 ||
  !submitOutcomeOk;

process.exit(failed ? 1 : 0);
