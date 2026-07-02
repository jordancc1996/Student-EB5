import { chromium } from 'playwright';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const BASE = process.env.BASE_URL || process.argv[2] || 'http://localhost:4321';
const PATH = '/pathways';
const results = [];

function pass(step, detail) {
  results.push({ step, status: 'PASS', detail });
  console.log(`✓ Step ${step}: PASS — ${detail}`);
}
function fail(step, detail) {
  results.push({ step, status: 'FAIL', detail });
  console.log(`✗ Step ${step}: FAIL — ${detail}`);
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const consoleErrors = [];
  const hydrationWarnings = [];
  page.on('console', (msg) => {
    const text = msg.text();
    if (msg.type() === 'error') consoleErrors.push(text);
    if (/hydration|mismatch/i.test(text)) hydrationWarnings.push(text);
  });
  page.on('pageerror', (err) => consoleErrors.push(err.message));

  await page.goto(`${BASE}${PATH}`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.locator('text=Grandfathering Deadline').scrollIntoViewIfNeeded();
  await page.waitForTimeout(2500);

  const islands = await page.locator('astro-island').evaluateAll((els) =>
    els.map((el) => ({
      name: (el.getAttribute('component-url') || '').split('/').pop()?.replace(/\.tsx$/, '') || 'unknown',
      client: el.getAttribute('client') || '',
    })),
  );

  const hasHeader = islands.some((i) => i.name.includes('Header') && i.client === 'load');
  const hasCountdown = islands.some((i) => i.name.includes('PathwaysCountdownBanner') && i.client === 'visible');
  const hasFooter = islands.some((i) => i.name.includes('Footer') && i.client === 'visible');

  if (hasHeader && hasCountdown && hasFooter) {
    pass(2, `Islands: ${islands.map((i) => `${i.name}(${i.client})`).join(', ')}`);
  } else {
    fail(2, `Missing island — Header=${hasHeader}, Countdown=${hasCountdown}, Footer=${hasFooter}; all=${JSON.stringify(islands)}`);
  }

  if (consoleErrors.length === 0 && hydrationWarnings.length === 0) {
    pass(2, 'No console errors or hydration warnings');
  } else {
    fail(2, `Console: ${consoleErrors.join('; ') || 'none'}. Hydration: ${hydrationWarnings.join('; ') || 'none'}`);
  }

  const daysText = await page.locator('text=Days').locator('..').locator('span.text-2xl').first().textContent();
  const hoursText = await page.locator('text=Hours').locator('..').locator('span.text-2xl').first().textContent();
  const minsText = await page.locator('text=Min').locator('..').locator('span.text-2xl').first().textContent();
  const days = parseInt(daysText?.trim() || '0', 10);
  const hours = parseInt(hoursText?.trim() || '0', 10);
  const minutes = parseInt(minsText?.trim() || '0', 10);

  if (days > 0 && hours >= 0 && minutes >= 0) {
    pass(3, `Countdown renders: ${days} days, ${hours} hours, ${minutes} min`);
  } else {
    fail(3, `Countdown values: days=${days}, hours=${hours}, minutes=${minutes} (raw: ${daysText}/${hoursText}/${minsText})`);
  }

  const h1bHref = await page.locator('a:has-text("I Am an H-1B Professional")').getAttribute('href');
  const studentHref = await page.locator('a:has-text("I Am an International Student")').getAttribute('href');
  if (h1bHref === '/pathways/h1b-to-green-card' && studentHref === '/pathways/f1-to-eb5-self-sponsored-green-card') {
    pass(4, `H-1B=${h1bHref}, Student=${studentHref}`);
  } else {
    fail(4, `H-1B=${h1bHref}, Student=${studentHref}`);
  }

  const learnMoreHref = await page.locator('a[href="/tools/grandfathering-countdown"]').getAttribute('href');
  if (learnMoreHref === '/tools/grandfathering-countdown') {
    pass(5, `Learn More → ${learnMoreHref}`);
  } else {
    fail(5, `Learn More href=${learnMoreHref}`);
  }

  const briefcaseSvg = await page.locator('a[href="/pathways/h1b-to-green-card"] svg').count();
  const alertSvg = await page.locator('section.bg-foreground svg').first().count();
  if (briefcaseSvg >= 1 && alertSvg >= 1) {
    pass(6, `LucideIcon SSR — Briefcase card svg=${briefcaseSvg}, AlertTriangle banner svg=${alertSvg}`);
  } else {
    fail(6, `Lucide SSR — Briefcase=${briefcaseSvg}, AlertTriangle=${alertSvg}`);
  }

  await browser.close();

  const failed = results.filter((r) => r.status === 'FAIL');
  console.log('\n--- SUMMARY ---');
  console.log(`Passed: ${results.filter((r) => r.status === 'PASS').length}, Failed: ${failed.length}`);
  if (failed.length) process.exitCode = 1;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
