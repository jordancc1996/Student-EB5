// Cookie consent utility — stores preferences and gates script loading

export interface CookiePreferences {
  necessary: true; // always true
  analytics: boolean;
  marketing: boolean;
}

const COOKIE_NAME = 'seb5_consent';
const COOKIE_DAYS = 365;

export function getConsentPreferences(): CookiePreferences | null {
  try {
    const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]*)`));
    if (!match) return null;
    return JSON.parse(decodeURIComponent(match[1]));
  } catch {
    return null;
  }
}

export function setConsentPreferences(prefs: CookiePreferences): void {
  const expires = new Date(Date.now() + COOKIE_DAYS * 864e5).toUTCString();
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(JSON.stringify(prefs))};expires=${expires};path=/;SameSite=Lax`;

  // Fire/block scripts based on consent
  if (prefs.analytics) loadAnalyticsScripts();
  if (prefs.marketing) loadMarketingScripts();

  // Dispatch event so other parts of the app can react
  window.dispatchEvent(new CustomEvent('cookie-consent-updated', { detail: prefs }));
}

export function clearConsentPreferences(): void {
  document.cookie = `${COOKIE_NAME}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;SameSite=Lax`;
}

// ---- Script loaders (only run once) ----

let analyticsLoaded = false;
function loadAnalyticsScripts() {
  if (analyticsLoaded) return;
  analyticsLoaded = true;

  // Microsoft Clarity
  const clarityScript = document.createElement('script');
  clarityScript.textContent = `
    (function(c,l,a,r,i,t,y){
      c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
      t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "vrqvt984xy");
  `;
  document.head.appendChild(clarityScript);

  // Ahrefs Analytics
  const ahrefsScript = document.createElement('script');
  ahrefsScript.src = 'https://analytics.ahrefs.com/analytics.js';
  ahrefsScript.dataset.key = 'D8y878mV/BL/C1lOF9kxKA';
  ahrefsScript.async = true;
  ahrefsScript.defer = true;
  document.head.appendChild(ahrefsScript);
}

let marketingLoaded = false;
function loadMarketingScripts() {
  if (marketingLoaded) return;
  marketingLoaded = true;
  // Placeholder for future marketing scripts (e.g., Meta Pixel, Google Ads)
}

// Boot: if consent already given, load scripts immediately
export function initConsentOnLoad(): void {
  const prefs = getConsentPreferences();
  if (prefs) {
    if (prefs.analytics) loadAnalyticsScripts();
    if (prefs.marketing) loadMarketingScripts();
  }
}
