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
  await page.goto(`${BASE}/tools/eb5-cspa-calculator`, {
    waitUntil: 'networkidle',
    timeout: 60000,
  });
  await page.waitForTimeout(1500);
}

async function fillDates({ dob, filing, approval, visa }) {
  const inputs = page.locator('input[type="date"]');
  await inputs.nth(0).fill(dob);
  await inputs.nth(1).fill(filing);
  await inputs.nth(2).fill(approval);
  await inputs.nth(3).fill(visa);
  await page.waitForTimeout(200);
}

async function clickCalculate() {
  await page.getByRole('button', { name: 'Calculate CSPA Age' }).click();
  await page.waitForTimeout(500);
}

async function readResult() {
  const title = (await page.locator('h2.font-serif.text-white').textContent())?.trim() ?? '';
  const cspaLine = (await page.locator('text=Calculated CSPA Age:').locator('..').textContent())?.trim() ?? '';
  const cspaMatch = cspaLine.match(/([\d.]+)\s*years/);
  const cspaAge = cspaMatch?.[1] ?? 'MISSING';
  const bioText = (await page.locator('text=Biological Age at Visa Availability').locator('..').locator('p.text-white.text-lg').textContent())?.trim() ?? '';
  const bioMatch = bioText.match(/([\d.]+)/);
  const biologicalAge = bioMatch?.[1] ?? 'MISSING';
  const pendingText = (await page.locator('text=Petition Pending Time Subtracted').locator('..').locator('p.text-white.text-lg').textContent())?.trim() ?? '';
  const pendingMatch = pendingText.match(/(\d+)/);
  const pendingDays = pendingMatch?.[1] ?? 'MISSING';
  const msg = (await page.locator('p.text-gray-200.mb-8').textContent())?.trim() ?? '';
  return { title, cspaAge, biologicalAge, pendingDays, msg };
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
const expected = ['Header', 'Breadcrumb', 'CSPACalculatorMainContent', 'Footer'];
const missing = expected.filter((n) => !islands.some((i) => i.name.toLowerCase().includes(n.toLowerCase())));
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

// Step 3: hand-traced scenario
await gotoTool();
await fillDates({
  dob: '2010-06-15',
  filing: '2024-01-15',
  approval: '2025-06-15',
  visa: '2025-03-01',
});
await clickCalculate();
const handTrace = await readResult();
results.push({
  step: 3,
  label: 'Hand-traced scenario',
  inputs: { dob: '2010-06-15', filing: '2024-01-15', approval: '2025-06-15', visa: '2025-03-01' },
  actual: handTrace,
  expected: {
    title: 'Likely Protected',
    biologicalAge: '15.00',
    pendingDays: '517',
    cspaAge: '13.59',
  },
  pass:
    handTrace.title === 'Likely Protected' &&
    handTrace.pendingDays === '517' &&
    parseFloat(handTrace.biologicalAge) >= 15.0 &&
    parseFloat(handTrace.biologicalAge) <= 15.01 &&
    parseFloat(handTrace.cspaAge) >= 13.58 &&
    parseFloat(handTrace.cspaAge) <= 13.59,
});

// Step 4: approval before filing validation
await gotoTool();
await fillDates({
  dob: '2010-06-15',
  filing: '2024-01-15',
  approval: '2023-01-15',
  visa: '2025-03-01',
});
await clickCalculate();
const validationMsg = (await page.locator('p.text-sm.text-red-200').textContent())?.trim() ?? '';
results.push({
  step: 4,
  label: 'Approval before filing guard',
  actual: validationMsg,
  expected: 'I-526E Approval Date cannot be earlier than the Filing Date.',
  pass: validationMsg === 'I-526E Approval Date cannot be earlier than the Filing Date.',
});

// Step 5: aged-out scenario (CSPA age >= 21)
await gotoTool();
await fillDates({
  dob: '2004-05-15',
  filing: '2025-06-01',
  approval: '2025-06-01',
  visa: '2025-06-01',
});
await clickCalculate();
const agedOut = await readResult();
results.push({
  step: 5,
  label: 'Age-Out Risk Detected band',
  inputs: { dob: '2004-05-15', filing: '2025-06-01', approval: '2025-06-01', visa: '2025-06-01' },
  actual: agedOut,
  pass:
    agedOut.title === 'Age-Out Risk Detected' &&
    parseFloat(agedOut.cspaAge) >= 21 &&
    agedOut.msg.includes('calculated CSPA age is 21 or above'),
});

// Step 6: at-risk narrow margin (target CSPA between 20.5 and 21)
// DOB 2004-06-15, filing 2020-01-01, approval 2024-06-15, FAD 2024-01-01
// availability = 2024-06-15, bio ~20.00, pending ~1642 days ~4.49 yrs, cspa ~15.5 - too low
// Need older child: DOB 2003-01-01, filing 2018-01-01, approval 2023-01-01, FAD 2022-01-01
// availability max(2022-01-01, 2023-01-01) = 2023-01-01, bio ~20.00, pending 1826 days ~5.0, cspa ~15 - still low
// Try DOB 2002-07-01: at avail 2024-06-15 bio ~21.96, pending 2020-01-01 to 2024-06-15 = 1627 days ~4.46, cspa ~17.5
// Need bio - pending/365.25 between 20.5 and 21: bio ~22, pending ~547 days gives ~20.5
// DOB 2002-01-01, avail 2024-01-01: bio 22.00, pending 365 days -> cspa 21.00 exactly (>=21 aged out)
// DOB 2002-03-01, avail 2024-01-01: bio ~21.83, pending 400 days -> ~20.73 at risk
await gotoTool();
await fillDates({
  dob: '2002-03-01',
  filing: '2023-01-01',
  approval: '2024-01-01',
  visa: '2023-06-01',
});
await clickCalculate();
const atRisk = await readResult();
results.push({
  step: 6,
  label: 'At Risk: Narrow Margin band',
  inputs: { dob: '2002-03-01', filing: '2023-01-01', approval: '2024-01-01', visa: '2023-06-01' },
  actual: atRisk,
  pass:
    atRisk.title === 'At Risk: Narrow Margin' &&
    parseFloat(atRisk.cspaAge) >= 20.5 &&
    parseFloat(atRisk.cspaAge) < 21 &&
    atRisk.msg.includes('narrow margin'),
});

// Step 7: reset
await page.getByRole('button', { name: /Restart Calculator/i }).click();
await page.waitForTimeout(500);
const dateValues = await page.locator('input[type="date"]').evaluateAll((els) =>
  els.map((el) => el.value)
);
const hasResult = (await page.locator('h2.font-serif.text-white').count()) > 0;
const hasCalculateBtn = (await page.getByRole('button', { name: 'Calculate CSPA Age' }).count()) > 0;
results.push({
  step: 7,
  label: 'Reset clears form and result',
  dateValues,
  hasResult,
  hasCalculateBtn,
  pass: dateValues.every((v) => v === '') && !hasResult && hasCalculateBtn,
});

// Step 8: NextStepsCTA links (re-run hand trace to get results view)
await gotoTool();
await fillDates({
  dob: '2010-06-15',
  filing: '2024-01-15',
  approval: '2025-06-15',
  visa: '2025-03-01',
});
await clickCalculate();
const ctaHeading = (await page.locator('h4.font-serif.text-2xl').textContent())?.trim() ?? '';
const ctaHref = await page.getByRole('link', { name: 'Speak with a CSPA Specialist' }).getAttribute('href');
const secondaryHref = await page.getByRole('link', { name: /CSPA Aging-Out Crisis/i }).getAttribute('href');
results.push({
  step: 8,
  label: 'NextStepsCTA in results view',
  ctaHeading,
  ctaHref,
  secondaryHref,
  pass:
    ctaHeading === "Protect Your Child's EB-5 Eligibility" &&
    ctaHref === '/contact' &&
    secondaryHref === '/research/eb5-visa-aging-out-crisis-solution',
});

await browser.close();

console.log(JSON.stringify({ base: BASE, mode: MODE, results }, null, 2));
const failed = results.filter((r) => !r.pass);
process.exit(failed.length ? 1 : 0);
