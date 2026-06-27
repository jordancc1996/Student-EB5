/**
 * Fresh forensic check: related FAQ section on h1b-grace-period-eb5-options.
 * Shows raw HTML section + card-level vs all-anchor counts.
 */
import { chromium } from 'playwright';

const BASE = process.argv[2] ?? 'http://localhost:4322';
const slug = 'h1b-grace-period-eb5-options';
const url = `${BASE}/faq/${slug}`;

function extractSection(html) {
  return html.match(/Related Questions[\s\S]*?(?=Still Have Questions|<\/main>)/)?.[0] ?? '';
}

function allFaqHrefs(html) {
  const sec = extractSection(html);
  return [...sec.matchAll(/href="(?:https:\/\/www\.studenteb5\.com)?\/faq\/([^"]+)"/g)].map((m) => m[1]);
}

// --- Static HTML (fetch = what build outputs) ---
const fetchHtml = await (await fetch(url)).text();
const fetchSection = extractSection(fetchHtml);
const fetchHrefs = allFaqHrefs(fetchHtml);

console.log('=== FRESH CHECK: /faq/h1b-grace-period-eb5-options ===\n');
console.log('--- 1. FETCH (static built HTML) ---');
console.log('Card-level href count (regex in section):', fetchHrefs.length);
console.log('Slugs:', fetchHrefs.join(' | '));
console.log('');

// --- Playwright: broken selector (first script logic) ---
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(500);

const brokenHrefs = await page
  .locator('h2', { hasText: 'Related Questions' })
  .locator('..')
  .locator('a[href*="/faq/"]')
  .evaluateAll((anchors) =>
    anchors.map((a) => {
      const m = a.getAttribute('href')?.match(/\/faq\/([^/?#]+)/);
      return m?.[1] ?? null;
    }).filter(Boolean),
  );

const fixedHrefs = await page
  .locator('h2', { hasText: 'Related Questions' })
  .locator('xpath=following-sibling::div[1]/a')
  .evaluateAll((anchors) =>
    anchors.map((a) => {
      const m = a.getAttribute('href')?.match(/\/faq\/([^/?#]+)/);
      return m?.[1] ?? null;
    }).filter(Boolean),
  );

const pwHtml = await page.content();
const pwSection = extractSection(pwHtml);
const pwRegexHrefs = allFaqHrefs(pwHtml);

console.log('--- 2. PLAYWRIGHT (after page load) ---');
console.log('BROKEN selector (h2 parent + all a[href*=/faq/]):', brokenHrefs.length, '→', brokenHrefs.join(' | '));
console.log('FIXED selector (grid direct child <a> only):', fixedHrefs.length, '→', fixedHrefs.join(' | '));
console.log('Regex on page.content() section:', pwRegexHrefs.length, '→', pwRegexHrefs.join(' | '));
console.log('');

console.log('--- 3. RAW HTML: Related Questions section (fetch/static) ---');
console.log(fetchSection.slice(0, 2500));
if (fetchSection.length > 2500) console.log('\n... [truncated, total', fetchSection.length, 'chars]');

await browser.close();
