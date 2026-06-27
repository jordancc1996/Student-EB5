/**
 * Compare related FAQ order: local preview vs live site (after JS render).
 */
import { chromium } from 'playwright';

const LOCAL = process.argv[2] ?? 'http://localhost:4322';
const LIVE = 'https://www.studenteb5.com';

const pages = [
  'what-is-eb5-visa-program',
  'family-members-included',
  'h1b-grace-period-eb5-options',
];

async function extractRelatedSlugs(page) {
  const section = page.locator('h2', { hasText: 'Related Questions' }).locator('..');
  const hrefs = await section.locator('a[href*="/faq/"]').evaluateAll((anchors) =>
    anchors
      .map((a) => {
        const match = a.getAttribute('href')?.match(/\/faq\/([^/?#]+)/);
        return match?.[1] ?? null;
      })
      .filter(Boolean),
  );
  return hrefs;
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

console.log('=== LIVE vs LOCAL RELATED ORDER (rendered DOM) ===\n');
let failed = 0;

for (const slug of pages) {
  await page.goto(`${LIVE}/faq/${slug}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  const liveHrefs = await extractRelatedSlugs(page);

  await page.goto(`${LOCAL}/faq/${slug}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  const localHrefs = await extractRelatedSlugs(page);

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
