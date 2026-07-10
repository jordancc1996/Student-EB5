/**
 * Diff old React SPA routes (from reference App.tsx) + live crawl vs this repo's dist/.
 * Usage: node scripts/audit-site-divergence.mjs
 */
import fs from 'node:fs';
import path from 'node:path';

function walkRoutes(dir, base = 'dist') {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      out.push(...walkRoutes(full, base));
      continue;
    }
    if (e.name !== 'index.html' && e.name !== '404.html') continue;
    let rel = path.relative(base, full).split(path.sep).join('/');
    if (rel === 'index.html') out.push('/');
    else if (rel === '404.html') out.push('/404');
    else out.push('/' + rel.replace(/\/index\.html$/, '').replace(/index\.html$/, ''));
  }
  return [...new Set(out)].sort();
}

/** Primary old-site routes from student-visa-launchpad-REFERENCE/src/App.tsx */
const OLD_PRIMARY = [
  '/',
  '/contact',
  '/research',
  '/news',
  '/eb5-report',
  '/faq',
  '/resources',
  '/student-playbook',
  '/infographics',
  '/about',
  '/privacy-policy',
  '/eb5-investment-immigration-tools',
  '/tools/h1bwagemap',
  '/tools/h1b-jobdatahub',
  '/tools/tuition-calculator',
  '/tools/grandfathering-countdown',
  '/tools/tea-project-explorer',
  '/tools/visa-backlog-checker',
  '/tools/opt-calculator',
  '/tools/2026-eb5-investment-feasibility-calculator',
  '/tools/source-of-funds-calculator',
  '/tools/h1b-lottery-odds-calculator',
  '/tools/eb5-direct-vs-regional-center',
  '/tools/eb5-concurrent-filing-eligibility',
  '/tools/eb5-cspa-calculator',
  '/tools/eb5-source-of-funds-checklist',
  '/tools/eb5-i829-lifecycle-tracker',
  '/tools/eb5-regional-center-scorecard',
  '/timelines/f1-student-eb5-timeline',
  '/timelines/h1b-eb5-processing-timeline',
  '/pathways',
  '/process',
  '/pathways/h1b-to-green-card',
  '/pathways/f1-to-eb5-self-sponsored-green-card',
  '/pathways/h1b-60-day-clock',
];

/** Old-site Navigate stubs (old slug → destination on old SPA). */
const OLD_REDIRECTS = [
  { from: '/tools', to: '/eb5-investment-immigration-tools' },
  { from: '/h1bwagemap', to: '/tools/h1bwagemap' },
  { from: '/h1b-jobdatahub', to: '/tools/h1b-jobdatahub' },
  { from: '/tuition-calculator', to: '/tools/tuition-calculator' },
  { from: '/grandfathering-countdown', to: '/tools/grandfathering-countdown' },
  { from: '/tea-project-explorer', to: '/tools/tea-project-explorer' },
  { from: '/visa-backlog-checker', to: '/tools/visa-backlog-checker' },
  { from: '/opt-calculator', to: '/tools/opt-calculator' },
  { from: '/tools/eb5-feasibility', to: '/tools/2026-eb5-investment-feasibility-calculator' },
  { from: '/tools/investment-comparison', to: '/tools/eb5-direct-vs-regional-center' },
  { from: '/tools/concurrent-filing-checker', to: '/tools/eb5-concurrent-filing-eligibility' },
  { from: '/guides/f1-student-eb5-green-card', to: '/student-playbook' },
  { from: '/guides/h1b-to-eb5-transition', to: '/resources' },
  { from: '/guides/source-of-funds-strategies', to: '/tools/source-of-funds-calculator' },
  { from: '/eb5-guide', to: '/research/complete-2027-eb5-guide' },
  { from: '/eb5-overview', to: '/research/complete-2027-eb5-guide' },
  { from: '/market-outlook', to: '/resources' },
  { from: '/eb5decoded', to: '/resources' },
  { from: '/eb5-future', to: '/research/eb5-grandfathering-2026-2027-deadlines' },
  {
    from: '/research/19-questions-analyze-eb5-deal',
    to: '/research/19-questions-rural-eb5-project-due-diligence',
  },
  {
    from: '/research/eb5-regional-center-selection-guide',
    to: '/research/choosing-rural-eb5-regional-center-guide',
  },
  { from: '/research/f1-eb5-transition-guide', to: '/research/f1-students/f1-to-eb5-green-card' },
  {
    from: '/research/eb5-deal-analysis-guide',
    to: '/research/19-questions-rural-eb5-project-due-diligence',
  },
  {
    from: '/research/f1-visa-to-green-card-eb5-guide',
    to: '/research/f1-students/f1-to-eb5-green-card',
  },
  {
    from: '/research/f1-visa-to-eb5-green-card-guide-2026',
    to: '/research/f1-students/f1-to-eb5-green-card',
  },
  {
    from: '/research/f1-student-visa-to-us-green-card-journey',
    to: '/research/f1-students/f1-to-eb5-green-card',
  },
  {
    from: '/research/f1-opt-students-eb5-investment-now',
    to: '/research/f1-students/f1-to-eb5-green-card',
  },
  {
    from: '/research/eb5-international-students-advantage-faq',
    to: '/research/f1-students/f1-to-eb5-green-card',
  },
  {
    from: '/research/eb5-pathway-academic-opportunities-international-students',
    to: '/research/f1-students/f1-to-eb5-green-card',
  },
  {
    from: '/research/top-eb5-regional-centers-international-students',
    to: '/research/choosing-rural-eb5-regional-center-guide',
  },
  {
    from: '/research/choosing-regional-center-guide-investors',
    to: '/research/choosing-rural-eb5-regional-center-guide',
  },
  {
    from: '/research/19-questions-every-investor-needs-to-ask-when-analyzing-an-eb5-deal',
    to: '/research/19-questions-rural-eb5-project-due-diligence',
  },
  {
    from: '/research/investment/eb5-pre-investment-checklist-f1-h1b',
    to: '/research/investment/eb5-pre-investment-checklist-part-1-f1-h1b',
  },
  {
    from: '/research/investment/eb5-i526e-filing-attorney-cost-f1-h1b',
    to: '/research/investment/eb5-i526e-filing-attorney-cost-part-2-f1-h1b',
  },
];

