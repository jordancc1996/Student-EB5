# Project: StudentEB5 — React to Astro Migration

## Goal
Convert an existing React/Vite site (built originally in Lovable) into Astro, 
for SEO purposes. The live site is https://www.studenteb5.com/ — much of its 
content is client-rendered, so Astro's static HTML output should fix indexing.

## Source and destination
- Source (read-only, do not modify): student-visa-launchpad-REFERENCE/ — the 
  original React/Vite project, full of working components, pages, and content data
- Destination: STUDENT-EB5/ (this project) — a fresh Astro project with the 
  tailwind and @astrojs/react integrations already installed

## Hard requirements — do not deviate from these
1. PIXEL-PERFECT VISUAL MATCH is the top priority, even if it makes the 
   migration slower. Never simplify, restyle, or "improve" a component's 
   appearance during conversion.
2. Tailwind classes must be copied EXACTLY as written in the source. 
   Never substitute, reorder, or "clean up" classes.
3. Any component using useState, useEffect, useRef, or browser APIs 
   (window, document, localStorage, sessionStorage) must be preserved 
   AS-IS as a React component and mounted in Astro as a client island 
   (client:load or client:visible). Never rewrite interactive components 
   into static Astro markup.
4. Pages with no client state ("hookless" pages) should be converted to 
   plain .astro components — no React island needed for these.
5. Long-form content currently hardcoded in TypeScript arrays 
   (src/data/researchPosts.ts, src/data/faqData.ts) should eventually 
   move into Astro content collections (src/content/), not be left as 
   hardcoded arrays or manually retyped.
6. Preserve all heading hierarchy (h1/h2/h3), alt text, and meta tags 
   exactly — these matter for the SEO goal driving this whole migration.
7. Convert one page or one logical unit at a time. Never attempt a 
   bulk/whole-site conversion in a single step.
8. If a requested change would require deviating from any rule above 
   (e.g. a file format conflict, a missing dependency), STOP and ask 
   before proceeding — do not silently work around it.

## Current status
- STUDENT-EB5 has been freshly initialized with `npm create astro@latest` 
  (minimal template) and has tailwind + @astrojs/react integrations added.
- Tailwind config and global CSS have not yet been ported from the 
  reference project (next step).
- No pages have been converted yet.

---

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## Known data gaps (from Lovable JSON export validation)

- researchPosts.json: image and heroImage fields contain literal 
  /dev-server/src/assets/... path strings, not the real asset imports used in 
  the original researchPosts.ts. These will need remapping to Astro's public/ 
  folder or content-collection asset paths during conversion — do not assume 
  these paths work as-is.
- faqData.json: missing the faqCategories array that faqData.ts exports 
  separately as a standalone export (["General", "Investment", "Process", 
  "Eligibility", "Regional Centers"]). This needs to be added manually if the 
  Astro FAQ page implements category filtering.

## Backend / API findings

- This project has zero server-side backend integrations. No database, no 
  server-side env vars (only import.meta.env.DEV, a Vite built-in used in 
  ExitIntentPopup.tsx). All third-party service references (Formcarry form 
  endpoint, Microsoft Clarity tag, Ahrefs site-verification tag) are hardcoded 
  public values used client-side — no real secrets to migrate.
- api/prerender.ts is a Vercel serverless function that exists ONLY to fake 
  static HTML for SEO bots, because the current React/Vite site is 
  client-rendered. This entire file and its logic should be RETIRED during 
  the Astro migration, not ported over — Astro's static output makes this 
  bot-detection workaround unnecessary.
- See _migration-notes/api-and-env.md for full details.

## Fonts and global assets findings

- Fonts to port: Playfair Display (serif) and Montserrat (sans), loaded via 
  Google Fonts. DO NOT port Inter — it's preloaded in the current site's 
  index.html but never actually used in any CSS/Tailwind config, it's dead 
  weight. Drop it entirely in the Astro version.
- Port Google Tag Manager (GTM-PCXRXQ34) and Google Analytics 
  (G-YWB04H0R4C) tags into Astro's Layout.astro <head> unchanged.
- The cookie-consent-gated script loader (src/lib/cookieConsent.ts) controls 
  additional analytics + Ahrefs Analytics loading after user consent — this 
  logic needs to be preserved, likely as a client-side script or React island.
- The per-route canonical-URL rewrite script in index.html (lines 34-43) 
  should be RETIRED, not ported — Astro's per-page SEO component sets 
  canonical tags natively per page without needing a runtime script.
- See _migration-notes/fonts-and-assets.md for full details.

## Tooling decisions

