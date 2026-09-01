/**
 * Insert PreferredSourcesCTA near top on pages that used SiteFooter CTA.
 * Skips privacy-policy and 404 (skip rule). Does not touch PathwayLandingLayout,
 * research/[...slug], NewsArticleLayout, or index (already patched).
 */
import fs from 'fs';
import path from 'path';

const root = process.cwd();

function ensureImport(src, importLine) {
  if (src.includes("from '@/components/PreferredSourcesCTA.astro'")) return src;
  const siteFooter = "import SiteFooter from '@/components/SiteFooter.astro';\n";
  const header = "import Header from '@/components/Header';\n";
  if (src.includes(siteFooter)) {
    return src.replace(siteFooter, siteFooter + importLine + '\n');
  }
  if (src.includes(header)) {
    return src.replace(header, header + importLine + '\n');
  }
  return src.replace(/^(---\n)/, `$1${importLine}\n`);
}

const importLine = "import PreferredSourcesCTA from '@/components/PreferredSourcesCTA.astro';";

const jobs = [
  // E2: after hero </section>, before <main
  {
    files: [
      'src/pages/about.astro',
      'src/pages/contact.astro',
      'src/pages/faq/index.astro',
      'src/pages/research/index.astro',
      'src/pages/news.astro',
      'src/pages/eb5-investment-process.astro',
      'src/pages/eb5-green-card-international-students-playbook.astro',
      'src/pages/eb5-investment-immigration-tools.astro',
      'src/pages/private-client-services/index.astro',
    ],
    insert: (src) => {
      if (src.includes('<PreferredSourcesCTA')) return { src, status: 'already' };
      // First hero section close then main — insert between last hero and main when pattern is section...main
      const re = /(<\/section>\s*\n\s*<main)/;
      if (!re.test(src)) return { src, status: 'NO_MATCH_E2' };
      return {
        src: src.replace(re, '</section>\n\n    <PreferredSourcesCTA />\n\n    <main'),
        status: 'ok',
      };
    },
  },
  // H2 pathway hubs
  {
    files: ['src/pages/pathways/index.astro', 'src/pages/pathways/view-all.astro'],
    insert: (src) => {
      if (src.includes('<PreferredSourcesCTA')) return { src, status: 'already' };
      const re = /(<\/section>\s*\n\s*<section class="py-20")/;
      if (!re.test(src)) {
        // view-all may differ
        const re2 = /(<\/section>\s*\n\s*<section)/;
        if (!re2.test(src)) return { src, status: 'NO_MATCH_H2' };
        return {
          src: src.replace(re2, '</section>\n\n      <PreferredSourcesCTA />\n\n      <section'),
          status: 'ok-alt',
        };
      }
      return {
        src: src.replace(re, '</section>\n\n      <PreferredSourcesCTA />\n\n      <section class="py-20"'),
        status: 'ok',
      };
    },
  },
  // I1 resources + PCS children: after Breadcrumb / LastUpdated block start of main
  {
    files: [
      'src/pages/resources.astro',
      'src/pages/private-client-services/investor-intelligence-reports.astro',
      'src/pages/private-client-services/investor-resource-library.astro',
      'src/pages/private-client-services/private-strategy-sessions.astro',
    ],
    insert: (src) => {
      if (src.includes('<PreferredSourcesCTA')) return { src, status: 'already' };
      if (src.includes('<LastUpdated')) {
        return {
          src: src.replace(
            /(<LastUpdated[^/]*\/>)/,
            '$1\n      <PreferredSourcesCTA />',
          ),
          status: 'ok',
        };
      }
      if (src.includes('<Breadcrumb')) {
        // after breadcrumb self-closing or component line
        return {
          src: src.replace(
            /(<Breadcrumb[\s\S]*?\/>)/,
            '$1\n      <PreferredSourcesCTA />',
          ),
          status: 'ok-bc',
        };
      }
      return { src, status: 'NO_MATCH_I1' };
    },
  },
  // G2 tools
  {
    files: [
      'src/pages/tools/opt-calculator.astro',
      'src/pages/tools/tuition-calculator.astro',
      'src/pages/tools/grandfathering-countdown.astro',
      'src/pages/tools/2026-eb5-investment-feasibility-calculator.astro',
      'src/pages/tools/eb5-concurrent-filing-eligibility.astro',
      'src/pages/tools/eb5-cspa-calculator.astro',
      'src/pages/tools/eb5-source-of-funds-checklist.astro',
      'src/pages/tools/eb5-regional-center-scorecard.astro',
      'src/pages/tools/source-of-funds-calculator.astro',
      'src/pages/tools/h1b-lottery-odds-calculator.astro',
    ],
    insert: (src) => {
      if (src.includes('<PreferredSourcesCTA')) return { src, status: 'already' };
      if (!src.includes('<LastUpdated')) return { src, status: 'NO_MATCH_G2' };
      return {
        src: src.replace(
          /(<LastUpdated[^/]*\/>)/,
          '$1\n  <PreferredSourcesCTA />',
        ),
        status: 'ok',
      };
    },
  },
  // FAQ detail C1-like: after breadcrumb nav before back link / ArticleContents
  {
    files: ['src/pages/faq/[slug].astro'],
    insert: (src) => {
      if (src.includes('<PreferredSourcesCTA')) return { src, status: 'already' };
      const marker = '</nav>\n\n          <a\n            href="/faq"';
      if (!src.includes(marker)) {
        // try ArticleContents
        if (src.includes('<ArticleContents')) {
          return {
            src: src.replace(
              /(<ArticleContents)/,
              '<PreferredSourcesCTA />\n\n          $1',
            ),
            status: 'ok-toc',
          };
        }
        return { src, status: 'NO_MATCH_FAQ' };
      }
      return {
        src: src.replace(marker, '</nav>\n\n          <PreferredSourcesCTA />\n\n          <a\n            href="/faq"'),
        status: 'ok',
      };
    },
  },
];

const results = [];

for (const job of jobs) {
  for (const rel of job.files) {
    const fp = path.join(root, rel);
    if (!fs.existsSync(fp)) {
      results.push({ rel, status: 'MISSING_FILE' });
      continue;
    }
    let src = fs.readFileSync(fp, 'utf8');
    src = ensureImport(src, importLine);
    const { src: next, status } = job.insert(src);
    if (status.startsWith('NO_') || status === 'MISSING_FILE') {
      results.push({ rel, status });
      continue;
    }
    fs.writeFileSync(fp, next);
    results.push({ rel, status });
  }
}

console.log(results.map((r) => `${r.status.padEnd(12)} ${r.rel}`).join('\n'));
console.log('---');
console.log(
  'ok=',
  results.filter((r) => r.status.startsWith('ok') || r.status === 'already').length,
  'fail=',
  results.filter((r) => r.status.startsWith('NO_') || r.status === 'MISSING_FILE').length,
);
