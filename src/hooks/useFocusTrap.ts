import { useEffect, type RefObject } from 'react';

export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  );
}

function isPortaledOverlayOpen() {
  return Boolean(
    document.querySelector('[data-radix-select-content], [data-radix-popper-content-wrapper]'),
  );
}

export function useFocusTrap(
  isActive: boolean,
  containerRef: RefObject<HTMLElement | null>,
  onEscape: () => void,
) {
  useEffect(() => {
    if (!isActive) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const modal = containerRef.current;
    if (!modal) return;

    getFocusableElements(modal)[0]?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (isPortaledOverlayOpen()) return;
        event.preventDefault();
        onEscape();
        return;
      }

      if (event.key !== 'Tab') return;
      if (isPortaledOverlayOpen()) return;

      const items = getFocusableElements(modal);
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      previouslyFocused?.focus();
    };
  }, [isActive, containerRef, onEscape]);
}
