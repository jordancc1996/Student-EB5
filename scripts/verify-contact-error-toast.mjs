import { chromium } from 'playwright';

const BASE = process.argv[2] ?? 'http://localhost:4321';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

const consoleErrors = [];
const pageErrors = [];

page.on('console', (msg) => {
  if (msg.type() === 'error') consoleErrors.push(msg.text());
});
page.on('pageerror', (err) => pageErrors.push(err.message));

const testFirst = 'ErrorBranch';
const testLast = 'Test';
const testEmail = 'error.branch@example.com';

async function fillAndSubmit() {
  await page.locator('#firstName').fill(testFirst);
  await page.locator('#lastName').fill(testLast);
  await page.locator('#email').fill(testEmail);
  await page.getByRole('button', { name: 'Start My Journey' }).click();
}

function getErrorToast() {
  return page.locator('[role="status"], [data-state="open"]').filter({
    hasText: 'Something went wrong',
  });
}

console.log('=== ERROR TOAST BRANCH (mocked Formcarry 500) ===\n');

await page.route('**/formcarry.com/**', (route) =>
  route.fulfill({ status: 500, contentType: 'application/json', body: '{"error":"mock failure"}' })
);

await page.goto(`${BASE}/contact`, { waitUntil: 'networkidle' });
await page.waitForTimeout(500);

consoleErrors.length = 0;
pageErrors.length = 0;

await fillAndSubmit();
await page.waitForTimeout(1200);

const errorToast = getErrorToast();
const errorVisible = (await errorToast.count()) > 0;
const errorText = errorVisible ? await errorToast.first().textContent() : '';

const successHeading = page.getByRole('heading', { name: `Thank You, ${testFirst}!` });
const successVisible = await successHeading.isVisible().catch(() => false);

const formVisible = await page.getByRole('button', { name: 'Start My Journey' }).isVisible();
const firstNameValue = await page.locator('#firstName').inputValue();

console.log('1. Mocked Formcarry returns 500: configured via Playwright route');
console.log(`2. Submitted valid fields (${testFirst}, ${testLast}, ${testEmail})`);
console.log(`3. Error toast visible: ${errorVisible ? 'YES' : 'NO'}`);
console.log(`   Title "Something went wrong": ${errorText.includes('Something went wrong')}`);
console.log(
  `   Description "Please try again or contact us directly.": ${errorText.includes('Please try again or contact us directly.')}`
);
console.log(`4. Success state NOT shown: ${successVisible ? 'FAIL (shown)' : 'PASS'}`);
console.log(`   Page errors: ${pageErrors.length}, console errors: ${consoleErrors.length}`);
if (pageErrors.length) pageErrors.forEach((e) => console.log(`     page: ${e}`));
if (consoleErrors.length) consoleErrors.forEach((e) => console.log(`     console: ${e}`));
console.log(`5. Form still usable after error:`);
console.log(`   Submit button visible: ${formVisible}`);
console.log(`   firstName value retained: "${firstNameValue}" (${firstNameValue === testFirst ? 'PASS' : 'FAIL'})`);

// Resubmit attempt while mock still active — should show error again, not lock up
await page.getByRole('button', { name: 'Start My Journey' }).click();
await page.waitForTimeout(800);
const errorStillWorks = (await getErrorToast().count()) > 0;
console.log(`   Resubmit after error (mock still active): toast fires again: ${errorStillWorks ? 'YES' : 'NO'}`);

const mockPhaseOk =
  errorVisible &&
  errorText.includes('Something went wrong') &&
  errorText.includes('Please try again or contact us directly.') &&
  !successVisible &&
  pageErrors.length === 0 &&
  formVisible &&
  firstNameValue === testFirst &&
  errorStillWorks;

console.log(`\nMock phase: ${mockPhaseOk ? 'PASS' : 'FAIL'}`);

// Part 2: remove mock, confirm real Formcarry works
console.log('\n=== REAL FORMCARRY (mock removed) ===\n');

await page.unroute('**/formcarry.com/**');
await page.goto(`${BASE}/contact`, { waitUntil: 'networkidle' });
await page.waitForTimeout(500);

consoleErrors.length = 0;
pageErrors.length = 0;

let formcarryStatus = null;
page.on('response', (resp) => {
  if (resp.url().includes('formcarry.com')) formcarryStatus = resp.status();
});

await fillAndSubmit();
await page.waitForTimeout(3000);

const realSuccess = await page
  .getByRole('heading', { name: `Thank You, ${testFirst}!` })
  .isVisible()
  .catch(() => false);
const realEmailInBody = (await page.locator('main').textContent())?.includes(testEmail);

console.log(`Formcarry response status: ${formcarryStatus ?? 'no request'}`);
console.log(`Success state after mock removed: ${realSuccess ? 'YES' : 'NO'}`);
console.log(`Email in success body: ${realEmailInBody ? 'YES' : 'NO'}`);
console.log(`Page/console errors: ${pageErrors.length}/${consoleErrors.length}`);

const realPhaseOk = formcarryStatus === 200 && realSuccess && realEmailInBody;

console.log(`\nReal submission phase: ${realPhaseOk ? 'PASS' : 'FAIL'}`);
console.log(`\nOVERALL: ${mockPhaseOk && realPhaseOk ? 'PASS' : 'FAIL'}`);

await browser.close();
process.exit(mockPhaseOk && realPhaseOk ? 0 : 1);
