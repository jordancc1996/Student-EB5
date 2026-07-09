/**
 * Breakpoint exhaustiveness checks for article TOC variants.
 * Exactly one of rail / mobile must have computed display !== 'none' at each width.
 */

export const TOC_BREAKPOINT_WIDTHS = [1440, 1280, 1279, 375];

export function readTocVisibilityState() {
  const mobile = document.querySelector('.article-toc-mobile');
  const rail = document.querySelector('nav.article-toc');
  const grid = document.querySelector('.article-with-toc');
  const cs = (el) => (el ? getComputedStyle(el) : null);
  const mobCs = cs(mobile);
  const railCs = cs(rail);
  const gridCs = cs(grid);
  const railRect = rail?.getBoundingClientRect();
  const label = document.querySelector('nav.article-toc .article-toc__label');

  return {
    innerWidth: window.innerWidth,
    mobileDisplay: mobCs?.display ?? null,
    railDisplay: railCs?.display ?? null,
    gridDisplay: gridCs?.display ?? null,
    railVisibility: railCs?.visibility ?? null,
    railOpacity: railCs?.opacity ?? null,
    railWidth: Math.round(railRect?.width ?? 0),
    railHeight: Math.round(railRect?.height ?? 0),
    railTop: Math.round((label ?? rail)?.getBoundingClientRect().top ?? 0),
    railInViewport:
      railRect != null && railRect.width > 0 && railRect.top >= 0 && railRect.top < window.innerHeight,
    exactlyOne:
      (mobCs?.display !== 'none' && railCs?.display === 'none') ||
      (mobCs?.display === 'none' && railCs?.display !== 'none'),
    hasResearchPageClass: document.querySelector('.research-article-page') != null,
  };
}

export async function verifyTocBreakpoints(browser, baseUrl, articlePath, check) {
  const results = [];

  for (const width of TOC_BREAKPOINT_WIDTHS) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    const res = await page.goto(`${baseUrl}${articlePath}`, {
      waitUntil: 'networkidle',
      timeout: 60000,
    });
    results.push(
      await check(`${width}px: page returns 200`, res?.status() === 200, String(res?.status())),
    );

    const m = await page.evaluate(readTocVisibilityState);
    results.push(await check(`${width}px: research-article-page wrapper present`, m.hasResearchPageClass));
    results.push(
      await check(
        `${width}px: exactly one TOC variant visible (display)`,
        m.exactlyOne,
        `mobile=${m.mobileDisplay} rail=${m.railDisplay}`,
      ),
    );

    if (width >= 1280) {
      results.push(
        await check(`${width}px: desktop rail display not none`, m.railDisplay !== 'none', m.railDisplay),
      );
      results.push(await check(`${width}px: grid display grid`, m.gridDisplay === 'grid', m.gridDisplay));
      results.push(
        await check(
          `${width}px: rail has non-zero box`,
          m.railWidth > 0 && m.railHeight > 0,
          `w=${m.railWidth} h=${m.railHeight}`,
        ),
      );
      results.push(
        await check(`${width}px: rail in viewport at load`, m.railInViewport, `top=${m.railTop}px`),
      );
    } else {
      results.push(
        await check(`${width}px: mobile display not none`, m.mobileDisplay !== 'none', m.mobileDisplay),
      );
      results.push(await check(`${width}px: rail display none`, m.railDisplay === 'none', m.railDisplay));
    }

    await page.close();
  }

  return results;
}

export async function verifyTocCssOnlyAtDesktop(browser, baseUrl, articlePath, check) {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(`${baseUrl}${articlePath}`, { waitUntil: 'networkidle', timeout: 60000 });
  const m = await page.evaluate(readTocVisibilityState);
  await context.close();

  return [
    await check(
      '1440px (no JS): rail visible from CSS only',
      m.railDisplay !== 'none' && m.railWidth > 0,
      `display=${m.railDisplay} w=${m.railWidth}`,
    ),
    await check(
      '1440px (no JS): mobile hidden',
      m.mobileDisplay === 'none',
      m.mobileDisplay,
    ),
  ];
}
