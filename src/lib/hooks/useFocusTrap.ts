import { useEffect } from 'react';

export function useFocusTrap(containerRef: React.RefObject<HTMLElement>, isOpen: boolean) {
  useEffect(() => {
    if (!isOpen || !containerRef.current) return;
    const el = containerRef.current;

    // 1) 최초 포커스
    const focusables = el.querySelectorAll<HTMLElement>(
      'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])',
    );
    const first = focusables[0] as HTMLElement | undefined;
    first?.focus();

    // 2) Tab 순환
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== 'Tab') return;
      const f = Array.from(focusables).filter((x) => !x.hasAttribute('disabled') && !x.getAttribute('aria-hidden'));
      if (f.length === 0) return;
      const firstEl = f[0];
      const lastEl = f[f.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    }
    el.addEventListener('keydown', onKeyDown);
    return () => el.removeEventListener('keydown', onKeyDown);
  }, [containerRef, isOpen]);
}