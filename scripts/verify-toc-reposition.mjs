import {
  PLAYWRIGHT_BROWSERS_PATH,
  configurePlaywrightBrowsersPath,
  launchChromium,
} from './lib/playwright-env.mjs';

configurePlaywrightBrowsersPath();

const DEFAULT_PORT = 4400;
const BASE = process.env.PREVIEW_URL || `http://localhost:${DEFAULT_PORT}`;
const ARTICLE = '/research/regional-center-shutdown-eb5-investor-protections';
const SHORT_PAGE = '/about';
const PATHWAYS = '/pathways';
const CONTAINER_EDGE_TOLERANCE_PX = 4;
const ARTICLE_CENTER_TOLERANCE_PX = 4;

let failed = 0;

function check(name, pass, detail = '') {
  console.log(`${pass ? 'PASS' : 'FAIL'}: ${name}${detail ? ` — ${detail}` : ''}`);
  if (!pass) failed++;
}

function articleCentered(viewportWidth, articleLeft, articleWidth) {
  const center = articleLeft + articleWidth / 2;
  return Math.abs(center - viewportWidth / 2) <= ARTICLE_CENTER_TOLERANCE_PX;
}

async function measureArticle(browser, width) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  await page.goto(`${BASE}${ARTICLE}`, { waitUntil: 'networkidle' });

  const atLoad = await page.evaluate(() => {
    const grid = document.querySelector('.article-with-toc');
    const toc = document.querySelector('nav.article-toc');
    const label = document.querySelector('nav.article-toc .article-toc__label');
    const cta = document.querySelector('nav.article-toc .article-toc__cta-link');
    const disclaimer = document.querySelector('.article-legal-disclaimer');
    const main = document.querySelector('.article-with-toc__main .article-content');
    const railCta = toc?.querySelector('.article-toc__cta-link');

    const gridWidth = grid?.getBoundingClientRect().width ?? 0;
    const tocContentLeft = (label ?? cta)?.getBoundingClientRect().left ?? 0;
    const articleLeft = main?.getBoundingClientRect().left ?? 0;
    const articleWidth = main?.getBoundingClientRect().width ?? 0;
    const tocRight = toc?.getBoundingClientRect().right ?? 0;
    const gap = articleLeft - tocRight;
    const expectedContainerEdge = Math.max(16, (gridWidth - 1400) / 2 + 16);
    const articleCenter = articleLeft + articleWidth / 2;
    const viewportCenter = window.innerWidth / 2;
    const railTop = (label ?? cta)?.getBoundingClientRect().top ?? 0;
    const disclaimerTop = disclaimer?.getBoundingClientRect().top ?? 0;

    const labels = [...document.querySelectorAll('nav.article-toc .article-toc__link')].map((el) => ({
      text: el.textContent?.trim().slice(0, 40),
      lines: el.getClientRects().length,
    }));

    return {
      gridWidth: Math.round(gridWidth),
      gridLeft: Math.round(grid?.getBoundingClientRect().left ?? 0),
      tocContentLeft: Math.round(tocContentLeft),
      expectedContainerEdge: Math.round(expectedContainerEdge),
      containerEdgeDelta: Math.round(tocContentLeft - expectedContainerEdge),
      articleLeft: Math.round(articleLeft),
      articleWidth: Math.round(articleWidth),
      articleCenterDelta: Math.round(articleCenter - viewportCenter),
      disclaimerAlignDelta: Math.round(railTop - disclaimerTop),
      railTopAtLoad: Math.round(railTop),
      disclaimerTopAtLoad: Math.round(disclaimerTop),
      railInViewportAtLoad: railTop >= 0 && railTop < window.innerHeight,
      bodyClientWidth: document.body.clientWidth,
      documentElementClientWidth: document.documentElement.clientWidth,
      scrollbarGutterDelta:
        document.body.clientWidth - document.documentElement.clientWidth,
      gapPx: Math.round(gap),
      gapRem: (gap / 16).toFixed(2),
      ctaText: railCta?.textContent?.trim(),
      ctaHref: railCta?.getAttribute('href'),
      labels,
      tocPosition: toc ? getComputedStyle(toc).position : null,
    };
  });

  await page.evaluate(() => window.scrollTo(0, 2000));
  await page.waitForTimeout(200);

  const pinnedTop = await page.evaluate(() => {
    const rail = document.querySelector('nav.article-toc');
    const cta = rail?.querySelector('.article-toc__cta');
    return {
      tocTop: Math.round(rail?.getBoundingClientRect().top ?? 0),
      ctaInToc: !!(rail && cta && rail.contains(cta)),
    };
  });

  await page.close();
  return { ...atLoad, pinnedTop };
}

