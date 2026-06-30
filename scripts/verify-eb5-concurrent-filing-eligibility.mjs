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
  await page.goto(`${BASE}/tools/eb5-concurrent-filing-eligibility`, {
    waitUntil: 'networkidle',
    timeout: 60000,
  });
  await page.waitForTimeout(1500);
}

async function fillAndAnalyze({ location, country, category }) {
  if (location === 'inside') {
    await page.getByRole('button', { name: 'Inside U.S.' }).click();
  } else if (location === 'outside') {
    await page.getByRole('button', { name: 'Outside U.S.' }).click();
  }
  if (country === 'current') {
    await page.locator('select').nth(0).selectOption('current');
  } else if (country === 'backlogged') {
    await page.locator('select').nth(0).selectOption('backlogged');
  }
  if (category === 'reserved') {
    await page.locator('select').nth(1).selectOption('reserved');
  } else if (category === 'unreserved') {
    await page.locator('select').nth(1).selectOption('unreserved');
  }
  await page.getByRole('button', { name: 'Analyze Eligibility' }).click();
  await page.waitForTimeout(500);
}

async function readResult() {
  const title = (await page.locator('h2.font-serif.text-white.text-3xl').textContent())?.trim() ?? '';
  const msg = (await page.locator('p.text-gray-200.mb-8').textContent())?.trim() ?? '';
  return { title, msg };
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
const expectedIslands = ['Header', 'Breadcrumb', 'ConcurrentFilingCheckerMainContent', 'Footer'];
const missing = expectedIslands.filter((n) => !islands.some((i) => i.name.toLowerCase().includes(n.toLowerCase())));
results.push({
  step: 2,
  label: 'Console/hydration islands',
  mode: MODE,
  islands,
  consoleErrors: [...consoleErrors],
  pageErrors: [...pageErrors],
  hydrationIssues: hydration,
  missingIslands: missing,
  pass: hydration.length === 0 && missing.length === 0,
});

const scenarios = [
  {
    key: '3a-consular',
    label: 'Outside US (any country, any category)',
    inputs: { location: 'outside', country: 'backlogged', category: 'unreserved' },
    expectedTitle: 'Consular Processing',
  },
  {
    key: '3b-eligible-row-unreserved',
    label: 'Inside US + Rest of World + Urban/Unreserved',
    inputs: { location: 'inside', country: 'current', category: 'unreserved' },
    expectedTitle: 'You Are Eligible',
  },
  {
    key: '3c-retrogression',
    label: 'Inside US + China/India + Urban/Unreserved',
    inputs: { location: 'inside', country: 'backlogged', category: 'unreserved' },
    expectedTitle: 'Retrogression Warning',
  },
  {
    key: '4-edge-rural-china',
    label: 'Inside US + China/India + Rural/Reserved (edge case)',
    inputs: { location: 'inside', country: 'backlogged', category: 'reserved' },
    expectedTitle: 'You Are Eligible',
  },
];

const scenarioResults = {};
for (const s of scenarios) {
  await gotoTool();
  await fillAndAnalyze(s.inputs);
  const actual = await readResult();
  scenarioResults[s.key] = {
    label: s.label,
    inputs: s.inputs,
    expectedTitle: s.expectedTitle,
    actualTitle: actual.title,
    actualMsg: actual.msg,
    pass: actual.title === s.expectedTitle,
  };
}
results.push({ step: '3-4', label: 'Outcome paths + edge case', scenarios: scenarioResults, pass: Object.values(scenarioResults).every((s) => s.pass) });

// Step 5: validation guard
await gotoTool();
await page.getByRole('button', { name: 'Analyze Eligibility' }).click();
await page.waitForTimeout(300);
const validationMsg = (await page.locator('p.text-sm.text-red-200').textContent())?.trim() ?? '';
results.push({
  step: 5,
  label: 'Validation guard',
  actual: validationMsg,
  expected: 'Please complete all fields to analyze your eligibility.',
  pass: validationMsg === 'Please complete all fields to analyze your eligibility.',
});

// Step 6: reset
await gotoTool();
await fillAndAnalyze({ location: 'inside', country: 'current', category: 'reserved' });
const beforeReset = await readResult();
await page.getByRole('button', { name: /Restart Checker/i }).click();
await page.waitForTimeout(400);
const formVisible = (await page.getByRole('button', { name: 'Analyze Eligibility' }).count()) > 0;
const resultGone = (await page.locator('h2.font-serif.text-white.text-3xl').count()) === 0;
const insideUnselected = !(await page.getByRole('button', { name: 'Inside U.S.' }).evaluate((el) => el.className.includes('bg-white text-black')));
const countryEmpty = (await page.locator('select').nth(0).inputValue()) === '';
const categoryEmpty = (await page.locator('select').nth(1).inputValue()) === '';
results.push({
  step: 6,
  label: 'Reset clears form',
  beforeResetTitle: beforeReset.title,
  formVisible,
  resultGone,
  insideUnselected,
  countryEmpty,
  categoryEmpty,
  pass: formVisible && resultGone && insideUnselected && countryEmpty && categoryEmpty,
});

// Step 7: redirect (dev/preview only if BASE is local)
if (MODE !== 'skip-redirect') {
  const redirectPage = await browser.newPage();
  await redirectPage.goto(`${BASE}/tools/concurrent-filing-checker`, { waitUntil: 'networkidle', timeout: 60000 });
  await redirectPage.waitForTimeout(1000);
  const finalUrl = redirectPage.url();
  const hasCheckerContent = (await redirectPage.getByRole('heading', { name: /Concurrent Filing/i }).count()) > 0;
  await redirectPage.close();
  results.push({
    step: 7,
    label: 'Alias redirect /tools/concurrent-filing-checker',
    finalUrl,
    hasCheckerContent,
    pass: finalUrl.includes('/tools/eb5-concurrent-filing-eligibility') && hasCheckerContent,
  });
}

await browser.close();
console.log(JSON.stringify({ base: BASE, mode: MODE, results }, null, 2));
const failed = results.filter((r) => !r.pass);
process.exit(failed.length ? 1 : 0);
