import { useEffect, useRef, useState, useCallback } from 'react';

// 개발 환경에서만 로그 출력
const isDev = process.env.NODE_ENV === 'development';
const log = (message: string, ...args: any[]) => {
  if (isDev) {
    console.log(message, ...args);
  }
};

// SSR-safe useMeasure hook
export const useMasonryMeasure = <T extends HTMLElement>() => {
  const ref = useRef<T | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const rafRef = useRef<number | undefined>(undefined);
  const debounceRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    if (typeof window === 'undefined') {
      log('useMeasure: SSR not available');
      return;
    }

    if (!ref.current) {
      log('useMeasure: ref.current is null');
      return;
    }

    log('useMeasure: Setting up measurement');

    // 즉시 현재 크기 측정
    const measure = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const newSize = { width: rect.width, height: rect.height };
        log('useMeasure: Measured size:', newSize);
        setSize(newSize);
      }
    };

    // 초기 측정 (즉시)
    measure();

    // DOM이 완전히 렌더링된 후 다시 측정
    const timeoutId1 = setTimeout(() => {
      log('useMeasure: Delayed measurement 1');
      measure();
    }, 100);

    const timeoutId2 = setTimeout(() => {
      log('useMeasure: Delayed measurement 2');
      measure();
    }, 500);

    // ResizeObserver 설정 (디바운스 적용)
    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(() => {
        log('useMeasure: ResizeObserver triggered');

        // 이전 디바운스 타이머 정리
        if (debounceRef.current) {
          clearTimeout(debounceRef.current);
        }

        // 120ms 디바운스로 연속 리사이즈 이벤트 제어
        debounceRef.current = setTimeout(() => {
          measure();
        }, 120);
      });
      ro.observe(ref.current);

      return () => {
        ro.disconnect();
        clearTimeout(timeoutId1);
        clearTimeout(timeoutId2);
        if (debounceRef.current) {
          clearTimeout(debounceRef.current);
        }
      };
    } else {
      // ResizeObserver가 없는 경우 window resize 이벤트 사용
      window.addEventListener('resize', measure);
      return () => {
        window.removeEventListener('resize', measure);
        clearTimeout(timeoutId1);
        clearTimeout(timeoutId2);
      };
    }
  }, []);

  return [ref, size] as const;
};
