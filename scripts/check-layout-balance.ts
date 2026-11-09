/**
 * Desktop layout-balance audit.
 * Visits every built page at 1280px and 1440px and flags sections whose
 * visible content is left- or right-heavy by more than 15% of the container,
 * whose heading text-align does not match body copy, or whose two-column
 * body text starts below the bottom of the other column.
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
        if (
          !SKIP_PATHS.has(route) &&
          !route.startsWith('/guides/') &&
          !route.startsWith('/private-client-services')
        )
          routes.push(route);
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

      const stackedSplit = (root: Element) => {
        const grids = [root, ...Array.from(root.querySelectorAll('*'))].filter((node) => {
          const s = getComputedStyle(node);
          if (s.display !== 'grid') return false;
          return s.gridTemplateColumns.trim().split(/\s+/).length >= 2;
        });

        const isMedia = (node: Element) =>
          !!node.querySelector('img, picture, form, aside, nav.article-toc, .article-toc-track') ||
          ['IMG', 'PICTURE', 'FORM', 'ASIDE'].includes(node.tagName);
        const isText = (node: Element) =>
          !!node.querySelector('p, h1, h2, h3, li') ||
          ['P', 'H1', 'H2', 'H3', 'UL', 'OL'].includes(node.tagName);

        for (const grid of grids) {
          const kids = Array.from(grid.children).filter((child) => visibleBox(child));
          if (kids.length < 2) continue;
          for (const mediaKid of kids) {
            if (!isMedia(mediaKid)) continue;
            const mediaBox = visibleBox(mediaKid);
            if (!mediaBox) continue;
            const sameRow = kids.filter((child) => {
              const box = visibleBox(child);
              return box != null && Math.abs(box.top - mediaBox.top) < 24;
            });
            const peers = sameRow.filter((child) => child !== mediaKid);
            if (peers.length !== 1 || !isText(peers[0])) continue;
            const firstPara = Array.from(peers[0].querySelectorAll('p, li'))
              .map((n) => visibleBox(n))
              .find(Boolean);
            if (firstPara && firstPara.top > mediaBox.bottom + 8) return true;
            const droppedSiblings = kids.some((child) => {
              if (child === mediaKid || child === peers[0] || !isText(child)) return false;
              const box = visibleBox(child);
              return box != null && box.top > mediaBox.bottom + 8;
            });
            if (!firstPara && droppedSiblings) return true;
          }
        }
        return false;
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
        const stacked = stackedSplit(el);
        const layout = classify(el);
        if (imbalance > limit || mismatch || stacked) {
          flags.push({
            viewport: vp,
            page: routePath,
            heading: headingOf(el),
            leftGap: Math.round(leftGap),
            rightGap: Math.round(rightGap),
            imbalancePct: Math.round(imbalance * 1000) / 10,
            layout,
            reason: stacked
              ? 'split body starts below other column'
              : mismatch && imbalance <= limit
                ? 'heading/body text-align mismatch'
                : 'gap imbalance',
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

const ARTICLE_RAIL_WIDTHS = [375, 768, 1280, 1440, 1680, 1920, 2400, 2560, 3440] as const;

function isArticleRoute(route: string): boolean {
  return (
    (route.startsWith('/research/') && route.length > '/research/'.length) ||
    (route.startsWith('/news/') && route.length > '/news/'.length)
  );
}

type RailFlag = {
  viewport: number;
  page: string;
  reason: string;
};

async function measureArticleRail(page: Page, route: string, viewport: number): Promise<RailFlag[]> {
  return page.evaluate(
    ({ routePath, vp }) => {
      const flags: RailFlag[] = [];
      const fail = (reason: string) => flags.push({ viewport: vp, page: routePath, reason });
      const scrollWidth = document.documentElement.scrollWidth;
      const clientWidth = document.documentElement.clientWidth;
      if (scrollWidth > clientWidth + 1) {
        fail(`horizontal scroll ${scrollWidth} > ${clientWidth}`);
      }

      const rail = document.querySelector('.article-side-rail');
      const railStyle = rail ? getComputedStyle(rail) : null;
      const railRect = rail?.getBoundingClientRect();
      const railVisible = !!rail && railStyle?.display !== 'none' && (railRect?.width ?? 0) > 8;

      if (vp < 1440) {
        if (railVisible) fail('side rail is visible below 1440px');
        return flags;
      }

      const toc = document.querySelector('.article-toc-track')?.getBoundingClientRect();
      const main = document.querySelector('.article-with-toc__main')?.getBoundingClientRect();
      if (!railVisible || !rail || !railRect || !toc || !main) {
        fail('TOC, article, or rail track is missing');
        return flags;
      }

      const text = (rail.textContent || '').replace(/\s+/g, ' ').trim();
      const linkCount = rail.querySelectorAll('a').length;
      if (text.length < 40 || linkCount < 3 || !/Talk to an EB-5 advisor/.test(text) || !/Related research/.test(text)) {
        fail(`rail is empty or incomplete (${linkCount} links)`);
      }
      if (toc.right > main.left + 1 || main.right > railRect.left + 1) {
        fail('tracks overlap');
      }
      const leftMargin = toc.left;
      const rightMargin = clientWidth - railRect.right;
      if (Math.abs(leftMargin - rightMargin) > 16) {
        fail(`outer margins differ by ${Math.abs(leftMargin - rightMargin).toFixed(1)}px (left ${leftMargin.toFixed(1)}, right ${rightMargin.toFixed(1)})`);
      }
      const tracks =
        vp >= 2400
          ? { toc: 340, article: 792, rail: 380 }
          : vp >= 1920
            ? { toc: 320, article: 768, rail: 360 }
            : vp >= 1680
              ? { toc: 290, article: 716, rail: 330 }
              : { toc: 240, article: 728, rail: 288 };
      const widthOff = (actual: number, expected: number) => Math.abs(actual - expected) > 16;
      if (widthOff(toc.width, tracks.toc)) fail(`TOC width ${Math.round(toc.width)}px, expected ${tracks.toc}`);
      if (widthOff(main.width, tracks.article)) fail(`article width ${Math.round(main.width)}px, expected ${tracks.article}`);
      if (widthOff(railRect.width, tracks.rail)) fail(`rail width ${Math.round(railRect.width)}px, expected ${tracks.rail}`);
      const sticky = rail.querySelector('.article-side-rail__sticky');
      const stickyHeight = sticky ? sticky.getBoundingClientRect().height : 0;
      if (stickyHeight < window.innerHeight * 0.6) {
        fail(
          `sticky rail visible height ${Math.round(stickyHeight)}px is under 60% of ${window.innerHeight}px`,
        );
      }
      if (vp === 1920 && sticky) {
        const header = document.querySelector('nav.nav-simple');
        const headerHeight = header ? header.getBoundingClientRect().height : 72;
        const available = window.innerHeight - headerHeight - 48;
        if (sticky.scrollHeight > available + 1) {
          fail(`rail content ${Math.round(sticky.scrollHeight)}px exceeds the viewport (${Math.round(available)}px available)`);
        }
      }
      return flags;
    },
    { routePath: route, vp: viewport },
  );
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

  const articleRoutes = routes.filter(isArticleRoute);
  const railFlags: RailFlag[] = [];
  for (const width of ARTICLE_RAIL_WIDTHS) {
    const height = width >= 1920 ? 1080 : width >= 1440 ? 900 : 800;
    await page.setViewportSize({ width, height });
    for (const route of articleRoutes) {
      const url = `${base}${route}`;
      try {
        const res = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
        if (!res || res.status() >= 400) {
          railFlags.push({ viewport: width, page: route, reason: `HTTP ${res?.status() ?? 'none'}` });
          continue;
        }
        await page.waitForSelector('.article-content', { timeout: 15000 });
        railFlags.push(...(await measureArticleRail(page, route, width)));
      } catch (err) {
        railFlags.push({
          viewport: width,
          page: route,
          reason: err instanceof Error ? err.message : 'navigation failed',
        });
      }
    }
  }

  await browser.close();
  printTable(flags);
  if (railFlags.length) {
    console.log('\nArticle rail checks:');
    for (const flag of railFlags) {
      console.log(`FAIL ${flag.page} @${flag.viewport}: ${flag.reason}`);
    }
  } else {
    console.log(`\nArticle rail checks passed for ${articleRoutes.length} article(s) at ${ARTICLE_RAIL_WIDTHS.join('/')}px.`);
  }

  const unique = flags.filter((f) => f.viewport === 1280);
  const outPath = path.resolve(process.cwd(), 'scripts/layout-balance-report.json');
  fs.writeFileSync(outPath, JSON.stringify({ generatedAt: new Date().toISOString(), flags }, null, 2));
  console.log(`Wrote ${outPath}`);

  const gapFails = flags.filter((f) => f.imbalancePct > IMBALANCE_LIMIT * 100);
  const stackedFails = flags.filter((f) => f.reason === 'split body starts below other column');
  if (gapFails.length) {
    console.error(`${gapFails.length} section(s) exceed ${IMBALANCE_LIMIT * 100}% gap imbalance.`);
  }
  if (stackedFails.length) {
    console.error(`${stackedFails.length} two-column section(s) start body text below the other column.`);
  }
  if (gapFails.length || stackedFails.length || railFlags.length) process.exit(1);
  if (failedNav) console.warn(`Navigation failures: ${failedNav}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
