import { chromium } from 'playwright';

const BASE = process.argv[2] ?? 'http://localhost:4321';
const MODE = process.argv[3] ?? 'dev';

function hydrationIssues(errors) {
  return errors.filter(
    (e) =>
      /hydrat/i.test(e) ||
      /mismatch/i.test(e) ||
      /did not match/i.test(e) ||
      /Recoverable/i.test(e) ||
      /astro-island/i.test(e)
  );
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const consoleErrors = [];
const pageErrors = [];

page.on('console', (msg) => {
  if (msg.type() === 'error') consoleErrors.push(msg.text());
});
page.on('pageerror', (err) => pageErrors.push(String(err)));

const results = [];

async function checkPage(url, label) {
  consoleErrors.length = 0;
  pageErrors.length = 0;
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(1500);

  const hydration = hydrationIssues([...consoleErrors, ...pageErrors]);
  results.push({ label: `${label} — console/hydration`, ok: hydration.length === 0, detail: hydration.join(' | ') || 'clean' });

  const breadcrumb = page.locator('nav[aria-label="Breadcrumb"]');
  const breadcrumbText = (await breadcrumb.innerText()).replace(/\s+/g, ' ').trim();
  const toolsLink = breadcrumb.locator('a', { hasText: 'Tools' });
  const toolsHref = (await toolsLink.count()) > 0 ? await toolsLink.getAttribute('href') : null;
  const breadcrumbOk =
    breadcrumbText.includes('Home') &&
    breadcrumbText.includes('Tools') &&
    breadcrumbText.includes('Grandfathering Countdown') &&
    toolsHref === '/eb5-investment-immigration-tools';
  results.push({
    label: `${label} — breadcrumb`,
    ok: breadcrumbOk,
    detail: `text="${breadcrumbText}" toolsHref=${toolsHref}`,
  });

  const secondsEl = page.locator('nav[aria-label="Breadcrumb"]').locator('..').locator('..').locator('text=Seconds').locator('..').locator('div').first();
  // Countdown: find the 4th digit box (Seconds column)
  const digitBoxes = page.locator('.bg-foreground.text-background .text-3xl');
  const count = await digitBoxes.count();
  const secondsBefore = count >= 4 ? await digitBoxes.nth(3).innerText() : 'MISSING';
  await page.waitForTimeout(2500);
  const secondsAfter = count >= 4 ? await digitBoxes.nth(3).innerText() : 'MISSING';
  const tickOk = count === 4 && secondsBefore !== 'MISSING' && secondsAfter !== secondsBefore;
  results.push({
    label: `${label} — countdown tick`,
    ok: tickOk,
    detail: `boxes=${count} seconds ${secondsBefore} -> ${secondsAfter}`,
  });

  const h1 = await page.locator('h1').first().innerText();
  results.push({
    label: `${label} — h1`,
    ok: h1 === 'Grandfathering Deadline Countdown',
    detail: h1,
  });

  return { hydration, breadcrumbOk, tickOk };
}

// Main page
await checkPage(`${BASE}/tools/grandfathering-countdown`, MODE);

// Legacy redirect
consoleErrors.length = 0;
pageErrors.length = 0;
const redirectResponse = await page.goto(`${BASE}/grandfathering-countdown`, {
  waitUntil: 'networkidle',
  timeout: 60000,
});
const finalUrl = page.url();
const redirectOk = finalUrl.includes('/tools/grandfathering-countdown');
results.push({
  label: `${MODE} — legacy redirect`,
  ok: redirectOk,
  detail: `status=${redirectResponse?.status()} finalUrl=${finalUrl}`,
});

await browser.close();

let failed = 0;
for (const r of results) {
  const mark = r.ok ? 'PASS' : 'FAIL';
  if (!r.ok) failed++;
  console.log(`[${mark}] ${r.label}: ${r.detail}`);
}
process.exit(failed > 0 ? 1 : 0);
