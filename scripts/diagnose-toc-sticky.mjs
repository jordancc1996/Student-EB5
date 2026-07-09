import {
  configurePlaywrightBrowsersPath,
  launchChromium,
} from './lib/playwright-env.mjs';

configurePlaywrightBrowsersPath();

const BASE = process.env.PREVIEW_URL || 'http://localhost:4400';
const URL = `${BASE}/research/complete-2027-eb5-guide`;

const browser = await launchChromium();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(URL, { waitUntil: 'networkidle' });

const measure = async () =>
  page.evaluate(() => {
    const toc = document.querySelector('.article-toc');
    const track = document.querySelector('.article-toc-track');
    const main = document.querySelector('.article-with-toc__main');
    const label = document.querySelector('nav.article-toc .article-toc__label');
    const disclaimer = document.querySelector('.article-legal-disclaimer');
    const footer = document.querySelector('article footer');
    if (!toc || !track) return { error: 'missing toc' };

    const tocCs = getComputedStyle(toc);
    const rect = label?.getBoundingClientRect() ?? toc.getBoundingClientRect();
    const disclaimerRect = disclaimer?.getBoundingClientRect();
    const footerRect = footer?.getBoundingClientRect();

    return {
      scrollY: window.scrollY,
      viewportTop: Math.round(rect.top),
      disclaimerTop: disclaimerRect ? Math.round(disclaimerRect.top) : null,
      disclaimerAlignDelta:
        disclaimerRect != null ? Math.round(rect.top - disclaimerRect.top) : null,
      inViewport: rect.top >= 0 && rect.top < window.innerHeight,
      position: tocCs.position,
      top: tocCs.top,
      marginTop: tocCs.marginTop,
      paddingTop: tocCs.paddingTop,
      tocTopVar: getComputedStyle(document.documentElement).getPropertyValue('--toc-top').trim(),
      trackHeight: Math.round(track.getBoundingClientRect().height),
      mainHeight: main ? Math.round(main.getBoundingClientRect().height) : null,
      footerTop: footerRect ? Math.round(footerRect.top) : null,
      overlapsFooter: footerRect ? rect.bottom > footerRect.top && rect.top < footerRect.bottom : null,
    };
  });

const atLoad = await measure();
await page.evaluate(() => window.scrollTo(0, 700));
await page.waitForTimeout(200);
const atPin = await measure();
await page.evaluate(() => window.scrollTo(0, 2000));
await page.waitForTimeout(200);
const at2000 = await measure();
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page.waitForTimeout(200);
const atEnd = await measure();

const expectedTop = parseFloat(atLoad.tocTopVar) || 90;
const pass =
  atLoad.inViewport === true &&
  Math.abs(atLoad.disclaimerAlignDelta ?? 999) <= 4 &&
  Math.abs(atPin.viewportTop - expectedTop) < 4 &&
  Math.abs(at2000.viewportTop - expectedTop) < 4 &&
  atEnd.overlapsFooter !== true;

console.log(JSON.stringify({ atLoad, atPin, at2000, atEnd, expectedTop, pass }, null, 2));
await browser.close();
process.exit(pass ? 0 : 1);
