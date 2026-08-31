/**
 * Pathname → ISO last-updated registry for pages that are not content-collection
 * articles and do not use pathwayRoutes.lastReviewed.
 *
 * Override a path when that page receives a material content edit.
 * Do not bump dates for cosmetic or code-only changes.
 *
 * Paths use trailingSlash: 'never' (no trailing slash), matching Astro routes.
 */
import { FEATURE_BASELINE_DATE } from './lastUpdated';

/** Pages where showing a last-updated line does not make sense. */
export const LAST_UPDATED_EXCLUDED_PATHS = new Set([
  '/',
  '/contact',
  '/privacy-policy',
  '/404',
  '/news',
  '/research',
  '/faq',
  '/pathways',
  '/pathways/view-all',
  '/pathways/parents-and-families',
  '/eb5-investment-immigration-tools',
]);

/**
 * Static / tool / FAQ / PCS page freshness.
 * Values are ISO YYYY-MM-DD. Baseline = feature implementation date when
 * no reliable historical modification date was available.
 */
export const pageLastUpdated: Record<string, string> = {
  '/about': FEATURE_BASELINE_DATE,
  '/resources': FEATURE_BASELINE_DATE,
  '/eb5-investment-process': FEATURE_BASELINE_DATE,
  '/eb5-green-card-international-students-playbook': FEATURE_BASELINE_DATE,
  '/private-client-services': FEATURE_BASELINE_DATE,
  '/private-client-services/investor-intelligence-reports': FEATURE_BASELINE_DATE,
  '/private-client-services/investor-resource-library': FEATURE_BASELINE_DATE,
  '/private-client-services/private-strategy-sessions': FEATURE_BASELINE_DATE,
  '/tools/opt-calculator': FEATURE_BASELINE_DATE,
  '/tools/tuition-calculator': FEATURE_BASELINE_DATE,
  '/tools/grandfathering-countdown': FEATURE_BASELINE_DATE,
  '/tools/2026-eb5-investment-feasibility-calculator': FEATURE_BASELINE_DATE,
  '/tools/eb5-concurrent-filing-eligibility': FEATURE_BASELINE_DATE,
  '/tools/eb5-cspa-calculator': FEATURE_BASELINE_DATE,
  '/tools/eb5-source-of-funds-checklist': FEATURE_BASELINE_DATE,
  '/tools/eb5-regional-center-scorecard': FEATURE_BASELINE_DATE,
  '/tools/source-of-funds-calculator': FEATURE_BASELINE_DATE,
  '/tools/h1b-lottery-odds-calculator': FEATURE_BASELINE_DATE,
};

export function normalizePathname(pathname: string): string {
  const trimmed = pathname.trim();
  if (!trimmed || trimmed === '/') return '/';
  return trimmed.replace(/\/+$/, '') || '/';
}

export function isLastUpdatedExcluded(pathname: string): boolean {
  return LAST_UPDATED_EXCLUDED_PATHS.has(normalizePathname(pathname));
}

/**
 * Resolve last-updated ISO for a static/tool page path.
 * FAQ detail paths default to the feature baseline unless overridden here.
 */
export function getPageLastUpdated(pathname: string): string {
  const key = normalizePathname(pathname);
  if (pageLastUpdated[key]) return pageLastUpdated[key];
  if (key.startsWith('/faq/') && key !== '/faq') {
    return pageLastUpdated[key] ?? FEATURE_BASELINE_DATE;
  }
  return FEATURE_BASELINE_DATE;
}
