/**
 * One-off live audit: desktop TOC rail inheritance + token scope.
 * Usage: node scripts/audit-toc-inheritance-live.mjs [chromium|msedge]
 */
import { configurePlaywrightBrowsersPath } from './lib/playwright-env.mjs';

configurePlaywrightBrowsersPath();

const URL =
  'https://student-eb-5.vercel.app/research/regional-center-shutdown-eb5-investor-protections';
const channel = process.argv[2] === 'msedge' ? 'msedge' : 'chromium';

const { chromium } = await import('playwright');

let browser;
if (channel === 'msedge') {
  browser = await chromium.launch({ channel: 'msedge', headless: true });
} else {
  browser = await chromium.launch({ headless: true });
}

const context = await browser.newContext({
  colorScheme: 'dark',
  viewport: { width: 1440, height: 900 },
});
const page = await context.newPage();
await page.goto(URL, { waitUntil: 'networkidle', timeout: 60000 });
await page.evaluate(() => window.scrollTo(0, 650));

const report = await page.evaluate(() => {
  const isWhiteish = (c) => {
    if (!c) return false;
    const m = c.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (!m) return false;
    const [r, g, b] = m.slice(1, 4).map(Number);
    return r >= 240 && g >= 240 && b >= 240;
  };

  const nav = document.querySelector('nav.article-toc');
  const link = nav?.querySelector('.article-toc__link');
  const label = nav?.querySelector('.article-toc__label');
  const bodyP = document.querySelector('.article-content p');

  if (!nav || !link) {
    return { error: 'desktop rail not found', railDisplay: nav ? getComputedStyle(nav).display : null };
  }

  const matchingRules = [];
  for (const sheet of document.styleSheets) {
    let href = sheet.href || 'inline';
    try {
      for (const rule of sheet.cssRules) {
        if (rule.type !== CSSRule.STYLE_RULE) continue;
        const sel = rule.selectorText || '';
        if (
          sel.includes('article-toc__link') ||
          sel.includes('article-toc__label') ||
          (sel.includes('article-toc') && rule.style.color)
        ) {
          matchingRules.push({
            href,
            selector: sel,
            color: rule.style.color || null,
          });
        }
      }
    } catch {
      matchingRules.push({ href, selector: '(cross-origin or blocked)', color: null });
    }
  }

  const chain = [];
  let el = nav;
  while (el) {
    const cs = getComputedStyle(el);
    chain.push({
      tag: el.tagName.toLowerCase(),
      id: el.id || null,
      classes: (el.className?.toString?.() || '').slice(0, 140),
      computedColor: cs.color,
      webkitTextFill: cs.webkitTextFillColor,
      background: cs.backgroundColor,
      colorScheme: cs.colorScheme,
      mutedFgVar: cs.getPropertyValue('--muted-foreground').trim(),
      foregroundVar: cs.getPropertyValue('--foreground').trim(),
      backgroundVar: cs.getPropertyValue('--background').trim(),
      inlineStyle: el.getAttribute('style') || null,
      whiteishText: isWhiteish(cs.color),
    });
    el = el.parentElement;
  }

  const navCs = getComputedStyle(nav);
  const linkCs = getComputedStyle(link);
  const labelCs = label ? getComputedStyle(label) : null;
  const bodyCs = bodyP ? getComputedStyle(bodyP) : null;
  const htmlCs = getComputedStyle(document.documentElement);

  return {
    channel: 'browser',
    railDisplay: navCs.display,
    gridDisplay: document.querySelector('.article-with-toc')
      ? getComputedStyle(document.querySelector('.article-with-toc')).display
      : null,
    link: {
      color: linkCs.color,
      webkitTextFill: linkCs.webkitTextFillColor,
      whiteish: isWhiteish(linkCs.color),
    },
    label: labelCs
      ? { color: labelCs.color, whiteish: isWhiteish(labelCs.color) }
      : null,
    bodyParagraph: bodyCs
      ? { color: bodyCs.color, whiteish: isWhiteish(bodyCs.color) }
      : null,
    navTokens: {
      mutedForeground: navCs.getPropertyValue('--muted-foreground').trim(),
      foreground: navCs.getPropertyValue('--foreground').trim(),
      background: navCs.getPropertyValue('--background').trim(),
    },
    htmlTokens: {
      mutedForeground: htmlCs.getPropertyValue('--muted-foreground').trim(),
      foreground: htmlCs.getPropertyValue('--foreground').trim(),
      background: htmlCs.getPropertyValue('--background').trim(),
      colorScheme: htmlCs.colorScheme,
    },
    cssRulesForToc: matchingRules.slice(0, 30),
    stylesheets: [...document.querySelectorAll('link[rel=stylesheet]')].map((l) => l.href),
    ancestorChain: chain,
  };
});

report.channel = channel;
console.log(JSON.stringify(report, null, 2));

await context.close();
await browser.close();
