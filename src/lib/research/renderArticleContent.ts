const convertLinks = (text: string) =>
  text.replace(
    /(?<!href="|href='|>)(https?:\/\/[^\s<]+)/g,
    '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline break-all">$1</a>',
  );

const convertBold = (text: string) => text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

const formatLine = (text: string) => convertLinks(convertBold(text));

export function renderArticleContentLines(contentLines: string[]): string {
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
        return `<figure class="my-8"><img src="${src}" alt="${alt}" class="w-full rounded-lg shadow-md" loading="lazy" /><figcaption class="text-center text-sm text-muted-foreground mt-2">${alt}</figcaption></figure>`;
      }

      if (line.startsWith('# ')) {
        return `<h2 class="text-3xl font-serif font-bold mt-10 mb-4">${formatLine(line.substring(2))}</h2>`;
      }
      if (line.startsWith('## ')) {
        return `<h2>${formatLine(line.substring(3))}</h2>`;
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
  const headingIndices = lines.reduce<number[]>((acc, line, i) => {
    if (line.startsWith('## ')) acc.push(i);
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

  if (midHeadingIdx > 0) {
    return {
      firstHalfHtml: renderArticleContentLines(lines.slice(0, midHeadingIdx)),
      secondHalfHtml: renderArticleContentLines(lines.slice(midHeadingIdx)),
      showMidSplit: true,
    };
  }

  return {
    firstHalfHtml: renderArticleContentLines(lines),
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
