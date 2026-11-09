import { getPhotoByFilename } from '@/data/photoRegistry';
import { articleImageTag, lookupArticleImage, optimizeArticleImage, upgradeRawArticleImages } from '@/lib/images/articleImage';
import { extractArticleHeadings } from './articleHeadings';

const convertLinks = (text: string) =>
  text.replace(
    /(?<!href="|href='|>)(https?:\/\/[^\s<]+)/g,
    '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>',
  );

const convertBold = (text: string) => text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

const convertItalic = (text: string) => text.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>');

const formatLine = (text: string) => convertItalic(convertLinks(convertBold(text)));

const ABBREVIATION_PLACEHOLDER = '\uE000';

/** Split standfirst copy into one-sentence paragraphs without breaking U.S., titles, or months. */
export function splitStandfirstParagraphs(text: string): string[] {
  const cleaned = text.replace(/<\/?intro>/gi, '').trim();
  if (!cleaned) return [];

  const blocks = cleaned
    .split(/\n\s*\n/)
    .map((block) => block.replace(/\s*\n\s*/g, ' ').trim())
    .filter(Boolean);

  return blocks.flatMap((block) => {
    const protectedText = block
      .replace(/\bU\.S(?:\.C)?\./g, (match) => match.replace(/\./g, ABBREVIATION_PLACEHOLDER))
      .replace(
        /\b(?:Mr|Ms|Mrs|Dr|Prof|vs|Inc|Ltd|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\./g,
        (match) => match.replace('.', ABBREVIATION_PLACEHOLDER),
      );

    return protectedText
      .split(/(?<=[.!?])\s+(?=[A-Z0-9])/)
      .map((part) => part.split(ABBREVIATION_PLACEHOLDER).join('.').trim())
      .filter(Boolean);
  });
}

function renderStandfirstHtml(text: string): string {
  const paragraphs = splitStandfirstParagraphs(text);
  if (paragraphs.length === 0) return '';
  return `<div class="article-intro">${paragraphs.map((paragraph) => `<p>${formatLine(paragraph)}</p>`).join('')}</div>`;
}

function isInlineArticleDisclaimerLine(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed) return false;
  const text =
    trimmed.startsWith('*') && trimmed.endsWith('*') && trimmed.length > 2
      ? trimmed.slice(1, -1).trim()
      : trimmed;
  return /the opinions expressed on this website are solely those of the author/i.test(text);
}

/** Remove trailing italic disclaimer copied from legacy researchPosts.ts into markdown bodies. */
export function stripInlineArticleDisclaimer(content: string): string {
  const lines = content.split('\n');

  while (lines.length > 0 && lines[lines.length - 1].trim() === '') {
    lines.pop();
  }

  if (lines.length > 0 && isInlineArticleDisclaimerLine(lines[lines.length - 1])) {
    lines.pop();
  }

  while (lines.length > 0 && lines[lines.length - 1].trim() === '') {
    lines.pop();
  }

  return lines.join('\n');
}

function isH2Line(line: string): boolean {
  return line.startsWith('## ');
}

function isTocHeadingLine(line: string): boolean {
  return parseHeadingLine(line) != null;
}

function parseHeadingLine(line: string): { level: 2 | 3; raw: string } | null {
  if (line.startsWith('### ')) return { level: 3, raw: line.slice(4) };
  if (line.startsWith('## ')) return { level: 2, raw: line.slice(3) };
  const html = line.trim().match(/^<h([23])(?:\s[^>]*)?>(.+)<\/h\1>$/i);
  if (html) {
    return { level: Number(html[1]) as 2 | 3, raw: html[2] };
  }
  return null;
}

const IMAGE_LAYOUT_HINT =
  /chart|table|timeline|infographic|comparison|amounts|milestones|process|evaluation|datahub|savings|earnings|value|fees|cost|history|provisions|advantages|gold-card/i;

type ArticleImageLayout = 'full' | 'wide' | 'left' | 'right' | 'portrait';

function resolveImageLayout(
  title: string | undefined,
  src: string,
  alt: string,
  photoIndex: { n: number },
): ArticleImageLayout {
  const token = (title || '').trim().toLowerCase();
  if (token === 'left' || token === 'float-left' || token === 'left-float') return 'left';
  if (token === 'right' || token === 'float-right' || token === 'right-float') return 'right';
  if (token === 'wide' || token === 'landscape') return 'wide';
  if (token === 'full' || token === 'full-width' || token === 'center') return 'full';
  if (token === 'portrait') return 'portrait';

  if (IMAGE_LAYOUT_HINT.test(src) || IMAGE_LAYOUT_HINT.test(alt) || /\.png$/i.test(src)) {
    return 'full';
  }

  const cycle: ArticleImageLayout[] = ['right', 'left', 'wide', 'full'];
  return cycle[photoIndex.n++ % cycle.length];
}

function creditMarkup(src: string): string {
  const filename = src.split('/').pop()?.split('?')[0] ?? '';
  const photo = getPhotoByFilename(filename);
  if (!photo) return '';
  return `<p class="photo-credit">Photo by <a href="${photo.profileUrl}" target="_blank" rel="noopener noreferrer">${photo.photographer}</a> on <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer">Unsplash</a></p>`;
}

async function renderArticleImage(alt: string, src: string, title?: string, photoIndex?: { n: number }): Promise<string> {
  const metadata = lookupArticleImage(src);
  if (!metadata) {
    throw new Error(`Article image is not in the image pipeline: ${src}`);
  }
  const image = await optimizeArticleImage(metadata);
  const layout = resolveImageLayout(title, src, alt, photoIndex ?? { n: 0 });
  return `<figure class="article-figure article-figure--${layout}" data-orientation="${image.orientation}">${articleImageTag(image, alt)}${creditMarkup(src)}</figure>`;
}

export async function renderArticleContentLines(
  contentLines: string[],
  headingIds?: string[],
  options?: { standfirstParagraphs?: boolean },
): string {
  let headingIndex = 0;
  const photoIndex = { n: 0 };
  const html: string[] = [];

  for (let i = 0; i < contentLines.length; i += 1) {
    const line = contentLines[i].replace(/\r$/, '');

    if (line.trim().startsWith('<intro>')) {
      const introParts: string[] = [];
      let current = line.trim().replace(/^<intro>/, '');
      if (current.includes('</intro>')) {
        introParts.push(current.replace(/<\/intro>\s*$/, ''));
      } else {
        introParts.push(current);
        i += 1;
        while (i < contentLines.length) {
          const next = contentLines[i];
          if (next.includes('</intro>')) {
            introParts.push(next.replace(/<\/intro>\s*$/, ''));
            break;
          }
          introParts.push(next);
          i += 1;
        }
      }
      html.push(renderStandfirstHtml(introParts.join('\n')));
      continue;
    }

    const youtubeMatch = line.match(/^<youtube>([^<]+)<\/youtube>$/);
    if (youtubeMatch) {
      const videoId = youtubeMatch[1].trim();
      html.push(
        `<figure class="article-figure article-figure--wide"><div class="aspect-video w-full overflow-hidden"><iframe src="https://www.youtube.com/embed/${videoId}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen loading="lazy" class="w-full h-full"></iframe></div></figure>`,
      );
      continue;
    }

    const imageMatch = line.match(/^!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)$/);
    if (imageMatch) {
      const [, alt, src, title] = imageMatch;
      html.push(await renderArticleImage(alt, src, title, photoIndex));
      continue;
    }

    const heading = parseHeadingLine(line);
    if (heading) {
      const id = headingIds?.[headingIndex++];
      const idAttr = id ? ` id="${id}"` : '';
      const tag = heading.level === 2 ? 'h2' : 'h3';
      html.push(`<${tag}${idAttr}>${formatLine(heading.raw)}</${tag}>`);
      continue;
    }
    if (line.startsWith('#### ')) {
      html.push(`<h4>${formatLine(line.substring(5))}</h4>`);
      continue;
    }
    if (line.startsWith('- ')) {
      html.push(`<p class="article-list-item">• ${formatLine(line.substring(2))}</p>`);
      continue;
    }
    if (line.startsWith('*') && line.endsWith('*') && !line.startsWith('**') && line.length > 2) {
      html.push(`<p class="article-italic">${line.substring(1, line.length - 1)}</p>`);
      continue;
    }
    if (line.trim() === '') {
      continue;
    }

    if (/^<aside[\s>]/.test(line.trim())) {
      html.push(line);
      continue;
    }

    if (options?.standfirstParagraphs) {
      html.push(renderStandfirstHtml(line));
      continue;
    }

    html.push(`<p>${formatLine(line)}</p>`);
  }

  return upgradeRawArticleImages(html.join(''));
}

