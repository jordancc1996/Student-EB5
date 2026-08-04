import { useEffect, useRef, useState } from 'react';

const STORAGE_KEY = 'playbook_exit_popup_shown';
const COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const READY_DELAY_MS = import.meta.env.DEV ? 3000 : 45000;

function wasRecentlyShown(): boolean {
  if (import.meta.env.DEV) return false;
  try {
    const ts = localStorage.getItem(STORAGE_KEY);
    if (!ts) return false;
    return Date.now() - Number(ts) < COOLDOWN_MS;
  } catch {
    return false;
  }
}

interface PlaybookExitIntentPopupProps {
  onOpen: () => void;
}

/**
 * Side-effect only: detects exit intent / scroll-back and calls onOpen.
 * Dialog UI lives in PlaybookInteractive.
 */
const PlaybookExitIntentPopup = ({ onOpen }: PlaybookExitIntentPopupProps) => {
  const [isReady, setIsReady] = useState(false);
  const shownRef = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), READY_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isReady) return;
    if (wasRecentlyShown()) return;

    const show = () => {
      if (shownRef.current) return;
      shownRef.current = true;
      onOpen();
    };

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY < 50) show();
    };

    let reachedDeep = false;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? scrollTop / docHeight : 0;

      if (scrollPercent >= 0.6) reachedDeep = true;
      if (reachedDeep && scrollPercent <= 0.3) show();
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isReady, onOpen]);

  return null;
};

export default PlaybookExitIntentPopup;
