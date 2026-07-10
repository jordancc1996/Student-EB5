export const COLOR_SCHEME_ARTICLE = '/research/regional-center-shutdown-eb5-investor-protections';

export const MIN_CONTRAST = 4.5;

/** Self-contained audit for page.evaluate — no imports. */
export function browserColorSchemeAudit() {
  const parseRgb = (color) => {
    const m = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    return m ? m.slice(1, 4).map(Number) : null;
  };

  const contrastRatio = (foreground, background) => {
    const channel = (v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
    };
    const lum = (rgb) => {
      const [r, g, b] = rgb.map(channel);
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    const fg = parseRgb(foreground);
    const bg = parseRgb(background);
    if (!fg || !bg) return null;
    const l1 = lum(fg);
    const l2 = lum(bg);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  };

  const readEffectiveBackground = (el) => {
    let node = el;
    while (node && node !== document.documentElement) {
      const bg = getComputedStyle(node).backgroundColor;
      if (parseRgb(bg) && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
        return bg;
      }
      node = node.parentElement;
    }
    return getComputedStyle(document.body).backgroundColor;
  };

  const details = document.querySelector('details.article-contents--inline');
  if (details) details.open = true;

  const targets = [
    { name: 'Contents link', selector: '.article-contents__link' },
    { name: 'Contents CTA', selector: '.article-contents__cta-link' },
    { name: 'Article body', selector: '.article-content p' },
    { name: 'Legal disclaimer', selector: '.article-legal-disclaimer' },
  ].map(({ name, selector }) => {
    const el = document.querySelector(selector);
    if (!el) return { name, selector, missing: true };
    const color = getComputedStyle(el).color;
    const background = readEffectiveBackground(el);
    const ratio = contrastRatio(color, background);
    return {
      name,
      selector,
      color,
      background,
      ratio: ratio == null ? null : Math.round(ratio * 100) / 100,
    };
  });

  const htmlStyle = getComputedStyle(document.documentElement);
  const bodyStyle = getComputedStyle(document.body);

  return {
    prefersDark: window.matchMedia('(prefers-color-scheme: dark)').matches,
    htmlColorScheme: htmlStyle.colorScheme,
    bodyBackground: bodyStyle.backgroundColor,
    bodyColor: bodyStyle.color,
    htmlHasDarkClass: document.documentElement.classList.contains('dark'),
    mutedForegroundToken: htmlStyle.getPropertyValue('--muted-foreground').trim(),
    foregroundToken: htmlStyle.getPropertyValue('--foreground').trim(),
    railPresent: !!document.querySelector('nav.article-toc'),
    railTrackVisible: (() => {
      const track = document.querySelector('.article-toc-track');
      return !!track && getComputedStyle(track).display !== 'none';
    })(),
    targets,
  };
}

/**
 * Run light + dark Playwright color-scheme passes.
 * @param {import('playwright').Browser} browser
 * @param {string} baseUrl
 * @param {(name: string, pass: boolean, detail?: string) => Promise<boolean>} check
 */
export async function verifyColorSchemes(browser, baseUrl, check) {
  const results = [];

  for (const scheme of ['light', 'dark']) {
    const context = await browser.newContext({
      colorScheme: scheme,
      viewport: { width: 1440, height: 900 },
    });
    const page = await context.newPage();
    await page.goto(`${baseUrl}${COLOR_SCHEME_ARTICLE}`, {
      waitUntil: 'networkidle',
      timeout: 60000,
    });
    await page.evaluate(() => window.scrollTo(0, 650));

    const audit = await page.evaluate(browserColorSchemeAudit);

    results.push(
      await check(
        `${scheme}: html color-scheme is light`,
        audit.htmlColorScheme === 'light',
        audit.htmlColorScheme,
      ),
    );
    results.push(
      await check(
        `${scheme}: no .dark class on html`,
        !audit.htmlHasDarkClass,
        String(audit.htmlHasDarkClass),
      ),
    );
    results.push(
      await check(
        `${scheme}: body background stays light`,
        audit.bodyBackground === 'rgb(255, 255, 255)',
        audit.bodyBackground,
      ),
    );
    results.push(
      await check(`${scheme}: desktop rail visible`, audit.railTrackVisible && audit.railPresent),
    );

    for (const target of audit.targets) {
      if (target.missing) {
        results.push(await check(`${scheme}: ${target.name} present`, false, target.selector));
        continue;
      }
      results.push(
        await check(
          `${scheme}: ${target.name} contrast >= ${MIN_CONTRAST}:1`,
          target.ratio != null && target.ratio >= MIN_CONTRAST,
          `${target.ratio}:1 (${target.color} on ${target.background})`,
        ),
      );
    }

    const tocLink = audit.targets.find((t) => t.name === 'Contents link');
    if (tocLink && !tocLink.missing) {
      results.push(
        await check(
          `${scheme}: Contents link not white-on-white`,
          !(tocLink.color === 'rgb(255, 255, 255)' && tocLink.background === 'rgb(255, 255, 255)'),
          `${tocLink.color} on ${tocLink.background}`,
        ),
      );
    }

    await context.close();
  }

  return results;
}
