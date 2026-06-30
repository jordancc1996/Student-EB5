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

const EXPECTED = {
  salary: {
    label: 'Salary & Savings',
    title: 'Salary & Savings Requirements',
    documents: [
      'Employment Verification Letter (Title, Salary, Tenure)',
      'Individual Income Tax Returns (Last 5 years)',
      'Bank Statements showing salary deposits (Last 12-24 months)',
      'Resume/CV highlighting career progression',
      'Proof of any bonuses or performance-based compensation',
    ],
  },
  gift: {
    label: 'Gifted Funds',
    title: 'Gifted Funds Requirements',
    documents: [
      'Signed Gift Letter (Affidavit of Gift)',
      "Proof of Donor's Lawful Source of Funds (Salary/Property docs)",
      'Wire transfer record from Donor to Investor',
      "Donor's Income Tax Returns (Last 5 years)",
      'Proof of relationship (Birth Certificate or Affidavit)',
    ],
  },
  property: {
    label: 'Property Sale / Loan',
    title: 'Property Sale Requirements',
    documents: [
      'Original Purchase Contract and Deed',
      'Proof of Lawful Funds used for original purchase',
      'Official Sale Agreement and HUD-1 Settlement Statement',
      'Bank statements showing receipt of sale proceeds',
      'Proof of Capital Gains tax payment (if applicable)',
    ],
  },
  stock: {
    label: 'Equity & Investments',
    title: 'Investment Liquidation Requirements',
    documents: [
      'Stock/Investment Account Statements (Last 3 years)',
      'Records showing the original purchase of shares/crypto',
      'Trade confirmation receipts for the sale/liquidation',
      'Bank statements showing transfer of proceeds to main account',
      'Corporate tax records (if selling business equity)',
    ],
  },
};

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
  await page.goto(`${BASE}/tools/eb5-source-of-funds-checklist`, {
    waitUntil: 'networkidle',
    timeout: 60000,
  });
  await page.waitForTimeout(1500);
}

async function selectSource(label) {
  await page.getByRole('button', { name: new RegExp(label, 'i') }).click();
  await page.waitForTimeout(400);
}

async function readChecklist() {
  const title = (await page.locator('h2.text-white.font-serif.text-2xl').textContent())?.trim() ?? '';
  const documents = await page.locator('ul.space-y-4 li span:last-child').allTextContents();
  return { title, documents: documents.map((d) => d.trim()) };
}

async function readNextStepsCTA() {
  const heading = (await page.locator('h4.font-serif.text-2xl').textContent())?.trim() ?? '';
  const description = (await page.locator('h4.font-serif.text-2xl + p').textContent())?.trim() ?? '';
  const ctaLabel = (await page.getByRole('link', { name: 'Get a Preliminary SOF Audit' }).textContent())?.trim() ?? '';
  const ctaHref = await page.getByRole('link', { name: 'Get a Preliminary SOF Audit' }).getAttribute('href');
  const secondaryHref = await page.getByRole('link', { name: /Tracing Foreign Exchange/i }).getAttribute('href');
  return { heading, description, ctaLabel, ctaHref, secondaryHref };
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
const expectedIslands = ['Header', 'Breadcrumb', 'SourceOfFundsChecklistMainContent', 'Footer'];
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

// Steps 3–4: all 4 source types
const sourceResults = {};
for (const [key, exp] of Object.entries(EXPECTED)) {
  await gotoTool();
  await selectSource(exp.label);
  const actual = await readChecklist();
  const countMatch = actual.documents.length === 5;
  const titleMatch = actual.title === exp.title;
  const docsMatch =
    actual.documents.length === exp.documents.length &&
    actual.documents.every((d, i) => d === exp.documents[i]);
  const noDupes = new Set(actual.documents).size === actual.documents.length;
  sourceResults[key] = {
    expectedTitle: exp.title,
    actualTitle: actual.title,
    expectedDocuments: exp.documents,
    actualDocuments: actual.documents,
    documentCount: actual.documents.length,
    titleMatch,
    countIsFive: countMatch,
    documentsVerbatimMatch: docsMatch,
    noDuplicates: noDupes,
    pass: titleMatch && countMatch && docsMatch && noDupes,
  };
}
results.push({ step: '3-4', label: 'All 4 source types — titles and complete document lists', sources: sourceResults, pass: Object.values(sourceResults).every((s) => s.pass) });

// Step 5: switching between sources (no stale list)
await gotoTool();
await selectSource('Salary & Savings');
const afterSalary = await readChecklist();
await page.getByRole('button', { name: 'Reset' }).click();
await page.waitForTimeout(300);
await selectSource('Gifted Funds');
const afterGift = await readChecklist();
await page.getByRole('button', { name: 'Reset' }).click();
await page.waitForTimeout(300);
await selectSource('Equity & Investments');
const afterStock = await readChecklist();
const switchingPass =
  afterSalary.title === EXPECTED.salary.title &&
  afterGift.title === EXPECTED.gift.title &&
  afterStock.title === EXPECTED.stock.title &&
  afterGift.documents[0] === EXPECTED.gift.documents[0] &&
  afterStock.documents[0] === EXPECTED.stock.documents[0] &&
  afterGift.documents[0] !== afterSalary.documents[0];
results.push({
  step: 5,
  label: 'Switching source types — no stale list',
  sequence: {
    salaryTitle: afterSalary.title,
    salaryFirstDoc: afterSalary.documents[0],
    giftTitle: afterGift.title,
    giftFirstDoc: afterGift.documents[0],
    stockTitle: afterStock.title,
    stockFirstDoc: afterStock.documents[0],
  },
  pass: switchingPass,
});

// Step 6: reset back to picker
await gotoTool();
await selectSource('Property Sale / Loan');
const beforeReset = await readChecklist();
await page.getByRole('button', { name: 'Reset' }).click();
await page.waitForTimeout(400);
const pickerVisible = (await page.getByText('Select your primary source of investment capital:').count()) > 0;
const fourButtons = await page.locator('.grid.grid-cols-1.md\\:grid-cols-2.gap-4 button').count();
const checklistGone = (await page.locator('h2.text-white.font-serif.text-2xl').count()) === 0;
results.push({
  step: 6,
  label: 'Reset back to picker',
  beforeResetTitle: beforeReset.title,
  pickerVisible,
  fourSourceButtons: fourButtons,
  checklistGone,
  pass: pickerVisible && fourButtons === 4 && checklistGone,
});

// Step 7: NextStepsCTA identical across sources
const ctaBySource = {};
for (const [key, exp] of Object.entries(EXPECTED)) {
  await gotoTool();
  await selectSource(exp.label);
  ctaBySource[key] = await readNextStepsCTA();
}
const ctaValues = Object.values(ctaBySource);
const firstCta = ctaValues[0];
const ctaIdentical = ctaValues.every(
  (c) =>
    c.heading === firstCta.heading &&
    c.description === firstCta.description &&
    c.ctaLabel === firstCta.ctaLabel &&
    c.ctaHref === firstCta.ctaHref &&
    c.secondaryHref === firstCta.secondaryHref
);
results.push({
  step: 7,
  label: 'NextStepsCTA identical regardless of source',
  ctaBySource,
  pass:
    ctaIdentical &&
    firstCta.heading === 'Audit Your Source of Funds Before Filing' &&
    firstCta.ctaHref === '/contact' &&
    firstCta.secondaryHref === '/research/ways-to-fund-eb5-investment-2026',
});

await browser.close();
console.log(JSON.stringify({ base: BASE, mode: MODE, results }, null, 2));
const failed = results.filter((r) => !r.pass);
process.exit(failed.length ? 1 : 0);
