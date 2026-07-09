/**
 * Post-deploy Contents / color-scheme gate — run against production preview after every deploy.
 *
 *   PREVIEW_URL=https://student-eb-5.vercel.app node scripts/verify-toc-live-deploy.mjs
 *   npm run verify:post-deploy
 */
import { configurePlaywrightBrowsersPath, launchChromium } from './lib/playwright-env.mjs';
import { verifyColorSchemes, browserColorSchemeAudit } from './lib/verify-color-scheme.mjs';

configurePlaywrightBrowsersPath();

const BASE = process.env.PREVIEW_URL || 'https://student-eb-5.vercel.app';
const ARTICLE = '/research/complete-2027-eb5-guide';
const VIEWPORTS = [375, 1024, 1440];

async function check(name, pass, detail = '') {
  console.log(`${pass ? 'PASS' : 'FAIL'}: ${name}${detail ? ` — ${detail}` : ''}`);
  return pass;
}

console.log(`Post-deploy gate — ${BASE}\n`);

const browser = await launchChromium();
const results = [];

results.push(...(await verifyColorSchemes(browser, BASE, check)));

for (const width of VIEWPORTS) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  const res = await page.goto(`${BASE}${ARTICLE}`, { waitUntil: 'networkidle', timeout: 60000 });
  results.push(await check(`${width}px: page returns 200`, res?.ok() === true, String(res?.status())));

  const state = await page.evaluate(() => {
    const block = document.querySelector('.article-contents');
    const rail = document.querySelector('nav.article-toc, .article-with-toc');
    const cta = document.querySelector('.article-contents__cta-link');
    return {
      contentsVisible: !!block && getComputedStyle(block).display !== 'none',
      railGone: !rail,
      linkCount: document.querySelectorAll('.article-contents__link').length,
      ctaHref: cta?.getAttribute('href') ?? null,
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    };
  });

  results.push(await check(`${width}px: Contents block visible`, state.contentsVisible));
  results.push(await check(`${width}px: rail removed`, state.railGone));
  results.push(
    await check(`${width}px: TOC links present`, state.linkCount >= 1, `${state.linkCount} links`),
  );
  results.push(
    await check(`${width}px: CTA → /pathways`, state.ctaHref === '/pathways', String(state.ctaHref)),
  );
  results.push(
    await check(
      `${width}px: no horizontal scrollbar`,
      state.scrollWidth <= state.clientWidth + 1,
      `scroll=${state.scrollWidth} client=${state.clientWidth}`,
    ),
  );
  await page.close();
}

// Report per-scheme Contents link colors
for (const scheme of ['light', 'dark']) {
  const context = await browser.newContext({
    colorScheme: scheme,
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();
  await page.goto(`${BASE}/research/regional-center-shutdown-eb5-investor-protections`, {
    waitUntil: 'networkidle',
    timeout: 60000,
  });
  const audit = await page.evaluate(browserColorSchemeAudit);
  const tocLink = audit.targets.find((t) => t.name === 'Contents link');
  console.log(
    `\n${scheme} scheme — .article-contents__link: ${tocLink?.color ?? 'missing'} on ${tocLink?.background ?? 'n/a'} (${tocLink?.ratio ?? 'n/a'}:1)`,
  );
  await context.close();
}

await browser.close();

const failed = results.filter((r) => !r).length;
console.log(`\n${results.length - failed}/${results.length} post-deploy checks passed`);
process.exit(failed > 0 ? 1 : 0);
