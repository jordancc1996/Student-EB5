/**
 * Desktop layout-balance audit.
 * Visits every built page at 1280px and 1440px and flags sections whose
 * visible content is left- or right-heavy by more than 15% of the container,
 * or whose heading text-align does not match body copy.
 *
 * Usage: npm run test:balance
 * Optional: BALANCE_BASE_URL=http://127.0.0.1:4325 npm run test:balance
 */
import { chromium, type Page } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const VIEWPORTS = [1280, 1440] as const;
const IMBALANCE_LIMIT = 0.15;
const SKIP_PATHS = new Set(['/404']);

type Flag = {
  viewport: number;
  page: string;
  heading: string;
  leftGap: number;
  rightGap: number;
  imbalancePct: number;
  layout: 'A' | 'B' | 'C';
  reason: string;
};

function routesFromDist(distDir: string): string[] {
  const routes: string[] = [];
  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name === 'index.html') {
        const rel = path.relative(distDir, path.dirname(full)).replace(/\\/g, '/');
        const route = rel === '' || rel === '.' ? '/' : `/${rel.replace(/\/$/, '')}`;
        if (!SKIP_PATHS.has(route) && !route.startsWith('/guides/')) routes.push(route);
      }
    }
  };
  walk(distDir);
  return routes.sort((a, b) => a.localeCompare(b));
}

async function measurePage(page: Page, route: string, viewport: number): Promise<Flag[]> {
  return page.evaluate(
    ({ routePath, vp, limit }) => {
      const flags: Flag[] = [];
      const skip = (el: Element) => {
        const tag = el.tagName;
        if (tag === 'HEADER' || tag === 'FOOTER' || tag === 'NAV' || tag === 'SCRIPT' || tag === 'STYLE') return true;
        if (el.closest('header, footer, [data-astro-transition-persist], #cookie-banner, [role="dialog"]')) return true;
        return false;
      };

      const sections = Array.from(document.querySelectorAll('main > section, main section.section-content, main .article-editorial'));
      const seen = new Set<Element>();
      const targets: Element[] = [];
      for (const el of sections) {
        if (skip(el) || seen.has(el)) continue;
        seen.add(el);
        targets.push(el);
      }
      if (targets.length === 0) {
        const measure = document.querySelector(
          'main .layout-measure, main > .max-w-2xl, main > .max-w-3xl, main > .max-w-4xl, main .prose, main article',
        );
        if (measure) targets.push(measure);
      }

      const visibleBox = (el: Element) => {
        const r = (el as HTMLElement).getBoundingClientRect();
        const style = getComputedStyle(el);
        if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) === 0) return null;
        if (r.width < 8 || r.height < 8) return null;
        return r;
      };

      const classify = (el: Element): 'A' | 'B' | 'C' => {
        const cards = el.querySelectorAll('[class*="grid"] > *, .feature-card, article, .rounded-lg.border');
        const grid = el.querySelector('.grid, [class*="grid-cols"]');
        if (grid && cards.length >= 3) return 'C';
        const split = getComputedStyle(el).display === 'grid' || !!el.querySelector('.grid.md\\:grid-cols-2, .grid.lg\\:grid-cols-2, .md\\:grid-cols-2');
        const hasForm = !!el.querySelector('form');
        const hasImg = !!el.querySelector('img, picture');
        const hasAside = !!el.querySelector('aside, nav.article-toc, .article-toc-track');
        if (hasForm || (hasImg && el.querySelector('h1, h2, p')) || hasAside || split) return 'B';
        return 'A';
      };

      const headingOf = (el: Element) => {
        const h = el.querySelector('h1, h2, h3');
        return (h?.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 72) || el.tagName.toLowerCase();
      };

      const alignMismatch = (el: Element) => {
        const heading = el.querySelector('h1, h2');
        const para = el.querySelector('p');
        if (!heading || !para) return false;
        const ha = getComputedStyle(heading).textAlign;
        const pa = getComputedStyle(para).textAlign;
        const norm = (v: string) => (v === 'start' ? 'left' : v === 'end' ? 'right' : v);
        return norm(ha) !== norm(pa) && (norm(ha) === 'center' || norm(pa) === 'center');
      };

      for (const el of targets) {
        const box = visibleBox(el);
        if (!box) continue;
        const isMeasure = /\blayout-measure\b|\bsection-content\b|\bmax-w-(xl|2xl|3xl|4xl)\b/.test((el as HTMLElement).className || '');
        const container = (
          isMeasure
            ? (el as HTMLElement)
            : ((el.closest('.container, .article-editorial, .section-content, .layout-measure') as HTMLElement) || (el as HTMLElement))
        );
        const cBox = container.getBoundingClientRect();
        if (cBox.width < 200) continue;

        const nodes = Array.from(el.querySelectorAll('h1, h2, h3, p, li, a, img, form, table, button, label, input, blockquote, figure, .card, [class*="card"]')).filter(
          (n) => !n.closest('header, footer'),
        );
        let left = Infinity;
        let right = -Infinity;
        for (const n of nodes) {
          const r = visibleBox(n);
          if (!r) continue;
          left = Math.min(left, r.left);
          right = Math.max(right, r.right);
        }
        if (!Number.isFinite(left) || !Number.isFinite(right)) {
          left = box.left;
          right = box.right;
        }

        const leftGap = Math.max(0, left - cBox.left);
        const rightGap = Math.max(0, cBox.right - right);
        const imbalance = Math.abs(rightGap - leftGap) / cBox.width;
        const mismatch = alignMismatch(el);
        const layout = classify(el);
        if (imbalance > limit || mismatch) {
          flags.push({
            viewport: vp,
            page: routePath,
            heading: headingOf(el),
            leftGap: Math.round(leftGap),
            rightGap: Math.round(rightGap),
            imbalancePct: Math.round(imbalance * 1000) / 10,
            layout,
            reason: mismatch && imbalance <= limit ? 'heading/body text-align mismatch' : 'gap imbalance',
          });
        }
      }
      return flags;
    },
    { routePath: route, vp: viewport, limit: IMBALANCE_LIMIT },
  );
}

