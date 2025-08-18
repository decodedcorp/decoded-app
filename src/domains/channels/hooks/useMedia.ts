import { useState, useEffect, useCallback } from 'react';

// 개발 환경에서만 로그 출력 (성능 최적화)
const isDev = process.env.NODE_ENV === 'development';
const log = (message: string, ...args: any[]) => {
  if (isDev) {
    console.log(message, ...args);
  }
};

/**
 * SSR-safe useMedia hook for responsive breakpoints
 * @param queries - Array of media queries to match
 * @param values - Array of values to return for each query
 * @param defaultValue - Default value when no queries match or on server
 * @returns Current matched value
 */
export const useMedia = (queries: string[], values: number[], defaultValue: number): number => {
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
      // 값이 실제로 변경되었을 때만 setState 호출
      if (newValue !== value) {
        log('useMedia: Media query changed, new value:', newValue);
        setValue(newValue);
      }
    };
    
    const mqls = queries.map((q) => window.matchMedia(q));
    mqls.forEach((m) => m.addEventListener('change', handler));

    return () => {
      mqls.forEach((m) => m.removeEventListener('change', handler));
    };
  }, [queries.join('|'), get, value]);

  return value;
};

/**
 * Common responsive breakpoints for the channels domain
 */
export const useResponsiveColumns = () => {
  return useMedia(
    ['(min-width: 1536px)', '(min-width: 1280px)', '(min-width: 1024px)', '(min-width: 768px)', '(min-width: 640px)'],
    [6, 5, 4, 3, 2],
    1
  );
};

/**
 * Responsive gap sizes for grids
 */
export const useResponsiveGap = () => {
  return useMedia(
    ['(min-width: 1024px)', '(min-width: 768px)'],
    [24, 16],
    12
  );
};