import { chromium } from 'playwright';

const BASE = process.argv[2] ?? 'http://localhost:4321';
const MODE = process.argv[3] ?? 'dev';

const TEA_INVESTMENT = 800000;
const FEES = 35000 + 11160 + 60000 + 7500 + 35000;
const TOTAL_EB_COSTS_TEA = TEA_INVESTMENT + FEES;
const LIVING_RESERVE_DEFAULT = 5000 * 24;
const TOTAL_NEEDED_TEA_DEFAULT = TOTAL_EB_COSTS_TEA + LIVING_RESERVE_DEFAULT;

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
const path = '/tools/2026-eb5-investment-feasibility-calculator';

async function gotoTool() {
  consoleErrors.length = 0;
  pageErrors.length = 0;
  await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(1500);
}

async function setInputs({ liquid, semi = 0, debts = 0, monthly = 5000, tea = true }) {
  const inputs = page.locator('input[type="number"]');
  await inputs.nth(1).fill(String(liquid));
  await inputs.nth(2).fill(String(semi));
  await inputs.nth(3).fill(String(monthly));
  await inputs.nth(4).fill(String(debts));
  if (!tea) {
    await page.getByText('Non-TEA (Standard)').click();
  }
  await page.waitForTimeout(300);
}

async function readTotals() {
  const totalNeededText = (await page.getByText('TOTAL NEEDED:').locator('..').locator('span').last().textContent())?.trim() ?? '';
  return { totalNeededText };
}

