// @ts-check
import { defineConfig } from 'astro/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import { landingPages, isIndexable } from './src/lib/pathwayRoutes.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const pathwayByPathname = new Map(
  landingPages.map((page) => [page.url, page]),
);

/**
 * @param {string} pageUrl full absolute URL from @astrojs/sitemap
 * @returns {boolean}
 */
function shouldIncludeInSitemap(pageUrl) {
  if (pageUrl.includes('/404')) return false;

  // Exclude redirect stubs
  if (pageUrl === 'https://studenteb5.com/tools/' || pageUrl === 'https://studenteb5.com/tools') return false;
  if (
    pageUrl === 'https://studenteb5.com/grandfathering-countdown/' ||
    pageUrl === 'https://studenteb5.com/grandfathering-countdown'
  )
    return false;
  if (pageUrl === 'https://studenteb5.com/opt-calculator/' || pageUrl === 'https://studenteb5.com/opt-calculator')
    return false;
  if (
    pageUrl === 'https://studenteb5.com/tuition-calculator/' ||
    pageUrl === 'https://studenteb5.com/tuition-calculator'
  )
    return false;
  if (pageUrl.includes('/guides/')) return false;
  if (pageUrl.includes('/tools/concurrent-filing-checker')) return false;
  if (pageUrl.includes('/tools/eb5-feasibility')) return false;

  // Staggered pathway rollout: only include registered pathway URLs when indexable
  try {
    const { pathname } = new URL(pageUrl);
    const normalized = pathname.replace(/\/$/, '') || '/';
    const pathwayEntry = pathwayByPathname.get(normalized);
    if (pathwayEntry && !isIndexable(pathwayEntry)) return false;
  } catch {
    // If URL parsing fails, fall through to include (non-pathway pages)
  }

  return true;
}

// https://astro.build/config
export default defineConfig({
  site: 'https://studenteb5.com',
  // Match per-page canonicals (no trailing slash). Also drives @astrojs/sitemap URL shape.
  trailingSlash: 'never',
  integrations: [
    react(),
    sitemap({
      filter: shouldIncludeInSitemap,
      // Match per-page canonicals (no trailing slash). Default sitemap output uses trailing slashes.
      serialize(item) {
        if (item.url.endsWith('/')) {
          item.url = item.url.replace(/\/+$/, '') || item.url;
        }
        return item;
      },
      changefreq: 'weekly',
      priority: 0.7,
    }),
  ],
  redirects: {
    '/process': '/eb5-investment-process',
    '/tools': '/eb5-investment-immigration-tools',
    '/grandfathering-countdown': '/tools/grandfathering-countdown',
    '/opt-calculator': '/tools/opt-calculator',
    '/tuition-calculator': '/tools/tuition-calculator',
    '/guides/source-of-funds-strategies': '/tools/source-of-funds-calculator',
    '/guides/f1-student-eb5-green-card': '/pathways/f1-to-eb5-self-sponsored-green-card',
    '/guides/h1b-to-eb5-transition': '/pathways/h1b-to-green-card',
    '/tools/concurrent-filing-checker': '/tools/eb5-concurrent-filing-eligibility',
    '/tools/eb5-feasibility': '/tools/2026-eb5-investment-feasibility-calculator',
    '/student-playbook': '/eb5-green-card-international-students-playbook',
    '/research/f1-students/stem-opt-eb5-indian-chinese':
      '/research/f1-students/eb5-indian-chinese-students-f1-stem-opt',
    '/research/comparisons/h1b-vs-eb5-lifetime-cost-indian-chinese-students':
      '/research/comparisons/is-eb5-worth-it-indian-chinese-students',
  },
  vite: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  },
});
