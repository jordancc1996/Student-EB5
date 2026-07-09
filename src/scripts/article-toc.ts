const NAV_SELECTOR = 'nav[aria-label="Main navigation"]';
const PROGRESS_BAR_HEIGHT = 3;

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
  }
}

function setStickyOffset(): void {
  const nav = document.querySelector(NAV_SELECTOR) as HTMLElement | null;
  const height = nav?.offsetHeight ?? 80;
  document.documentElement.style.setProperty(
    '--toc-top',
    `${height + PROGRESS_BAR_HEIGHT}px`,
  );
}

function getScrollTrigger(): number {
  const offsetValue = getComputedStyle(document.documentElement).getPropertyValue('--toc-top');
  return (Number.parseFloat(offsetValue) || 112) + 16;
}

function initArticleToc(): void {
  const page = document.querySelector('.research-article-page');
  if (!page?.querySelector('.article-toc, .article-toc-mobile')) return;

  setStickyOffset();

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

  const links = [...page.querySelectorAll<HTMLAnchorElement>('[data-toc-link]')];
  const headings = [...page.querySelectorAll<HTMLElement>('.article-content h2[id]')];

  if (!links.length || !headings.length) return;

  const setActive = (slug: string | null) => {
    links.forEach((link) => {
      const isActive = slug !== null && link.dataset.tocLink === slug;
      link.classList.toggle('is-active', isActive);
      if (isActive) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  };

  const updateActiveHeading = () => {
    const trigger = getScrollTrigger();
    let current = headings[0]?.id ?? null;

    for (const heading of headings) {
      if (heading.getBoundingClientRect().top <= trigger) {
        current = heading.id;
      } else {
        break;
      }
    }

    setActive(current);
  };

  updateActiveHeading();

  const observer = new IntersectionObserver(
    () => {
      updateActiveHeading();
    },
    {
      root: null,
      rootMargin: `-${getScrollTrigger()}px 0px -55% 0px`,
      threshold: 0,
    },
  );

  headings.forEach((heading) => observer.observe(heading));

  window.addEventListener('resize', () => {
    setStickyOffset();
    observer.disconnect();
    headings.forEach((heading) => observer.observe(heading));
    updateActiveHeading();
  });

  const nav = document.querySelector(NAV_SELECTOR);
  if (nav && 'ResizeObserver' in window) {
    const ro = new ResizeObserver(() => {
      setStickyOffset();
      updateActiveHeading();
    });
    ro.observe(nav);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initArticleToc, { once: true });
} else {
  initArticleToc();
}