async function measureContainerLeft(browser, path) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle' });
  const left = await page.evaluate(() => {
    const el = document.querySelector('main.container') || document.querySelector('main > .container');
    return Math.round(el?.getBoundingClientRect().left ?? 0);
  });
  await page.close();
  return left;
}

async function main() {
  console.log(`Playwright browsers path: ${PLAYWRIGHT_BROWSERS_PATH}`);

  let browser;

  try {
    browser = await launchChromium();

    const smoke = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    const smokeRes = await smoke.goto(`${BASE}${ARTICLE}`, {
      waitUntil: 'networkidle',
      timeout: 30000,
    });
    if (!smokeRes?.ok()) {
      throw new Error(`Smoke goto returned HTTP ${smokeRes?.status() ?? 'unknown'}`);
    }
    await smoke.close();
  } catch (err) {
    console.error('SETUP FAILED — verify-toc-reposition.mjs setup (chromium.launch / first goto)');
    console.error('Failure site: former line 13 — const browser = await chromium.launch()');
    if (err instanceof Error) {
      console.error(err.stack || err.message);
    } else {
      console.error(String(err));
    }
    process.exit(1);
  }

  try {
    const m1440 = await measureArticle(browser, 1440);
    const m1920 = await measureArticle(browser, 1920);
    const m1280 = await measureArticle(browser, 1280);

    console.log(`Raw deltas 1440px: containerEdge=${m1440.containerEdgeDelta}px articleCenter=${m1440.articleCenterDelta}px gridLeft=${m1440.gridLeft}px disclaimerAtLoad=${m1440.disclaimerAlignDelta}px railTop=${m1440.railTopAtLoad}px`);
    console.log(`Raw deltas 1920px: containerEdge=${m1920.containerEdgeDelta}px articleCenter=${m1920.articleCenterDelta}px gridLeft=${m1920.gridLeft}px disclaimerAtLoad=${m1920.disclaimerAlignDelta}px railTop=${m1920.railTopAtLoad}px`);
    console.log(
      `Scrollbar gutter check 1440px: body ${m1440.bodyClientWidth}px documentElement ${m1440.documentElementClientWidth}px delta ${m1440.scrollbarGutterDelta}px`,
    );

    check(
      '1440px: TOC top aligned with disclaimer at load',
      Math.abs(m1440.disclaimerAlignDelta) <= 4,
      `delta ${m1440.disclaimerAlignDelta}px rail ${m1440.railTopAtLoad}px disclaimer ${m1440.disclaimerTopAtLoad}px`,
    );
    check(
      '1440px: TOC visible in viewport at load',
      m1440.railInViewportAtLoad,
      `railTop ${m1440.railTopAtLoad}px`,
    );

    check(
      '1440px: TOC aligns with site container left edge',
      Math.abs(m1440.containerEdgeDelta) <= CONTAINER_EDGE_TOLERANCE_PX,
      `delta ${m1440.containerEdgeDelta}px (expected ${m1440.expectedContainerEdge}px got ${m1440.tocContentLeft}px)`,
    );
    check(
      '1920px: TOC aligns with site container left edge',
      Math.abs(m1920.containerEdgeDelta) <= CONTAINER_EDGE_TOLERANCE_PX,
      `delta ${m1920.containerEdgeDelta}px (expected ${m1920.expectedContainerEdge}px got ${m1920.tocContentLeft}px)`,
    );
    check(
      '1440px: article column width 630px',
      Math.abs(m1440.articleWidth - 630) < 4,
      `${m1440.articleWidth}px`,
    );
    check(
      '1920px: article column width 630px',
      Math.abs(m1920.articleWidth - 630) < 4,
      `${m1920.articleWidth}px`,
    );
    check(
      '1440px: article column centered in viewport',
      Math.abs(m1440.articleCenterDelta) <= ARTICLE_CENTER_TOLERANCE_PX,
      `delta ${m1440.articleCenterDelta}px`,
    );
    check(
      '1920px: article column centered in viewport',
      Math.abs(m1920.articleCenterDelta) <= ARTICLE_CENTER_TOLERANCE_PX,
      `delta ${m1920.articleCenterDelta}px`,
    );
    check(
      '1280px: ≥2rem gap TOC to article',
      m1280.gapPx >= 32,
      `${m1280.gapRem}rem (${m1280.gapPx}px)`,
    );

    const wrap3 = m1440.labels.filter((l) => l.lines >= 3);
    check(
      'No desktop rail TOC labels wrap 3+ lines',
      wrap3.length === 0,
      wrap3.map((l) => l.text).join('; '),
    );

    check(
      'CTA single-line text',
      m1440.ctaText === 'See your path from visa to green card →',
      m1440.ctaText,
    );
    check('CTA routes to Pathways hub', m1440.ctaHref === '/pathways', m1440.ctaHref);

    const pathwaysPage = await browser.newPage();
    const pathwaysRes = await pathwaysPage.goto(`${BASE}${PATHWAYS}`, { waitUntil: 'networkidle' });
    check('Pathways hub returns 200', pathwaysRes?.status() === 200, String(pathwaysRes?.status()));
    await pathwaysPage.close();

    check(
      'CTA pins inside sticky rail',
      m1440.pinnedTop.ctaInToc,
      `tocTop ${m1440.pinnedTop.tocTop}px`,
    );
    check('TOC remains sticky', m1440.tocPosition === 'sticky', m1440.tocPosition);

    const shortLeft = await measureContainerLeft(browser, SHORT_PAGE);
    const longLeft = await measureContainerLeft(browser, ARTICLE);
    check(
      'No layout shift: main container left matches on short vs long page',
      shortLeft === longLeft,
      `about ${shortLeft}px article ${longLeft}px`,
    );

    const mobile = await browser.newPage({ viewport: { width: 375, height: 812 } });
    await mobile.goto(`${BASE}${ARTICLE}`, { waitUntil: 'networkidle' });
    const mobileChecks = await mobile.evaluate(() => {
      const mobileToc = document.querySelector('.article-toc-mobile');
      const rail = document.querySelector('nav.article-toc');
      const bc = document.querySelector('nav[aria-label="Breadcrumb"]');
      const grid = document.querySelector('.article-with-toc');
      const disclaimer = document.querySelector('.article-legal-disclaimer');
      const intro = document.querySelector('.article-content .article-intro');
      const mobCs = mobileToc ? getComputedStyle(mobileToc) : null;
      const railCs = rail ? getComputedStyle(rail) : null;
      let placement = null;
      if (bc && mobileToc && grid && disclaimer && intro) {
        const mobB = mobileToc.getBoundingClientRect().bottom;
        const discT = disclaimer.getBoundingClientRect().top;
        const discB = disclaimer.getBoundingClientRect().bottom;
        const introT = intro.getBoundingClientRect().top;
        placement = {
          betweenBreadcrumbAndArticle:
            mobileToc.getBoundingClientRect().top >= bc.getBoundingClientRect().bottom - 2 &&
            mobileToc.getBoundingClientRect().bottom <= grid.getBoundingClientRect().top + 2,
          disclaimerAfterMobileToc: discT >= mobB - 2,
          disclaimerBeforeLede: discB <= introT + 2,
        };
      }
      return {
        mobileDisplay: mobCs?.display ?? null,
        railDisplay: railCs?.display ?? null,
        exactlyOneVisible:
          (mobCs?.display !== 'none' && railCs?.display === 'none') ||
          (mobCs?.display === 'none' && railCs?.display !== 'none'),
        placement,
      };
    });
    check('375px: exactly one TOC variant visible', mobileChecks.exactlyOneVisible);
    check(
      '375px: mobile TOC between breadcrumb and article grid',
      mobileChecks.placement?.betweenBreadcrumbAndArticle === true,
      JSON.stringify(mobileChecks.placement),
    );
    check(
      '375px: disclaimer after mobile TOC and before lede',
      mobileChecks.placement?.disclaimerAfterMobileToc === true &&
        mobileChecks.placement?.disclaimerBeforeLede === true,
      JSON.stringify(mobileChecks.placement),
    );
    const mobileCta = await mobile.evaluate(() => ({
      openCta: (() => {
        const d = document.querySelector('.article-toc-mobile');
        d?.setAttribute('open', '');
        return document.querySelector('.article-toc-mobile .article-toc__cta-link')?.textContent?.trim();
      })(),
    }));
    check(
      '375px: mobile CTA present when open',
      mobileCta.openCta === 'See your path from visa to green card →',
      mobileCta.openCta,
    );
    await mobile.close();
  } finally {
    await browser.close();
  }

  console.log(`\n${failed === 0 ? 'All checks passed' : `${failed} failed`}`);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error('UNHANDLED ERROR — verify-toc-reposition.mjs');
  if (err instanceof Error) {
    console.error(err.stack || err.message);
  } else {
    console.error(String(err));
  }
  process.exit(1);
});
