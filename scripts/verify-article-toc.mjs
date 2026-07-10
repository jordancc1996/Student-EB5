import { PLAYWRIGHT_BROWSERS_PATH, configurePlaywrightBrowsersPath, launchChromium } from './lib/playwright-env.mjs';
import { verifyColorSchemes } from './lib/verify-color-scheme.mjs';

configurePlaywrightBrowsersPath();

const BASE = process.env.PREVIEW_URL || 'http://localhost:4400';
const ARTICLE_WITH_TOC = '/research/complete-2027-eb5-guide';
const NEWS_ARTICLE = '/news/july-2026-visa-bulletin-eb5-q3-outlook';
const FAQ_ARTICLE = '/faq/what-is-eb5-visa-program';
const VIEWPORTS = [375, 1023, 1024, 1180, 1440];
const WIDE_VIEWPORTS = [1024, 1180, 1280, 1440, 1920];

/** Self-contained for page.evaluate */
function readTocLayoutState() {
  const isVisible = (el) => !!el && getComputedStyle(el).display !== 'none';

  const inline = document.querySelector('.article-contents--inline');
  const railTrack = document.querySelector('.article-toc-track');
  const railNav = document.querySelector('nav.article-toc');
  const links = [...document.querySelectorAll('.article-contents__link')].filter((link) => {
    const parent = link.closest('.article-contents--inline, nav.article-toc');
    return parent && getComputedStyle(parent).display !== 'none' && parent.offsetParent !== null;
  });
  const cta = document.querySelector('.article-contents__cta-link');
  const details = document.querySelector('details.article-contents--inline');
  const content =
    document.querySelector('.article-with-toc__main') ||
    document.querySelector('.article-content');
  const headerColumn = document.querySelector('.max-w-4xl.mx-auto');

  const contentRect = content?.getBoundingClientRect();
  const headerRect = headerColumn?.getBoundingClientRect();
  const mid = window.innerWidth / 2;
  const contentMid = contentRect ? contentRect.left + contentRect.width / 2 : 0;

  return {
    inlineVisible: isVisible(inline),
    railTrackVisible: isVisible(railTrack),
    railNavVisible: isVisible(railNav),
    railNavPosition: railNav ? getComputedStyle(railNav).position : null,
    linkCount: links.length,
    linkLabels: links.map((a) => a.textContent?.trim() ?? ''),
    ctaHref: cta?.getAttribute('href') ?? null,
    ctaLabel: cta?.textContent?.trim() ?? null,
    openByDefault: details ? details.hasAttribute('open') : null,
    h2Ids: [...document.querySelectorAll('.article-content h2[id]')].map((h) => h.id),
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    columnCentered: contentRect != null && Math.abs(contentMid - mid) < 8,
    contentLeft: contentRect?.left ?? null,
    headerLeft: headerRect?.left ?? null,
    contentAlignedWithHeader:
      contentRect != null &&
      headerRect != null &&
      Math.abs(contentRect.left - headerRect.left) < 2,
  };
}

async function check(name, pass, detail = '') {
  const status = pass ? 'PASS' : 'FAIL';
  console.log(`${status}: ${name}${detail ? ` — ${detail}` : ''}`);
  return pass;
}

async function assertTocVariant(page, label, width, { contentsless = false } = {}) {
  const results = [];
  const isDesktop = width >= 1024;
  const state = await page.evaluate(readTocLayoutState);

  if (isDesktop) {
    results.push(await check(`${label}: desktop rail track visible`, state.railTrackVisible));
    results.push(await check(`${label}: desktop rail nav visible`, state.railNavVisible));
    results.push(await check(`${label}: inline block hidden`, !state.inlineVisible));
    results.push(
      await check(
        `${label}: exactly one variant (desktop)`,
        state.railTrackVisible && !state.inlineVisible,
      ),
    );
  } else {
    results.push(await check(`${label}: mobile inline visible`, state.inlineVisible));
    results.push(await check(`${label}: mobile rail track hidden`, !state.railTrackVisible));
    results.push(
      await check(
        `${label}: exactly one variant (mobile)`,
        state.inlineVisible && !state.railTrackVisible,
      ),
    );
  }

  results.push(
    await check(
      `${label}: ${contentsless ? 'CTA-only fallback' : 'TOC links present'}`,
      contentsless ? state.linkCount === 0 : state.linkCount >= 1,
      `${state.linkCount} links`,
    ),
  );
  results.push(
    await check(
      `${label}: CTA resolves to /pathways`,
      state.ctaHref === '/pathways',
      String(state.ctaHref),
    ),
  );
  results.push(
    await check(
      `${label}: CTA label`,
      state.ctaLabel === 'See your path from visa to green card →',
      String(state.ctaLabel),
    ),
  );
  results.push(
    await check(
      `${label}: no horizontal scrollbar`,
      state.scrollWidth <= state.clientWidth + 1,
      `scroll=${state.scrollWidth} client=${state.clientWidth}`,
    ),
  );

  if (isDesktop) {
    results.push(
      await check(
        `${label}: article column aligned with header block`,
        state.contentAlignedWithHeader,
        `content=${state.contentLeft} header=${state.headerLeft}`,
      ),
    );
    results.push(await check(`${label}: article column centered`, state.columnCentered));
  }

  if (!contentsless && state.linkCount > 0 && !isDesktop) {
    results.push(
      await check(
        `${label}: open-by-default rule`,
        state.linkCount <= 8 ? state.openByDefault === true : state.openByDefault === false,
        `links=${state.linkCount} open=${state.openByDefault}`,
      ),
    );
  }

  return { results, state };
}

