import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Settings, Shield } from 'lucide-react';
import {
  getConsentPreferences,
  setConsentPreferences,
  initConsentOnLoad,
  type CookiePreferences,
} from '@/lib/cookieConsent';

const CookieConsentBanner = () => {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    initConsentOnLoad();
  }, []);

  useEffect(() => {
    const prefs = getConsentPreferences();
    if (!prefs) {
      // Small delay so it doesn't flash on page load
      const t = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  // Listen for external "open cookie settings" events
  useEffect(() => {
    const handler = () => {
      const prefs = getConsentPreferences();
      if (prefs) {
        setAnalytics(prefs.analytics);
        setMarketing(prefs.marketing);
      }
      setShowDetails(true);
      setVisible(true);
    };
    window.addEventListener('open-cookie-settings', handler);
    return () => window.removeEventListener('open-cookie-settings', handler);
  }, []);

  const save = useCallback((prefs: CookiePreferences) => {
    setConsentPreferences(prefs);
    setVisible(false);
    setShowDetails(false);
  }, []);

  const acceptAll = () => save({ necessary: true, analytics: true, marketing: true });
  const rejectNonEssential = () => save({ necessary: true, analytics: false, marketing: false });
  const savePreferences = () => save({ necessary: true, analytics, marketing });

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[9998] p-4 sm:p-6 pointer-events-none">
      <div className="pointer-events-auto mx-auto max-w-2xl rounded-lg border border-border bg-card shadow-lg animate-in slide-in-from-bottom-4 duration-300">
        <div className="p-5 sm:p-6">
          {/* Header */}
          <div className="flex items-start gap-3 mb-3">
            <Shield size={20} className="text-muted-foreground mt-0.5 shrink-0" />
            <div>
              <h3 className="font-serif font-semibold text-card-foreground text-sm">Cookie Preferences</h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                We use cookies to improve your experience and analyze site traffic. You can choose which categories to allow. 
                See our{' '}
                <a href="/privacy-policy" className="underline hover:text-foreground transition-colors">
                  Privacy Policy
                </a>{' '}
                for details.
              </p>
            </div>
          </div>

          {/* Expandable category details */}
          {showDetails && (
            <div className="mt-4 mb-4 space-y-3 border-t border-border pt-4">
              {/* Necessary */}
              <label className="flex items-center justify-between gap-3">
                <div>
                  <span className="text-sm font-medium text-card-foreground">Necessary</span>
                  <p className="text-xs text-muted-foreground">Essential for the site to function. Always enabled.</p>
                </div>
                <input type="checkbox" checked disabled className="h-4 w-4 accent-foreground" />
              </label>
              {/* Analytics */}
              <label className="flex items-center justify-between gap-3 cursor-pointer">
                <div>
                  <span className="text-sm font-medium text-card-foreground">Analytics</span>
                  <p className="text-xs text-muted-foreground">Help us understand how visitors use the site (Clarity, Ahrefs).</p>
                </div>
                <input
                  type="checkbox"
                  checked={analytics}
                  onChange={(e) => setAnalytics(e.target.checked)}
                  className="h-4 w-4 accent-foreground cursor-pointer"
                />
              </label>
              {/* Marketing */}
              <label className="flex items-center justify-between gap-3 cursor-pointer">
                <div>
                  <span className="text-sm font-medium text-card-foreground">Marketing</span>
                  <p className="text-xs text-muted-foreground">Used for targeted advertising and remarketing.</p>
                </div>
                <input
                  type="checkbox"
                  checked={marketing}
                  onChange={(e) => setMarketing(e.target.checked)}
                  className="h-4 w-4 accent-foreground cursor-pointer"
                />
              </label>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <Button onClick={acceptAll} size="sm" className="text-xs">
              Accept All
            </Button>
            <Button onClick={rejectNonEssential} variant="outline" size="sm" className="text-xs">
              Reject Non-Essential
            </Button>
            {showDetails ? (
              <Button onClick={savePreferences} variant="secondary" size="sm" className="text-xs">
                Save Preferences
              </Button>
            ) : (
              <Button
                onClick={() => setShowDetails(true)}
                variant="ghost"
                size="sm"
                className="text-xs gap-1"
              >
                <Settings size={14} />
                Manage Preferences
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsentBanner;
