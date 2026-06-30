import { chromium } from 'playwright';

const BASE = process.argv[2] ?? 'http://localhost:4321';
const MODE = process.argv[3] ?? 'dev';

const tuitionData = {
  UCLA: { intl: 48315, inState: 13804 },
  'University of Michigan (Ann Arbor)': { intl: 60094, inState: 17786 },
  'UC Berkeley': { intl: 48176, inState: 14312 },
};

function fmt(n) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

function expected(university) {
  const { intl, inState } = tuitionData[university];
  const annualSavings = intl - inState;
  return {
    barIntl4yr: fmt(intl * 4),
    barInState4yr: fmt(inState * 4),
    barWidthPct: `${(inState / intl) * 100}%`,
    annualIntl: fmt(intl),
    annualInState: fmt(inState),
    annualSavings: fmt(annualSavings),
    total4yr: fmt(annualSavings * 4),
  };
}

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
page.on('console', (m) => {
  if (m.type() === 'error') consoleErrors.push(m.text());
});
page.on('pageerror', (e) => pageErrors.push(String(e)));

async function readDisplayed() {
  const barLabels = await page
    .locator('.space-y-4 .flex.justify-between.items-baseline .text-sm.font-bold.text-foreground')
    .allTextContents();
  const barWidth = await page
    .locator('.bg-primary.rounded-sm.transition-all.duration-700')
    .getAttribute('style');
  const gridValues = await page
    .locator('.grid.grid-cols-3 .text-lg.font-bold')
    .allTextContents();
  const total4yr = (
    await page.locator('.text-4xl.md\\:text-5xl.font-bold.text-primary').textContent()
  )?.trim();
  return {
    barIntl4yr: barLabels[0]?.trim() ?? 'MISSING',
    barInState4yr: barLabels[1]?.trim() ?? 'MISSING',
    barWidthStyle: barWidth ?? 'MISSING',
    annualIntl: gridValues[0]?.trim() ?? 'MISSING',
    annualInState: gridValues[1]?.trim() ?? 'MISSING',
    annualSavings: gridValues[2]?.trim() ?? 'MISSING',
    total4yr: total4yr ?? 'MISSING',
  };
}

async function selectUniversity(name) {
  await page.getByRole('combobox').click();
  await page.getByRole('option', { name, exact: true }).click();
  await page.waitForTimeout(400);
}

const results = [];

// Step 2: hydration
consoleErrors.length = 0;
pageErrors.length = 0;
await page.goto(`${BASE}/tools/tuition-calculator`, { waitUntil: 'networkidle', timeout: 60000 });
await page.waitForTimeout(1500);
const hydration = hydrationIssues([...consoleErrors, ...pageErrors]);
results.push({
  step: '2-hydration',
  ok: hydration.length === 0,
  detail: hydration.length ? hydration.join(' | ') : 'clean — Header, Breadcrumb, TuitionCalculatorMainContent, Footer',
});

async function verifyUniversity(step, university) {
  await selectUniversity(university);
  const displayed = await readDisplayed();
  const exp = expected(university);
  const widthMatch = displayed.barWidthStyle.includes(
    `width: ${exp.barWidthPct.replace(/(\.\d{3})\d+%/, '$1%')}` // allow float rounding
  ) || displayed.barWidthStyle.replace(/\s/g, '') === `width:${exp.barWidthPct}`.replace(/\s/g, '');
  const numericWidth = parseFloat(displayed.barWidthStyle.match(/[\d.]+/)?.[0] ?? '0');
  const expWidth = parseFloat(exp.barWidthPct);
  const widthOk = Math.abs(numericWidth - expWidth) < 0.1;
  const ok =
    displayed.barIntl4yr === exp.barIntl4yr &&
    displayed.barInState4yr === exp.barInState4yr &&
    widthOk &&
    displayed.annualIntl === exp.annualIntl &&
    displayed.annualInState === exp.annualInState &&
    displayed.annualSavings === exp.annualSavings &&
    displayed.total4yr === exp.total4yr;
  results.push({
    step,
    ok,
    detail: JSON.stringify({ university, displayed, expected: exp }, null, 0),
  });
  return displayed;
}

// Steps 3-5
await verifyUniversity('3-ucla', 'UCLA');
await verifyUniversity('4-umich', 'University of Michigan (Ann Arbor)');
const berkeleyDisplayed = await verifyUniversity('5-uc-berkeley', 'UC Berkeley');

// Step 6: switch back to UCLA — values must match step 3, not stale UMich
await selectUniversity('UCLA');
const switchBack = await readDisplayed();
const uclaExp = expected('UCLA');
const step6Ok =
  switchBack.annualIntl === uclaExp.annualIntl &&
  switchBack.total4yr === uclaExp.total4yr &&
  switchBack.annualIntl !== fmt(tuitionData['University of Michigan (Ann Arbor)'].intl);
results.push({
  step: '6-switch-universities',
  ok: step6Ok,
  detail: JSON.stringify({ afterSwitchToUCLA: switchBack, expectedUCLA: uclaExp }, null, 0),
});

// Step 9: legacy redirect
consoleErrors.length = 0;
pageErrors.length = 0;
const redirectResp = await page.goto(`${BASE}/tuition-calculator`, { waitUntil: 'networkidle', timeout: 60000 });
const finalUrl = page.url();
results.push({
  step: '9-legacy-redirect',
  ok: finalUrl.includes('/tools/tuition-calculator'),
  detail: `status=${redirectResp?.status()} finalUrl=${finalUrl}`,
});

await browser.close();

let failed = 0;
console.log(`\n=== Tuition Calculator Verification ===`);
console.log(`Mode: ${MODE} @ ${BASE}\n`);
for (const r of results) {
  const mark = r.ok ? 'PASS' : 'FAIL';
  if (!r.ok) failed++;
  console.log(`${mark} | ${r.step}`);
  console.log(`     ${r.detail}\n`);
}
process.exit(failed > 0 ? 1 : 0);
