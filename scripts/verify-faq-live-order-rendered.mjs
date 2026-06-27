/**
 * Live site (Playwright card links) vs local preview (static HTML regex).
 */
import { chromium } from 'playwright';

const LOCAL = process.argv[2] ?? 'http://localhost:4322';
const LIVE = 'https://www.studenteb5.com';

const pages = [
  'what-is-eb5-visa-program',
  'family-members-included',
  'h1b-grace-period-eb5-options',
];

function extractLocal(html) {
  const relatedSection =
    html.match(/Related Questions[\s\S]*?(?=Still Have Questions|<\/main>)/)?.[0] ?? '';
  return [
    ...relatedSection.matchAll(/href="(?:https:\/\/www\.studenteb5\.com)?\/faq\/([^"]+)"/g),
  ].map((m) => m[1]);
}

async function extractLiveCardSlugs(page) {
  const cards = page.locator('h2', { hasText: 'Related Questions' }).locator('xpath=following-sibling::div[1]/a');
  const count = await cards.count();
  const slugs = [];
  for (let i = 0; i < count; i++) {
    const href = await cards.nth(i).getAttribute('href');
    const match = href?.match(/\/faq\/([^/?#]+)/);
    if (match) slugs.push(match[1]);
  }
  return slugs;
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

console.log('=== LIVE (rendered cards) vs LOCAL (static HTML) ===\n');
let failed = 0;

for (const slug of pages) {
  await page.goto(`${LIVE}/faq/${slug}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  const liveHrefs = await extractLiveCardSlugs(page);

  const localHtml = await (await fetch(`${LOCAL}/faq/${slug}`)).text();
  const localHrefs = extractLocal(localHtml);

  const match =
    liveHrefs.length === localHrefs.length &&
    liveHrefs.every((s, i) => s === localHrefs[i]);

  console.log(`/faq/${slug}`);
  console.log(`  Live:  ${liveHrefs.join(' | ') || '(none)'}`);
  console.log(`  Local: ${localHrefs.join(' | ') || '(none)'}`);
  console.log(`  Order match: ${match ? 'PASS' : 'FAIL'}`);
  console.log('');

  if (!match) failed++;
}

await browser.close();
process.exit(failed > 0 ? 1 : 0);
