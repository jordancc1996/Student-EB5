/**
 * Article format audit. Run after a fresh build:
 *   npm run test:article-format
 * Starts its own preview of dist/. Does not reuse an old dev server.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { configurePlaywrightBrowsersPath, launchChromium } from './lib/playwright-env.mjs';

const ROOT = process.cwd();
const DIST = path.join(ROOT, 'dist');
const SITE = 'https://studenteb5.com';
const PORT = Number(process.env.FORMAT_PORT || 4411);
let BASE = `http://127.0.0.1:${PORT}`;
const VIEWPORTS = [
  { width: 375, height: 812 },
  { width: 1280, height: 800 },
  { width: 1440, height: 900 },
  { width: 1680, height: 900 },
  { width: 1920, height: 1080 },
  { width: 2400, height: 1080 },
  { width: 2560, height: 1080 },
  { width: 3440, height: 1080 },
];
const CONTENT_CAUSES = new Set(['no-hero', 'image-alt', 'heading-skip', 'duplicate-meta']);
const COLUMNS = ['template', 'blocks', 'layout', 'typography', 'headings', 'seo', 'images', 'links'];

configurePlaywrightBrowsersPath();

function walk(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, acc);
    else acc.push(full);
  }
  return acc;
}

function normalizePath(pathname) {
  if (!pathname) return '/';
  const clean = pathname.split('?')[0].split('#')[0];
  if (clean.length > 1 && clean.endsWith('/')) return clean.slice(0, -1);
  return clean || '/';
}

function distRoutes() {
  const routes = new Set();
  for (const file of walk(DIST)) {
    if (!file.endsWith('.html')) continue;
    let rel = path.relative(DIST, file).replace(/\\/g, '/');
    if (rel === 'index.html') routes.add('/');
    else if (rel.endsWith('/index.html')) routes.add(`/${rel.slice(0, -'/index.html'.length)}`);
    else routes.add(`/${rel.slice(0, -'.html'.length)}`);
  }
  return routes;
}

function redirectMap() {
  const map = new Map();
  const astroSrc = fs.readFileSync(path.join(ROOT, 'astro.config.mjs'), 'utf8');
  const pairRe =
    /['"](\/[^'"]+)['"]\s*:\s*(?:['"](\/[^'"]+)['"]|\{\s*status:\s*\d+,\s*destination:\s*['"](\/[^'"]+)['"]\s*\})/g;
  let match;
  while ((match = pairRe.exec(astroSrc))) {
    map.set(normalizePath(match[1]), normalizePath(match[2] || match[3]));
  }
  const vercelPath = path.join(ROOT, 'vercel.json');
  if (fs.existsSync(vercelPath)) {
    const vercel = JSON.parse(fs.readFileSync(vercelPath, 'utf8'));
    for (const redirect of vercel.redirects ?? []) {
      if (typeof redirect.source === 'string' && redirect.source.startsWith('/')) {
        map.set(normalizePath(redirect.source), normalizePath(redirect.destination));
      }
    }
  }
  return map;
}

function routeExists(pathname, routes, redirects) {
  const clean = normalizePath(pathname);
  if (routes.has(clean)) return true;
  const dest = redirects.get(clean);
  return Boolean(dest && routes.has(dest));
}

function sitemapArticlePaths() {
  const paths = new Set();
  for (const file of walk(DIST).filter((item) => /sitemap[^/\\]*\.xml$/i.test(item))) {
    const xml = fs.readFileSync(file, 'utf8');
    for (const loc of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
      try {
        const url = new URL(loc[1].trim());
        if (!url.pathname.startsWith('/sitemap')) paths.add(normalizePath(url.pathname));
      } catch {
        // ignore malformed loc
      }
    }
  }
  return [...paths].filter(isArticlePath);
}

function isArticlePath(pathname) {
  return /^\/research\/.+/.test(pathname) || /^\/news\/.+/.test(pathname);
}

function articleType(pathname) {
  return pathname.startsWith('/news/') ? 'news' : 'research';
}

function contentArticlePaths() {
  const paths = [];
  const blogDir = path.join(ROOT, 'src', 'content', 'blog');
  for (const file of walk(blogDir).filter((item) => item.endsWith('.md') || item.endsWith('.mdx'))) {
    const text = fs.readFileSync(file, 'utf8');
    const frontmatter = text.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '';
    if (/^draft:\s*true\s*$/m.test(frontmatter)) continue;
    const slug = frontmatter.match(/^slug:\s*['"]?([^'"\n]+)['"]?\s*$/m)?.[1]?.trim();
    if (!slug) continue;
    paths.push(`/research/${slug}`);
  }
  const newsSrc = fs.readFileSync(path.join(ROOT, 'src', 'data', 'newsArticles.ts'), 'utf8');
  const seen = new Set();
  for (const match of newsSrc.matchAll(/slug:\s*'([^']+)'/g)) {
    if (seen.has(match[1])) continue;
    seen.add(match[1]);
    paths.push(`/news/${match[1]}`);
  }
  return paths;
}

function stamp() {
  const date = new Date();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

function cell(ok) {
  return ok ? 'pass' : 'fail';
}

function causeColumn(cause) {
  if (['template', 'http', 'not-in-sitemap'].includes(cause)) return 'template';
  if (cause === 'block-order') return 'blocks';
  if (['layout', 'h-scroll', 'title-align', 'toc-visibility', 'rail'].includes(cause)) return 'layout';
  if (cause === 'typography') return 'typography';
  if (['h1', 'heading-skip', 'heading-id', 'toc-mismatch'].includes(cause)) return 'headings';
  if (['seo', 'duplicate-meta'].includes(cause)) return 'seo';
  if (['no-hero', 'image-alt', 'hero-dimensions', 'image-overflow', 'body-dimensions', 'body-srcset', 'body-lazy', 'body-height', 'cls'].includes(cause)) return 'images';
  if (cause === 'broken-link') return 'links';
  return 'template';
}

function startPreview() {
  const child = spawn('npx', ['astro', 'preview', '--host', '127.0.0.1', '--port', String(PORT)], {
    cwd: ROOT,
    shell: true,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let log = '';
  child.stdout.on('data', (chunk) => {
    log += chunk.toString();
  });
  child.stderr.on('data', (chunk) => {
    log += chunk.toString();
  });
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Preview did not start.\n${log.slice(-1000)}`));
    }, 60000);
    const tick = () => {
      const match = log.match(/Local\s+(http:\/\/127\.0\.0\.1:\d+)/);
      if (match) {
        clearTimeout(timer);
        resolve({ child, base: match[1] });
        return;
      }
      if (child.exitCode != null) {
        clearTimeout(timer);
        reject(new Error(`Preview exited ${child.exitCode}.\n${log.slice(-1000)}`));
        return;
      }
      setTimeout(tick, 200);
    };
    tick();
  });
}

function stopPreview(child) {
  if (!child || child.killed) return;
  if (process.platform === 'win32' && child.pid) {
    spawn('taskkill', ['/PID', String(child.pid), '/T', '/F'], { shell: true, stdio: 'ignore' });
    return;
  }
  child.kill('SIGTERM');
}

function readPageSnapshot() {
  const header = document.querySelector('nav.nav-simple, header');
  const title = document.querySelector('.article-title-block');
  const fallbackHeader = document.querySelector('main header');
  const titleHost = title || fallbackHeader;
  const h1 = document.querySelector('h1');
  const heroSection = [...document.querySelectorAll('section')].find(
    (section) => section.querySelector('.article-title-block') && section.querySelector('img'),
  );
  const heroImg = heroSection?.querySelector('img') ?? null;
  const crumb = document.querySelector('nav[aria-label="Breadcrumb"]');
  const topDisclaimer = document.querySelector('.article-legal-disclaimer, [aria-label="Legal disclaimer"]');
  const body = document.querySelector('.article-content');
  const bottom = document.querySelector('.article-bottom-disclaimer');
  const share = [...document.querySelectorAll('span, p')].find((el) => el.textContent.trim() === 'Share this article') ?? null;
  const published = [...document.querySelectorAll('main footer')].find(
    (el) => /published/i.test(el.textContent) && /last updated/i.test(el.textContent),
  ) ?? null;
  const related = [...document.querySelectorAll('h2')].find((el) => el.textContent.trim() === 'Related Articles') ?? null;
  const siteFooter = document.querySelector('footer.bg-primary');
  const problems = [];

  function follows(earlier, later) {
    if (!earlier || !later) return false;
    return Boolean(earlier.compareDocumentPosition(later) & Node.DOCUMENT_POSITION_FOLLOWING);
  }

  if (!document.querySelector('.research-article-page.research-article-page--rail')) problems.push('missing shared article shell');
  if (!document.querySelector('.article-with-toc.article-with-toc--has-rail')) problems.push('missing shared TOC and rail layout');
  if (!header || !h1 || !follows(header, h1)) problems.push('header/nav is not before the title');
  if (!titleHost) problems.push('missing title block');
  else {
    if (!titleHost.querySelector('.editorial-kicker')) problems.push('missing kicker');
    if (!titleHost.querySelector('h1')) problems.push('H1 is outside the title block');
    const titleText = titleHost.textContent || '';
    if (!/published/i.test(titleText)) problems.push('missing Published');
    if (!/last updated/i.test(titleText)) problems.push('missing Last updated');
    if (!/\d+\s*min/i.test(titleText)) problems.push('missing reading time');
  }
  if (heroImg) {
    if (!follows(heroImg, title)) problems.push('hero image is not before the title block');
    if (title && heroSection && !heroSection.contains(title)) problems.push('title block is outside the hero');
  }
  if (!crumb) problems.push('missing breadcrumb');
  else if (heroImg && titleHost && !follows(titleHost, crumb)) problems.push('breadcrumb is before the title block');
  if (!topDisclaimer) problems.push('missing top disclaimer');
  else if (crumb && !follows(crumb, topDisclaimer)) problems.push('top disclaimer is before the breadcrumb');
  if (!body) problems.push('missing article body');
  else if (topDisclaimer && !follows(topDisclaimer, body)) problems.push('article body is before the top disclaimer');
  const sourceHeading = [...document.querySelectorAll('.article-content h2, .article-content h3')].find((el) =>
    /sources|references|further reading/i.test(el.textContent || ''),
  );
  if (sourceHeading && bottom && !follows(sourceHeading, bottom)) problems.push('sources are after the closing disclaimer');
  if (!bottom) problems.push('missing closing disclaimer');
  else if (body && !follows(body, bottom)) problems.push('closing disclaimer is before the article body');
  if (!share) problems.push('missing share row');
  else if (bottom && !follows(bottom, share)) problems.push('share row is before the closing disclaimer');
  if (!published) problems.push('missing published/updated footer');
  else if (share && !follows(share, published)) problems.push('published footer is before the share row');
  if (!related) problems.push('missing related articles');
  else if (published && !follows(published, related)) problems.push('related articles are before the published footer');
  if (!siteFooter) problems.push('missing site footer');
  else if (related && !follows(related, siteFooter)) problems.push('site footer is before related articles');

  const h1s = [...document.querySelectorAll('h1')].map((el) => (el.textContent || '').replace(/\s+/g, ' ').trim());
  const bodyHeadings = [...document.querySelectorAll('.article-content h2, .article-content h3, .article-content h4')]
    .filter((el) => !el.closest('.not-prose, aside'))
    .map((el) => ({
    level: Number(el.tagName.slice(1)),
    id: el.id || '',
    text: (el.textContent || '').replace(/\s+/g, ' ').trim(),
  }));
  const tocIds = [...document.querySelectorAll('nav.article-toc a[href^="#"]')].map((el) => {
    try {
      return decodeURIComponent((el.getAttribute('href') || '').slice(1));
    } catch {
      return (el.getAttribute('href') || '').slice(1);
    }
  });

  const schemas = [];
  for (const script of document.querySelectorAll('script[type="application/ld+json"]')) {
    try {
      schemas.push(JSON.parse(script.textContent || ''));
    } catch (error) {
      schemas.push({ invalid: true, error: error instanceof Error ? error.message : 'invalid JSON-LD' });
    }
  }

  const pathName = location.pathname.replace(/\/$/, '') || '/';
  return {
    shell: Boolean(document.querySelector('.research-article-page.research-article-page--rail .article-with-toc--has-rail')),
    blockProblems: problems.filter((item) => item !== 'no-hero'),
    hasHero: Boolean(heroImg),
    heroAlt: heroImg?.getAttribute('alt')?.trim() || '',
    heroWidth: heroImg?.getAttribute('width') || '',
    heroHeight: heroImg?.getAttribute('height') || '',
    missingAlt: [...document.querySelectorAll('.article-content img')]
      .filter((img) => !(img.getAttribute('alt') || '').trim())
      .map((img) => img.currentSrc || img.getAttribute('src') || 'image'),
    bodyImages: [...document.querySelectorAll('.article-content img')].map((img) => ({
      width: img.getAttribute('width') || '',
      height: img.getAttribute('height') || '',
      srcset: img.getAttribute('srcset') || '',
      loading: img.getAttribute('loading') || '',
    })),
    h1s,
    bodyHeadings,
    tocIds,
    h2Count: bodyHeadings.filter((heading) => heading.level === 2).length,
    seo: {
      title: document.title.trim(),
      description: document.querySelector('meta[name="description"]')?.getAttribute('content')?.trim() || '',
      canonical: document.querySelector('link[rel="canonical"]')?.href || '',
      expectedCanonical: `https://studenteb5.com${pathName}`,
      ogImage: document.querySelector('meta[property="og:image"]')?.getAttribute('content') || '',
      ogWidth: document.querySelector('meta[property="og:image:width"]')?.getAttribute('content') || '',
      ogHeight: document.querySelector('meta[property="og:image:height"]')?.getAttribute('content') || '',
      ogAlt: document.querySelector('meta[property="og:image:alt"]')?.getAttribute('content')?.trim() || '',
      twitterCard: document.querySelector('meta[name="twitter:card"]')?.getAttribute('content') || '',
      twitterImage: document.querySelector('meta[name="twitter:image"]')?.getAttribute('content') || '',
      schemas,
      brand: /StudentEB5/.test(document.querySelector('nav.nav-simple')?.textContent || document.body.textContent || ''),
    },
    hrefs: [...document.querySelectorAll('a[href]')].map((el) => el.getAttribute('href') || ''),
    ids: [...document.querySelectorAll('[id]')].map((el) => el.id),
  };
}

function readViewport(width) {
  const doc = document.documentElement;
  const main = document.querySelector('.article-with-toc__main');
  const toc = document.querySelector('.article-toc-track');
  const rail = document.querySelector('.article-side-rail');
  const inline = document.querySelector('.article-contents--inline');
  const content = document.querySelector('.article-content');
  const h1 = document.querySelector('h1');

  function shown(el) {
    if (!el) return false;
    const style = getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 8 && rect.height > 0;
  }

  function fontOf(el) {
    if (!el) return null;
    const style = getComputedStyle(el);
    return {
      family: style.fontFamily,
      size: Number.parseFloat(style.fontSize),
      weight: style.fontWeight,
      align: style.textAlign,
    };
  }

  const visibleParts = [toc, main, rail].filter(shown);
  const left = visibleParts.length ? Math.min(...visibleParts.map((el) => el.getBoundingClientRect().left)) : null;
  const right = visibleParts.length ? Math.max(...visibleParts.map((el) => el.getBoundingClientRect().right)) : null;
  const clientWidth = doc.clientWidth;
  const colRight = main ? main.getBoundingClientRect().right + 2 : null;
  const overflow = [];
  if (colRight != null) {
    for (const el of document.querySelectorAll('.article-content img, .article-content table, .article-content iframe, .article-content video')) {
      if (el.closest('.overflow-x-auto, .table-scroll, .not-prose')) continue;
      const rect = el.getBoundingClientRect();
      if (rect.width < 2 || rect.height < 2) continue;
      if (rect.right > colRight) overflow.push(el.currentSrc || el.getAttribute('src') || el.tagName.toLowerCase());
    }
  }

  const body = [...document.querySelectorAll('.article-content p')].find(
    (el) => !el.closest('.article-intro, figcaption') && !el.classList.contains('data-source') && !el.classList.contains('photo-credit'),
  );
  const thumbs = [...document.querySelectorAll('.article-side-rail .article-rail-related__thumb')];
  const follow = document.querySelector('[data-article-follow]');
  const tocLinks = [...document.querySelectorAll('nav.article-toc .article-contents__link')];
  const h3Items = [...document.querySelectorAll('nav.article-toc li[data-toc-level="3"]')];
  const h3Sections = new Set(h3Items.map((item) => item.dataset.tocSection));
  const charsPerLine = (() => {
    const column = document.querySelector('.article-content');
    const sample = document.querySelector('.article-content p');
    if (!column || !sample) return null;
    const style = getComputedStyle(sample);
    const probe = document.createElement('p');
    probe.textContent = 'The investment threshold for a targeted employment area is $800,000 before USCIS filing fees and attorney costs. '.repeat(6);
    probe.style.position = 'absolute';
    probe.style.visibility = 'hidden';
    probe.style.left = '0';
    probe.style.top = '0';
    probe.style.margin = '0';
    probe.style.width = `${column.getBoundingClientRect().width}px`;
    probe.style.font = style.font;
    probe.style.letterSpacing = style.letterSpacing;
    probe.style.wordSpacing = style.wordSpacing;
    column.appendChild(probe);
    const textNode = probe.firstChild;
    const text = textNode ? textNode.textContent || '' : '';
    if (!textNode || !text) {
      probe.remove();
      return null;
    }
    const range = document.createRange();
    range.setStart(textNode, 0);
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
    probe.remove();
    return best;
  })();

  return {
    hScroll: doc.scrollWidth > clientWidth + 1 || (main ? main.scrollWidth > main.clientWidth + 1 : false),
    articleWidth: main ? Math.round(main.getBoundingClientRect().width) : null,
    tocWidth: shown(toc) ? Math.round(toc.getBoundingClientRect().width) : 0,
    railWidth: shown(rail) ? Math.round(rail.getBoundingClientRect().width) : 0,
    tocVisible: shown(toc),
    railVisible: shown(rail),
    inlineVisible: shown(inline),
    marginDelta: left == null || right == null ? null : Math.abs(Math.round(left) - Math.round(clientWidth - right)),
    titleAlign: h1 && content ? Math.abs(Math.round(h1.getBoundingClientRect().left - content.getBoundingClientRect().left)) : null,
    clientWidth,
    overflow,
    advisor: Boolean(document.querySelector('.article-side-rail .article-rail-card')),
    googleInRail: Boolean(rail && follow && rail.contains(follow)),
    thumbCount: thumbs.length,
    thumbsLoaded: thumbs.filter((img) => img.complete && img.naturalWidth > 0).length,
    thumbWidth: thumbs[0] ? Math.round(thumbs[0].getBoundingClientRect().width) : 0,
    tocFont: tocLinks[0] ? Number.parseFloat(getComputedStyle(tocLinks[0]).fontSize) : null,
    tocVisibleCount: tocLinks.filter((link) => {
      const item = link.closest('li');
      return !item?.hidden && link.getBoundingClientRect().height > 0;
    }).length,
    h3SectionCount: h3Sections.size,
    hiddenH3Count: h3Items.filter((item) => item.hidden).length,
    charsPerLine,
    fonts: {
      body: fontOf(body),
      intro: fontOf(document.querySelector('.article-content .article-intro')),
      h1: fontOf(h1),
      h2: fontOf(document.querySelector('.article-content > h2')),
      h3: fontOf(document.querySelector('.article-content > h3')),
      h4: fontOf(document.querySelector('.article-content > h4')),
      kicker: fontOf(document.querySelector('.article-title-block .editorial-kicker, main header .editorial-kicker')),
      meta: fontOf(document.querySelector('.article-title-block .research-article-meta, main header .research-article-meta')),
    },
  };
}

function weightOf(value) {
  if (value === 'normal') return 400;
  if (value === 'bold') return 700;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function familyHas(font, name) {
  return Boolean(font && font.family.toLowerCase().includes(name.toLowerCase()));
}

function sizeOk(font, expected) {
  return Boolean(font && Math.abs(font.size - expected) <= 0.75);
}

function flattenSchema(node, acc = []) {
  if (!node || typeof node !== 'object') return acc;
  if (Array.isArray(node)) {
    for (const item of node) flattenSchema(item, acc);
    return acc;
  }
  acc.push(node);
  if (node['@graph']) flattenSchema(node['@graph'], acc);
  return acc;
}

function schemaType(node) {
  const value = node?.['@type'];
  return Array.isArray(value) ? value.join(' ') : String(value || '');
}

function authorName(author) {
  if (!author) return '';
  if (typeof author === 'string') return author.trim();
  if (Array.isArray(author)) return authorName(author[0]);
  return String(author.name || '').trim();
}

function imageUrl(image) {
  if (!image) return '';
  if (typeof image === 'string') return image;
  if (Array.isArray(image)) return imageUrl(image[0]);
  return String(image.url || '');
}

function checkSeo(seo, h1) {
  const notes = [];
  if (!seo.title) notes.push('missing title');
  if (!seo.description) notes.push('missing meta description');
  if (seo.canonical !== seo.expectedCanonical) notes.push(`canonical ${seo.canonical || 'missing'}`);
  if (!seo.ogImage.startsWith(`${SITE}/`)) notes.push('og:image is not an absolute studenteb5.com URL');
  if (seo.ogWidth !== '1200' || seo.ogHeight !== '630') notes.push(`og:image size ${seo.ogWidth || '?'}x${seo.ogHeight || '?'}`);
  if (!seo.ogAlt) notes.push('missing og:image:alt');
  if (seo.twitterCard !== 'summary_large_image') notes.push(`twitter:card ${seo.twitterCard || 'missing'}`);
  if (!seo.twitterImage.startsWith(`${SITE}/`)) notes.push('twitter:image is not an absolute studenteb5.com URL');
  if (!seo.brand) notes.push('header does not show StudentEB5');

  const nodes = seo.schemas.flatMap((schema) => (schema?.invalid ? [schema] : flattenSchema(schema)));
  if (nodes.some((node) => node.invalid)) notes.push('JSON-LD does not parse');
  const article = nodes.find((node) => /Article/.test(schemaType(node)) && schemaType(node) !== 'ArticleSection');
  if (!article || article.invalid) notes.push('missing Article or NewsArticle schema');
  else {
    const headline = String(article.headline || '').replace(/\s+/g, ' ').trim();
    if (!h1 || headline !== h1) notes.push('schema headline does not match the H1');
    if (!article.datePublished) notes.push('schema missing datePublished');
    if (!article.dateModified) notes.push('schema missing dateModified');
    const schemaImage = imageUrl(article.image);
    if (!schemaImage.startsWith(`${SITE}/`)) notes.push('schema image is not an absolute studenteb5.com URL');
    if (!authorName(article.author)) notes.push('schema missing author');
    const publisher = authorName(article.publisher);
    if (publisher !== 'StudentEB5') notes.push(`schema publisher ${publisher || 'missing'}`);
  }
  return notes;
}

function checkHeadings(snapshot) {
  const notes = [];
  const causes = [];
  if (snapshot.h1s.length !== 1) {
    causes.push(['h1', `${snapshot.h1s.length} H1s`]);
  }
  let previous = 1;
  for (const heading of snapshot.bodyHeadings) {
    if (heading.level > previous + 1) {
      causes.push(['heading-skip', `H${previous} skipped to H${heading.level}: ${heading.text}`]);
    }
    previous = heading.level;
    if (heading.level === 2) {
      if (!heading.id) causes.push(['heading-id', `H2 has no id: ${heading.text}`]);
      else if (!snapshot.tocIds.includes(heading.id)) causes.push(['toc-mismatch', `H2 missing from TOC: ${heading.text}`]);
    }
  }
  return causes.length ? causes : notes;
}

function bodySizeFor(width) {
  if (width >= 2400) return 22;
  if (width >= 1920) return 21;
  return width >= 768 ? 20 : 18;
}

function articleTracks(width) {
  if (width >= 2400) return { toc: 340, article: 860, rail: 380, tocFont: 16 };
  if (width >= 1920) return { toc: 320, article: 800, rail: 360, tocFont: 16 };
  if (width >= 1680) return { toc: 290, article: 780, rail: 330, tocFont: 15 };
  if (width >= 1440) return { toc: 240, article: 768, rail: 288, tocFont: 14.4 };
  return null;
}

function checkFonts(fonts, width) {
  const wide = width >= 768;
  const notes = [];
  const expect = [
    ['body', fonts.body, 'Source Serif 4', 400, bodySizeFor(width)],
    ['standfirst', fonts.intro, 'Playfair Display', 400, wide ? 22 : 18],
    ['H1', fonts.h1, 'Playfair Display', 500, wide ? 46 : 33],
    ['H2', fonts.h2, 'Playfair Display', 600, wide ? 32 : 26],
    ['H3', fonts.h3, 'Playfair Display', 600, wide ? 24 : 21],
    ['H4', fonts.h4, 'Montserrat', 600, wide ? 16 : 15],
    ['kicker', fonts.kicker, 'Montserrat', 600, 12],
    ['date row', fonts.meta, 'Montserrat', 500, 13],
  ];
  for (const [label, font, family, weight, size] of expect) {
    if (!font) {
      if (label === 'standfirst' || label === 'H2' || label === 'H3' || label === 'H4') continue;
      notes.push(`${label} missing at ${width}px`);
      continue;
    }
    const problems = [];
    if (!familyHas(font, family)) problems.push(font.family);
    if (weightOf(font.weight) !== weight) problems.push(`weight ${font.weight}`);
    if (!sizeOk(font, size)) problems.push(`${font.size}px`);
    if ((label === 'H1' || label === 'kicker') && !['left', 'start'].includes(font.align)) problems.push(`align ${font.align}`);
    if (problems.length) notes.push(`${label} at ${width}px: ${problems.join(', ')}`);
  }
  return notes;
}

function checkLayout(view, width, h2Count) {
  const notes = [];
  if (view.hScroll) notes.push(`horizontal scroll at ${width}px`);
  if (view.titleAlign == null || view.titleAlign > 16) notes.push(`title not aligned with the column at ${width}px (${view.titleAlign ?? 'missing'}px)`);
  if (view.marginDelta == null || view.marginDelta > 16) notes.push(`outer margins differ by ${view.marginDelta ?? 'n/a'}px at ${width}px`);
  if (view.overflow.length) notes.push(`content overflows the column at ${width}px`);

  if (width < 1024) {
    if (view.railVisible) notes.push(`rail visible at ${width}px`);
    if (view.tocVisible) notes.push(`side TOC visible at ${width}px`);
    if (h2Count >= 3 && !view.inlineVisible) notes.push(`inline Contents missing at ${width}px`);
    if (view.articleWidth != null && view.clientWidth - view.articleWidth > 80) notes.push(`article is not full width at ${width}px (${view.articleWidth}px)`);
  } else if (width < 1440) {
    if (view.railVisible) notes.push(`rail visible at ${width}px`);
    if (h2Count >= 3 && !view.tocVisible) notes.push(`side TOC missing at ${width}px`);
    if (view.tocVisible && Math.abs(view.tocWidth - 216) > 16) notes.push(`TOC width ${view.tocWidth}px at ${width}px`);
    if (view.articleWidth == null || Math.abs(view.articleWidth - 720) > 16) notes.push(`article width ${view.articleWidth ?? 'missing'}px at ${width}px`);
  } else {
    if (!view.railVisible) notes.push(`rail missing at ${width}px`);
    if (h2Count >= 3 && !view.tocVisible) notes.push(`side TOC missing at ${width}px`);
    const tracks = articleTracks(width);
    if (tracks && view.tocVisible && Math.abs(view.tocWidth - tracks.toc) > 16) notes.push(`TOC width ${view.tocWidth}px at ${width}px`);
    if (tracks && view.articleWidth != null && Math.abs(view.articleWidth - tracks.article) > 16) notes.push(`article width ${view.articleWidth}px at ${width}px`);
    if (tracks && view.railVisible && Math.abs(view.railWidth - tracks.rail) > 16) notes.push(`rail width ${view.railWidth}px at ${width}px`);
    if (tracks && view.tocFont != null && Math.abs(view.tocFont - tracks.tocFont) > 0.75) notes.push(`TOC link ${view.tocFont}px at ${width}px`);
    // The sample sentence is a little narrower than average body copy.
    // On the reference article the real paragraph measures 76 characters.
    const charMax = width >= 2400 ? 82 : 78;
    if (width >= 1680 && view.charsPerLine != null && (view.charsPerLine < 65 || view.charsPerLine > charMax)) {
      notes.push(`body line is ${view.charsPerLine} characters at ${width}px`);
    }
    if (view.h3SectionCount > 1 && view.hiddenH3Count === 0) notes.push(`all H3 TOC entries are expanded at ${width}px`);
    const thumbTarget = width >= 1920 ? 96 : 88;
    if (view.railVisible && view.thumbWidth && Math.abs(view.thumbWidth - thumbTarget) > 2) {
      notes.push(`rail thumbnail ${view.thumbWidth}px wide at ${width}px`);
    }
    if (!view.advisor) notes.push(`advisor card missing at ${width}px`);
    if (!view.googleInRail) notes.push(`Google block is not in the rail at ${width}px`);
    if (view.thumbCount !== 4 || view.thumbsLoaded !== 4) notes.push(`related thumbnails ${view.thumbsLoaded}/${view.thumbCount} loaded at ${width}px`);
  }
  return notes;
}

function checkLinks(snapshot, pagePath, routes, redirects) {
  const broken = [];
  const ids = new Set(snapshot.ids);
  for (const raw of snapshot.hrefs) {
    if (!raw || raw.startsWith('mailto:') || raw.startsWith('tel:') || raw.startsWith('javascript:')) continue;
    let url;
    try {
      url = new URL(raw, `${SITE}${pagePath}`);
    } catch {
      broken.push(raw);
      continue;
    }
    const host = url.hostname.replace(/^www\./, '');
    if (url.protocol === 'http:' || url.protocol === 'https:') {
      if (host !== 'studenteb5.com') continue;
    } else if (url.protocol !== '') {
      continue;
    }
    const pathname = normalizePath(url.pathname);
    if (pathname && !routeExists(pathname, routes, redirects)) {
      broken.push(raw);
      continue;
    }
    if (url.hash && normalizePath(pathname) === normalizePath(pagePath)) {
      const id = decodeURIComponent(url.hash.slice(1));
      if (id && !ids.has(id)) broken.push(raw);
    }
  }
  return [...new Set(broken)];
}

function addIssue(row, cause, note) {
  row.issues.push({ cause, note });
}

async function measureArticleImages(page) {
  return page.evaluate(async () => {
    document.documentElement.style.scrollBehavior = 'auto';
    await document.fonts.ready;
    await new Promise((resolve) => setTimeout(resolve, 1000));
    window.__cls = 0;
    window.__clsSources = [];
    const imgs = [...document.querySelectorAll('.article-content img')];
    for (const img of imgs) {
      img.scrollIntoView({ block: 'center' });
      if (!img.complete) {
        await new Promise((resolve) => {
          img.addEventListener('load', resolve, { once: true });
          img.addEventListener('error', resolve, { once: true });
        });
      }
      if (img.decode) await img.decode().catch(() => {});
    }
    window.scrollTo(0, 0);
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    return {
      cls: Number(window.__cls || 0),
      sources: window.__clsSources || [],
      heights: imgs.map((img) => Math.round(img.getBoundingClientRect().height)),
    };
  });
}

async function auditPage(page, pagePath, routes, redirects, inSitemap) {
  const row = {
    url: pagePath,
    type: articleType(pagePath),
    template: 'research-article-page--rail',
    issues: [],
    seoTitle: '',
    seoDescription: '',
  };
  if (!inSitemap) addIssue(row, 'not-in-sitemap', 'published article is missing from the sitemap');

  await page.setViewportSize({ width: 1440, height: 900 });
  const response = await page.goto(`${BASE}${pagePath}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  if (!response || response.status() >= 400) {
    addIssue(row, 'http', `HTTP ${response?.status() ?? 'none'}`);
    row.template = 'missing';
    return row;
  }
  await page.waitForSelector('h1', { timeout: 15000 });
  await page.evaluate(async () => {
    await Promise.race([document.fonts.ready, new Promise((resolve) => setTimeout(resolve, 8000))]);
    await document.fonts.load("500 33px 'Playfair Display'");
    await document.fonts.load("400 20px 'Source Serif 4'");
    await document.fonts.load("500 13px Montserrat");
  });

  const snapshot = await page.evaluate(readPageSnapshot);
  row.seoTitle = snapshot.seo.title;
  row.seoDescription = snapshot.seo.description;
  if (!snapshot.shell) {
    addIssue(row, 'template', 'page does not use the shared article shell');
    row.template = 'other';
  }
  if (!snapshot.hasHero) addIssue(row, 'no-hero', 'no hero image');
  else {
    if (!snapshot.heroAlt) addIssue(row, 'image-alt', 'hero image has no alt text');
    if (!snapshot.heroWidth || !snapshot.heroHeight) addIssue(row, 'hero-dimensions', 'hero image has no width/height');
  }
  if (snapshot.missingAlt.length) addIssue(row, 'image-alt', `body image missing alt (${snapshot.missingAlt.length})`);
  const missingSize = snapshot.bodyImages.filter((img) => !img.width || !img.height);
  if (missingSize.length) addIssue(row, 'body-dimensions', `${missingSize.length} body image(s) missing width/height`);
  const missingSrcset = snapshot.bodyImages.filter((img) => !img.srcset);
  if (missingSrcset.length) addIssue(row, 'body-srcset', `${missingSrcset.length} body image(s) missing srcset`);
  const notLazy = snapshot.bodyImages.filter((img) => img.loading !== 'lazy');
  if (notLazy.length) addIssue(row, 'body-lazy', `${notLazy.length} body image(s) are not lazy`);
  const measured = await measureArticleImages(page);
  const tall = measured.heights.filter((height) => height > 640);
  if (tall.length) addIssue(row, 'body-height', `${tall.length} body image(s) taller than 640px at 1440 (${tall.join(', ')})`);
  if (measured.cls > 0.05) {
    const top = [...measured.sources].sort((a, b) => b.value - a.value)[0];
    addIssue(row, 'cls', `CLS ${measured.cls.toFixed(3)}${top ? ` (${top.name})` : ''}`);
  }
  for (const problem of snapshot.blockProblems) {
    if (problem.startsWith('missing shared')) continue;
    addIssue(row, 'block-order', problem);
  }
  for (const [cause, note] of checkHeadings(snapshot)) addIssue(row, cause, note);
  for (const note of checkSeo(snapshot.seo, snapshot.h1s[0] || '')) addIssue(row, 'seo', note);
  const broken = checkLinks(snapshot, pagePath, routes, redirects);
  if (broken.length) addIssue(row, 'broken-link', broken.slice(0, 6).join(', '));

  for (const viewport of VIEWPORTS) {
    await page.setViewportSize(viewport);
    if (viewport.width >= 1440) {
      await page.waitForFunction(() => {
        const rail = document.querySelector('.article-side-rail');
        const follow = document.querySelector('[data-article-follow]');
        const thumbs = [...document.querySelectorAll('.article-side-rail .article-rail-related__thumb')];
        return Boolean(rail && follow && rail.contains(follow) && thumbs.length === 4 && thumbs.every((img) => img.complete && img.naturalWidth > 0));
      }, { timeout: 8000 }).catch(() => {});
    } else {
      await page.waitForTimeout(150);
    }
    const view = await page.evaluate(readViewport, viewport.width);
    for (const note of checkFonts(view.fonts, viewport.width)) addIssue(row, 'typography', note);
    for (const note of checkLayout(view, viewport.width, snapshot.h2Count)) addIssue(row, 'layout', note);
    if (view.overflow.length) addIssue(row, 'image-overflow', `${view.overflow.length} item(s) overflow at ${viewport.width}px`);
  }
  return row;
}

function columnPass(row, column) {
  return !row.issues.some((issue) => causeColumn(issue.cause) === column);
}

function writeReport(rows, contentCount) {
  const research = rows.filter((row) => row.type === 'research').length;
  const news = rows.filter((row) => row.type === 'news').length;
  const formatFails = rows.filter((row) => row.issues.some((issue) => !CONTENT_CAUSES.has(issue.cause)));
  const contentFails = rows.filter((row) => row.issues.some((issue) => CONTENT_CAUSES.has(issue.cause)));
  const groups = new Map();
  for (const row of rows) {
    for (const issue of row.issues) {
      const key = issue.cause;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push({ url: row.url, note: issue.note });
    }
  }

  const lines = [
    `# Article format audit ${stamp()}`,
    '',
    `Reference: \`/research/eb5-inflation-adjustment-f1-h1b\`. Checklist: \`docs/article-format.md\`.`,
    '',
    `Checked ${rows.length} articles (${research} research, ${news} news). Content collection articles: ${contentCount}.`,
    `Format failures: ${formatFails.length}. Content items waiting for approval: ${contentFails.length}.`,
    '',
    '## Failures by cause',
    '',
  ];
  if (groups.size === 0) lines.push('None.');
  for (const [cause, items] of groups) {
    const kind = CONTENT_CAUSES.has(cause) ? 'content' : 'format';
    lines.push(`### ${cause} (${kind}, ${items.length})`, '');
    for (const item of items) lines.push(`- \`${item.url}\`: ${item.note.replace(/\|/g, '/')}`);
    lines.push('');
  }

  lines.push('## Pages', '');
  lines.push(`| URL | type | template | ${COLUMNS.join(' | ')} | notes |`);
  lines.push(`| --- | --- | --- | ${COLUMNS.map(() => '---').join(' | ')} | --- |`);
  for (const row of rows) {
    const notes = row.issues.map((issue) => `${issue.cause}: ${issue.note}`).join('; ') || '';
    const checks = COLUMNS.map((column) => cell(columnPass(row, column))).join(' | ');
    lines.push(`| \`${row.url}\` | ${row.type} | ${row.template} | ${checks} | ${notes.replace(/\|/g, '/')} |`);
  }
  lines.push('');

  const outDir = path.join(ROOT, 'docs', 'audits');
  fs.mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, `article-format-${stamp()}.md`);
  fs.writeFileSync(outFile, lines.join('\n'));
  return { outFile, formatFails: formatFails.length, contentFails: contentFails.length, groups };
}

async function main() {
  if (!fs.existsSync(DIST)) {
    console.error('dist/ is missing. Run npm run test:article-format so the check uses a fresh build.');
    process.exit(1);
  }
  const routes = distRoutes();
  const redirects = redirectMap();
  const sitemap = new Set(sitemapArticlePaths());
  const content = contentArticlePaths();
  const paths = [...new Set([...sitemap, ...content])].filter(isArticlePath).sort();
  console.log(`Articles: ${paths.length} (${content.filter((item) => item.startsWith('/research/')).length} research in content, ${content.filter((item) => item.startsWith('/news/')).length} news)`);

  const previewRun = await startPreview();
  const preview = previewRun.child;
  BASE = previewRun.base;
  console.log(`Preview ${BASE}`);
  const browser = await launchChromium();
  const page = await browser.newPage();
  await page.addInitScript(() => {
    window.__cls = 0;
    window.__clsSources = [];
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.hadRecentInput) continue;
        window.__cls += entry.value;
        const node = entry.sources && entry.sources[0] && entry.sources[0].node;
        const name = node ? `${node.tagName}.${String(node.className || '').slice(0, 60)}` : 'unknown';
        window.__clsSources.push({ value: entry.value, name });
      }
    }).observe({ type: 'layout-shift', buffered: true });
  });
  await page.route('**/*', (route) => {
    const url = route.request().url();
    if (/googletagmanager|google-analytics|clarity\.ms|news\.google/.test(url)) return route.abort();
    return route.continue();
  });

  const rows = [];
  try {
    for (const pagePath of paths) {
      process.stdout.write(`${pagePath}\n`);
      try {
        rows.push(await auditPage(page, pagePath, routes, redirects, sitemap.has(pagePath)));
      } catch (error) {
        rows.push({
          url: pagePath,
          type: articleType(pagePath),
          template: 'error',
          issues: [{ cause: 'http', note: error instanceof Error ? error.message : 'audit failed' }],
          seoTitle: '',
          seoDescription: '',
        });
      }
    }
  } finally {
    await browser.close();
    stopPreview(preview);
  }

  const titleOwners = new Map();
  const descriptionOwners = new Map();
  for (const row of rows) {
    if (row.seoTitle) {
      if (!titleOwners.has(row.seoTitle)) titleOwners.set(row.seoTitle, []);
      titleOwners.get(row.seoTitle).push(row.url);
    }
    if (row.seoDescription) {
      if (!descriptionOwners.has(row.seoDescription)) descriptionOwners.set(row.seoDescription, []);
      descriptionOwners.get(row.seoDescription).push(row.url);
    }
  }
  for (const row of rows) {
    const sameTitle = titleOwners.get(row.seoTitle) ?? [];
    const sameDescription = descriptionOwners.get(row.seoDescription) ?? [];
    if (row.seoTitle && sameTitle.length > 1) addIssue(row, 'duplicate-meta', 'title is not unique');
    if (row.seoDescription && sameDescription.length > 1) addIssue(row, 'duplicate-meta', 'meta description is not unique');
  }

  const report = writeReport(rows, content.length);
  console.log(`Wrote ${report.outFile}`);
  console.log(`Format failures: ${report.formatFails}. Content items: ${report.contentFails}.`);
  for (const [cause, items] of report.groups) {
    const urls = [...new Set(items.map((item) => item.url))];
    console.log(`${cause}: ${urls.length}`);
  }
  const formatIssue = rows.some((row) => row.issues.some((issue) => !CONTENT_CAUSES.has(issue.cause)));
  process.exit(formatIssue ? 1 : 0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
