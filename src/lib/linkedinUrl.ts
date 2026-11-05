export const LINKEDIN_PROFILE_ERROR =
  'Please enter a LinkedIn profile link, e.g. linkedin.com/in/yourname';

export type LinkedInUrlResult = { ok: true; url: string } | { ok: false; error: string };

const LINKEDIN_HOST = /(?:^|\.)linkedin\.com$/i;

/** Empty is valid. Never fetches the URL. */
export function normalizeLinkedInUrl(raw: string): LinkedInUrlResult {
  const trimmed = raw.trim();
  if (!trimmed) return { ok: true, url: '' };

  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  let parsed: URL;
  try {
    parsed = new URL(withProtocol);
  } catch {
    return { ok: false, error: LINKEDIN_PROFILE_ERROR };
  }

  if (!LINKEDIN_HOST.test(parsed.hostname)) {
    return { ok: false, error: LINKEDIN_PROFILE_ERROR };
  }

  const segments = parsed.pathname.split('/').filter(Boolean);
  if (segments.length < 2) {
    return { ok: false, error: LINKEDIN_PROFILE_ERROR };
  }

  const kind = segments[0].toLowerCase();
  if (kind !== 'in' && kind !== 'pub') {
    return { ok: false, error: LINKEDIN_PROFILE_ERROR };
  }

  if (kind === 'in') {
    let handle = segments[1];
    try {
      handle = decodeURIComponent(handle);
    } catch {
      return { ok: false, error: LINKEDIN_PROFILE_ERROR };
    }
    if (!handle || /[/?#]/.test(handle)) {
      return { ok: false, error: LINKEDIN_PROFILE_ERROR };
    }
    return { ok: true, url: `https://www.linkedin.com/in/${encodeURIComponent(handle)}` };
  }

  const pubPath = segments
    .slice(1)
    .join('/')
    .replace(/\/+$/, '');
  if (!pubPath) {
    return { ok: false, error: LINKEDIN_PROFILE_ERROR };
  }
  return { ok: true, url: `https://www.linkedin.com/pub/${pubPath}` };
}
