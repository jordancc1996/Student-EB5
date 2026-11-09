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
| 1440–1599px | TOC 15rem, article up to 48rem, rail 18rem, gap 3rem. Centered, equal outer margins (within 16px). |
| 1600px and up | TOC 16rem, article up to 50rem, rail 20rem, gap 3.5rem. Shell max-width 93.75rem. Centered, equal outer margins (within 16px). |

From 1440px the rail shows, in order: advisor card, 4 related items with thumbnails, Google preferred-sources block. The page itself does not scroll sideways.

## Typography

Root size is 16px. Families: Playfair Display (`--font-display`), Source Serif 4 (`--font-body-serif`), Montserrat (`--font-ui`).

| Element | Family | Weight | Size |
|---|---|---|---|
| Body paragraph | Source Serif 4 | 400 | 18px under 768px, 20px from 768px |
| Standfirst (`.article-intro`) | Playfair Display | 400 | 18px under 768px, 22px from 768px |
| H1 (`.research-article-title` / `.editorial-h1`) | Playfair Display | 500 | 33px under 768px, 46px from 768px |
| H2 | Playfair Display | 600 | 26px under 768px, 32px from 768px |
| H3 | Playfair Display | 600 | 21px under 768px, 24px from 768px |
| H4 | Montserrat | 600 | 15px under 768px, 16px from 768px |
| Kicker | Montserrat | 600 | 12px, uppercase |
| Published / Last updated / reading time row | Montserrat | 500 | 13px |

The H1 is left-aligned. Its left edge matches the article column (within 16px). The title block does not print a separate byline. The author is in the schema only.

## Headings

- Exactly one H1, and it is the article title.
- Inside the article body, H2, H3, and H4 do not skip a level (H2 then H4 is a skip).
- Every body H2 is a TOC entry. The TOC label may be shortened. The link target is the heading id.
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
- Images inside the article body have non-empty alt text.
- Body images stay inside the article column. The page has no horizontal scroll.
- Rail thumbnails are decorative (`alt=""`). The link text is the article title.