function printTable(flags: Flag[]) {
  const rows = flags.slice().sort((a, b) => b.imbalancePct - a.imbalancePct || a.page.localeCompare(b.page));
  const pad = (s: string, n: number) => (s.length > n ? `${s.slice(0, n - 1)}…` : s.padEnd(n));
  console.log(
    `${pad('page', 42)} ${pad('section heading', 40)} ${'L'.padStart(5)} ${'R'.padStart(5)} ${'%'.padStart(6)} ${'lay'.padStart(4)}  note`,
  );
  console.log('-'.repeat(120));
  for (const f of rows) {
    console.log(
      `${pad(f.page, 42)} ${pad(f.heading, 40)} ${String(f.leftGap).padStart(5)} ${String(f.rightGap).padStart(5)} ${String(f.imbalancePct).padStart(6)} ${f.layout.padStart(4)}  ${f.reason} @${f.viewport}`,
    );
  }
  console.log(`\n${rows.length} flagged section(s) across ${VIEWPORTS.join('/')}px.`);
}

async function main() {
  const distDir = path.resolve(process.cwd(), 'dist');
  if (!fs.existsSync(distDir)) {
    console.error('dist/ is missing. Run npm run build first.');
    process.exit(1);
  }
  const routes = routesFromDist(distDir);
  const base = (process.env.BALANCE_BASE_URL || 'http://127.0.0.1:4325').replace(/\/$/, '');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  const flags: Flag[] = [];
  let failedNav = 0;

  for (const width of VIEWPORTS) {
    await page.setViewportSize({ width, height: 1400 });
    for (const route of routes) {
      const url = `${base}${route}`;
      try {
        const res = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
        if (!res || res.status() >= 400) {
          failedNav += 1;
          continue;
        }
        await page.waitForTimeout(400);
        flags.push(...(await measurePage(page, route, width)));
      } catch {
        failedNav += 1;
      }
    }
  }

  await browser.close();
  printTable(flags);

  const unique = flags.filter((f) => f.viewport === 1280);
  const outPath = path.resolve(process.cwd(), 'scripts/layout-balance-report.json');
  fs.writeFileSync(outPath, JSON.stringify({ generatedAt: new Date().toISOString(), flags }, null, 2));
  console.log(`Wrote ${outPath}`);

  const gapFails = flags.filter((f) => f.imbalancePct > IMBALANCE_LIMIT * 100);
  if (gapFails.length) {
    console.error(`${gapFails.length} section(s) exceed ${IMBALANCE_LIMIT * 100}% gap imbalance.`);
    process.exit(1);
  }
  if (failedNav) console.warn(`Navigation failures: ${failedNav}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
