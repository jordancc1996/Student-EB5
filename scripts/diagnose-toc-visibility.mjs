import {
  configurePlaywrightBrowsersPath,
  launchChromium,
} from './lib/playwright-env.mjs';

configurePlaywrightBrowsersPath();

const BASE = process.env.PREVIEW_URL || 'http://localhost:4400';
const URL = `${BASE}/research/complete-2027-eb5-guide`;

const browser = await launchChromium();
for (const width of [1279, 768, 1440]) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  await page.goto(URL, { waitUntil: 'networkidle' });

  const m = await page.evaluate(() => {
    const mobile = document.querySelector('.article-toc-mobile');
    const rail = document.querySelector('nav.article-toc');
    const disclaimer = document.querySelector('.article-legal-disclaimer');
    const intro = document.querySelector('.article-content .article-intro');
    const label = document.querySelector('nav.article-toc .article-toc__label');
    const bc = document.querySelector('nav[aria-label="Breadcrumb"]');
    const grid = document.querySelector('.article-with-toc');

    const mobileCs = mobile ? getComputedStyle(mobile) : null;
    const railCs = rail ? getComputedStyle(rail) : null;

    let mobilePlacement = null;
    if (bc && grid && mobile) {
      const bcB = bc.getBoundingClientRect().bottom;
      const gridT = grid.getBoundingClientRect().top;
      const mobT = mobile.getBoundingClientRect().top;
      const mobB = mobile.getBoundingClientRect().bottom;
      mobilePlacement = {
        betweenBreadcrumbAndArticle:
          mobT >= bcB - 2 && mobB <= gridT + 2,
        mobTop: Math.round(mobT),
        gridTop: Math.round(gridT),
      };
    }

    return {
      innerWidth: window.innerWidth,
      mobileDisplay: mobileCs?.display ?? null,
      railDisplay: railCs?.display ?? null,
      exactlyOneVisible:
        (mobileCs?.display !== 'none' && railCs?.display === 'none') ||
        (mobileCs?.display === 'none' && railCs?.display !== 'none'),
      railTop: Math.round(label?.getBoundingClientRect().top ?? 0),
      disclaimerTop: Math.round(disclaimer?.getBoundingClientRect().top ?? 0),
      introTop: Math.round(intro?.getBoundingClientRect().top ?? 0),
      railVsDisclaimerDelta: Math.round(
        (label?.getBoundingClientRect().top ?? 0) - (disclaimer?.getBoundingClientRect().top ?? 0),
      ),
      mobilePlacement,
    };
  });

  console.log(`\n=== ${width}px ===`);
  console.log(JSON.stringify(m, null, 2));
  await page.close();
}

const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(URL, { waitUntil: 'networkidle' });

const atLoad = await page.evaluate(() => {
  const mobile = document.querySelector('.article-toc-mobile');
  const rail = document.querySelector('nav.article-toc');
  const track = document.querySelector('.article-toc-track');
  const grid = document.querySelector('.article-with-toc');
  const disclaimer = document.querySelector('.article-legal-disclaimer');
  const intro = document.querySelector('.article-content .article-intro');
  const label = document.querySelector('nav.article-toc .article-toc__label');

  const cs = (el) => (el ? getComputedStyle(el) : null);

  return {
    innerWidth: window.innerWidth,
    scrollY: window.scrollY,
    mobileInDom: !!mobile,
    mobileDisplay: cs(mobile)?.display ?? null,
    mobileVisible: mobile ? mobile.getBoundingClientRect().height > 0 : false,
    railInDom: !!rail,
    railDisplay: cs(rail)?.display ?? null,
    railVisibility: cs(rail)?.visibility ?? null,
    trackDisplay: cs(track)?.display ?? null,
    gridDisplay: cs(grid)?.display ?? null,
    gridAlignItems: cs(grid)?.alignItems ?? null,
    trackAlignSelf: cs(track)?.alignSelf ?? null,
    railTop: Math.round(label?.getBoundingClientRect().top ?? rail?.getBoundingClientRect().top ?? 0),
    disclaimerTop: Math.round(disclaimer?.getBoundingClientRect().top ?? 0),
    introTop: Math.round(intro?.getBoundingClientRect().top ?? 0),
    railVsDisclaimerDelta: Math.round(
      (label?.getBoundingClientRect().top ?? rail?.getBoundingClientRect().top ?? 0) -
        (disclaimer?.getBoundingClientRect().top ?? 0),
    ),
    gridTop: Math.round(grid?.getBoundingClientRect().top ?? 0),
    mainTop: Math.round(
      document.querySelector('.article-with-toc__main')?.getBoundingClientRect().top ?? 0,
    ),
    tocTopVar: getComputedStyle(document.documentElement).getPropertyValue('--toc-top').trim(),
    railMarginTop: cs(rail)?.marginTop ?? null,
    railPaddingTop: cs(rail)?.paddingTop ?? null,
    trackMarginTop: cs(track)?.marginTop ?? null,
    trackPaddingTop: cs(track)?.paddingTop ?? null,
    consoleErrors: window.__tocDiagErrors ?? [],
  };
});

// Collect console errors
page.on('console', (msg) => {
  if (msg.type() === 'error') {
    page.evaluate((t) => {
      window.__tocDiagErrors = window.__tocDiagErrors || [];
      window.__tocDiagErrors.push(t);
    }, msg.text());
  }
});
await page.reload({ waitUntil: 'networkidle' });

const afterScrollToGrid = await page.evaluate(() => {
  const grid = document.querySelector('.article-with-toc');
  if (grid) grid.scrollIntoView({ block: 'start' });
  return null;
});
await page.waitForTimeout(300);

const atGrid = await page.evaluate(() => {
  const label = document.querySelector('nav.article-toc .article-toc__label');
  const disclaimer = document.querySelector('.article-legal-disclaimer');
  const intro = document.querySelector('.article-content .article-intro');
  const expectedTop = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--toc-top')) || 90;
  const railTop = Math.round(label?.getBoundingClientRect().top ?? 0);
  const disclaimerTop = Math.round(disclaimer?.getBoundingClientRect().top ?? 0);
  const introTop = Math.round(intro?.getBoundingClientRect().top ?? 0);
  return {
    scrollY: window.scrollY,
    railTop,
    disclaimerTop,
    introTop,
    railVsDisclaimerDelta: railTop - disclaimerTop,
    expectedStickyTop: Math.round(expectedTop),
    railPinned: Math.abs(railTop - expectedTop) < 8,
  };
});

console.log(JSON.stringify({ atLoad, atGrid }, null, 2));
await browser.close();