async function readStatusHeadline() {
  const green = page.getByRole('heading', { name: 'STRONG POSITION' });
  const yellow = page.getByRole('heading', { name: 'MODERATE POSITION - PREPARATION NEEDED' });
  const red = page.getByRole('heading', { name: 'CHALLENGING POSITION - NOT RECOMMENDED NOW' });
  if ((await green.count()) > 0) return 'GREEN';
  if ((await yellow.count()) > 0) return 'YELLOW';
  if ((await red.count()) > 0) return 'RED';
  return 'NONE';
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
const expectedIslands = ['Header', 'Breadcrumb', 'EB5FeasibilityToolMainContent', 'Footer'];
const missing = expectedIslands.filter((n) => !islands.some((i) => i.name.toLowerCase().includes(n.toLowerCase().replace(/maincontent/i, ''))));
const missingFixed = expectedIslands.filter((n) => {
  const key = n.toLowerCase();
  return !islands.some((i) => i.name.toLowerCase().includes(key.replace('eb5feasibilitytool', 'eb5feasibility')));
});
results.push({
  step: 2,
  label: 'Console/hydration islands',
  mode: MODE,
  islands,
  consoleErrors: [...consoleErrors],
  pageErrors: [...pageErrors],
  hydrationIssues: hydration,
  missingIslands: expectedIslands.filter(
    (n) =>
      !islands.some((i) => {
        const iname = i.name.toLowerCase();
        if (n === 'EB5FeasibilityToolMainContent') return iname.includes('eb5feasibility');
        return iname.includes(n.toLowerCase());
      })
  ),
  pass: hydration.length === 0 && expectedIslands.every((n) =>
    islands.some((i) => {
      const iname = i.name.toLowerCase();
      if (n === 'EB5FeasibilityToolMainContent') return iname.includes('eb5feasibility');
      return iname.includes(n.toLowerCase());
    })
  ),
});

const scenarios = [
  {
    key: 'green',
    label: 'liquid=1,200,000 → GREEN',
    inputs: { liquid: 1200000 },
    expectedStatus: 'GREEN',
    expectedTotalNeeded: `$${TOTAL_NEEDED_TEA_DEFAULT.toLocaleString()}`,
  },
  {
    key: 'yellow',
    label: 'liquid=900,000, semi=300,000 → YELLOW',
    inputs: { liquid: 900000, semi: 300000 },
    expectedStatus: 'YELLOW',
    expectedTotalNeeded: `$${TOTAL_NEEDED_TEA_DEFAULT.toLocaleString()}`,
  },
  {
    key: 'red',
    label: 'liquid=500,000, semi=100,000 → RED',
    inputs: { liquid: 500000, semi: 100000 },
    expectedStatus: 'RED',
    expectedTotalNeeded: `$${TOTAL_NEEDED_TEA_DEFAULT.toLocaleString()}`,
  },
  {
    key: 'green-boundary',
    label: 'liquid=1,068,660 (remainingLiquid=livingReserve) → GREEN',
    inputs: { liquid: 1068660 },
    expectedStatus: 'GREEN',
    expectedTotalNeeded: `$${TOTAL_NEEDED_TEA_DEFAULT.toLocaleString()}`,
  },
  {
    key: 'yellow-boundary',
    label: 'liquid=1,000,000, semi=68,660 (totalAvailable=totalNeeded) → YELLOW',
    inputs: { liquid: 1000000, semi: 68660 },
    expectedStatus: 'YELLOW',
    expectedTotalNeeded: `$${TOTAL_NEEDED_TEA_DEFAULT.toLocaleString()}`,
  },
];

const scenarioResults = {};
for (const s of scenarios) {
  await gotoTool();
  await setInputs(s.inputs);
  const status = await readStatusHeadline();
  const { totalNeededText } = await readTotals();
  scenarioResults[s.key] = {
    label: s.label,
    inputs: s.inputs,
    expectedStatus: s.expectedStatus,
    actualStatus: status,
    expectedTotalNeeded: s.expectedTotalNeeded,
    actualTotalNeeded: totalNeededText,
    pass: status === s.expectedStatus && totalNeededText === s.expectedTotalNeeded,
  };
}
results.push({
  step: 3,
  label: 'GREEN/YELLOW/RED scenarios + totalNeeded',
  formulaConstants: {
    TOTAL_EB_COSTS_TEA,
    LIVING_RESERVE_DEFAULT,
    TOTAL_NEEDED_TEA_DEFAULT,
  },
  scenarios: scenarioResults,
  pass: Object.values(scenarioResults).every((s) => s.pass),
});

// Step 4: tooltips
await gotoTool();
await page.locator('span.cursor-help').first().hover({ force: true });
await page.waitForTimeout(800);
const tooltipText = (await page.locator('[data-radix-popper-content-wrapper]').textContent())?.trim()
  ?? (await page.locator('[role="tooltip"]').textContent())?.trim()
  ?? '';
const tooltipVisible = tooltipText.includes('Cash, Savings');
results.push({
  step: 4,
  label: 'Radix tooltip on hover',
  tooltipText,
  tooltipVisible,
  pass: tooltipVisible,
});

// Step 5: print button present
await gotoTool();
const printBtn = (await page.getByRole('button', { name: 'Print Report' }).count()) > 0;
results.push({ step: 5, label: 'Print Report button', printBtn, pass: printBtn });

// Step 6: print:hidden audit via DOM locators
await gotoTool();
await setInputs({ liquid: 1200000 });
const timelineClass = (await page.getByRole('heading', { name: 'Typical EB-5 Timeline' }).locator('..').getAttribute('class')) ?? '';
const checklistClass = (await page.getByRole('heading', { name: 'Required Documentation Checklist' }).locator('..').getAttribute('class')) ?? '';
const costClass = (await page.getByRole('heading', { name: 'Total EB-5 Cost Breakdown' }).locator('..').getAttribute('class')) ?? '';
const resultPanelClass = (await page.locator('.border-l-8.bg-green-50').first().getAttribute('class')) ?? '';
results.push({
  step: 6,
  label: 'print:hidden placement',
  timelineHasPrintHidden: timelineClass.includes('print:hidden'),
  checklistHasPrintHidden: checklistClass.includes('print:hidden'),
  costBreakdownHasPrintHidden: costClass.includes('print:hidden'),
  resultPanelHasPrintHidden: resultPanelClass.includes('print:hidden'),
  pass:
    timelineClass.includes('print:hidden') &&
    checklistClass.includes('print:hidden') &&
    !costClass.includes('print:hidden') &&
    !resultPanelClass.includes('print:hidden'),
});

// Step 7: dual breadcrumbs
await gotoTool();
const darkCrumb = (await page.locator('nav[aria-label="Breadcrumb"]').count()) >= 2;
const customCrumbText = (await page.getByText('EB-5 Investment Feasibility Tool').count()) >= 1;
results.push({
  step: 7,
  label: 'Dual breadcrumbs',
  breadcrumbNavCount: await page.locator('nav[aria-label="Breadcrumb"]').count(),
  customTitleVisible: customCrumbText,
  pass: darkCrumb && customCrumbText,
});

// Step 8: redirect
if (MODE !== 'skip-redirect') {
  const redirectPage = await browser.newPage();
  await redirectPage.goto(`${BASE}/tools/eb5-feasibility`, { waitUntil: 'networkidle', timeout: 60000 });
  await redirectPage.waitForTimeout(1000);
  const finalUrl = redirectPage.url();
  const hasHeading = (await redirectPage.getByRole('heading', { name: /2026 EB-5 Investment Feasibility Calculator/i }).count()) > 0;
  await redirectPage.close();
  results.push({
    step: 8,
    label: 'Legacy redirect /tools/eb5-feasibility',
    finalUrl,
    hasHeading,
    pass: finalUrl.includes(path) && hasHeading,
  });
}

await browser.close();
console.log(JSON.stringify({ base: BASE, mode: MODE, results }, null, 2));
const failed = results.filter((r) => !r.pass);
process.exit(failed.length ? 1 : 0);
