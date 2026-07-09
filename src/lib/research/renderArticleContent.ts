import { extractArticleH2s } from './articleHeadings';
import { resolveInlineArticleImageSrc } from './resolveInlineArticleImage';

const convertLinks = (text: string) =>
  text.replace(
    /(?<!href="|href='|>)(https?:\/\/[^\s<]+)/g,
    '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>',
  );

const convertBold = (text: string) => text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

const formatLine = (text: string) => convertLinks(convertBold(text));

function isH2Line(line: string): boolean {
  return line.startsWith('## ') || line.startsWith('# ');
}

export function renderArticleContentLines(contentLines: string[], headingIds?: string[]): string {
  let h2Index = 0;

  return contentLines
    .map((line) => {
      const introMatch = line.match(/^<intro>(.+)<\/intro>$/);
      if (introMatch) return `<p class="article-intro">${introMatch[1]}</p>`;

      const youtubeMatch = line.match(/^<youtube>([^<]+)<\/youtube>$/);
      if (youtubeMatch) {
        const videoId = youtubeMatch[1].trim();
        return `<figure class="my-8"><div class="aspect-video w-full rounded-lg overflow-hidden shadow-lg"><iframe src="https://www.youtube.com/embed/${videoId}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen loading="lazy" class="w-full h-full"></iframe></div></figure>`;
      }

      const imageMatch = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
      if (imageMatch) {
        const [, alt, src] = imageMatch;
        const resolvedSrc = resolveInlineArticleImageSrc(src);
        return `<figure class="my-8"><img src="${resolvedSrc}" alt="${alt}" class="w-full rounded-lg shadow-md" loading="lazy" /><figcaption class="article-caption mt-2">${alt}</figcaption></figure>`;
      }

      if (isH2Line(line)) {
        const raw = line.startsWith('## ') ? line.slice(3) : line.slice(2);
        const id = headingIds?.[h2Index++];
        const idAttr = id ? ` id="${id}"` : '';
        return `<h2${idAttr}>${formatLine(raw)}</h2>`;
      }
      if (line.startsWith('### ')) {
        return `<h3>${formatLine(line.substring(4))}</h3>`;
      }
      if (line.startsWith('#### ')) {
        return `<h4>${formatLine(line.substring(5))}</h4>`;
      }
      if (line.startsWith('- ')) {
        return `<p class="article-list-item">• ${formatLine(line.substring(2))}</p>`;
      }
      if (line.startsWith('*') && line.endsWith('*') && !line.startsWith('**') && line.length > 2) {
        return `<p class="article-italic">${line.substring(1, line.length - 1)}</p>`;
      }
      if (line.trim() === '') {
        return '<div style="height:0.75em"></div>';
      }

      if (/^<aside[\s>]/.test(line.trim())) {
        return line;
      }

      return `<p>${formatLine(line)}</p>`;
    })
    .join('');
}

export function splitArticleContent(content: string): {
  firstHalfHtml: string;
  secondHalfHtml: string | null;
  showMidSplit: boolean;
} {
  const lines = content.split('\n');
  const allHeadingIds = extractArticleH2s(content).map((h) => h.slug);

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
    const h2Count = sliceLines.filter(isH2Line).length;
    const ids = allHeadingIds.slice(idOffset, idOffset + h2Count);
    return renderArticleContentLines(sliceLines, ids);
  };

  if (midHeadingIdx > 0) {
    const firstLines = lines.slice(0, midHeadingIdx);
    const secondLines = lines.slice(midHeadingIdx);
    const firstH2Count = firstLines.filter(isH2Line).length;

    return {
      firstHalfHtml: renderSlice(firstLines, 0),
      secondHalfHtml: renderSlice(secondLines, firstH2Count),
      showMidSplit: true,
    };
  }

  return {
    firstHalfHtml: renderSlice(lines, 0),
    secondHalfHtml: null,
    showMidSplit: false,
  };
}

export function resolveAssetSrc(value: string | { src: string }): string {
  return typeof value === 'string' ? value : value.src;
}

export function resolveAbsoluteAssetUrl(value: string | { src: string }, siteUrl: string): string {
  const src = resolveAssetSrc(value);
  if (src.startsWith('http://') || src.startsWith('https://')) return src;
  return `${siteUrl}${src.startsWith('/') ? '' : '/'}${src}`;
}
