/**
 * Page-level freshness helpers.
 *
 * Displayed "Last updated" dates must come from page metadata, never from
 * build time, deploy time, or the visitor's clock.
 */

/** Initial baseline when a historical modification date is unknown. */
export const FEATURE_BASELINE_DATE = '2026-08-31';

const MONTHS: Record<string, number> = {
  january: 0,
  february: 1,
  march: 2,
  april: 3,
  may: 4,
  june: 5,
  july: 6,
  august: 7,
  september: 8,
  october: 9,
  november: 10,
  december: 11,
};

const DISPLAY_MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/**
 * Parse a page date into ISO YYYY-MM-DD.
 * Accepts ISO (`2026-08-31`) or human strings (`August 31, 2026`, `May 2026`).
 */
export function toIsoDate(input: string): string {
  const trimmed = input.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return trimmed;
  }

  const withDay = trimmed.match(/^([A-Za-z]+)\s+(\d{1,2}),\s*(\d{4})$/);
  if (withDay) {
    const month = MONTHS[withDay[1].toLowerCase()];
    if (month !== undefined) {
      const day = Number(withDay[2]);
      const year = Number(withDay[3]);
      return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }
  }

  const monthYear = trimmed.match(/^([A-Za-z]+)\s+(\d{4})$/);
  if (monthYear) {
    const month = MONTHS[monthYear[1].toLowerCase()];
    if (month !== undefined) {
      const year = Number(monthYear[2]);
      return `${year}-${String(month + 1).padStart(2, '0')}-01`;
    }
  }

  const parsed = new Date(trimmed);
  if (!Number.isNaN(parsed.getTime())) {
    const y = parsed.getUTCFullYear();
    const m = String(parsed.getUTCMonth() + 1).padStart(2, '0');
    const d = String(parsed.getUTCDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  return FEATURE_BASELINE_DATE;
}

/** Format ISO or human date as `August 31, 2026`. */
export function formatDisplayDate(input: string): string {
  const iso = toIsoDate(input);
  const [y, m, d] = iso.split('-').map(Number);
  return `${DISPLAY_MONTHS[m - 1]} ${d}, ${y}`;
}

/**
 * Effective last-updated value for articles that store human-readable dates.
 * Prefer an explicit update field; otherwise fall back to the published date.
 */
export function resolveArticleLastUpdated(
  published: string,
  updated?: string | null,
): string {
  return updated && updated.trim() ? updated.trim() : published;
}
