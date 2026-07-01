import { useEffect, useRef } from 'react';

const STORAGE_KEY = 'exit-popup-shown-at';
const COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function wasRecentlyShown(): boolean {
  if (import.meta.env.DEV) return false; // skip cooldown in dev mode
  try {
    const ts = localStorage.getItem(STORAGE_KEY);
    if (!ts) return false;
    return Date.now() - Number(ts) < COOLDOWN_MS;
  } catch {
    return false;
  }
}

function markShown() {
  try {
    localStorage.setItem(STORAGE_KEY, String(Date.now()));
  } catch {
    // ignore
  }
}

interface ExitIntentPopupProps {
  onTrigger: () => void;
}

const ExitIntentPopup = ({ onTrigger }: ExitIntentPopupProps) => {
  const shownRef = useRef(false);

  useEffect(() => {
    if (wasRecentlyShown()) return;

    const show = () => {
      if (shownRef.current) return;
      shownRef.current = true;
      markShown();
      onTrigger();
    };

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY < 50) show();
    };

    let maxScroll = 0;
    let reachedThreshold = false;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? scrollTop / docHeight : 0;

      if (scrollPercent > maxScroll) maxScroll = scrollPercent;
      if (maxScroll >= 0.4) reachedThreshold = true;
      if (reachedThreshold && maxScroll - scrollPercent >= 0.04) show();
    };

    const timer = setTimeout(() => {
      document.addEventListener('mouseleave', handleMouseLeave);
      window.addEventListener('scroll', handleScroll, { passive: true });
    }, 500);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [onTrigger]);

  return null;
};

export default ExitIntentPopup;
