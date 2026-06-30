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

async function gotoTool() {
  consoleErrors.length = 0;
  pageErrors.length = 0;
  await page.goto(`${BASE}/tools/eb5-regional-center-scorecard`, {
    waitUntil: 'networkidle',
    timeout: 60000,
  });
  await page.waitForTimeout(1500);
}

async function fillAndScore({ years, approvals, violations, defaults }) {
  await page.locator('#rc-years').fill(String(years));
  await page.locator('#rc-approvals').fill(String(approvals));
  await page.locator('#rc-violations').selectOption(String(violations));
  await page.locator('#rc-defaults').selectOption(String(defaults));
  await page.getByRole('button', { name: 'Generate Trust Score' }).click();
  await page.waitForTimeout(500);
}

async function readResult() {
  const scoreText = (await page.locator('.font-serif.text-white.text-7xl').textContent())?.trim() ?? '';
  const tierText = (await page.locator('.text-sm.font-bold.uppercase.tracking-\\[0\\.3em\\]').textContent())?.trim() ?? '';
  const tierClass = (await page.locator('.text-sm.font-bold.uppercase.tracking-\\[0\\.3em\\]').getAttribute('class')) ?? '';
  return { scoreText, tierText, tierClass };
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
const expectedIslands = ['Header', 'Breadcrumb', 'RegionalCenterScorecardMainContent', 'Footer'];
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
    key: '3a',
    label: 'years=15, approvals=600, violations=None, defaults=None',
    inputs: { years: 15, approvals: 600, violations: 0, defaults: 0 },
    expectedScore: '100/100',
    expectedTier: 'Tier 1: Institutional Grade',
    expectedColor: 'text-green-400',
  },
  {
    key: '3b',
    label: 'years=8, approvals=250, violations=Minor, defaults=None',
    inputs: { years: 8, approvals: 250, violations: 1, defaults: 0 },
    expectedScore: '61/100',
    expectedTier: 'Tier 2: Established Profile',
    expectedColor: 'text-yellow-400',
  },
  {
    key: '3c',
    label: 'years=17, approvals=0, violations=None, defaults=None',
    inputs: { years: 17, approvals: 0, violations: 0, defaults: 0 },
    expectedScore: '84/100',
    expectedTier: 'Tier 2: Established Profile',
    expectedColor: 'text-yellow-400',
  },
  {
    key: '3d',
    label: 'years=3, approvals=50, violations=Major, defaults=Significant',
    inputs: { years: 3, approvals: 50, violations: 2, defaults: 2 },
    expectedScore: '0/100',
    expectedTier: 'Tier 3: High Risk / Emerging',
    expectedColor: 'text-red-400',
  },
];

const scenarioResults = {};
for (const s of scenarios) {
  await gotoTool();
  await fillAndScore(s.inputs);
  const actual = await readResult();
  scenarioResults[s.key] = {
    label: s.label,
    inputs: s.inputs,
    expectedScore: s.expectedScore,
    expectedTier: s.expectedTier,
    actualScore: actual.scoreText,
    actualTier: actual.tierText,
    actualTierClass: actual.tierClass,
    pass:
      actual.scoreText === s.expectedScore &&
      actual.tierText === s.expectedTier &&
      actual.tierClass.includes(s.expectedColor),
  };
}
results.push({
  step: 3,
  label: 'Hand-traced scoring scenarios',
  scenarios: scenarioResults,
  pass: Object.values(scenarioResults).every((s) => s.pass),
});

const boundaries = [
  {
    key: '4a',
    label: 'Score exactly 85 → Tier 1 (green)',
    inputs: { years: 17, approvals: 25, violations: 0, defaults: 0 },
    expectedScore: '85/100',
    expectedTier: 'Tier 1: Institutional Grade',
    expectedColor: 'text-green-400',
  },
  {
    key: '4b',
    label: 'Score exactly 60 → Tier 2 (yellow)',
    inputs: { years: 5, approvals: 0, violations: 0, defaults: 0 },
    expectedScore: '60/100',
    expectedTier: 'Tier 2: Established Profile',
    expectedColor: 'text-yellow-400',
  },
  {
    key: '4c',
    label: 'Score exactly 59 → Tier 3 (red)',
    inputs: { years: 4, approvals: 25, violations: 0, defaults: 0 },
    expectedScore: '59/100',
    expectedTier: 'Tier 3: High Risk / Emerging',
    expectedColor: 'text-red-400',
  },
];

const boundaryResults = {};
for (const b of boundaries) {
  await gotoTool();
  await fillAndScore(b.inputs);
  const actual = await readResult();
  boundaryResults[b.key] = {
    label: b.label,
    inputs: b.inputs,
    expectedScore: b.expectedScore,
    expectedTier: b.expectedTier,
    actualScore: actual.scoreText,
    actualTier: actual.tierText,
    actualTierClass: actual.tierClass,
    pass:
      actual.scoreText === b.expectedScore &&
      actual.tierText === b.expectedTier &&
      actual.tierClass.includes(b.expectedColor),
  };
}
results.push({
  step: 4,
  label: 'Tier threshold boundaries',
  boundaries: boundaryResults,
  pass: Object.values(boundaryResults).every((b) => b.pass),
});

// Step 5: NextStepsCTA transparent variant
await gotoTool();
await fillAndScore({ years: 15, approvals: 600, violations: 0, defaults: 0 });
const ctaWrapper = page.locator('.bg-transparent.p-10.text-center').filter({ hasText: 'Move Beyond Self-Reported Data' });
const ctaVisible = (await ctaWrapper.count()) > 0;
const ctaHeading = (await ctaWrapper.locator('h4.font-serif.text-2xl.text-white').textContent())?.trim() ?? '';
const ctaSecondary = (await ctaWrapper.locator('a.text-xs.text-white\\/70').textContent())?.trim() ?? '';
results.push({
  step: 5,
  label: 'NextStepsCTA variant transparent in results',
  ctaVisible,
  ctaHeading,
  ctaSecondary,
  pass: ctaVisible && ctaHeading === 'Move Beyond Self-Reported Data' && ctaSecondary.includes('SEC Compliance'),
});

// Step 6: reset
await gotoTool();
await fillAndScore({ years: 10, approvals: 100, violations: 0, defaults: 0 });
const beforeReset = await readResult();
await page.getByRole('button', { name: 'Re-Score Another Center' }).click();
await page.waitForTimeout(400);
const formVisible = (await page.getByRole('button', { name: 'Generate Trust Score' }).count()) > 0;
const resultGone = (await page.locator('.font-serif.text-white.text-7xl').count()) === 0;
const yearsEmpty = (await page.locator('#rc-years').inputValue()) === '';
const approvalsEmpty = (await page.locator('#rc-approvals').inputValue()) === '';
results.push({
  step: 6,
  label: 'Re-Score Another Center resets form',
  beforeResetScore: beforeReset.scoreText,
  formVisible,
  resultGone,
  yearsEmpty,
  approvalsEmpty,
  pass: formVisible && resultGone && yearsEmpty && approvalsEmpty,
});

await browser.close();
console.log(JSON.stringify({ base: BASE, mode: MODE, results }, null, 2));
const failed = results.filter((r) => !r.pass);
process.exit(failed.length ? 1 : 0);