async function verifyTemplate(browser, path, templateLabel, { contentsless = false } = {}) {
  const results = [];

  for (const width of VIEWPORTS) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    const res = await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle', timeout: 60000 });
    results.push(await check(`${templateLabel} @${width}: HTTP 200`, res?.ok() === true, String(res?.status())));
    const { results: blockResults, state } = await assertTocVariant(page, `${templateLabel} @${width}`, width, {
      contentsless,
    });
    results.push(...blockResults);

    if (!contentsless && state.linkCount > 0 && state.h2Ids.length > 0) {
      const firstSlug = state.h2Ids[0];
      if (width < 1024) {
        await page.evaluate(() => {
          const details = document.querySelector('details.article-contents--inline');
          if (details) details.open = true;
        });
      }
      const linkSelector =
        width >= 1024
          ? `nav.article-toc .article-contents__link[data-toc-link="${firstSlug}"]`
          : `.article-contents--inline .article-contents__link[data-toc-link="${firstSlug}"]`;
      const link = page.locator(linkSelector);
      if (await link.count()) {
        await link.click();
        await page.waitForTimeout(400);
        const hash = await page.evaluate(() => location.hash);
        results.push(
          await check(
            `${templateLabel} @${width}: link lands on section`,
            hash === `#${firstSlug}`,
            hash,
          ),
        );
      }
    }

    await page.close();
  }

  return results;
}

async function verifyScaledLaptopRail(browser) {
  const results = [];
  const context = await browser.newContext({
    viewport: { width: 1180, height: 900 },
    deviceScaleFactor: 1.25,
  });
  await context.addInitScript(() => {
    document.documentElement.style.overflowY = 'scroll';
  });
  const page = await context.newPage();
  await page.goto(`${BASE}${ARTICLE_WITH_TOC}`, { waitUntil: 'networkidle', timeout: 60000 });

  const initial = await page.evaluate(readTocLayoutState);
  results.push(await check('scaled 1180: rail track visible', initial.railTrackVisible));
  results.push(await check('scaled 1180: rail nav visible', initial.railNavVisible));
  results.push(await check('scaled 1180: inline hidden', !initial.inlineVisible));
  results.push(
    await check(
      'scaled 1180: article column aligned with header',
      initial.contentAlignedWithHeader,
      `content=${initial.contentLeft} header=${initial.headerLeft}`,
    ),
  );
  results.push(
    await check(
      'scaled 1180: no horizontal scrollbar',
      initial.scrollWidth <= initial.clientWidth + 1,
      `scroll=${initial.scrollWidth} client=${initial.clientWidth}`,
    ),
  );

  const railBox = await page.locator('nav.article-toc').boundingBox();
  results.push(
    await check(
      'scaled 1180: rail on-screen at load',
      railBox != null && railBox.width > 0 && railBox.x + railBox.width > 0,
      railBox ? `x=${railBox.x} w=${railBox.width}` : 'missing',
    ),
  );

  const topBefore = await page.evaluate(() => {
    const nav = document.querySelector('nav.article-toc');
    return nav ? nav.getBoundingClientRect().top : null;
  });

  await page.evaluate(() => window.scrollTo(0, 1200));
  await page.waitForTimeout(200);

  const stickyState = await page.evaluate(() => {
    const nav = document.querySelector('nav.article-toc');
    if (!nav) return null;
    const rect = nav.getBoundingClientRect();
    const style = getComputedStyle(nav);
    return {
      top: rect.top,
      position: style.position,
      stickyTop: style.top,
    };
  });

  results.push(
    await check(
      'scaled 1180: rail uses sticky positioning',
      stickyState?.position === 'sticky',
      String(stickyState?.position),
    ),
  );
  results.push(
    await check(
      'scaled 1180: rail pins after scroll',
      stickyState != null &&
        topBefore != null &&
        stickyState.top < topBefore &&
        stickyState.top >= 100 &&
        stickyState.top <= 120,
      `before=${topBefore} after=${stickyState?.top}`,
    ),
  );

  await context.close();
  return results;
}

