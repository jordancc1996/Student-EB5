import { chromium } from 'playwright';
import fs from 'node:fs';

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

function log(step, detail) {
  console.log(`[${step}] ${detail}`);
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const consoleErrors = [];
const pageErrors = [];

page.on('console', (msg) => {
  if (msg.type() === 'error') consoleErrors.push(msg.text());
});
page.on('pageerror', (err) => pageErrors.push(String(err)));

async function gotoTool() {
  consoleErrors.length = 0;
  pageErrors.length = 0;
  await page.goto(`${BASE}/tools/opt-calculator`, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(1500);
}

async function readTimelineDates() {
  const boldDates = await page.locator('.font-bold.text-lg.text-foreground').allTextContents();
  return boldDates.map((t) => t.trim()).filter(Boolean);
}

async function readProgramEndDate() {
  return page.locator('input[type="date"]').first().inputValue();
}

async function readDaysUsed() {
  const text = await page.locator('text=days used of 365').textContent();
  const m = text?.match(/Total:\s*(\d+)/);
  return m ? parseInt(m[1], 10) : null;
}

async function readDaysAvailable() {
  const text = await page.locator('text=You have a total of').first().textContent();
  const m = text?.match(/total of\s*(\d+)/i);
  return m ? parseInt(m[1], 10) : null;
}

const results = [];

// --- Step 2: hydration (after initial load) ---
await gotoTool();
const hydration = hydrationIssues([...consoleErrors, ...pageErrors]);
results.push({
  step: '2-hydration',
  ok: hydration.length === 0,
  detail: hydration.length ? hydration.join(' | ') : 'clean — Header, Breadcrumb, OPTCalculatorMainContent, Footer',
});

// --- Step 3a: Fall 2026 ---
// select[0]=levelStudy, select[1]=term, select[2]=year
await page.locator('select').nth(1).selectOption('fall');
await page.locator('select').nth(2).selectOption('2026');
await page.waitForTimeout(300);

const pedA = await readProgramEndDate();
const timelineA = await readTimelineDates();
// Timeline order: earliestApply, PED, latestApply, PED, earliestStart, latestStart
const a = {
  programEndDate: pedA,
  earliestApply: timelineA[0] ?? 'MISSING',
  programCompletion1: timelineA[1] ?? 'MISSING',
  latestApply: timelineA[2] ?? 'MISSING',
  programCompletion2: timelineA[3] ?? 'MISSING',
  earliestStart: timelineA[4] ?? 'MISSING',
  latestStart: timelineA[5] ?? 'MISSING',
};
const aOk = pedA === '2026-12-19' && timelineA.length >= 6;
results.push({ step: '3a-fall-2026', ok: aOk, detail: JSON.stringify(a, null, 0) });

// --- Step 3b: custom PED 2026-06-01 ---
await page.locator('input[type="date"]').first().fill('2026-06-01');
await page.waitForTimeout(300);
const pedB = await readProgramEndDate();
const timelineB = await readTimelineDates();
const b = {
  programEndDate: pedB,
  earliestApply: timelineB[0] ?? 'MISSING',
  latestApply: timelineB[2] ?? 'MISSING',
  earliestStart: timelineB[4] ?? 'MISSING',
  latestStart: timelineB[5] ?? 'MISSING',
};
const bOk = pedB === '2026-06-01' && timelineB[0] === '03/03/2026' && timelineB[2] === '07/31/2026' && timelineB[4] === '06/02/2026' && timelineB[5] === '07/31/2026';
results.push({ step: '3b-custom-ped', ok: bOk, detail: JSON.stringify(b, null, 0) });

// --- Step 3c: prior OPT ---
await page.locator('input[name="priorOpt"]').first().check();
await page.waitForTimeout(300);
const eadStart = page.locator('input[type="date"]').nth(1);
const eadEnd = page.locator('input[type="date"]').nth(2);
await eadStart.fill('2025-01-01');
await eadEnd.fill('2025-06-30');
await page.waitForTimeout(300);
const daysUsed = await readDaysUsed();
const daysAvailable = await readDaysAvailable();
const c = { daysUsed, daysAvailable, expectedUsed: 181, expectedAvailable: 184 };
const cOk = daysUsed === 181 && daysAvailable === 184;
results.push({ step: '3c-prior-opt', ok: cOk, detail: JSON.stringify(c, null, 0) });

// --- Step 3d: invalid reqStartDate ---
const reqStartInput = page.locator('label:has-text("Select your OPT start date")').locator('..').locator('input[type="date"]');
await reqStartInput.fill('2026-01-01');
await page.waitForTimeout(300);
const errorText = (await page.locator('.text-destructive.font-bold').textContent())?.trim() ?? '';
const summaryVisible = await page.locator('h2:has-text("Summary")').isVisible();
const d = { startDateError: errorText, summaryVisible };
const dOk = errorText.includes('Please select a date between') && errorText.includes('06/02/2026') && errorText.includes('07/31/2026') && !summaryVisible;
results.push({ step: '3d-invalid-start', ok: dOk, detail: JSON.stringify(d, null, 0) });

// --- Step 3e: valid reqStartDate + summary ---
await reqStartInput.fill('2026-06-15');
await page.waitForTimeout(300);
const endDateLine = (await page.locator('text=Your OPT end date will be').textContent())?.trim() ?? '';
const summaryRows = await page.locator('table tbody tr').count();
const summaryCells = await page.locator('table tbody td:nth-child(2)').allTextContents();
const e = {
  calculatedEndDateLine: endDateLine,
  summaryRowCount: summaryRows,
  summaryValues: summaryCells.map((t) => t.trim()),
};
const eOk = summaryRows === 5 && endDateLine.includes('12/15/2026') && summaryCells.length === 5 && summaryCells[1] === '03/03/2026';
results.push({ step: '3e-valid-start-summary', ok: eOk, detail: JSON.stringify(e, null, 0) });

// --- Step 3f: print ---
await page.evaluate(() => {
  window.__printCalled = false;
  const orig = window.print;
  window.print = () => {
    window.__printCalled = true;
  };
  window.__printOrig = orig;
});
await page.locator('button:has-text("Print")').click();
await page.waitForTimeout(200);
const printCalled = await page.evaluate(() => window.__printCalled === true);
results.push({ step: '3f-print', ok: printCalled, detail: printCalled ? 'window.print() was called' : 'window.print() NOT called' });

// --- Step 6: legacy redirect ---
consoleErrors.length = 0;
pageErrors.length = 0;
const redirectResponse = await page.goto(`${BASE}/opt-calculator`, { waitUntil: 'networkidle', timeout: 60000 });
const finalUrl = page.url();
const redirectOk = finalUrl.includes('/tools/opt-calculator');
results.push({
  step: '6-legacy-redirect',
  ok: redirectOk,
  detail: `status=${redirectResponse?.status()} finalUrl=${finalUrl}`,
});

// --- Step 4 breadcrumb (bonus on tool page) ---
await gotoTool();
const breadcrumbText = (await page.locator('nav[aria-label="Breadcrumb"]').innerText()).replace(/\s+/g, ' ').trim();
const toolsHref = await page.locator('nav[aria-label="Breadcrumb"] a:has-text("Tools")').getAttribute('href');
results.push({
  step: 'breadcrumb',
  ok: breadcrumbText.includes('Home') && breadcrumbText.includes('Tools') && breadcrumbText.includes('OPT Calculator') && toolsHref === '/eb5-investment-immigration-tools',
  detail: `text="${breadcrumbText}" toolsHref=${toolsHref}`,
});

await browser.close();

let failed = 0;
console.log('\n=== OPT Calculator Verification ===');
console.log(`Mode: ${MODE} @ ${BASE}\n`);
for (const r of results) {
  const mark = r.ok ? 'PASS' : 'FAIL';
  if (!r.ok) failed++;
  console.log(`${mark} | ${r.step}`);
  console.log(`     ${r.detail}\n`);
}
process.exit(failed > 0 ? 1 : 0);