- Downgraded Astro's Tailwind integration from v4 to v3 to match the reference project's existing config exactly, prioritizing pixel-perfect visual fidelity over using the latest Tailwind version. `@astrojs/tailwind` is not used (deprecated; incompatible with Astro 7 peer deps). Tailwind v3 runs via manual PostCSS (`postcss.config.js` + existing `tailwind.config.ts`). This can be revisited as a separate upgrade project after the migration is complete.
- Fixed Tailwind content glob in `tailwind.config.ts` to scan `.astro` files (was previously only scanning `.tsx/.ts` from the old Vite folder structure) — this was the root cause of missing CSS (washed-out hero, broken section backgrounds) on the first converted page. This fix applies project-wide, so future page conversions should not hit the same CSS issue.
- Migrated research articles from `src/data/researchPosts.ts` to an Astro content collection at `src/content/blog/`, verified byte-identical against the original JSON export and fully tested per the standard verification checklist. Original file preserved as `researchPosts.ts.deprecated`.
- Privacy Policy page renders its entire body as a client:load React island, unlike other static pages, because TOC navigation and hash-scroll-on-load require useEffect + onClick handlers tightly coupled to the content. This is an intentional exception, not an oversight — the alternative would require duplicating section structure across static and island layers for no real benefit on a low-traffic legal page.
- News section audit confirmed 8 total entries in News.tsx, 5 of which are placeholder/fake content (no real URLs, no article bodies, route guard sends them back to /news). Per user confirmation, only the 3 real articles are migrated: july-2026-visa-bulletin-eb5-q3-outlook, uscis-adjustment-of-status-memo-eb5-investors, and eb5-visa-landscape-news-update-may-2026. The 5 placeholders are permanently excluded, not deferred.
- Confirmed STUDENT-EB5's Breadcrumb.tsx correctly ports the reference's full routeNames/pathOverrides/multi-segment logic — the 'simple' looking breadcrumbs on /about, /contact, /resources, /student-playbook, /faq are correct behavior for single-segment URLs, not a regression. Deliberate improvement over reference: added proper display names to routeNames for the 6 tools missing from the hub grid (eb5-direct-vs-regional-center, eb5-concurrent-filing-eligibility, eb5-cspa-calculator, eb5-source-of-funds-checklist, eb5-i829-lifecycle-tracker, eb5-regional-center-scorecard), which the reference site lacks (falls back to auto-capitalized kebab-case on live).
- Found and fixed a pre-existing bug in the reference project: GrandfatheringCountdown.tsx used `new Date('2026-09-30T23:59:59')` with no timezone, while Pathways.tsx used `new Date('2026-09-30T23:59:59-04:00')` (explicit EDT) for the same deadline — meaning the live site could show different countdown values depending on visitor timezone. Fixed during migration by creating `src/lib/eb5-dates.ts` with shared constants and using them everywhere. This is a deliberate improvement over reference, not a pixel-perfect port of this specific bug.
- `src/lib/eb5-dates.ts` exports `GRANDFATHERING_DEADLINE`, `INFLATION_ADJUSTMENT_DATE`, and `RC_REAUTHORIZATION_DEADLINE` (all US Eastern time). GrandfatheringCountdown uses `GRANDFATHERING_DEADLINE` now; **Pathways conversion must import from this module** instead of the reference's inline `new Date('2026-09-30T23:59:59-04:00')`.
- Found and fixed a second timezone-dependent date bug, same category as the Grandfathering Countdown fix: OPTCalculatorMainContent.tsx used `new Date(programEndDate + 'T00:00:00')` with no timezone offset for PED and all derived dates (earliestApply, latestApply, earliestStart, latestStart, calculatedEndDate). Since the date-only input has no timezone info, JS interprets `'T00:00:00'` as LOCAL midnight in whatever timezone the browser runs in — meaning two users in different timezones entering the identical program end date could see different computed application/start/end dates after date arithmetic crosses a day boundary in UTC. Confirmed via direct Node calculation: `new Date('2026-06-01T00:00:00')` minus 90 days produced `2026-03-03T04:00:00.000Z`, which displays as `'Mar 02'` in a UTC-4 local context. Fixed by switching all date math in this component to UTC-based date construction so results are deterministic regardless of the visitor's browser timezone. This is a deliberate improvement over reference (which has this same bug live), not a pixel-perfect port of the bug. Confirmed via reference check that the live site has the identical `'T00:00:00'` no-offset pattern.
- `src/lib/eb5-investment.ts` exports `TEA_INVESTMENT_THRESHOLD` ($800,000) and `NON_TEA_INVESTMENT_THRESHOLD` ($1,050,000) for shared use across tools and future conversions. Source of Funds Calculator imports `TEA_INVESTMENT_THRESHOLD` for its default target-funding value (reference hardcoded `'800000'`; same numeric value). Clarified: TEA_INVESTMENT_THRESHOLD ($800,000) and NON_TEA_INVESTMENT_THRESHOLD ($1,050,000) represent the EB-5 capital investment amount ONLY — they do NOT include USCIS filing fees, administrative/regional center fees, legal fees, or the EB-5 Integrity Fund fee. Any future content or tool that implies these thresholds represent 'total cost to do EB-5' would be inaccurate and should be corrected or caveated.
- GatedFeasibilityCalculator also uses TEA_INVESTMENT_THRESHOLD from eb5-investment.ts (replacing const GOAL = 800_000 inline). This is the 4th tool to use this constant after SourceOfFundsCalculator, EB5FeasibilityTool, and InlineTuitionCalculator — consistent with the established pattern.
- CSPACalculator.tsx uses `new Date(dateString)` on four user-input date fields (DOB, filing date, approval date, visa final action date). While internally consistent (all four parse the same way, unlike OPT's mixed pattern), applied an explicit UTC-safe date parsing fix as a precaution, given this tool's output (whether a derivative child 'ages out' of EB-5 eligibility) has real immigration consequences for families. Deliberate preventive improvement, not a fix for a confirmed bug like the OPT/Grandfathering cases — documented for transparency since it is a behavior change from verbatim reference, even though hand-traced test results are identical under both approaches for the example scenario tested.
- **Excluded tools (will return 404 on new Astro site, per user decision):** H1B Wage Map (`/tools/h1bwagemap`), H-1B Job Datahub (`/tools/h1b-jobdatahub`), Direct vs. Regional Center / Investment Comparison (`/tools/eb5-direct-vs-regional-center`), I-829 Lifecycle Tracker (`/tools/eb5-i829-lifecycle-tracker`), Visa Backlog Checker (`/tools/visa-backlog-checker`). Same rationale for all — not migrated. Audit internal links to these routes before deployment (multiple research articles, Student Playbook, and Header dropdown still reference `/tools/visa-backlog-checker`).
- **Remaining tools to convert:** None — tools phase complete (hub at `/eb5-investment-immigration-tools`, 6 live tools in grid).
- Tools Hub page (`/eb5-investment-immigration-tools`) deliberately shows only the 6 migrated tools in its grid, removing the 4 excluded tools (H1B Wage Map, H1B Job Datahub, TEA Project Explorer, Visa Backlog Checker) entirely. Reference shows all 10 including broken links. This is an intentional UX improvement, not a pixel-perfect port. JSON-LD ItemList structured data also updated to reflect only the 6 live tools.
- Pathway pages phase: 4 pages total (/pathways hub + 3 pathway pages). Requires 12 new components not yet in STUDENT-EB5: ExitIntentPopup, GuideDownloadModal, QualificationModal, FeasibilityModal, CalculatorLeadModal, GatedFeasibilityCalculator, PageLayout (H1B main); InlineTuitionCalculator, StudentLeadModal, StudentEligibilityModal, GiftedFundsModal, StudentExitIntentPopup (Student); MinimalLayout (60-day). Conversion order: (1) H1B60DayClock, (2) StudentToGreenCard, (3) H1BToGreenCard, (4) Pathways hub. GRANDFATHERING_DEADLINE from eb5-dates.ts applies to Pathways hub countdown. TEA_INVESTMENT_THRESHOLD applies to InlineTuitionCalculator and prose references on Student page.
- Pathway pages phase: 4 pages total (/pathways hub + 3 pathway pages). Requires 12 new components not yet in STUDENT-EB5: ExitIntentPopup, GuideDownloadModal, QualificationModal, FeasibilityModal, CalculatorLeadModal, GatedFeasibilityCalculator, PageLayout (H1B main); InlineTuitionCalculator, StudentLeadModal, StudentEligibilityModal, GiftedFundsModal, StudentExitIntentPopup (Student); MinimalLayout (60-day). Conversion order: (1) H1B60DayClock, (2) StudentToGreenCard, (3) H1BToGreenCard, (4) Pathways hub. GRANDFATHERING_DEADLINE from eb5-dates.ts applies to Pathways hub countdown. TEA_INVESTMENT_THRESHOLD applies to InlineTuitionCalculator and prose references on Student page.
- api/prerender.ts RETIRED — not ported to STUDENT-EB5. This Vercel serverless function existed solely to generate synthetic static HTML for search engine crawlers because the original React/Vite SPA was client-rendered. Astro's static build output (dist/) produces real, complete HTML for every route at build time, making the entire prerender workaround obsolete. No api/ directory, no Vercel function config, no SPA catch-all rewrite needed in the Astro deployment.

## Known issues

- FAQ detail page related-FAQ cards have nested `<a>` tags (outer card link wraps inner links from the answer excerpt's `dangerouslySetInnerHTML`/`set:html` content). This is invalid HTML, but currently causes no visible bug since `FaqDetailContent` renders as static SSR (no client hydration to conflict). It DID cause a false-positive duplicate-card reading in an early verification script (browser HTML-repair artifacts), confirmed resolved as a script bug, not a real page bug, on 2026-06-27. Worth a future structural fix (e.g. truncating excerpt HTML to strip inner `<a>` tags) if strict HTML validity becomes a priority, but not currently blocking.

## Pending for SEO finalization phase

- When building the sitemap during SEO layer finalization (per the revised conversion order), ensure `/news` and all 3 real article URLs (`july-2026-visa-bulletin-eb5-q3-outlook`, `uscis-adjustment-of-status-memo-eb5-investors`, `eb5-visa-landscape-news-update-may-2026`) are included. Do NOT include the 5 placeholder slugs that were excluded from migration.

## Known issue: stale Vite cache after config changes

- Symptom: After changing astro.config.mjs, tailwind.config.ts, or similar 
  build config, multiple unrelated React islands may fail to hydrate with 
  console errors like "[astro-island] Error hydrating /src/components/X.tsx 
  TypeError: Failed to fetch dynamically imported module". This can affect 
  several components simultaneously (seen on Header.tsx, ConsultationCTA.tsx, 
  and Footer.tsx at once after the Tailwind v3 downgrade).
- Root cause: Stale Vite dependency cache, not a code defect. Vite logs 
  "Re-optimizing dependencies because vite config has changed" right before 
  this happens.
- Fix: Stop the dev server, delete node_modules/.vite and .astro/ (both are 
  safe to delete, they regenerate automatically), then restart with npm run dev.
- This is NOT a sign of a broken component, missing dependency, or circular 
  import — verified via headless browser check that all islands hydrate 
  cleanly once the cache is cleared. Clear the cache FIRST before doing any 
  deeper investigation into a hydration error that appears right after a 
  config change.

## Revised conversion order and process

## Conversion order (revised)
Research pages are the highest SEO priority and should be converted BEFORE 
remaining static marketing pages (About, Contact, PrivacyPolicy, etc.), 
since the 36 research articles are the primary source of organic search 
value for this site. Revised order:

1. Homepage (DONE)
2. Research listing page (/research) — src/pages/Research.tsx
3. Research post template (/research/:id, /research/:category/:id) — 
   src/pages/ResearchPost.tsx — this is the highest-leverage conversion, 
   since it's the template all 36 articles will use
4. Migrate researchPosts.json content into an Astro content collection 
   (src/content/) per the existing schema discussion in AGENTS.md, 
   remapping image paths per the "Known data gaps" section
5. FAQ listing + detail pages (similar content-collection pattern, smaller scope)
6. Remaining static/hookless pages (About, Contact, Resources, 
   StudentPlaybook, PrivacyPolicy, NotFound)
7. News listing + article pages (inline content, handle per earlier findings)
8. Calculator/tool pages (highest complexity, most React islands)
9. Pathway pages (most complex: multi-step flows, modals, popups)
10. SEO layer finalization (sitemap, robots.txt, meta audit across all pages)
11. Retire api/prerender.ts once Astro's static output is confirmed working 
    for all bot-relevant routes

## Required process for EVERY page conversion (no exceptions)
Going forward, every single page conversion must follow this sequence 
before being considered done:

1. Convert the page using Cursor, following the existing hard requirements 
   (pixel-perfect, preserve islands for stateful components, etc.)
2. Visually verify in npm run dev against the live site 
   (https://www.studenteb5.com/[route]) — side by side comparison, not a 
   quick glance
3. Check browser console for hydration errors on every React island used 
   on that page
4. If any hydration error appears, clear node_modules/.vite and .astro/ 
   cache and retest before doing deeper debugging (per the "Known issue: 
   stale Vite cache" section above)
5. Run npm run build and confirm it completes with no errors
6. Confirm in the build output that all images/video/assets for that page 
   resolved to hashed /_astro/ paths, not dev-only /@fs/ or /src/assets/ paths
7. Run npm run preview and re-verify the page visually one more time against 
   the production build, not just the dev server
8. Only after steps 1-7 pass should the page be considered complete and 
   the next page started

Do not skip steps 5-7 (the production build check) even for simple pages — 
dev-server-clean and production-build-clean are different guarantees, and 
asset path issues only surface in the production build.
