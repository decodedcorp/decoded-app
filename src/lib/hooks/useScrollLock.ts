import { useEffect } from 'react';

export function useScrollLock(isLocked: boolean) {
  useEffect(() => {
    if (!isLocked) return;
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const body = document.body;
    const prevOverflow = body.style.overflow;
    const prevPaddingRight = body.style.paddingRight;
    const prevPosition = body.style.position;
    const prevTop = body.style.top;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;

    // iOS 대응: 고정
    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.width = '100%';

    // overscroll 차단
    document.documentElement.style.overscrollBehavior = 'contain';

    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPaddingRight;
      body.style.position = prevPosition;
      body.style.top = prevTop;
      document.documentElement.style.overscrollBehavior = '';
      window.scrollTo(0, scrollY);
    };
  }, [isLocked]);
}