// @ts-check
import { defineConfig } from 'astro/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import react from '@astrojs/react';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  redirects: {
    '/tools': '/eb5-investment-immigration-tools',
    '/grandfathering-countdown': '/tools/grandfathering-countdown',
    '/opt-calculator': '/tools/opt-calculator',
    '/tuition-calculator': '/tools/tuition-calculator',
    '/guides/source-of-funds-strategies': '/tools/source-of-funds-calculator',
    '/guides/f1-student-eb5-green-card': '/pathways/f1-to-eb5-self-sponsored-green-card',
    '/guides/h1b-to-eb5-transition': '/pathways/h1b-to-green-card',
    '/tools/concurrent-filing-checker': '/tools/eb5-concurrent-filing-eligibility',
    '/tools/eb5-feasibility': '/tools/2026-eb5-investment-feasibility-calculator',
  },
  vite: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  },
});