export async function splitArticleContent(content: string): Promise<{
  firstHalfHtml: string;
  secondHalfHtml: string | null;
  showMidSplit: boolean;
}> {
  const lines = stripInlineArticleDisclaimer(content).split('\n');
  const allHeadingIds = extractArticleHeadings(content).map((h) => h.slug);

  const headingIndices = lines.reduce<number[]>((acc, line, i) => {
    if (isH2Line(line)) acc.push(i);
    return acc;
  }, []);
  const midTarget = Math.floor(lines.length / 2);
  const midHeadingIdx =
    headingIndices.length > 0
      ? headingIndices.reduce(
          (best, idx) => (Math.abs(idx - midTarget) < Math.abs(best - midTarget) ? idx : best),
          headingIndices[0],
        )
      : -1;

  const renderSlice = (sliceLines: string[], idOffset: number) => {
    const headingCount = sliceLines.filter(isTocHeadingLine).length;
    const ids = allHeadingIds.slice(idOffset, idOffset + headingCount);
    return renderArticleContentLines(sliceLines, ids);
  };

  if (midHeadingIdx > 0) {
    const firstLines = lines.slice(0, midHeadingIdx);
    const secondLines = lines.slice(midHeadingIdx);
    const firstH2Count = firstLines.filter(isTocHeadingLine).length;

    return {
      firstHalfHtml: await renderSlice(firstLines, 0),
      secondHalfHtml: await renderSlice(secondLines, firstH2Count),
      showMidSplit: true,
    };
  }

  return {
    firstHalfHtml: await renderSlice(lines, 0),
    secondHalfHtml: null,
    showMidSplit: false,
  };
}

