import { chromium } from 'playwright';

const BASE = process.env.PREVIEW_URL || 'http://localhost:4323';

const urls = [
  `${BASE}/research/comparisons/h1b-vs-eb5-lifetime-cost-indian-chinese-students/`,
  `${BASE}/research/19-questions-rural-eb5-project-due-diligence/`,
];

const browser = await chromium.launch();
const page = await browser.newPage();

async function measureAt(viewport) {
  await page.setViewportSize(viewport);
  const out = {};

  for (const url of urls) {
    await page.goto(url, { waitUntil: 'networkidle' });
    out[url] = await page.evaluate(() => {
      const article = document.querySelector('.research-article-page article');
      if (!article) return { error: 'no article' };

      const p = article.querySelector(
        '.article-content p:not(.article-intro):not(.article-list-item):not(.article-italic)',
      );
      const h2 = article.querySelector('.article-content h2');
      const h1 = document.querySelector('.research-article-page .research-article-title');
      const caption = article.querySelector('.article-caption, .article-content figcaption');

      const cs = (el) => (el ? getComputedStyle(el) : null);
      const px = (el) => (el ? parseFloat(cs(el).fontSize) : null);

      const charsPerLineMeasure = (el) => {
        if (!el) return null;
        const range = document.createRange();
        range.selectNodeContents(el);
        const blockRects = range.getClientRects();
        if (!blockRects.length) return null;
        const firstTop = blockRects[0].top;
        let count = 0;
        const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
        let node = walker.nextNode();
        while (node) {
          for (let i = 1; i <= node.length; i++) {
            range.setStart(node, 0);
            range.setEnd(node, i);
            const rects = range.getClientRects();
            const top = rects[rects.length - 1].top;
            if (rects.length > 1 || Math.abs(top - firstTop) > 1) {
              return count;
            }
            count++;
          }
          node = walker.nextNode();
        }
        return count;
      };

      const allBodyPs = [...article.querySelectorAll(
        '.article-content p:not(.article-intro):not(.article-list-item):not(.article-italic)',
      )];
      const lineCounts = allBodyPs.map((p) => charsPerLineMeasure(p)).filter(Boolean);
      const medianChars =
        lineCounts.length === 0
          ? null
          : lineCounts.sort((a, b) => a - b)[Math.floor(lineCounts.length / 2)];

      const below14 = [];
      article.querySelectorAll('*').forEach((el) => {
        if (el.children.length === 0 && el.textContent.trim()) {
          const size = parseFloat(cs(el).fontSize);
          if (size < 14) {
            below14.push({
              tag: el.tagName,
              cls: String(el.className || '').slice(0, 60),
              px: size,
              text: el.textContent.trim().slice(0, 30),
            });
          }
        }
      });

      return {
        pFontSize: px(p),
        pLineHeightPx: p ? parseFloat(cs(p).lineHeight) : null,
        pLineHeightRatio: p ? parseFloat(cs(p).lineHeight) / parseFloat(cs(p).fontSize) : null,
        h2FontSize: px(h2),
        h2MarginTop: h2 ? parseFloat(cs(h2).marginTop) : null,
        h1FontSize: px(h1),
        h1Class: h1?.className,
        captionFontSize: px(caption),
        captionColor: caption ? cs(caption).color : null,
        bodyColor: p ? cs(p).color : null,
        pWidth: p?.getBoundingClientRect().width,
        charsPerLine: medianChars ?? charsPerLineMeasure(p),
        lineCounts,
        below14,
        hasCaption: !!caption,
      };
    });
  }

  return out;
}

const desktop = await measureAt({ width: 1280, height: 900 });
const mobile = await measureAt({ width: 375, height: 812 });

const main = desktop[`${BASE}/research/comparisons/h1b-vs-eb5-lifetime-cost-indian-chinese-students/`];
const mainM = mobile[`${BASE}/research/comparisons/h1b-vs-eb5-lifetime-cost-indian-chinese-students/`];
const cap = desktop[`${BASE}/research/19-questions-rural-eb5-project-due-diligence/`];

const mutedRgb = 'rgb(89, 89, 89)'; // hsl(0 0% 35%) at default theme

const report = [
  {
    id: 1,
    pass: main.pFontSize === 19 && mainM.pFontSize >= 17,
    detail: `desktop p=${main.pFontSize}px, mobile p=${mainM.pFontSize}px`,
  },
  {
    id: 2,
    pass: main.pLineHeightPx >= 31 && main.pLineHeightPx <= 32,
    detail: `p line-height=${main.pLineHeightPx}px (ratio ${main.pLineHeightRatio?.toFixed(3)})`,
  },
  {
    id: 3,
    pass: main.h2FontSize === 30 && main.h2MarginTop >= 45 && main.h2MarginTop <= 50,
    detail: `h2 font=${main.h2FontSize}px, margin-top=${main.h2MarginTop}px`,
  },
  {
    id: 4,
    pass: main.h1FontSize === 40 && mainM.h1FontSize === 30,
    detail: `h1 desktop=${main.h1FontSize}px mobile=${mainM.h1FontSize}px class="${main.h1Class}"`,
  },
  {
    id: 5,
    pass:
      main.hasCaption &&
      main.captionFontSize === 15 &&
      main.captionColor !== main.bodyColor &&
      main.captionColor === mutedRgb,
    detail: main.hasCaption
      ? `formatter caption=${main.captionFontSize}px color=${main.captionColor} body=${main.bodyColor}`
      : 'no figcaption found',
  },
  {
    id: 6,
    pass: main.charsPerLine >= 65 && main.charsPerLine <= 72,
    detail: `~${main.charsPerLine} chars/line at p width ${main.pWidth}px`,
  },
  {
    id: 7,
    pass: main.below14.length === 0 && mainM.below14.length === 0,
    detail: `desktop below14=${main.below14.length}, mobile=${mainM.below14.length}`,
    below14: { desktop: main.below14, mobile: mainM.below14 },
  },
];

console.log(JSON.stringify({ report, main, mainM, cap }, null, 2));
await browser.close();
