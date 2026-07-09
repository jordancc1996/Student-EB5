declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
  }
}

function initArticleToc(): void {
  const page = document.querySelector('.research-article-page');
  if (!page?.querySelector('.article-contents')) return;

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
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initArticleToc, { once: true });
} else {
  initArticleToc();
}
