import { chromium } from 'playwright';

const url = 'http://localhost:4322/faq/h1b-grace-period-eb5-options';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(500);

const cardCount = await page.locator('h2', { hasText: 'Related Questions' }).locator('xpath=following-sibling::div[1]/a').count();
const cardTitles = await page.locator('h2', { hasText: 'Related Questions' }).locator('xpath=following-sibling::div[1]/a//h3').allTextContents();

console.log('Visible related FAQ cards in DOM:', cardCount);
console.log('Card titles:');
cardTitles.forEach((t, i) => console.log(`  ${i + 1}. ${t.trim()}`));

await browser.close();
