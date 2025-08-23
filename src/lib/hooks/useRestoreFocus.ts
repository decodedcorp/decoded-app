import { useEffect, useRef } from 'react';

export function useRestoreFocus(isOpen: boolean) {
  const triggerRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (!isOpen) return;
    triggerRef.current = (document.activeElement as HTMLElement) ?? null;
    return () => {
      triggerRef.current?.focus?.();
    };
  }, [isOpen]);
}