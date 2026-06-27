import { useEffect, useRef, useState } from 'react';

interface ReadingProgressBarProps {
  /** Optional ref to the element whose scroll progress we track. Defaults to <article> on the page. */
  targetRef?: React.RefObject<HTMLElement>;
}

/**
 * Minimalist scroll-linked reading progress indicator.
 * Renders a 3px line pinned to the bottom edge of the fixed site header.
 * Uses transform: scaleX for hardware-accelerated, layout-shift-free updates.
 */
const ReadingProgressBar = ({ targetRef }: ReadingProgressBarProps) => {
  const barRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const [headerHeight, setHeaderHeight] = useState<number>(64);

  // Track header height so the bar always sits flush with its bottom edge.
  useEffect(() => {
    const nav = document.querySelector('nav[aria-label="Main navigation"]') as HTMLElement | null;
    if (!nav) return;

    const measure = () => setHeaderHeight(nav.offsetHeight);
    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(nav);
    window.addEventListener('resize', measure);
    // Header toggles padding on scroll — re-measure on scroll too.
    window.addEventListener('scroll', measure, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', measure);
    };
  }, []);

  useEffect(() => {
    const update = () => {
      const bar = barRef.current;
      if (!bar) return;

      const target =
        targetRef?.current ||
        (document.querySelector('article') as HTMLElement | null);

      let progress = 0;
      if (target) {
        const rect = target.getBoundingClientRect();
        const start = rect.top + window.scrollY - headerHeight;
        const end = start + target.offsetHeight - window.innerHeight;
        const range = Math.max(end - start, 1);
        progress = (window.scrollY - start) / range;
      } else {
        const doc = document.documentElement;
        const range = Math.max(doc.scrollHeight - window.innerHeight, 1);
        progress = window.scrollY / range;
      }

      progress = Math.min(1, Math.max(0, progress));
      bar.style.transform = `scaleX(${progress})`;
    };

    const onScroll = () => {
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        update();
      });
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [targetRef, headerHeight]);

  return (
    <div
      aria-hidden="true"
      className="fixed left-0 right-0 z-[60] pointer-events-none"
      style={{ top: headerHeight, height: 3 }}
    >
      <div
        ref={barRef}
        className="h-full w-full bg-foreground origin-left will-change-transform"
        style={{ transform: 'scaleX(0)', transition: 'transform 80ms linear' }}
      />
    </div>
  );
};

export default ReadingProgressBar;