/** Intentionally excluded from Astro migration (will 404). */
const EXCLUDED_BY_DECISION = new Set([
  '/tools/h1bwagemap',
  '/tools/h1b-jobdatahub',
  '/tools/tea-project-explorer',
  '/tools/visa-backlog-checker',
  '/tools/eb5-direct-vs-regional-center',
  '/tools/eb5-i829-lifecycle-tracker',
]);

const REDIRECT_STUBS_IN_DIST = new Set([
  '/process',
  '/tools',
  '/grandfathering-countdown',
  '/opt-calculator',
  '/tuition-calculator',
  '/tools/concurrent-filing-checker',
  '/tools/eb5-feasibility',
]);

const newRoutes = new Set(
  walkRoutes('dist').filter(
    (p) => p !== '/404' && !REDIRECT_STUBS_IN_DIST.has(p) && !p.startsWith('/guides/'),
  ),
);

const oldPrimary = new Set(OLD_PRIMARY);

const missing = [...oldPrimary]
  .filter((p) => !newRoutes.has(p) && p !== '/process')
  .sort();

const missingExcluded = missing.filter((p) => EXCLUDED_BY_DECISION.has(p));
const missingOther = missing.filter((p) => !EXCLUDED_BY_DECISION.has(p));

const onlyNew = [...newRoutes].filter((p) => !oldPrimary.has(p)).sort();

const slugRedirects = [
  { from: '/process', to: '/eb5-investment-process', note: 'NEW this PR' },
  ...OLD_REDIRECTS.filter(({ from, to }) => from !== to).map((r) => ({
    ...r,
    note: newRoutes.has(r.to)
      ? 'destination exists in Astro'
      : EXCLUDED_BY_DECISION.has(r.to)
        ? 'destination excluded from migration'
        : 'destination missing in Astro',
  })),
];

// Astro-config redirects that differ from old SPA destinations
const ASTRO_VS_OLD = [
  {
    from: '/guides/f1-student-eb5-green-card',
    oldTo: '/student-playbook',
    astroTo: '/pathways/f1-to-eb5-self-sponsored-green-card',
  },
  {
    from: '/guides/h1b-to-eb5-transition',
    oldTo: '/resources',
    astroTo: '/pathways/h1b-to-green-card',
  },
];

console.log('=== SITE DIVERGENCE AUDIT ===');
console.log(`Old primary routes (App.tsx): ${oldPrimary.size}`);
console.log(`New dist routes (excl. stubs): ${newRoutes.size}`);

console.log(`\n(a) OLD MISSING FROM THIS REPO (${missing.length})`);
console.log('  — Previously excluded tools (expected 404):');
missingExcluded.forEach((p) => console.log(`    ${p}`));
console.log('  — Other pages not ported:');
missingOther.forEach((p) => console.log(`    ${p}`));

console.log(`\n(b) IN THIS REPO NOT ON OLD PRIMARY LIST (${onlyNew.length})`);
console.log('  (includes FAQ/news/research detail pages, new tools, new process page)');
onlyNew.forEach((p) => console.log(`  ${p}`));

console.log(`\n(c) SLUG REDIRECTS`);
console.log('  Critical new:');
console.log('    /process → /eb5-investment-process');
console.log('  Already configured in astro.config / vercel:');
for (const r of slugRedirects.filter((x) => x.from !== '/process')) {
  if (
    [
      '/tools',
      '/grandfathering-countdown',
      '/opt-calculator',
      '/tuition-calculator',
      '/tools/concurrent-filing-checker',
      '/tools/eb5-feasibility',
      '/guides/source-of-funds-strategies',
      '/guides/f1-student-eb5-green-card',
      '/guides/h1b-to-eb5-transition',
    ].includes(r.from)
  ) {
    console.log(`    ${r.from} → ${r.to} (${r.note})`);
  }
}
console.log('  Old SPA redirect destinations vs Astro (review):');
ASTRO_VS_OLD.forEach((r) =>
  console.log(`    ${r.from}: old→${r.oldTo} | astro→${r.astroTo}`),
);
console.log('  Additional old Navigate stubs still useful for domain switch:');
OLD_REDIRECTS.filter(
  (r) =>
    ![
      '/tools',
      '/grandfathering-countdown',
      '/opt-calculator',
      '/tuition-calculator',
      '/tools/concurrent-filing-checker',
      '/tools/eb5-feasibility',
      '/guides/source-of-funds-strategies',
      '/guides/f1-student-eb5-green-card',
      '/guides/h1b-to-eb5-transition',
    ].includes(r.from),
).forEach((r) => console.log(`    ${r.from} → ${r.to}`));
