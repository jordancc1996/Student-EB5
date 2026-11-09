import { PLAYWRIGHT_BROWSERS_PATH, configurePlaywrightBrowsersPath, launchChromium } from './lib/playwright-env.mjs';
import { verifyColorSchemes } from './lib/verify-color-scheme.mjs';

configurePlaywrightBrowsersPath();

const BASE = process.env.PREVIEW_URL || 'http://localhost:4400';
const ARTICLE_WITH_TOC = '/research/complete-2027-eb5-guide';
const ARTICLE_WITH_TOC_PATHWAY = '/pathways/eb5-vs-other-visa-options';
const ARTICLE_WITH_TOC_LABEL = 'See the EB-5 path for visa and residency planners →';
const PILOT_ARTICLE = '/research/best-alternative-to-h1b-o1-eb1-eb5';
const PILOT_PATHWAY = '/pathways/eb5-for-tech-workers';
const PILOT_TOC_LABEL = 'See the EB-5 path for tech workers →';
const NEWS_ARTICLE = '/news/july-2026-visa-bulletin-eb5-q3-outlook';
const FAQ_ARTICLE = '/faq/what-is-eb5-visa-program';
const VIEWPORTS = [375, 768, 1023, 1024, 1180, 1440];
const WIDE_VIEWPORTS = [1024, 1180, 1280, 1440, 1920];
const FIRST_PARTY_READY = '.article-content';

/**
 * Preferred Sources keeps Google connections open, so networkidle never settles.
 * `load` also waits on publisher.js. Use DOMContentLoaded plus a first-party
 * article node as the readiness signal.
 */
async function gotoFirstPartyReady(page, url, { timeout = 60000 } = {}) {
  const res = await page.goto(url, { waitUntil: 'domcontentloaded', timeout });
  await page.waitForSelector(FIRST_PARTY_READY, { timeout });
  return res;
}

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
  const headerColumn =
    document.querySelector('.article-with-toc__main nav[aria-label="Breadcrumb"]') ||
    document.querySelector('.article-editorial');

  const contentRect = content?.getBoundingClientRect();
  const headerRect = headerColumn?.getBoundingClientRect();
  const railRect = railNav?.getBoundingClientRect();
  const sideRail = document.querySelector('.article-side-rail');
  const sideRect = sideRail?.getBoundingClientRect();
  const tocTrack = document.querySelector('.article-toc-track');
  const tocRect = tocTrack?.getBoundingClientRect();
  const mid = window.innerWidth / 2;
  const contentMid = contentRect ? contentRect.left + contentRect.width / 2 : 0;
  const pairLeft = railRect && contentRect ? Math.min(railRect.left, contentRect.left) : null;
  const pairRight = railRect && contentRect ? Math.max(railRect.right, contentRect.right) : null;
  const pairMid = pairLeft != null && pairRight != null ? (pairLeft + pairRight) / 2 : 0;
  const sideStyle = sideRail ? getComputedStyle(sideRail) : null;
  const sideRailVisible = !!sideRail && sideStyle.display !== 'none' && (sideRect?.width ?? 0) > 8;
  const viewWidth = document.documentElement.clientWidth;
  const leftMargin = tocRect ? tocRect.left : null;
  const rightMargin = sideRect ? viewWidth - sideRect.right : null;
  const tracksOverlap =
    tocRect && contentRect && sideRect
      ? tocRect.right > contentRect.left + 1 || contentRect.right > sideRect.left + 1
      : false;

  const lineProbe = (() => {
    const paras = [...document.querySelectorAll('.article-content p')].filter((p) => {
      const text = (p.textContent || '').replace(/\s+/g, ' ').trim();
      if (text.length < 80) return false;
      if (p.closest('.article-legal-disclaimer, aside, .article-rail-card')) return false;
      const style = getComputedStyle(p);
      return style.display !== 'none' && style.visibility !== 'hidden';
    });
    const para = paras.find((el) => !el.closest('.article-intro')) || paras[0];
    if (!para) return null;
    const walker = document.createTreeWalker(para, NodeFilter.SHOW_TEXT);
    let textNode = null;
    let longest = 0;
    while (walker.nextNode()) {
      const len = (walker.currentNode.textContent || '').trim().length;
      if (len > longest) {
        longest = len;
        textNode = walker.currentNode;
      }
    }
    if (!textNode) return null;
    const text = textNode.textContent || '';
    const range = document.createRange();
    range.setStart(textNode, 0);
    range.setEnd(textNode, Math.min(1, text.length));
    let lo = 1;
    let hi = text.length;
    let best = 1;
    while (lo <= hi) {
      const midPoint = (lo + hi) >> 1;
      range.setEnd(textNode, midPoint);
      const rects = [...range.getClientRects()];
      const tops = rects.map((rect) => Math.round(rect.top));
      const single = rects.length > 0 && tops.every((top) => Math.abs(top - tops[0]) <= 1);
      if (single) {
        best = midPoint;
        lo = midPoint + 1;
      } else {
        hi = midPoint - 1;
      }
    }
    return {
      chars: best,
      fontSize: getComputedStyle(para).fontSize,
      width: Math.round(para.getBoundingClientRect().width),
    };
  })();

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
    columnCentered: contentRect != null && Math.abs(contentMid - mid) < 16,
    pairCentered: pairLeft != null && Math.abs(pairMid - mid) < 16,
    contentWidth: contentRect?.width ?? null,
    contentLeft: contentRect?.left ?? null,
    headerLeft: headerRect?.left ?? null,
    railLeftOfContent:
      railRect != null && contentRect != null && railRect.right <= contentRect.left + 2,
    contentAlignedWithHeader:
      contentRect != null &&
      headerRect != null &&
      Math.abs(contentRect.left - headerRect.left) < 2,
    sideRailVisible,
    sideRailText: sideRail ? (sideRail.textContent || '').replace(/\s+/g, ' ').trim() : '',
    sideRailLinkCount: sideRail ? sideRail.querySelectorAll('a').length : 0,
    followInRail: !!sideRail?.querySelector('[data-article-follow]'),
    followInline: !!document.querySelector('[data-article-follow-inline] [data-article-follow]'),
    leftMargin,
    rightMargin,
    marginDelta: leftMargin != null && rightMargin != null ? Math.abs(leftMargin - rightMargin) : null,
    tracksOverlap,
    tocWidth: tocRect?.width ?? null,
    sideRailWidth: sideRect?.width ?? null,
    lineProbe,
    titleAligned: (() => {
      const title = document.querySelector('.article-title-block h1');
      if (!title || !contentRect) return true;
      return Math.abs(title.getBoundingClientRect().left - contentRect.left) < 3;
    })(),
  };
}

