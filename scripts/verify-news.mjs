import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const BASE = process.argv[2] ?? 'http://localhost:4322';
const MODE = process.argv[3] ?? 'dev';

const ARTICLES = [
  {
    slug: 'eb5-visa-landscape-news-update-may-2026',
    title: 'EB-5 Visa Landscape News Update May 2026',
    hasTable: true,
    hasFaq: true,
    faqSchema: true,
    internalLinks: [
      '/tools/grandfathering-countdown',
      '/pathways/h1b-to-green-card',
      '/tools/eb5-regional-center-scorecard',
    ],
  },
  {
    slug: 'uscis-adjustment-of-status-memo-eb5-investors',
    title: 'Navigating the USCIS Adjustment of Status Memo',
    hasTable: false,
    hasFaq: false,
    faqSchema: false,
    internalLinks: ['/research/post-reform-integrity-act-analysis'],
    ctaHref: '/pathways/h1b-to-green-card',
  },
  {
    slug: 'july-2026-visa-bulletin-eb5-q3-outlook',
    title: 'EB-5 Investor Outlook for Q3',
    hasTable: false,
    hasFaq: true,
    faqSchema: true,
    internalLinks: [
      '/research/policy/eb5-grandfathering-september-2026',
      '/tools/grandfathering-countdown',
    ],
    externalLink: {
      href: 'https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin/2026/visa-bulletin-for-july-2026.html',
      text: 'Visa Bulletin for July 2026',
    },
  },
];

const BOGUS_SLUG = 'this-news-article-does-not-exist-xyz123';

function hydrationIssues(errors) {
  return errors.filter(
    (e) =>
      /hydrat/i.test(e) ||
      /mismatch/i.test(e) ||
      /did not match/i.test(e) ||
      /Recoverable/i.test(e)
  );
}

function parseJsonLd(html) {
  const scripts = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  return scripts.map((m) => {
    try {
      return JSON.parse(m[1]);
    } catch {
      return null;
    }
  }).filter(Boolean);
}

