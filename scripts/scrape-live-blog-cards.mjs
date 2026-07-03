import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await (await browser.newContext()).newPage();
await page.goto('https://www.studenteb5.com/pathways/h1b-to-green-card', {
  waitUntil: 'networkidle',
  timeout: 90000,
});
await page.waitForSelector('h2:has-text("Relevant Blog Articles")', { timeout: 30000 });
const cards = await page
  .locator('section:has(h2:has-text("Relevant Blog Articles")) a[href*="/research/"]')
  .evaluateAll((els) =>
    els.map((a) => ({
      href: a.getAttribute('href'),
      title: a.querySelector('h3')?.textContent?.trim() ?? null,
    })),
  );
console.log(JSON.stringify(cards, null, 2));
await browser.close();
