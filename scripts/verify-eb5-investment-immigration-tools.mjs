import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const BASE = process.argv[2] ?? 'http://localhost:4321';
const MODE = process.argv[3] ?? 'dev';
const HUB_PATH = '/eb5-investment-immigration-tools';

const EXPECTED_TOOLS = [
  { title: 'Tuition Savings Calculator', href: '/tools/tuition-calculator' },
  { title: 'Grandfathering Countdown', href: '/tools/grandfathering-countdown' },
  { title: 'OPT Calculator', href: '/tools/opt-calculator' },
  { title: 'H-1B Lottery Odds Calculator', href: '/tools/h1b-lottery-odds-calculator' },
  { title: 'EB-5 Feasibility Calculator', href: '/tools/2026-eb5-investment-feasibility-calculator' },
  { title: 'Source of Funds Calculator', href: '/tools/source-of-funds-calculator' },
];

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

await page.goto(`${BASE}${HUB_PATH}`, { waitUntil: 'networkidle', timeout: 60000 });
await page.waitForTimeout(1500);

// Step 2: islands + hydration
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

const expectedIslands = [
  { name: 'Header', client: 'load' },
  { name: 'Breadcrumb', client: 'load' },
  { name: 'Footer', client: 'visible' },
];

const islandChecks = expectedIslands.map((exp) => {
  const found = islands.find((i) => i.name.toLowerCase().includes(exp.name.toLowerCase()));
  return {
    ...exp,
    found: !!found,
    actualClient: found?.client ?? null,
    clientMatch: found?.client === exp.client,
  };
});

const toolsHubIsland = islands.find((i) => i.name.toLowerCase().includes('toolshub'));
const hydration = hydrationIssues([...consoleErrors, ...pageErrors]);

console.log('=== STEP 2: Console / hydration ===');
console.log(JSON.stringify({ mode: MODE, islands, islandChecks, toolsHubIsIsland: !!toolsHubIsland, consoleErrors, pageErrors, hydrationIssues: hydration }, null, 2));

// Step 3: 6 tool cards
const gridLinks = page.locator('main .grid.md\\:grid-cols-2 a');
const cardCount = await gridLinks.count();
const cards = [];
for (let i = 0; i < cardCount; i++) {
  const link = gridLinks.nth(i);
  const href = (await link.getAttribute('href')) ?? '';
  const title = (await link.locator('h2').textContent())?.trim() ?? '';
  cards.push({ title, href });
}

const cardChecks = EXPECTED_TOOLS.map((exp) => {
  const found = cards.find((c) => c.href === exp.href && c.title === exp.title);
  return { ...exp, found: !!found };
});

console.log('=== STEP 3: Tool cards ===');
console.log(JSON.stringify({ cardCount, cards, cardChecks, pass: cardCount === 6 && cardChecks.every((c) => c.found) }, null, 2));

// Step 4: Feasibility CTA
const cta = page.locator('a', { hasText: 'Check Your EB-5 Feasibility' });
const ctaHref = (await cta.getAttribute('href')) ?? '';
const ctaPass = ctaHref === '/tools/2026-eb5-investment-feasibility-calculator';

console.log('=== STEP 4: Feasibility CTA ===');
console.log(JSON.stringify({ ctaHref, pass: ctaPass }, null, 2));

// Step 5: redirect
const redirectPage = await browser.newPage();
let redirectFinal = '';
redirectPage.on('response', (resp) => {
  if (resp.url().includes('/tools') && resp.status() >= 300 && resp.status() < 400) {
    redirectFinal = resp.headers()['location'] ?? redirectFinal;
  }
});
await redirectPage.goto(`${BASE}/tools`, { waitUntil: 'networkidle', timeout: 60000 });
const redirectUrl = redirectPage.url();
await redirectPage.close();

console.log('=== STEP 5: /tools redirect ===');
console.log(JSON.stringify({ redirectUrl, redirectFinal, pass: redirectUrl.includes('/eb5-investment-immigration-tools') }, null, 2));

// Step 6: JSON-LD ItemList count
const ldScripts = await page.locator('script[type="application/ld+json"]').allTextContents();
let itemListCount = 0;
let collectionDescription = '';
for (const raw of ldScripts) {
  try {
    const data = JSON.parse(raw);
    if (data['@type'] === 'CollectionPage') {
      collectionDescription = data.description ?? '';
      itemListCount = data.mainEntity?.itemListElement?.length ?? 0;
    }
  } catch {
    /* ignore */
  }
}

console.log('=== STEP 6: JSON-LD ItemList ===');
console.log(JSON.stringify({ itemListCount, collectionDescription, pass: itemListCount === 6 }, null, 2));

await browser.close();
