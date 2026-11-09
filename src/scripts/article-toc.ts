declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
  }
}

function initArticleToc(): void {
  const page = document.querySelector('.research-article-page');
  if (!page) return;

  const hasInline = page.querySelector('.article-contents--inline');
  const hasRail = page.querySelector('nav.article-toc');
  if (!hasInline && !hasRail) return;

  const pageEl = page as HTMLElement;
  if (pageEl.dataset.articleTocInit === 'true') return;
  pageEl.dataset.articleTocInit = 'true';

  const ctaLinks = [...page.querySelectorAll<HTMLAnchorElement>('[data-toc-cta]')];
  ctaLinks.forEach((link) => {
    link.addEventListener('click', () => {
      const category = link.dataset.tocCategory || '';
      const payload = { event: 'toc_cta_click', category };
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(payload);
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'toc_cta_click', { category });
      }
    });
  });

  const tracking = initTocActiveTracking(page);
  initTocLinkScroll(page, tracking);
}

function sectionSlugFor(page: Element, slug: string): string {
  const link = [...page.querySelectorAll<HTMLAnchorElement>('nav.article-toc [data-toc-link]')].find(
    (item) => item.dataset.tocLink === slug,
  );
  return link?.closest<HTMLElement>('[data-toc-section]')?.dataset.tocSection || '';
}

function showTocSection(page: Element, sectionSlug: string): void {
  page.querySelectorAll<HTMLElement>('nav.article-toc li[data-toc-level="3"]').forEach((item) => {
    const ownSection = item.dataset.tocSection || '';
    item.hidden = !sectionSlug || ownSection !== sectionSlug;
  });
}

function initTocLinkScroll(
  page: Element,
  tracking: { setActive: (slug: string, hold?: boolean) => void } | null,
): void {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  page.querySelectorAll<HTMLAnchorElement>('[data-toc-link]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const slug = link.dataset.tocLink;
      if (!slug) return;

      const target = page.querySelector<HTMLElement>(`.article-content #${CSS.escape(slug)}`);
      if (!target) return;

      event.preventDefault();
      if (link.closest('nav.article-toc')) tracking?.setActive(slug, true);
      target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
      history.pushState(null, '', `#${slug}`);
    });
  });
}

function initTocActiveTracking(page: Element): { setActive: (slug: string, hold?: boolean) => void } | null {
  const links = [...page.querySelectorAll<HTMLAnchorElement>('[data-toc-link]')];
  if (!links.length) return null;

  const headings = links
    .map((link) => {
      const slug = link.dataset.tocLink;
      if (!slug) return null;
      return page.querySelector<HTMLElement>(`.article-content #${CSS.escape(slug)}`);
    })
    .filter((heading): heading is HTMLElement => heading != null);

  if (!headings.length) return null;

  let activeSlug = '';
  let holdSlug = '';
  let holdUntil = 0;

  const setActive = (slug: string, hold = false) => {
    if (!slug) return;
    if (hold) {
      holdSlug = slug;
      holdUntil = performance.now() + 1000;
    } else if (performance.now() < holdUntil && slug !== holdSlug) {
      return;
    }
    if (slug === activeSlug && !hold) return;
    activeSlug = slug;
    links.forEach((link) => {
      link.classList.toggle('is-active', link.dataset.tocLink === slug);
    });
    showTocSection(page, sectionSlugFor(page, slug));
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

      if (visible.length > 0) {
        setActive(visible[0].target.id);
      }
    },
    { rootMargin: '-20% 0px -60% 0px', threshold: 0 },
  );

  headings.forEach((heading) => observer.observe(heading));

  const hashSlug = location.hash.replace(/^#/, '');
  if (hashSlug && links.some((link) => link.dataset.tocLink === hashSlug)) {
    setActive(hashSlug);
  } else {
    setActive(headings[0].id);
  }

  window.addEventListener('hashchange', () => {
    const slug = location.hash.replace(/^#/, '');
    if (slug) setActive(slug);
  });

  return { setActive };
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initArticleToc, { once: true });
} else {
  initArticleToc();
}
