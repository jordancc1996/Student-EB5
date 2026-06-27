import { chromium } from 'playwright';

const pages = [
  { path: '/news', label: 'Listing', liveCards: 3 },
  {
    path: '/news/eb5-visa-landscape-news-update-may-2026',
    label: 'Landscape May 2026',
    checkTable: true,
    checkFaq: true,
  },
  {
    path: '/news/uscis-adjustment-of-status-memo-eb5-investors',
    label: 'Adjustment Memo',
  },
  {
    path: '/news/july-2026-visa-bulletin-eb5-q3-outlook',
    label: 'July Bulletin',
    checkFaq: true,
    checkStateLink: true,
  },
];

const LOCAL = 'http://localhost:4321';
const LIVE = 'https://www.studenteb5.com';

const browser = await chromium.launch({ headless: true });

console.log('=== Visual/structural check: preview vs live ===\n');
let allOk = true;

for (const entry of pages) {
  console.log(`${entry.label} (${entry.path})`);

  const localPage = await browser.newPage();
  const livePage = await browser.newPage();

  const localResp = (await localPage.goto(`${LOCAL}${entry.path}`, { waitUntil: 'networkidle' }))?.status();
  const liveResp = (await livePage.goto(`${LIVE}${entry.path}`, { waitUntil: 'networkidle' }))?.status();

  const localH1 = (await localPage.locator('h1').first().textContent())?.trim() ?? '';
  const liveH1 = (await livePage.locator('h1').first().textContent())?.trim() ?? '';

  const h1Match = localH1 === liveH1;
  console.log(`  local status: ${localResp} | live status: ${liveResp}`);
  console.log(`  h1 match: ${h1Match ? 'YES' : 'NO'}`);
  if (!h1Match) {
    console.log(`    local: "${localH1.slice(0, 80)}"`);
    console.log(`    live:  "${liveH1.slice(0, 80)}"`);
    allOk = false;
  }

  if (entry.liveCards) {
    const localCards = await localPage.locator('main a[href^="/news/"]').count();
    const liveCards = await livePage.locator('a[href^="/news/"]').count();
    console.log(`  article cards: local=${localCards} (expect 3), live=${liveCards}`);
    if (localCards !== 3) allOk = false;
  }

  if (entry.checkTable) {
    const localTable = await localPage.locator('table td', { hasText: 'Rural Projects' }).count();
    const liveTable = await livePage.locator('table td', { hasText: 'Rural Projects' }).count();
    console.log(`  data table (Rural Projects row): local=${localTable}, live=${liveTable}`);
    if (localTable !== 1 || liveTable !== 1) allOk = false;
  }

  if (entry.checkFaq) {
    const localFaq = await localPage.locator('h2', { hasText: 'Frequently Asked Questions' }).count();
    const liveFaq = await livePage.locator('h2', { hasText: 'Frequently Asked Questions' }).count();
    console.log(`  FAQ section: local=${localFaq}, live=${liveFaq}`);
    if (localFaq !== 1 || liveFaq !== 1) allOk = false;
  }

  if (entry.checkStateLink) {
    const link = localPage.locator('a[href*="travel.state.gov"]');
    const target = await link.getAttribute('target');
    const rel = await link.getAttribute('rel');
    console.log(`  state.gov link target/rel: ${target} / ${rel}`);
    if (target !== '_blank' || rel !== 'noopener noreferrer') allOk = false;
  }

  await localPage.close();
  await livePage.close();

  console.log('');
}

await browser.close();
console.log(allOk ? 'Visual check: PASS' : 'Visual check: ISSUES FOUND');
process.exit(allOk ? 0 : 1);
