// 개발 환경에서만 로그 출력 (성능 최적화)
const isDev = process.env.NODE_ENV === 'development';

export const log = (message: string, ...args: any[]) => {
  if (isDev) {
    console.log(message, ...args);
  }
};

export const perfLog = (message: string, ...args: any[]) => {
  if (isDev) {
    console.log(`[PERF] ${message}`, ...args);
  }
};

export const timeLog = (label: string) => {
  if (isDev) {
    console.time(label);
  }
};

export const timeLogEnd = (label: string) => {
  if (isDev) {
    console.timeEnd(label);
  }
};

/**
 * Performance monitoring decorator for expensive operations
 */
export const withPerformanceTracking = <T extends any[], R>(
  fn: (...args: T) => R,
  label: string
) => {
  return (...args: T): R => {
    timeLog(label);
    const result = fn(...args);
    timeLogEnd(label);
    return result;
  };
};

/**
 * Throttle function for performance-sensitive operations
 */
export const throttle = <T extends any[]>(
  func: (...args: T) => void,
  delay: number
) => {
  let timeoutId: NodeJS.Timeout | null = null;
  let lastExecTime = 0;

  return (...args: T) => {
    const currentTime = Date.now();

    if (currentTime - lastExecTime > delay) {
      func(...args);
      lastExecTime = currentTime;
    } else {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      timeoutId = setTimeout(() => {
        func(...args);
        lastExecTime = Date.now();
      }, delay - (currentTime - lastExecTime));
    }
  };
};

/**
 * Debounce function for search inputs and similar use cases
 */
export const debounce = <T extends any[]>(
  func: (...args: T) => void,
  delay: number
) => {
  let timeoutId: NodeJS.Timeout | null = null;

  return (...args: T) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};