function findFaqSchema(schemas) {
  return schemas.find((s) => s['@type'] === 'FAQPage' || (Array.isArray(s) && s.some((x) => x['@type'] === 'FAQPage')));
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const consoleErrors = [];
const pageErrors = [];

page.on('console', (msg) => {
  if (msg.type() === 'error') consoleErrors.push(msg.text());
});
page.on('pageerror', (err) => pageErrors.push(err.message));

let pass = true;
const report = (step, ok, detail = '') => {
  const status = ok ? 'PASS' : 'FAIL';
  if (!ok) pass = false;
  console.log(`  ${status}${detail ? ` — ${detail}` : ''}`);
};

console.log(`=== NEWS verification @ ${BASE} (${MODE}) ===\n`);

// Step 2 — listing
console.log('Step 2 — /news listing');
const listResp = await page.goto(`${BASE}/news`, { waitUntil: 'networkidle' });
await page.waitForTimeout(800);
report('HTTP status', listResp?.status() === 200, `status ${listResp?.status()}`);
report('h1 present', !!(await page.locator('h1').filter({ hasText: 'EB-5 Immigration News' }).count()));
const cardCount = await page.locator('main a[href^="/news/"]').count();
report('3 article cards', cardCount === 3, `found ${cardCount}`);

const listHydr = hydrationIssues([...consoleErrors, ...pageErrors]);
report('hydration errors', listHydr.length === 0, listHydr.join('; ') || 'none');
report('console errors', consoleErrors.length === 0, consoleErrors.join('; ') || 'none');

const islands = page.locator('astro-island');
const islandCount = await islands.count();
console.log('  Islands:');
for (let i = 0; i < islandCount; i++) {
  const el = islands.nth(i);
  const client = (await el.getAttribute('client')) ?? '(none)';
  const url = (await el.getAttribute('component-url')) ?? '';
  const name = url.split('/').pop()?.replace(/\.tsx$/, '') ?? `island-${i}`;
  console.log(`    ${name}: client:${client}`);
}
const expectedIslands = ['Header', 'Breadcrumb', 'ConsultationCTA', 'Footer', 'Toaster'];
for (const name of expectedIslands) {
  const found = await page.locator(`astro-island[component-url*="${name}"]`).count();
  if (name === 'ConsultationCTA' || name === 'Toaster' || name === 'Footer') {
    report(`${name} island`, found > 0);
  }
}

// Step 3 — each article
for (const article of ARTICLES) {
  console.log(`\nStep 3 — /news/${article.slug}`);
  consoleErrors.length = 0;
  pageErrors.length = 0;

  const resp = await page.goto(`${BASE}/news/${article.slug}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  report('HTTP status', resp?.status() === 200, `status ${resp?.status()}`);

  const h1 = await page.locator('h1').first().textContent();
  report('h1 renders', h1?.includes(article.title.split('&')[0].trim().slice(0, 20)) ?? false, `"${h1?.trim().slice(0, 60)}..."`);

  const hydr = hydrationIssues([...consoleErrors, ...pageErrors]);
  report('hydration errors', hydr.length === 0, hydr.join('; ') || 'none');
  report('console errors', consoleErrors.length === 0, consoleErrors.join('; ') || 'none');

  if (article.hasTable) {
    const table = page.locator('table');
    const tableCount = await table.count();
    const ruralCell = await page.locator('td', { hasText: 'Rural Projects' }).count();
    const headerCell = await page.locator('th', { hasText: 'Adjudication Speed' }).count();
    report('data table renders', tableCount === 1 && ruralCell === 1 && headerCell === 1);
  }

  if (article.hasFaq) {
    const faqHeading = await page.locator('h2', { hasText: 'Frequently Asked Questions' }).count();
    const faqQ = await page.locator('h3', { hasText: /grandfathering|What does the "U"/ }).count();
    report('FAQ section in DOM', faqHeading === 1 && faqQ >= 1, `h2=${faqHeading}, h3=${faqQ}`);
  }

  if (article.faqSchema) {
    const html = await page.content();
    const schemas = parseJsonLd(html);
    const flat = schemas.flatMap((s) => (Array.isArray(s) ? s : [s]));
    const faqSchema = flat.find((s) => s['@type'] === 'FAQPage');
    const entityCount = faqSchema?.mainEntity?.length ?? 0;
    report('FAQ JSON-LD schema', !!faqSchema && entityCount >= 3, `FAQPage with ${entityCount} questions`);
  }

  if (article.externalLink) {
    const link = page.locator(`a[href="${article.externalLink.href}"]`);
    const target = await link.getAttribute('target');
    const rel = await link.getAttribute('rel');
    report('travel.state.gov link', (await link.count()) === 1, article.externalLink.href);
    report('target="_blank"', target === '_blank', target ?? 'missing');
    report('rel="noopener noreferrer"', rel === 'noopener noreferrer', rel ?? 'missing');
  }

  for (const href of article.internalLinks) {
    const link = page.locator(`a[href="${href}"]`).first();
    const count = await link.count();
    const actual = count ? await link.getAttribute('href') : null;
    report(`internal link ${href}`, count > 0 && actual === href, actual ?? 'not found');
  }

  if (article.ctaHref) {
    const cta = page.locator(`a[href="${article.ctaHref}"]`).last();
    report(`CTA href ${article.ctaHref}`, (await cta.count()) > 0);
  }
}

// Step 4 — bogus slug → 404
console.log(`\nStep 4 — bogus slug /news/${BOGUS_SLUG}`);
consoleErrors.length = 0;
const bogusResp = await page.goto(`${BASE}/news/${BOGUS_SLUG}`, { waitUntil: 'networkidle' });
await page.waitForTimeout(500);
const bogusH1 = await page.locator('h1').first().textContent();
report('HTTP 404', bogusResp?.status() === 404, `status ${bogusResp?.status()}`);
report('404 page UI', bogusH1?.trim() === '404', `h1="${bogusH1?.trim()}"`);

await browser.close();

console.log(`\nOverall (${MODE}): ${pass ? 'PASS' : 'FAIL'}`);
process.exit(pass ? 0 : 1);
