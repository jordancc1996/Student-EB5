import { chromium } from 'playwright';

const LOCAL = 'http://localhost:4322';
const slug = 'what-is-eb5-visa-program';

function extract(html) {
  const sec = html.match(/Related Questions[\s\S]*?(?=Still Have Questions|<\/main>)/)?.[0] ?? '';
  return [...sec.matchAll(/href="(?:https:\/\/www\.studenteb5\.com)?\/faq\/([^"]+)"/g)].map((m) => m[1]);
}

const fetchHtml = await (await fetch(`${LOCAL}/faq/${slug}`)).text();
console.log('fetch:', extract(fetchHtml));

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.goto(`${LOCAL}/faq/${slug}`, { waitUntil: 'networkidle' });
const pwHtml = await page.content();
console.log('playwright:', extract(pwHtml));
console.log('section length fetch vs pw:', 
  (fetchHtml.match(/Related Questions[\s\S]*?(?=Still Have Questions|<\/main>)/)?.[0] ?? '').length,
  (pwHtml.match(/Related Questions[\s\S]*?(?=Still Have Questions|<\/main>)/)?.[0] ?? '').length
);
await browser.close();
