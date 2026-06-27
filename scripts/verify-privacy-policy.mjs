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

async function sectionInViewport(sectionId) {
  return page.evaluate((id) => {
    const el = document.getElementById(id);
    if (!el) return { found: false, inViewport: false, top: null };
    const rect = el.getBoundingClientRect();
    const inViewport = rect.top >= 0 && rect.top < window.innerHeight * 0.6;
    return { found: true, inViewport, top: Math.round(rect.top) };
  }, sectionId);
}

console.log('=== STEP 2: /privacy-policy — console, hydration, islands ===\n');

await page.goto(`${BASE}/privacy-policy`, { waitUntil: 'networkidle' });
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
await page.waitForTimeout(400);

console.log('\n=== STEP 3: TOC click behavior ===\n');

const tocTests = [
  { label: '1. Introduction', buttonText: '1. Introduction', sectionId: 'introduction' },
  { label: '5. Cookies and Tracking Technologies', buttonText: '5. Cookies and Tracking Technologies', sectionId: 'cookies' },
  { label: '13. Contact Us', buttonText: '13. Contact Us', sectionId: 'contact' },
];

let tocPass = true;

for (const { label, buttonText, sectionId } of tocTests) {
  await page.goto(`${BASE}/privacy-policy`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  await page.evaluate(() => window.scrollTo(0, 0));

  const btn = page.getByRole('button', { name: buttonText });
  const btnVisible = (await btn.count()) > 0;
  await btn.click();
  await page.waitForTimeout(600);

  const result = await sectionInViewport(sectionId);
  const pass = btnVisible && result.found && result.inViewport;
  if (!pass) tocPass = false;

  console.log(`${label}:`);
  console.log(`  button found: ${btnVisible}`);
  console.log(`  section #${sectionId} found: ${result.found}`);
  console.log(`  section in viewport after click (top=${result.top}px): ${result.inViewport ? 'YES' : 'NO'}`);
  console.log(`  result: ${pass ? 'PASS' : 'FAIL'}`);
  console.log('');
}

console.log('=== STEP 4: Hash-scroll-on-load ===\n');

await page.goto(`${BASE}/privacy-policy#contact`, { waitUntil: 'networkidle' });
await page.waitForTimeout(700);

const hashResult = await sectionInViewport('contact');
const hashPass = hashResult.found && hashResult.inViewport;

console.log(`Navigated to: ${BASE}/privacy-policy#contact`);
console.log(`Section #contact found: ${hashResult.found}`);
console.log(`Section in viewport after load (top=${hashResult.top}px): ${hashResult.inViewport ? 'YES' : 'NO'}`);
console.log(`result: ${hashPass ? 'PASS' : 'FAIL'}`);

await browser.close();

const step2Ok = loadHydration.length === 0 && islandInfo.some((i) => i.name.includes('PrivacyPolicy'));
const failed = !step2Ok || !tocPass || !hashPass;
process.exit(failed ? 1 : 0);
