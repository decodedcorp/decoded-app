/**
 * Performance Provider
 *
 * Global performance monitoring provider that integrates with Next.js routing
 * and provides performance context throughout the application.
 */

'use client';

import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { performanceMonitor, usePerformanceMonitoring } from '../utils/performanceMonitor';

interface PerformanceContextType {
  markRouteChangeStart: () => void;
  markRouteChangeEnd: () => void;
  markComponentLoadStart: (name: string) => void;
  markComponentLoadEnd: (name: string) => void;
  markApiStart: (name: string) => void;
  markApiEnd: (name: string, success?: boolean) => void;
  getMetrics: () => any;
  generateReport: () => string;
}

const PerformanceContext = createContext<PerformanceContextType | null>(null);

interface PerformanceProviderProps {
  children: ReactNode;
  enabled?: boolean;
}

export const PerformanceProvider: React.FC<PerformanceProviderProps> = ({
  children,
  enabled = true,
}) => {
  const pathname = usePathname();
  const monitoring = usePerformanceMonitoring(enabled);

  // Track route changes
  useEffect(() => {
    if (!monitoring) return;

    console.log('📊 Route changed to:', pathname);

    // Mark route change end for navigation timing
    monitoring.markRouteChangeEnd();

    // Track page-specific metrics
    const timer = setTimeout(() => {
      const metrics = monitoring.getMetrics();

      // Log current page performance
      if (Object.keys(metrics).length > 0) {
        console.log('📊 Page performance metrics:', {
          route: pathname,
          metrics: {
            lcp: metrics.lcp ? `${metrics.lcp.toFixed(2)}ms` : 'N/A',
            fid: metrics.fid ? `${metrics.fid.toFixed(2)}ms` : 'N/A',
            cls: metrics.cls ? metrics.cls.toFixed(3) : 'N/A',
            routeChange: metrics.routeChangeTime ? `${metrics.routeChangeTime.toFixed(2)}ms` : 'N/A',
          },
        });
      }
    }, 2000); // Wait 2 seconds for metrics to stabilize

    return () => clearTimeout(timer);
  }, [pathname, monitoring]);

  // Performance development tools (only in development)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined' && monitoring) {
      // Add global performance debugging functions
      (window as any).getPerformanceMetrics = monitoring.getMetrics;
      (window as any).getPerformanceReport = monitoring.generateReport;

      // Add keyboard shortcut for performance report
      const handleKeyDown = (event: KeyboardEvent) => {
        // Ctrl/Cmd + Shift + P for performance report
        if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'P') {
          event.preventDefault();
          console.log(monitoring.generateReport());
        }
      };

      window.addEventListener('keydown', handleKeyDown);

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        delete (window as any).getPerformanceMetrics;
        delete (window as any).getPerformanceReport;
      };
    }
  }, [monitoring]);

  // Provide default no-op functions if monitoring is disabled
  const contextValue: PerformanceContextType = monitoring || {
    markRouteChangeStart: () => {},
    markRouteChangeEnd: () => {},
    markComponentLoadStart: () => {},
    markComponentLoadEnd: () => {},
    markApiStart: () => {},
    markApiEnd: () => {},
    getMetrics: () => ({}),
    generateReport: () => 'Performance monitoring disabled',
  };

  return (
    <PerformanceContext.Provider value={contextValue}>
      {children}
    </PerformanceContext.Provider>
  );
};

// Hook to use performance monitoring context
export const usePerformanceContext = (): PerformanceContextType => {
  const context = useContext(PerformanceContext);
  if (!context) {
    throw new Error('usePerformanceContext must be used within a PerformanceProvider');
  }
  return context;
};

// Hook for component performance tracking
export const useComponentPerformance = (componentName: string) => {
  const { markComponentLoadStart, markComponentLoadEnd } = usePerformanceContext();

  useEffect(() => {
    markComponentLoadStart(componentName);

    return () => {
      markComponentLoadEnd(componentName);
    };
  }, [componentName, markComponentLoadStart, markComponentLoadEnd]);

  return {
    markLoadStart: () => markComponentLoadStart(componentName),
    markLoadEnd: () => markComponentLoadEnd(componentName),
  };
};

// Hook for API performance tracking
export const useApiPerformance = () => {
  const { markApiStart, markApiEnd } = usePerformanceContext();

  const trackApiCall = async <T,>(
    apiName: string,
    apiCall: () => Promise<T>
  ): Promise<T> => {
    markApiStart(apiName);

    try {
      const result = await apiCall();
      markApiEnd(apiName, true);
      return result;
    } catch (error) {
      markApiEnd(apiName, false);
      throw error;
    }
  };

  return {
    trackApiCall,
    markApiStart,
    markApiEnd,
  };
};