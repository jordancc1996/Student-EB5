import { configurePlaywrightBrowsersPath, launchChromium } from './lib/playwright-env.mjs';
import { verifyColorSchemes, browserColorSchemeAudit } from './lib/verify-color-scheme.mjs';

configurePlaywrightBrowsersPath();

const BASE = process.env.PREVIEW_URL || 'https://student-eb-5.vercel.app';

async function check(name, pass, detail = '') {
  console.log(`${pass ? 'PASS' : 'FAIL'}: ${name}${detail ? ` — ${detail}` : ''}`);
  return pass;
}

console.log(`Post-deploy gate — ${BASE}\n`);

const browser = await launchChromium();
const results = [];

results.push(...(await verifyColorSchemes(browser, BASE, check)));

// Report per-scheme TOC link colors for the task deliverable.
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
  await page.evaluate(() => window.scrollTo(0, 650));
  const audit = await page.evaluate(browserColorSchemeAudit);
  const tocLink = audit.targets.find((t) => t.name === 'TOC link');
  console.log(
    `\n${scheme} scheme — .article-toc__link: ${tocLink?.color ?? 'missing'} on ${tocLink?.background ?? 'n/a'} (${tocLink?.ratio ?? 'n/a'}:1)`,
  );
  await context.close();
}

await browser.close();

const failed = results.filter((r) => !r).length;
console.log(`\n${results.length - failed}/${results.length} post-deploy checks passed`);
process.exit(failed > 0 ? 1 : 0);
