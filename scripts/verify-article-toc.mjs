import { PLAYWRIGHT_BROWSERS_PATH, configurePlaywrightBrowsersPath, launchChromium } from './lib/playwright-env.mjs';
import { verifyColorSchemes } from './lib/verify-color-scheme.mjs';

configurePlaywrightBrowsersPath();

const BASE = process.env.PREVIEW_URL || 'http://localhost:4400';
const ARTICLE_WITH_TOC = '/research/complete-2027-eb5-guide';
const NEWS_ARTICLE = '/news/july-2026-visa-bulletin-eb5-q3-outlook';
const FAQ_ARTICLE = '/faq/what-is-eb5-visa-program';
const VIEWPORTS = [375, 1024, 1440];
const WIDE_VIEWPORTS = [1280, 1440, 1920, 2560];

async function check(name, pass, detail = '') {
  const status = pass ? 'PASS' : 'FAIL';
  console.log(`${status}: ${name}${detail ? ` — ${detail}` : ''}`);
  return pass;
}

async function assertContentsBlock(page, label, { contentsless = false } = {}) {
  const results = [];
  const state = await page.evaluate(() => {
    const block = document.querySelector('.article-contents');
    const rail = document.querySelector('nav.article-toc, .article-with-toc, .article-toc-track');
    const links = [...document.querySelectorAll('.article-contents__link')];
    const cta = document.querySelector('.article-contents__cta-link');
    const details = document.querySelector('details.article-contents');
    return {
      blockPresent: !!block,
      blockDisplay: block ? getComputedStyle(block).display : null,
      railGone: !rail,
      linkCount: links.length,
      linkLabels: links.map((a) => a.textContent?.trim() ?? ''),
      ctaHref: cta?.getAttribute('href') ?? null,
      ctaLabel: cta?.textContent?.trim() ?? null,
      openByDefault: details ? details.hasAttribute('open') : null,
      h2Ids: [...document.querySelectorAll('.article-content h2[id]')].map((h) => h.id),
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      columnCentered: (() => {
        const content = document.querySelector('.article-content');
        if (!content) return null;
        const rect = content.getBoundingClientRect();
        const mid = window.innerWidth / 2;
        const contentMid = rect.left + rect.width / 2;
        return Math.abs(contentMid - mid) < 8;
      })(),
    };
  });

  results.push(await check(`${label}: Contents block present`, state.blockPresent));
  results.push(
    await check(
      `${label}: Contents block visible`,
      state.blockDisplay !== 'none',
      String(state.blockDisplay),
    ),
  );
  results.push(await check(`${label}: rail/grid removed`, state.railGone));
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

  if (!contentsless && state.linkCount > 0) {
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
    const { results: blockResults, state } = await assertContentsBlock(page, `${templateLabel} @${width}`, {
      contentsless,
    });
    results.push(...blockResults);

    if (!contentsless && state.linkCount > 0 && state.h2Ids.length > 0) {
      const firstSlug = state.h2Ids[0];
      const link = page.locator(`.article-contents__link[data-toc-link="${firstSlug}"]`);
      if (await link.count()) {
        // Ensure details is open so the link is clickable
        await page.evaluate(() => {
          const details = document.querySelector('details.article-contents');
          if (details) details.open = true;
        });
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

  // Research: override labels + anchors
  const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await desktop.goto(`${BASE}${ARTICLE_WITH_TOC}`, { waitUntil: 'networkidle' });

  const overrideLink = desktop.locator(
    '.article-contents__link[data-toc-link="what-is-the-eb-5-immigrant-investor-program"]',
  );
  await desktop.evaluate(() => {
    const details = document.querySelector('details.article-contents');
    if (details) details.open = true;
  });
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

  // Wide viewport centering + no overflow
  for (const width of WIDE_VIEWPORTS) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    await page.goto(`${BASE}${ARTICLE_WITH_TOC}`, { waitUntil: 'networkidle' });
    const layout = await page.evaluate(() => {
      const content = document.querySelector('.article-content');
      const rect = content?.getBoundingClientRect();
      const mid = window.innerWidth / 2;
      const contentMid = rect ? rect.left + rect.width / 2 : 0;
      return {
        centered: rect != null && Math.abs(contentMid - mid) < 8,
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        railGone: !document.querySelector('nav.article-toc, .article-with-toc'),
        contentsVisible: (() => {
          const el = document.querySelector('.article-contents');
          return !!el && getComputedStyle(el).display !== 'none';
        })(),
      };
    });
    results.push(await check(`${width}px: article column centered`, layout.centered));
    results.push(
      await check(
        `${width}px: no horizontal scrollbar`,
        layout.scrollWidth <= layout.clientWidth + 1,
        `scroll=${layout.scrollWidth} client=${layout.clientWidth}`,
      ),
    );
    results.push(await check(`${width}px: Contents visible (not rail)`, layout.contentsVisible && layout.railGone));
    await page.close();
  }

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
