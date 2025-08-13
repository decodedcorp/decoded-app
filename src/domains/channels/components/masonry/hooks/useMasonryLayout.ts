import { useEffect, useState, useCallback } from 'react';

// 개발 환경에서만 로그 출력
const isDev = process.env.NODE_ENV === 'development';
const log = (message: string, ...args: any[]) => {
  if (isDev) {
    console.log(message, ...args);
  }
};

// SSR-safe useMedia hook
export const useMasonryMedia = (queries: string[], values: number[], defaultValue: number): number => {
  const get = useCallback(() => {
    if (typeof window === 'undefined') {
      log('useMedia: SSR not available, returning defaultValue:', defaultValue);
      return defaultValue;
    }
    const idx = queries.findIndex((q) => window.matchMedia(q).matches);
    const result = values[idx] ?? defaultValue;
    log('useMedia: get() called, result:', result, 'queries:', queries, 'values:', values);
    return result;
  }, [queries.join('|'), values, defaultValue]);

  const [value, setValue] = useState<number>(get);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handler = () => {
      const newValue = get();
      log('useMedia: Media query changed, new value:', newValue);
      setValue(newValue);
    };
    const mqls = queries.map((q) => window.matchMedia(q));
    mqls.forEach((m) => m.addEventListener('change', handler));

    return () => mqls.forEach((m) => m.removeEventListener('change', handler));
  }, [queries.join('|'), get, values, defaultValue]);

  log('useMedia: Current value:', value);
  return value;
};

// 기본 컬럼 수 계산
export const useMasonryColumns = () => {
  return useMasonryMedia(
    ['(min-width:1500px)', '(min-width:1000px)', '(min-width:600px)', '(min-width:400px)'],
    [5, 4, 3, 2],
    1,
  );
};