/**
 * Split article markdown at the first H2 so a post-intro CTA can sit between
 * introductory content and the first section heading.
 */
export async function splitArticleBeforeFirstH2(content: string): Promise<{
  introHtml: string;
  bodyMarkdown: string;
  showPostIntroCta: boolean;
}> {
  const cleaned = stripInlineArticleDisclaimer(content);
  const lines = cleaned.split('\n');
  const firstH2Index = lines.findIndex(isH2Line);

  if (firstH2Index <= 0) {
    return {
      introHtml: '',
      bodyMarkdown: cleaned,
      showPostIntroCta: false,
    };
  }

  const introLines = lines.slice(0, firstH2Index);
  const bodyLines = lines.slice(firstH2Index);
  const introHtml = await renderArticleContentLines(introLines, undefined, { standfirstParagraphs: true });
  const hasVisibleIntro = introLines.some((line) => line.trim().length > 0);

  return {
    introHtml,
    bodyMarkdown: bodyLines.join('\n'),
    showPostIntroCta: hasVisibleIntro,
  };
}

/** Detect an already-embedded post-intro pathways CTA in article HTML/markdown. */
export function articleAlreadyHasPostIntroCta(htmlOrMarkdown: string): boolean {
  return (
    /data-post-intro-cta/i.test(htmlOrMarkdown) ||
    /Considering EB-5\?\s*See Your Next Step/i.test(htmlOrMarkdown)
  );
}

export function resolveAssetSrc(value: string | { src: string }): string {
  return typeof value === 'string' ? value : value.src;
}

export function resolveAbsoluteAssetUrl(value: string | { src: string }, siteUrl: string): string {
  const src = resolveAssetSrc(value);
  if (src.startsWith('http://') || src.startsWith('https://')) return src;
  return `${siteUrl}${src.startsWith('/') ? '' : '/'}${src}`;
}
