import { useEffect } from 'react';

export function useAriaInert(isOpen: boolean, modalRoot: HTMLElement | null) {
  useEffect(() => {
    if (!isOpen || !modalRoot) return;

    const roots = Array.from(document.body.children).filter((n) => n !== modalRoot);
    const prev: Array<{ el: Element; ariaHidden: string | null }> = [];

    // inert 지원 시
    const supportsInert = 'inert' in HTMLElement.prototype;
    roots.forEach((el) => {
      prev.push({ el, ariaHidden: el.getAttribute('aria-hidden') });
      (el as HTMLElement).setAttribute('aria-hidden', 'true');
      if (supportsInert) (el as any).inert = true;
    });

    return () => {
      prev.forEach(({ el, ariaHidden }) => {
        if (ariaHidden === null) el.removeAttribute('aria-hidden');
        else el.setAttribute('aria-hidden', ariaHidden);
        if (supportsInert) (el as any).inert = false;
      });
    };
  }, [isOpen, modalRoot]);
}