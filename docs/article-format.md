# Article format

Reference page: `/research/eb5-inflation-adjustment-f1-h1b`

Every published research article and every news article uses this format. The reference is not a one-off template. It is the shared article shell.

## Template

- Page component: `src/pages/research/[...slug].astro` for research, `src/pages/news/[slug].astro` for news.
- Both wrap the article in `Layout.astro` and the same shell: `research-article-page research-article-page--rail`.
- The reading column, contents, and right rail come from `ArticleTocRail.astro` (`article-with-toc article-with-toc--has-rail`). News renders that shell through `NewsArticleLayout.astro`. The article body is the only part that changes.

## Block order

The hero is a full-bleed section. The title sits on the image. In the DOM the image comes first, then the title block.

1. Site header / nav.
2. Hero image (`img` in the hero section, eager, cover).
3. Title block, left-aligned with the article column:
   - kicker (category)
   - one H1
   - Published, Last updated, and reading time
4. Breadcrumb.
5. Top legal disclaimer box (educational notice, before the body).
6. Article body, including the standfirst when the article has one.
7. Sources or references, when the article has them. They stay inside the body, before the closing disclaimer.
8. Closing disclaimer.
9. Share row ("Share this article").
10. Published / Last updated footer.
11. Related articles.
12. Site footer.

The consultation block and photo credits may sit between the related articles and the site footer. Below 1440px the Google preferred-sources block sits above the body. From 1440px it moves into the right rail.

## Layout by width

| Width | Structure |
|---|---|
| Under 1024px | Inline Contents block. Article uses the full content width. No side TOC. No right rail. |
| 1024–1439px | Side TOC (13.5rem / 216px) plus a 45rem / 720px article. The pair is centered. Outer margins match within 16px. No right rail. |
| 1440–1679px | TOC 15rem (240px), article up to 45.5rem (728px), rail 18rem (288px), gap 3rem plus 20px. The article column is slightly narrower than the previous 48rem so a Roboto line stays within 78 characters. The extra width is in the gaps, so the outer margins stay the same. |
| 1680–1919px | TOC 290px, article 716px, rail 330px, gap 88px. Centered, equal outer margins (within 16px). |
| 1920–2399px | TOC 320px, article 768px, rail 360px, gap 80px. Body text 21px. Centered, equal outer margins (within 16px). |
| 2400px and up | TOC 340px, article 792px, rail 380px, gap 106px. Body text 22px. Centered, equal outer margins (within 16px). |

Body lines stay within 65–78 characters. From 1440px the rail shows, in order: advisor card, 4 related items with thumbnails, Google preferred-sources block. Thumbnails are 88×60, and 96×64 from 1920px. The page itself does not scroll sideways. At 1920×1080 the rail content fits without an inner scrollbar.

## Typography

Root size is 16px. The body element is 17px. Families: Playfair Display (`--font-display`) and Roboto (`--font-sans`). Georgia and Arial are fallbacks only.

| Element | Family | Weight | Size |
|---|---|---|---|
| Body paragraph | Roboto | 400 | 18px under 768px, 20px from 768px, 21px from 1920px, 22px from 2400px. Line height 1.7. Paragraph spacing 1.25em. Left aligned. |
| Standfirst (`.article-intro`) | Roboto | 400 | 20px under 768px, 22px from 768px. Line height 1.55. |
| H1 (`.research-article-title` / `.editorial-h1`) | Playfair Display | 400 | 36px under 768px, 52px from 768px |
| H2 | Playfair Display | 400 | 28px under 768px, 36px from 768px |
| H3 | Playfair Display | 500 | 22px under 768px, 26px from 768px |
| H4 | Roboto | 500 | 18px under 768px, 20px from 768px |
| Kicker | Roboto | 500 | 13px, uppercase |
| Published / Last updated / reading time row | Roboto | 500 | 13px |
| Contents links | Roboto | 400 (active 500) | 15px, 16px from 1680px. H3 entries are 1px smaller. |
| Pull quote | Playfair Display italic | 400 | 26px under 768px, 28px from 768px |

The H1 is left-aligned. Its left edge matches the article column (within 16px). The title block does not print a separate byline. The author is in the schema only.

## Headings

- Exactly one H1, and it is the article title.
- Inside the article body, H2, H3, and H4 do not skip a level (H2 then H4 is a skip).
- Every body H2 is a TOC entry. The side TOC shows the full heading, wrapping to at most 3 lines. The link target is the heading id.
- The side TOC lists H2s. H3s under a section appear when that section is the active scroll position, or when its H2 is clicked.
- The side TOC is visible from 1024px up when the article has 3 or more H2s. Under 1024px those articles show the inline Contents block.
- "Related Articles" and other headings outside `.article-content` are not TOC entries.

## SEO

- Unique `<title>` and meta description.
- Canonical is the page itself: `https://studenteb5.com` plus the path, no trailing slash.
- `og:image` and `twitter:image` are absolute `https://studenteb5.com/...` URLs. They use the 1200×630 hero crop, or `https://studenteb5.com/og-image.jpg` when the article has no hero.
- `og:image:width` is 1200, `og:image:height` is 630, and `og:image:alt` is set.
- `twitter:card` is `summary_large_image`.
- JSON-LD parses. The article node is `Article` or `NewsArticle` and includes `headline` (the visible H1), `datePublished`, `dateModified`, `image`, `author`, and `publisher`.
- `publisher.name` is `StudentEB5`, the same name as the header wordmark.

## Images

- The hero `img` has non-empty alt text and `width` and `height` attributes.
- Images inside the article body have non-empty alt text, intrinsic `width` and `height`, a responsive `srcset`, and `loading="lazy"`.
- At 1440px, no in-article image is taller than 640px. Landscape images fill the column width. Portrait images are limited to `min(70vh, 640px)` and centered in the column.
- Cumulative layout shift on each article is 0.05 or less.
- Body images stay inside the article column. The page has no horizontal scroll.
- Rail thumbnails are decorative (`alt=""`). The link text is the article title.