async function check(name, pass, detail = '') {
  const status = pass ? 'PASS' : 'FAIL';
  console.log(`${status}: ${name}${detail ? ` — ${detail}` : ''}`);
  return pass;
}

async function assertTocVariant(page, label, width, { contentsless = false, expectedCtaHref = '/pathways', expectedCtaLabel = 'See your path from visa to green card →', expectSideRail = false } = {}) {
  const results = [];
  const isDesktop = width >= 1024;
  await page.evaluate(() => (document.fonts ? document.fonts.ready : null));
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
      `${label}: CTA resolves to expected pathway`,
      state.ctaHref === expectedCtaHref,
      String(state.ctaHref),
    ),
  );
  results.push(
    await check(
      `${label}: CTA label`,
      state.ctaLabel === expectedCtaLabel,
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
    results.push(
      await check(
        `${label}: TOC sits left of article`,
        state.railLeftOfContent,
      ),
    );
    const wideRail = expectSideRail && width >= 1280;
    const articleWidthOk =
      typeof state.contentWidth === 'number' &&
      state.contentWidth >= 640 &&
      state.contentWidth <= 760;
    if (!wideRail) {
      const wideEnoughForCenter = width >= 1280;
      results.push(
        await check(
          `${label}: article column ${wideEnoughForCenter ? 'pair centered' : 'in reading range'}`,
          wideEnoughForCenter ? state.pairCentered && articleWidthOk : articleWidthOk,
          `width=${state.contentWidth} pairCentered=${state.pairCentered}`,
        ),
      );
    }
  }

  if (expectSideRail && width >= 1280) {
    results.push(...(await assertThreeTrack(label, state, width)));
  } else if (width <= 768) {
    results.push(await check(`${label}: no side rail`, !state.sideRailVisible));
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

async function assertThreeTrack(label, state, width) {
  const results = [];
  const centered = typeof state.marginDelta === 'number' && state.marginDelta <= 16;
  const railFilled =
    state.sideRailVisible &&
    state.sideRailText.length > 40 &&
    state.sideRailLinkCount >= 3 &&
    /Talk to an EB-5 advisor/.test(state.sideRailText) &&
    /Related research/.test(state.sideRailText);
  results.push(
    await check(
      `${label}: TOC + article + rail centered`,
      state.sideRailVisible && centered,
      `left=${state.leftMargin} right=${state.rightMargin} delta=${state.marginDelta}`,
    ),
  );
  results.push(
    await check(
      `${label}: rail is not empty`,
      railFilled,
      `links=${state.sideRailLinkCount} text=${state.sideRailText.slice(0, 80)}`,
    ),
  );
  results.push(await check(`${label}: tracks do not overlap`, state.sideRailVisible && !state.tracksOverlap));
  results.push(await check(`${label}: title aligns with article column`, state.titleAligned !== false));
  results.push(
    await check(
      `${label}: Google follow sits in the rail`,
      state.followInRail && !state.followInline,
    ),
  );
  if (width >= 1440 && state.lineProbe) {
    const charsOk = state.lineProbe.chars >= 65 && state.lineProbe.chars <= 78;
    results.push(
      await check(
        `${label}: body line is 65-78 characters`,
        charsOk,
        `${state.lineProbe.chars} chars at ${state.lineProbe.fontSize} / ${state.lineProbe.width}px`,
      ),
    );
  }
  return results;
}

async function verifyTemplate(browser, path, templateLabel, { contentsless = false, expectedCtaHref, expectedCtaLabel, expectSideRail = false } = {}) {
  const results = [];

  for (const width of VIEWPORTS) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    const res = await gotoFirstPartyReady(page, `${BASE}${path}`);
    results.push(await check(`${templateLabel} @${width}: HTTP 200`, res?.ok() === true, String(res?.status())));
    const { results: blockResults, state } = await assertTocVariant(page, `${templateLabel} @${width}`, width, {
      contentsless,
      expectedCtaHref,
      expectedCtaLabel,
      expectSideRail,
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
  await gotoFirstPartyReady(page, `${BASE}${ARTICLE_WITH_TOC}`);

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

  await page.evaluate(() => window.scrollTo(0, 1000));
  await page.waitForFunction(() => {
    const nav = document.querySelector('nav.article-toc');
    if (!nav) return false;
    const top = nav.getBoundingClientRect().top;
    const stickyTop = parseFloat(getComputedStyle(nav).top);
    return Number.isFinite(stickyTop) && Math.abs(top - stickyTop) <= 2;
  }, null, { timeout: 5000 });

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

  const stickyTopPx = stickyState ? parseFloat(stickyState.stickyTop) : NaN;

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
        Number.isFinite(stickyTopPx) &&
        Math.abs(stickyState.top - stickyTopPx) <= 2,
      `before=${topBefore} after=${stickyState?.top} stickyTop=${stickyState?.stickyTop}`,
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
    const smokeRes = await gotoFirstPartyReady(smoke, `${BASE}${ARTICLE_WITH_TOC}`, {
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
  await gotoFirstPartyReady(desktop, `${BASE}${ARTICLE_WITH_TOC}`);

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
    await gotoFirstPartyReady(page, `${BASE}${ARTICLE_WITH_TOC}`);
    await page.evaluate(() => (document.fonts ? document.fonts.ready : null));
    const layout = await page.evaluate(readTocLayoutState);
    if (width >= 1280) {
      results.push(...(await assertThreeTrack(`${width}px`, layout, width)));
    } else {
      results.push(
        await check(
          `${width}px: article column in reading range`,
          typeof layout.contentWidth === 'number' &&
            layout.contentWidth >= 640 &&
            layout.contentWidth <= 760,
          `width=${layout.contentWidth}`,
        ),
      );
      results.push(await check(`${width}px: no side rail`, !layout.sideRailVisible));
    }
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
  results.push(...(await verifyTemplate(browser, ARTICLE_WITH_TOC, 'research', {
    expectedCtaHref: ARTICLE_WITH_TOC_PATHWAY,
    expectedCtaLabel: ARTICLE_WITH_TOC_LABEL,
    expectSideRail: true,
  })));
  results.push(
    ...(await verifyTemplate(browser, PILOT_ARTICLE, 'research-pilot', {
      expectedCtaHref: PILOT_PATHWAY,
      expectedCtaLabel: PILOT_TOC_LABEL,
      expectSideRail: true,
    })),
  );
  results.push(...(await verifyTemplate(browser, NEWS_ARTICLE, 'news', { expectSideRail: true })));
  results.push(...(await verifyTemplate(browser, FAQ_ARTICLE, 'faq', { contentsless: true })));

  results.push(...(await verifyColorSchemes(browser, BASE, check)));

  await browser.close();

  const failed = results.filter((r) => !r).length;
  console.log(`\n${results.length - failed}/${results.length} checks passed`);
  process.exit(failed > 0 ? 1 : 0);
}

main();
