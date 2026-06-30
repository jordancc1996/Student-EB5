import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const BASE = process.argv[2] ?? 'http://localhost:4321';
const MODE = process.argv[3] ?? 'dev';

const EXPECTED_ODDS = ['25.2%', '44.1%', '58.2%', '68.8%'];
const TOOL_PATH = '/tools/h1b-lottery-odds-calculator';

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

const results = [];

async function gotoTool() {
  consoleErrors.length = 0;
  pageErrors.length = 0;
  await page.goto(`${BASE}${TOOL_PATH}`, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(1500);
}

async function selectJob(title) {
  const input = page.locator('input[placeholder="e.g. Software Engineer"]');
  await input.fill(title);
  await page.locator('button', { hasText: title }).first().click();
  await page.waitForTimeout(300);
}

async function selectSoc(titleFragment) {
  await page.locator('button', { hasText: titleFragment }).first().click();
  await page.waitForTimeout(300);
}

async function selectState(state) {
  await page.locator('button', { hasText: 'Select State' }).click();
  await page.locator('button', { hasText: state }).first().click();
  await page.waitForTimeout(300);
}

async function readOddsTable() {
  const rows = page.locator('.divide-y.divide-border > div.grid.grid-cols-4');
  const count = await rows.count();
  const odds = [];
  const highlighted = [];
  for (let i = 0; i < count; i++) {
    const row = rows.nth(i);
    const levelText = (await row.locator('div').first().textContent())?.trim() ?? '';
    const oddsText = (await row.locator('div').nth(2).textContent())?.trim() ?? '';
    const cls = (await row.getAttribute('class')) ?? '';
    odds.push(oddsText);
    if (cls.includes('bg-muted/50')) highlighted.push(levelText);
  }
  return { odds, highlighted, rowCount: count };
}

async function isDropdownOpen(kind) {
  if (kind === 'job') {
    return page.locator('.z-50.w-full.mt-2.bg-card').isVisible();
  }
  const panels = page.locator('.z-40.w-full.mt-2.bg-card');
  const n = await panels.count();
  if (n === 0) return false;
  if (kind === 'state') {
    return panels.first().isVisible();
  }
  return panels.last().isVisible();
}

// --- Step 2: hydration + islands ---
await gotoTool();

const islandEls = page.locator('astro-island');
const islandCount = await islandEls.count();
const islands = [];
for (let i = 0; i < islandCount; i++) {
  const el = islandEls.nth(i);
  const client = (await el.getAttribute('client')) ?? '(none)';
  const url = (await el.getAttribute('component-url')) ?? '';
  const name = url.split('/').pop()?.replace(/\.tsx$/, '') ?? `island-${i}`;
  islands.push({ name, client });
}

const hydration = hydrationIssues([...consoleErrors, ...pageErrors]);
const expectedIslands = ['Header', 'Breadcrumb', 'H1BLotteryCalculatorMainContent', 'Footer', 'Toaster'];
const islandNames = islands.map((i) => i.name);
const missingIslands = expectedIslands.filter(
  (n) => !islandNames.some((x) => x.toLowerCase().includes(n.toLowerCase()))
);

results.push({
  step: '2-hydration-islands',
  ok: hydration.length === 0 && missingIslands.length === 0,
  detail: JSON.stringify({
    consoleErrors: consoleErrors.length ? consoleErrors : 'none',
    pageErrors: pageErrors.length ? pageErrors : 'none',
    hydrationIssues: hydration.length ? hydration : 'none',
    islands,
    missingIslands: missingIslands.length ? missingIslands : 'none',
  }),
});

// --- Step 3a: job → Step 2 unlocks ---
await gotoTool();
await selectJob('Software Engineer');
const step2Visible = await page.locator('text=Select SOC Code').isVisible();
const step3Hidden = !(await page.locator('text=Select Location').isVisible());
results.push({
  step: '3a-job-unlocks-step2',
  ok: step2Visible && step3Hidden,
  detail: `step2Visible=${step2Visible} step3HiddenBeforeSoc=${step3Hidden}`,
});

// --- Step 3b: SOC + odds table ---
await selectSoc('Software Engineers (General)');
const step3Visible = await page.locator('text=Select Location').isVisible();
await selectState('California');
await page.locator('button', { hasText: 'Select County' }).click();
await page.locator('button', { hasText: 'Los Angeles County' }).click();
await page.waitForTimeout(600);

const { odds, highlighted, rowCount } = await readOddsTable();
const oddsMatch = EXPECTED_ODDS.every((v, i) => odds[i] === v);
const summaryTitle = (await page.getByRole('heading', { name: /Software Engineers \(General\)/ }).textContent())?.trim();
const locationText = (await page.locator('.lg\\:col-span-7').getByText('Los Angeles, California').textContent())?.trim();

results.push({
  step: '3b-soc-odds-table',
  ok: step3Visible && rowCount === 4 && oddsMatch && highlighted.includes('Level 2'),
  detail: JSON.stringify({
    step3VisibleAfterSoc: step3Visible,
    selectedSoc: 'Software Engineers (General) — level 2',
    summaryTitle,
    locationText,
    oddsDisplayed: odds,
    expectedOdds: EXPECTED_ODDS,
    oddsMatch,
    highlightedRow: highlighted,
    expectedHighlight: 'Level 2',
  }),
});

// --- Step 3c–3f: county flows (single session) ---
await gotoTool();
await selectJob('Software Engineer');
await selectSoc('Software Engineers (General)');
await selectState('California');
const countyDropdownBtn = page.locator('.grid.grid-cols-1.md\\:grid-cols-2.gap-4 button').nth(1);

const dropdownVisible3c = await countyDropdownBtn.isVisible();
const inputVisible3c = await page.locator('input[placeholder="Enter County..."]').isVisible();
await countyDropdownBtn.click();
const laVisible = await page.locator('button', { hasText: 'Los Angeles County' }).isVisible();
const otherVisible = await page.locator('button', { hasText: 'Other...' }).isVisible();
results.push({
  step: '3c-california-county-dropdown',
  ok: dropdownVisible3c && !inputVisible3c && laVisible && otherVisible,
  detail: `dropdownVisible=${dropdownVisible3c} textInputVisible=${inputVisible3c} LosAngeles=${laVisible} Other=${otherVisible}`,
});

// --- Step 3d: listed county — no prompt ---
let promptOnListed = false;
const listedDialogHandler = async (d) => {
  promptOnListed = true;
  await d.dismiss();
};
page.on('dialog', listedDialogHandler);
await page.locator('button', { hasText: 'Los Angeles County' }).click();
await page.waitForTimeout(400);
page.off('dialog', listedDialogHandler);
const countyLabel3d = (await countyDropdownBtn.textContent())?.trim();
results.push({
  step: '3d-listed-county-no-prompt',
  ok: !promptOnListed && countyLabel3d === 'Los Angeles',
  detail: `promptFired=${promptOnListed} countyButtonText="${countyLabel3d}"`,
});

// --- Step 3e: Other... fires prompt ---
await countyDropdownBtn.click();
let promptOnOther = false;
let promptMessage = '';
const otherDialogHandler = async (d) => {
  promptOnOther = true;
  promptMessage = d.message();
  await d.accept('Marin');
};
page.on('dialog', otherDialogHandler);
await page.locator('button', { hasText: 'Other...' }).click();
await page.waitForTimeout(400);
page.off('dialog', otherDialogHandler);
const customCounty = (await countyDropdownBtn.textContent())?.trim();
results.push({
  step: '3e-other-prompt',
  ok: promptOnOther && promptMessage === 'Enter County:' && customCounty === 'Marin',
  detail: `promptFired=${promptOnOther} message="${promptMessage}" countyAfterAccept="${customCounty}"`,
});

// --- Step 3f: scrollIntoView (county Marin already set, results visible) ---
const inViewportAfter = await page.evaluate(() => {
  const el = document.querySelector('.lg\\:col-span-7.space-y-6');
  if (!el) return { found: false };
  const r = el.getBoundingClientRect();
  const vh = window.innerHeight;
  return {
    found: true,
    top: Math.round(r.top),
    bottom: Math.round(r.bottom),
    partiallyVisible: r.top < vh && r.bottom > 0,
    nearTop: r.top >= -50 && r.top < vh * 0.6,
  };
});
results.push({
  step: '3f-scroll-into-view',
  ok: inViewportAfter.found && (inViewportAfter.partiallyVisible || inViewportAfter.nearTop),
  detail: JSON.stringify(inViewportAfter),
});

// --- Step 4: click-outside all 3 dropdowns ---
async function testClickOutside(name, setupFn, openFn, panelSelector) {
  await gotoTool();
  await setupFn();
  await openFn();
  await page.waitForTimeout(200);
  const openBefore = await page.locator(panelSelector).first().isVisible();
  await page.locator('h1').first().click({ force: true });
  await page.waitForTimeout(300);
  const openAfter = await page.locator(panelSelector).first().isVisible().catch(() => false);
  return { name, openBefore, openAfter, closed: openBefore && !openAfter };
}

const jobOutside = await testClickOutside(
  'job',
  async () => {},
  async () => {
    await page.locator('input[placeholder="e.g. Software Engineer"]').click();
  },
  '.z-50.w-full.mt-2.bg-card'
);

const stateOutside = await testClickOutside(
  'state',
  async () => {
    await selectJob('Software Engineer');
    await selectSoc('Software Engineers (General)');
  },
  async () => {
    await page.locator('button', { hasText: 'Select State' }).click();
  },
  '.z-40.w-full.mt-2.bg-card'
);

const countyOutside = await testClickOutside(
  'county',
  async () => {
    await selectJob('Software Engineer');
    await selectSoc('Software Engineers (General)');
    await selectState('California');
  },
  async () => {
    await page.locator('.grid.grid-cols-1.md\\:grid-cols-2.gap-4 button').nth(1).click();
  },
  '.z-40.w-full.mt-2.bg-card'
);

results.push({
  step: '4-click-outside',
  ok: jobOutside.closed && stateOutside.closed && countyOutside.closed,
  detail: JSON.stringify({ jobOutside, stateOutside, countyOutside }),
});

// --- Step 5: low-odds CTA branch ---
await gotoTool();
await selectJob('Business Analyst');
await selectSoc('Business Analysts (General)');
await selectState('Texas');
await page.locator('button', { hasText: 'Select County' }).click();
await page.locator('button', { hasText: 'Harris County' }).click();
await page.waitForTimeout(600);

const lowOddsTable = await readOddsTable();
const lowLabel = await page.locator('text=Your Odds Are Low').textContent().catch(() => null);
const lowHeadline = await page
  .locator('section.bg-background.border-t h2')
  .textContent()
  .catch(() => '');
const exploreLink = await page.locator('a[href="/pathways/h1b-to-green-card"]').isVisible();
const scheduleBtnVisible = await page.locator('button', { hasText: 'Schedule a Call' }).isVisible();

results.push({
  step: '5-low-odds-cta',
  ok:
    lowOddsTable.highlighted.includes('Level 1') &&
    lowOddsTable.odds[0] === '25.2%' &&
    parseFloat(lowOddsTable.odds[0]) < 30 &&
    !!lowLabel &&
    lowHeadline?.includes('Tired of the lottery') &&
    exploreLink &&
    !scheduleBtnVisible,
  detail: JSON.stringify({
    job: 'Business Analyst',
    soc: 'Business Analysts (General) level 1',
    userOdds: lowOddsTable.odds[0],
    highlighted: lowOddsTable.highlighted,
    ctaLabel: lowLabel?.trim(),
    headline: lowHeadline?.trim(),
    exploreEb5Link: exploreLink,
    scheduleCallButton: scheduleBtnVisible,
  }),
});

// --- Step 5b: high-odds CTA branch ---
await gotoTool();
await selectJob('Software Engineer');
await selectSoc('Software Engineers (General)');
await selectState('California');
await page.locator('button', { hasText: 'Select County' }).click();
await page.locator('button', { hasText: 'Santa Clara County' }).click();
await page.waitForTimeout(600);

const highLabel = await page.locator('text=Beyond the H-1B Lottery').textContent();
const highHeadline = await page.locator('section.bg-background.border-t h2').textContent();
const scheduleVisible = await page.locator('button', { hasText: 'Schedule a Call' }).isVisible();
results.push({
  step: '5b-high-odds-cta',
  ok: !!highLabel && highHeadline?.includes('path forward beyond H-1B') && scheduleVisible,
  detail: JSON.stringify({
    ctaLabel: highLabel?.trim(),
    headline: highHeadline?.trim(),
    scheduleCallButton: scheduleVisible,
  }),
});

// --- Step 6: ScheduleCallCTA form ---
let formcarryStatus = null;
page.on('response', (resp) => {
  if (resp.url().includes('formcarry.com')) formcarryStatus = resp.status();
});

await page.locator('button', { hasText: 'Schedule a Call' }).click();
await page.waitForTimeout(500);
const sheetOpen = await page.locator('[role="dialog"]').isVisible();

await page.locator('#firstName').fill('VerifyTest');
await page.locator('#lastName').fill('H1BUser');
await page.locator('#email').fill('verify.h1b@university.edu');
await page.getByRole('combobox').click();
await page.getByRole('option', { name: 'H-1B' }).click();
await page.getByRole('button', { name: 'Submit Your Inquiry' }).click();
await page.waitForTimeout(3500);

const thankToast = page.locator('[data-state="open"]').filter({ hasText: "We'll be in touch" });
const toastVisible = (await thankToast.count()) > 0;
const submittedState = await page.locator('text=Thank you').first().isVisible().catch(() => false);

results.push({
  step: '6-schedule-call-form',
  ok: sheetOpen && (formcarryStatus === 200 || toastVisible || submittedState),
  detail: JSON.stringify({
    sheetOpened: sheetOpen,
    formcarryStatus: formcarryStatus ?? 'not observed',
    toastVisible,
    submittedState,
  }),
});

await browser.close();

// --- Step 8: dist check (when run after build) ---
const distFile = path.join('dist', 'tools', 'h1b-lottery-odds-calculator', 'index.html');
let distResult = null;
if (fs.existsSync(distFile)) {
  const html = fs.readFileSync(distFile, 'utf8');
  const attrPattern = /(?:src|href)=["']([^"']*(?:\/@fs\/|\/src\/assets\/)[^"']*)["']/g;
  const badPaths = [...html.matchAll(attrPattern)].map((m) => m[1]);
  distResult = {
    exists: true,
    hasAtFs: html.includes('/@fs/'),
    hasSrcAssets: html.includes('/src/assets/'),
    badAttrPaths: badPaths,
    clean: badPaths.length === 0 && !html.includes('/@fs/'),
  };
}

console.log(`\n=== H-1B Lottery Calculator Verification ===`);
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
  console.log(`${mark} | 8-dist-dev-paths`);
  console.log(`     ${JSON.stringify(distResult)}\n`);
} else {
  console.log(`SKIP | 8-dist-dev-paths`);
  console.log(`     dist file not found yet — run after npm run build\n`);
}

process.exit(failed > 0 ? 1 : 0);
