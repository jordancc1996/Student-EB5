import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.goto('http://localhost:4322/resources', { waitUntil: 'networkidle' });

const mainLinks = await page.locator('main a[target="_blank"]').evaluateAll((els) =>
  els.map((el) => ({
    href: el.getAttribute('href'),
    rel: el.getAttribute('rel'),
    target: el.getAttribute('target'),
  }))
);

console.log(`main[target=_blank] count: ${mainLinks.length}`);
const bad = mainLinks.filter((l) => !l.rel?.includes('noopener') || !l.rel?.includes('noreferrer'));
console.log(`missing noopener/noreferrer in main: ${bad.length}`);
if (bad.length) bad.forEach((l) => console.log('  BAD:', l.href));

await browser.close();
process.exit(bad.length > 0 ? 1 : 0);
