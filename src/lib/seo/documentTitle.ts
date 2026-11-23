const BRAND = ' | StudentEB5';

/** Keep a title as written. Add the site name only when the result is still 60 characters or fewer. */
export function seoTitle(raw: string): string {
  const trimmed = raw.trim();
  if (trimmed.includes(BRAND)) return trimmed;
  const branded = `${trimmed}${BRAND}`;
  return branded.length <= 60 ? branded : trimmed;
}
