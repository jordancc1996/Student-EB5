/** Paths that emit a noindex robots tag. The sitemap filter uses this same set. */
export const NOINDEX_PATHS = new Set(['/photo-credits']);

export function isNoindexPath(pathname: string): boolean {
  const normalized = pathname.replace(/\/$/, '') || '/';
  return NOINDEX_PATHS.has(normalized);
}
