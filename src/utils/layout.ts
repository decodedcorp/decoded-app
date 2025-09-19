// Layout utilities - 공통 설정으로 단순화

export type LayoutDomain = 'home' | 'channel' | 'search' | 'profile';

/**
 * Automatically detect layout domain based on pathname
 * @param pathname - Current route pathname
 * @returns LayoutDomain - The detected domain type
 */
export function getLayoutDomain(pathname: string): LayoutDomain {
  if (pathname.startsWith('/channels/')) return 'channel';
  if (pathname.startsWith('/search')) return 'search';
  if (pathname.startsWith('/profile')) return 'profile';
  return 'home';
}

/**
 * Validate if a string is a valid layout domain
 * @param domain - String to validate
 * @returns boolean - True if valid domain
 */
export function isValidLayoutDomain(domain: string): domain is LayoutDomain {
  const validDomains: LayoutDomain[] = ['home', 'channel', 'search', 'profile'];
  return validDomains.includes(domain as LayoutDomain);
}

// Layout debugging utilities
export const LAYOUT_DEBUG = {
  /**
   * Enable layout debugging mode
   * @param element - Element to apply debugging to (defaults to document.documentElement)
   */
  enable(element: HTMLElement = document.documentElement) {
    element.setAttribute('data-layout-debug', '1');
  },

  /**
   * Disable layout debugging mode
   * @param element - Element to remove debugging from (defaults to document.documentElement)
   */
  disable(element: HTMLElement = document.documentElement) {
    element.removeAttribute('data-layout-debug');
  },

  /**
   * Toggle layout debugging mode
   * @param element - Element to toggle debugging on (defaults to document.documentElement)
   */
  toggle(element: HTMLElement = document.documentElement) {
    const isEnabled = element.getAttribute('data-layout-debug') === '1';
    if (isEnabled) {
      this.disable(element);
    } else {
      this.enable(element);
    }
  },
};

// Performance monitoring utilities
export const LAYOUT_PERFORMANCE = {
  /**
   * Measure layout shift during domain changes
   * @param callback - Function to execute during measurement
   * @returns Promise<PerformanceEntry[]> - Layout shift entries
   */
  async measureLayoutShift(callback: () => void): Promise<PerformanceEntry[]> {
    return new Promise((resolve) => {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        observer.disconnect();
        resolve(entries);
      });

      observer.observe({ entryTypes: ['layout-shift'] });
      callback();

      // Timeout after 1 second
      setTimeout(() => {
        observer.disconnect();
        resolve([]);
      }, 1000);
    });
  },

  /**
   * Log layout performance metrics
   * @param domain - Current layout domain
   * @param metrics - Performance metrics object
   */
  logMetrics(domain: LayoutDomain, metrics: Record<string, number>) {
    if (process.env.NODE_ENV === 'development') {
      console.group(`🎯 Layout Performance - ${domain}`);
      Object.entries(metrics).forEach(([key, value]) => {
        console.log(`${key}: ${value}ms`);
      });
      console.groupEnd();
    }
  },
};

/**
 * Get CSS properties for layout domain
 * Currently using CSS variables defined in globals.css, so returning empty object
 * @param _domain - Layout domain (currently unused, reserved for future customizations)
 * @returns CSS properties object
 */
export function getLayoutCSSProperties(_domain: LayoutDomain): React.CSSProperties {
  // All layout styling is handled via CSS variables in globals.css
  // This function exists for potential future customizations
  return {};
}
