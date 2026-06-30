import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

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

async function gotoTool() {
  consoleErrors.length = 0;
  pageErrors.length = 0;
  await page.goto(`${BASE}/tools/source-of-funds-calculator`, {
    waitUntil: 'networkidle',
    timeout: 60000,
  });
  await page.waitForTimeout(1500);
}

async function selectTaxStatus(label) {
  await page.locator('#taxStatus').click();
  await page.getByRole('option', { name: label }).click();
  await page.waitForTimeout(200);
}

async function fillStep2({ costBasis, currentValue, ira, heloc }) {
  await page.locator('#costBasis').fill(String(costBasis));
  await page.locator('#currentValue').fill(String(currentValue));
  await page.locator('#iraBalance').fill(String(ira));
  await page.locator('#helocAmount').fill(String(heloc));
  await page.waitForTimeout(200);
}

async function readCosts() {
  const cards = page.locator('.grid.md\\:grid-cols-3.gap-4 .bg-background.rounded-lg.p-4.border');
  const texts = await cards.allTextContents();
  const brokerage = texts[0]?.match(/\$[\d,]+/)?.[0] ?? 'MISSING';
  const ira = texts[1]?.match(/\$[\d,]+/)?.[0] ?? 'MISSING';
  const heloc = texts[2]?.match(/\$[\d,]+/)?.[0] ?? 'MISSING';
  const optimal = (await page.locator('h4.text-lg.font-semibold span.text-primary').textContent())?.trim() ?? 'MISSING';
  return { brokerage, ira, heloc, optimal };
}

// Step 2: hydration
await gotoTool();
const islandEls = page.locator('astro-island');
const islandCount = await islandEls.count();
const islands = [];
for (let i = 0; i < islandCount; i++) {
  const el = islandEls.nth(i);
  const client = (await el.getAttribute('client')) ?? '(none)';
  const url = (await el.getAttribute('component-url')) ?? '';
  const name = url.split('/').pop()?.replace(/\.tsx$/, '').replace(/\.js$/, '') ?? `island-${i}`;
  islands.push({ name, client });
}
const hydration = hydrationIssues([...consoleErrors, ...pageErrors]);
const expected = ['Header', 'Breadcrumb', 'SourceOfFundsCalculatorMainContent', 'Footer'];
const missing = expected.filter((n) => !islands.some((i) => i.name.toLowerCase().includes(n.toLowerCase())));
results.push({
  step: '2-hydration-islands',
  ok: hydration.length === 0 && missing.length === 0,
  detail: JSON.stringify({ consoleErrors: consoleErrors.length ? consoleErrors : 'none', hydrationIssues: hydration.length ? hydration : 'none', islands, missing: missing.length ? missing : 'none' }),
});

// Step 3a-b: Resident scenario
await gotoTool();
await selectTaxStatus('H-1B, L-1, or F-1 (In US more than 5 years)');
await page.getByRole('button', { name: /Next: Assets/ }).click();
await page.waitForTimeout(300);
await fillStep2({ costBasis: 300000, currentValue: 500000, ira: 400000, heloc: 800000 });
await page.getByRole('button', { name: /View Results/ }).click();
await page.waitForTimeout(400);
const resident = await readCosts();
const residentOk =
  resident.brokerage === '$40,000' &&
  resident.ira === '$140,000' &&
  resident.heloc === '$68,000' &&
  resident.optimal === 'Brokerage';
results.push({
  step: '3-resident-costs',
  ok: residentOk,
  detail: JSON.stringify({ taxStatus: 'resident', displayed: resident, expected: { brokerage: '$40,000', ira: '$140,000', heloc: '$68,000', optimal: 'Brokerage' } }),
});

// Step 3d: NRA — back to step 1
await page.getByRole('button', { name: /Back to Assets/ }).click();
await page.waitForTimeout(200);
await page.getByRole('button', { name: /Back/ }).first().click();
await page.waitForTimeout(200);
await selectTaxStatus('F-1 Student / OPT (In US less than 5 years)');
await page.getByRole('button', { name: /Next: Assets/ }).click();
await page.waitForTimeout(300);
await fillStep2({ costBasis: 300000, currentValue: 500000, ira: 400000, heloc: 800000 });
await page.getByRole('button', { name: /View Results/ }).click();
await page.waitForTimeout(400);
const nra = await readCosts();
const nraOk =
  nra.brokerage === '$60,000' &&
  nra.ira === '$140,000' &&
  nra.heloc === '$68,000' &&
  nra.optimal === 'Brokerage';
results.push({
  step: '3d-nra-costs',
  ok: nraOk,
  detail: JSON.stringify({ taxStatus: 'nra', displayed: nra, expected: { brokerage: '$60,000', ira: '$140,000', heloc: '$68,000', optimal: 'Brokerage' } }),
});

// Step 4: Collapsible
const trigger = page.getByText('View the math behind this strategy');
const collapsedBefore = !(await page.locator('text=Capital Gain = Current Value - Cost Basis').isVisible());
await trigger.click();
await page.waitForTimeout(300);
const expandedVisible = await page.locator('text=Capital Gain = Current Value - Cost Basis').isVisible();
const nraTaxLine = (await page.locator('text=Tax = Gain ×').textContent())?.trim();
await trigger.click();
await page.waitForTimeout(300);
const collapsedAfter = !(await page.locator('text=Capital Gain = Current Value - Cost Basis').isVisible());
results.push({
  step: '4-collapsible-math',
  ok: collapsedBefore && expandedVisible && collapsedAfter && nraTaxLine?.includes('30%'),
  detail: JSON.stringify({ collapsedBefore, expandedVisible, collapsedAfter, nraTaxLine }),
});

// Step 7: legacy redirect
consoleErrors.length = 0;
pageErrors.length = 0;
const redirectResp = await page.goto(`${BASE}/guides/source-of-funds-strategies`, {
  waitUntil: 'networkidle',
  timeout: 60000,
});
const finalUrl = page.url();
results.push({
  step: '7-legacy-redirect',
  ok: finalUrl.includes('/tools/source-of-funds-calculator'),
  detail: `status=${redirectResp?.status()} finalUrl=${finalUrl}`,
});

await browser.close();

// Step 6: dist check
const distFile = path.join('dist', 'tools', 'source-of-funds-calculator', 'index.html');
let distResult = null;
if (fs.existsSync(distFile)) {
  const html = fs.readFileSync(distFile, 'utf8');
  const attrPattern = /(?:src|href)=["']([^"']*(?:\/@fs\/|\/src\/assets\/)[^"']*)["']/g;
  const badPaths = [...html.matchAll(attrPattern)].map((m) => m[1]);
  distResult = {
    exists: true,
    hasAtFs: html.includes('/@fs/'),
    badAttrPaths: badPaths,
    clean: badPaths.length === 0 && !html.includes('/@fs/'),
  };
}

console.log(`\n=== Source of Funds Calculator Verification ===`);
console.log(`Mode: ${MODE} @ ${BASE}\n`);
let failed = 0;
for (const r of results) {
  const mark = r.ok ? 'PASS' : 'FAIL';
  if (!r.ok) failed++;
  console.log(`${mark} | ${r.step}`);
  console.log(`     ${r.detail}\n`);
}
if (distResult) {
  const mark = distResult.clean ? 'PASS' : 'FAIL';
  if (!distResult.clean) failed++;
  console.log(`${mark} | 6-dist-dev-paths`);
  console.log(`     ${JSON.stringify(distResult)}\n`);
} else {
  console.log(`SKIP | 6-dist-dev-paths — run after build\n`);
}
process.exit(failed > 0 ? 1 : 0);
