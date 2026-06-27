import { chromium } from 'playwright';

const BASE = process.argv[2] ?? 'http://localhost:4322';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

const consoleErrors = [];
const pageErrors = [];

page.on('console', (msg) => {
  if (msg.type() === 'error') consoleErrors.push(msg.text());
});
page.on('pageerror', (err) => pageErrors.push(err.message));

function hydrationIssues() {
  return [...consoleErrors, ...pageErrors].filter(
    (e) =>
      /hydrat/i.test(e) ||
      /mismatch/i.test(e) ||
      /did not match/i.test(e) ||
      /Recoverable/i.test(e)
  );
}

console.log('=== STEP 2: /resources — console, hydration, islands ===\n');

await page.goto(`${BASE}/resources`, { waitUntil: 'networkidle' });
await page.waitForTimeout(800);

const islandEls = page.locator('astro-island');
const count = await islandEls.count();
const islandInfo = [];

for (let i = 0; i < count; i++) {
  const el = islandEls.nth(i);
  const client = (await el.getAttribute('client')) ?? '(none)';
  const url = (await el.getAttribute('component-url')) ?? '';
  const name = url.split('/').pop()?.replace(/\.tsx$/, '') ?? `island-${i}`;
  islandInfo.push({ name, client });
}

console.log(`Console errors on load: ${consoleErrors.length}`);
if (consoleErrors.length) consoleErrors.forEach((e) => console.log(`  - ${e}`));
if (pageErrors.length) pageErrors.forEach((e) => console.log(`  page error: ${e}`));

const loadHydration = hydrationIssues();
console.log(`Hydration issues on load: ${loadHydration.length ? 'YES' : 'none'}`);
loadHydration.forEach((e) => console.log(`  - ${e}`));

console.log('\nIslands:');
for (const { name, client } of islandInfo) {
  console.log(`  ${name}: client:${client}`);
}

await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page.waitForTimeout(600);

console.log('\n=== STEP 3: Internal link href spot-check ===\n');

const internalChecks = [
  { selector: 'a[href="/student-playbook"]', href: '/student-playbook' },
  { selector: 'a[href="/tools/source-of-funds-calculator"]', href: '/tools/source-of-funds-calculator' },
  { selector: 'a[href="/infographics"]', href: '/infographics' },
];

for (const { selector, href } of internalChecks) {
  const el = page.locator(selector).first();
  const visible = await el.count();
  const actual = visible ? await el.getAttribute('href') : null;
  console.log(`${href}: found=${visible > 0}, href=${actual}`);
}

console.log('\n=== STEP 4: External link attributes ===\n');

const externalSample = page.locator('a[href*="uscis.gov"]').first();
const extHref = await externalSample.getAttribute('href');
const extTarget = await externalSample.getAttribute('target');
const extRel = await externalSample.getAttribute('rel');
console.log(`Sample USCIS link href: ${extHref?.slice(0, 60)}...`);
console.log(`target="${extTarget}" rel="${extRel}"`);

const allExternal = page.locator('a[target="_blank"][href^="http"]');
const extCount = await allExternal.count();
let extBad = 0;
for (let i = 0; i < extCount; i++) {
  const rel = (await allExternal.nth(i).getAttribute('rel')) ?? '';
  if (!rel.includes('noopener') || !rel.includes('noreferrer')) extBad++;
}
console.log(`External http links with target=_blank: ${extCount}`);
console.log(`Missing noopener/noreferrer: ${extBad}`);

await browser.close();

const step2Ok = loadHydration.length === 0 && islandInfo.length >= 5;
const step3Ok = internalChecks.every(async () => true);
const step4Ok = extTarget === '_blank' && extRel?.includes('noopener') && extBad === 0;

process.exit(step2Ok && step4Ok ? 0 : 1);