async function main() {
  console.log(`Playwright browsers path: ${PLAYWRIGHT_BROWSERS_PATH}`);

  let browser;
  try {
    browser = await launchChromium();
    const smoke = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    const smokeRes = await smoke.goto(`${BASE}${ARTICLE_WITH_TOC}`, {
      waitUntil: 'networkidle',
      timeout: 30000,
    });
    if (!smokeRes?.ok()) {
      throw new Error(`Smoke goto returned HTTP ${smokeRes?.status() ?? 'unknown'}`);
    }
    await smoke.close();
  } catch (err) {
    console.error('SETUP FAILED — verify-article-toc.mjs');
    if (err instanceof Error) console.error(err.stack || err.message);
    else console.error(String(err));
    process.exit(1);
  }

  const results = [];

  const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await desktop.goto(`${BASE}${ARTICLE_WITH_TOC}`, { waitUntil: 'networkidle' });

  const overrideLink = desktop.locator(
    'nav.article-toc .article-contents__link[data-toc-link="what-is-the-eb-5-immigrant-investor-program"]',
  );
  const overrideText = await overrideLink.textContent();
  results.push(
    await check(
      'TOC override label renders',
      overrideText?.trim() === 'EB-5 Program Overview',
      overrideText?.trim(),
    ),
  );

  const pageHeading = await desktop
    .locator('.article-content h2#what-is-the-eb-5-immigrant-investor-program')
    .textContent();
  results.push(
    await check(
      'Page H2 text unchanged by override',
      pageHeading?.includes('What is the EB-5 Immigrant Investor Program'),
      pageHeading?.trim().slice(0, 60),
    ),
  );

  await overrideLink.click();
  await desktop.waitForTimeout(600);
  const hash = await desktop.evaluate(() => location.hash);
  results.push(
    await check(
      'Override link navigates to anchor',
      hash === '#what-is-the-eb-5-immigrant-investor-program',
      hash,
    ),
  );

  const scrollMargin = await desktop
    .locator('.article-content h2#what-is-the-eb-5-immigrant-investor-program')
    .evaluate((el) => getComputedStyle(el).scrollMarginTop);
  results.push(
    await check('H2 scroll-margin-top preserved', scrollMargin === '96px' || scrollMargin === '6rem', scrollMargin),
  );
  await desktop.close();

  for (const width of WIDE_VIEWPORTS) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    await page.goto(`${BASE}${ARTICLE_WITH_TOC}`, { waitUntil: 'networkidle' });
    const layout = await page.evaluate(readTocLayoutState);
    results.push(await check(`${width}px: article column centered`, layout.columnCentered));
    results.push(
      await check(
        `${width}px: no horizontal scrollbar`,
        layout.scrollWidth <= layout.clientWidth + 1,
        `scroll=${layout.scrollWidth} client=${layout.clientWidth}`,
      ),
    );
    results.push(await check(`${width}px: desktop rail visible`, layout.railTrackVisible && layout.railNavVisible));
    results.push(await check(`${width}px: inline hidden`, !layout.inlineVisible));
    await page.close();
  }

  results.push(...(await verifyScaledLaptopRail(browser)));
  results.push(...(await verifyTemplate(browser, ARTICLE_WITH_TOC, 'research')));
  results.push(...(await verifyTemplate(browser, NEWS_ARTICLE, 'news')));
  results.push(...(await verifyTemplate(browser, FAQ_ARTICLE, 'faq', { contentsless: true })));

  results.push(...(await verifyColorSchemes(browser, BASE, check)));

  await browser.close();

  const failed = results.filter((r) => !r).length;
  console.log(`\n${results.length - failed}/${results.length} checks passed`);
  process.exit(failed > 0 ? 1 : 0);
}

main();
