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

  initTocLinkScroll(page);
  initTocActiveTracking(page);
}

function initTocLinkScroll(page: Element): void {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  page.querySelectorAll<HTMLAnchorElement>('[data-toc-link]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const slug = link.dataset.tocLink;
      if (!slug) return;

      const target = page.querySelector<HTMLElement>(`.article-content h2#${CSS.escape(slug)}`);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
      history.pushState(null, '', `#${slug}`);
    });
  });
}

function initTocActiveTracking(page: Element): void {
  const links = [...page.querySelectorAll<HTMLAnchorElement>('[data-toc-link]')];
  if (!links.length) return;

  const headings = links
    .map((link) => {
      const slug = link.dataset.tocLink;
      if (!slug) return null;
      return page.querySelector<HTMLElement>(`.article-content h2#${CSS.escape(slug)}`);
    })
    .filter((heading): heading is HTMLElement => heading != null);

  if (!headings.length) return;

  let activeSlug = '';

  const setActive = (slug: string) => {
    if (!slug || slug === activeSlug) return;
    activeSlug = slug;
    links.forEach((link) => {
      link.classList.toggle('is-active', link.dataset.tocLink === slug);
    });
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
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initArticleToc, { once: true });
} else {
  initArticleToc();
}
