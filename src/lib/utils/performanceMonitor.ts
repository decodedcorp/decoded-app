/**
 * Global Performance Monitoring System
 *
 * Comprehensive performance monitoring with Core Web Vitals tracking,
 * navigation timing, and intelligent optimization recommendations.
 */

'use client';

// Performance metrics interface
export interface PerformanceMetrics {
  // Core Web Vitals
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift

  // Navigation Timing
  navigationStart?: number;
  domContentLoaded?: number;
  loadComplete?: number;

  // Custom Metrics
  routeChangeTime?: number;
  componentLoadTime?: number;
  apiResponseTime?: number;

  // Resource Metrics
  totalJSSize?: number;
  totalCSSSize?: number;
  totalImageSize?: number;

  // User Experience
  timeToInteractive?: number;
  firstContentfulPaint?: number;
}

export interface PerformanceThresholds {
  lcp: { good: number; needsImprovement: number };
  fid: { good: number; needsImprovement: number };
  cls: { good: number; needsImprovement: number };
  routeChange: { good: number; needsImprovement: number };
}

// Performance thresholds based on Core Web Vitals
export const PERFORMANCE_THRESHOLDS: PerformanceThresholds = {
  lcp: { good: 2500, needsImprovement: 4000 },
  fid: { good: 100, needsImprovement: 300 },
  cls: { good: 0.1, needsImprovement: 0.25 },
  routeChange: { good: 1000, needsImprovement: 2000 },
};

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {};
  private observers: Map<string, PerformanceObserver> = new Map();
  private routeChangeStart?: number;
  private isMonitoring = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initialize();
    }
  }

  private initialize() {
    // Initialize Core Web Vitals monitoring
    this.initializeCoreWebVitals();

    // Initialize navigation timing
    this.initializeNavigationTiming();

    // Initialize resource monitoring
    this.initializeResourceMonitoring();

    // Start monitoring
    this.isMonitoring = true;

    console.log('📊 Performance monitoring initialized');
  }

  private initializeCoreWebVitals() {
    // LCP (Largest Contentful Paint)
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as any;

          if (lastEntry) {
            this.metrics.lcp = lastEntry.startTime;
            this.reportMetric('lcp', lastEntry.startTime);
          }
        });

        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.set('lcp', lcpObserver);
      } catch (error) {
        console.warn('LCP observer not supported:', error);
      }

      // FID (First Input Delay)
      try {
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            if (entry.processingStart && entry.startTime) {
              const fid = entry.processingStart - entry.startTime;
              this.metrics.fid = fid;
              this.reportMetric('fid', fid);
            }
          });
        });

        fidObserver.observe({ entryTypes: ['first-input'] });
        this.observers.set('fid', fidObserver);
      } catch (error) {
        console.warn('FID observer not supported:', error);
      }

      // CLS (Cumulative Layout Shift) - requires manual calculation
      try {
        let clsScore = 0;
        const clsObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsScore += entry.value;
            }
          });

          this.metrics.cls = clsScore;
          this.reportMetric('cls', clsScore);
        });

        clsObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.set('cls', clsObserver);
      } catch (error) {
        console.warn('CLS observer not supported:', error);
      }
    }

    // Fallback for browsers without PerformanceObserver
    if ('performance' in window && 'getEntriesByType' in performance) {
      // Check for paint entries
      setTimeout(() => {
        const paintEntries = performance.getEntriesByType('paint');
        const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');

        if (fcpEntry) {
          this.metrics.firstContentfulPaint = fcpEntry.startTime;
          this.reportMetric('fcp', fcpEntry.startTime);
        }
      }, 1000);
    }
  }

  private initializeNavigationTiming() {
    if ('performance' in window && 'timing' in performance) {
      const timing = performance.timing;

      this.metrics.navigationStart = timing.navigationStart;

      // DOM Content Loaded
      if (timing.domContentLoadedEventEnd && timing.navigationStart) {
        this.metrics.domContentLoaded = timing.domContentLoadedEventEnd - timing.navigationStart;
      }

      // Load Complete
      if (timing.loadEventEnd && timing.navigationStart) {
        this.metrics.loadComplete = timing.loadEventEnd - timing.navigationStart;
      }

      console.log('📊 Navigation timing captured:', {
        domContentLoaded: this.metrics.domContentLoaded,
        loadComplete: this.metrics.loadComplete,
      });
    }
  }

  private initializeResourceMonitoring() {
    if ('PerformanceObserver' in window) {
      try {
        const resourceObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();

          let jsSize = 0;
          let cssSize = 0;
          let imageSize = 0;

          entries.forEach((entry: any) => {
            if (entry.transferSize) {
              if (entry.name.includes('.js') || entry.initiatorType === 'script') {
                jsSize += entry.transferSize;
              } else if (entry.name.includes('.css') || entry.initiatorType === 'css') {
                cssSize += entry.transferSize;
              } else if (entry.initiatorType === 'img' || /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(entry.name)) {
                imageSize += entry.transferSize;
              }
            }
          });

          this.metrics.totalJSSize = jsSize;
          this.metrics.totalCSSSize = cssSize;
          this.metrics.totalImageSize = imageSize;

          if (jsSize > 0 || cssSize > 0 || imageSize > 0) {
            console.log('📊 Resource sizes:', {
              js: `${(jsSize / 1024).toFixed(1)}KB`,
              css: `${(cssSize / 1024).toFixed(1)}KB`,
              images: `${(imageSize / 1024).toFixed(1)}KB`,
            });
          }
        });

        resourceObserver.observe({ entryTypes: ['resource'] });
        this.observers.set('resource', resourceObserver);
      } catch (error) {
        console.warn('Resource observer not supported:', error);
      }
    }
  }

  // Route change performance tracking
  markRouteChangeStart() {
    this.routeChangeStart = performance.now();
  }

  markRouteChangeEnd() {
    if (this.routeChangeStart) {
      const routeChangeTime = performance.now() - this.routeChangeStart;
      this.metrics.routeChangeTime = routeChangeTime;
      this.reportMetric('routeChange', routeChangeTime);
      this.routeChangeStart = undefined;
    }
  }

  // Component loading tracking
  markComponentLoadStart(componentName: string) {
    if (typeof window !== 'undefined') {
      (window as any)[`${componentName}_loadStart`] = performance.now();
    }
  }

  markComponentLoadEnd(componentName: string) {
    if (typeof window !== 'undefined') {
      const startTime = (window as any)[`${componentName}_loadStart`];
      if (startTime) {
        const loadTime = performance.now() - startTime;
        this.metrics.componentLoadTime = loadTime;
        this.reportMetric('componentLoad', loadTime, { componentName });
        delete (window as any)[`${componentName}_loadStart`];
      }
    }
  }

  // API response time tracking
  markApiStart(apiName: string) {
    if (typeof window !== 'undefined') {
      (window as any)[`${apiName}_apiStart`] = performance.now();
    }
  }

  markApiEnd(apiName: string, success: boolean = true) {
    if (typeof window !== 'undefined') {
      const startTime = (window as any)[`${apiName}_apiStart`];
      if (startTime) {
        const responseTime = performance.now() - startTime;
        this.metrics.apiResponseTime = responseTime;
        this.reportMetric('apiResponse', responseTime, { apiName, success });
        delete (window as any)[`${apiName}_apiStart`];
      }
    }
  }

  private reportMetric(metricName: string, value: number, metadata?: any) {
    const threshold = this.getThreshold(metricName);
    const status = this.getMetricStatus(value, threshold);

    const logMessage = `📊 ${metricName}: ${value.toFixed(2)}ms (${status})`;

    if (status === 'good') {
      console.log(`✅ ${logMessage}`, metadata);
    } else if (status === 'needs improvement') {
      console.warn(`⚠️ ${logMessage}`, metadata);
    } else {
      console.error(`❌ ${logMessage}`, metadata);
    }

    // Report to analytics if available
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'performance_metric', {
        metric_name: metricName,
        metric_value: Math.round(value),
        metric_status: status,
        ...metadata,
      });
    }
  }

  private getThreshold(metricName: string) {
    switch (metricName) {
      case 'lcp':
        return PERFORMANCE_THRESHOLDS.lcp;
      case 'fid':
        return PERFORMANCE_THRESHOLDS.fid;
      case 'cls':
        return PERFORMANCE_THRESHOLDS.cls;
      case 'routeChange':
        return PERFORMANCE_THRESHOLDS.routeChange;
      default:
        return { good: 1000, needsImprovement: 2000 };
    }
  }

  private getMetricStatus(value: number, threshold: { good: number; needsImprovement: number }) {
    if (value <= threshold.good) return 'good';
    if (value <= threshold.needsImprovement) return 'needs improvement';
    return 'poor';
  }

  // Get current metrics snapshot
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  // Generate performance report
  generateReport(): string {
    const metrics = this.getMetrics();

    let report = '📊 Performance Report\n';
    report += '═══════════════════\n\n';

    // Core Web Vitals
    if (metrics.lcp || metrics.fid || metrics.cls) {
      report += '🎯 Core Web Vitals:\n';
      if (metrics.lcp) {
        const lcpStatus = this.getMetricStatus(metrics.lcp, PERFORMANCE_THRESHOLDS.lcp);
        report += `  • LCP: ${metrics.lcp.toFixed(2)}ms (${lcpStatus})\n`;
      }
      if (metrics.fid) {
        const fidStatus = this.getMetricStatus(metrics.fid, PERFORMANCE_THRESHOLDS.fid);
        report += `  • FID: ${metrics.fid.toFixed(2)}ms (${fidStatus})\n`;
      }
      if (metrics.cls) {
        const clsStatus = this.getMetricStatus(metrics.cls, PERFORMANCE_THRESHOLDS.cls);
        report += `  • CLS: ${metrics.cls.toFixed(3)} (${clsStatus})\n`;
      }
      report += '\n';
    }

    // Navigation
    if (metrics.domContentLoaded || metrics.loadComplete) {
      report += '🚀 Navigation Timing:\n';
      if (metrics.domContentLoaded) {
        report += `  • DOM Content Loaded: ${metrics.domContentLoaded.toFixed(2)}ms\n`;
      }
      if (metrics.loadComplete) {
        report += `  • Load Complete: ${metrics.loadComplete.toFixed(2)}ms\n`;
      }
      report += '\n';
    }

    // Resources
    if (metrics.totalJSSize || metrics.totalCSSSize || metrics.totalImageSize) {
      report += '📦 Resource Sizes:\n';
      if (metrics.totalJSSize) {
        report += `  • JavaScript: ${(metrics.totalJSSize / 1024).toFixed(1)}KB\n`;
      }
      if (metrics.totalCSSSize) {
        report += `  • CSS: ${(metrics.totalCSSSize / 1024).toFixed(1)}KB\n`;
      }
      if (metrics.totalImageSize) {
        report += `  • Images: ${(metrics.totalImageSize / 1024).toFixed(1)}KB\n`;
      }
      report += '\n';
    }

    // Recommendations
    report += this.generateRecommendations();

    return report;
  }

  private generateRecommendations(): string {
    const metrics = this.getMetrics();
    const recommendations: string[] = [];

    // LCP recommendations
    if (metrics.lcp && metrics.lcp > PERFORMANCE_THRESHOLDS.lcp.good) {
      recommendations.push('• Optimize LCP: Consider image optimization, server response times, or removing render-blocking resources');
    }

    // FID recommendations
    if (metrics.fid && metrics.fid > PERFORMANCE_THRESHOLDS.fid.good) {
      recommendations.push('• Optimize FID: Break up long tasks, optimize JavaScript execution, or use web workers');
    }

    // CLS recommendations
    if (metrics.cls && metrics.cls > PERFORMANCE_THRESHOLDS.cls.good) {
      recommendations.push('• Optimize CLS: Add dimensions to images/videos, avoid inserting content above existing content');
    }

    // Resource size recommendations
    if (metrics.totalJSSize && metrics.totalJSSize > 500 * 1024) { // 500KB
      recommendations.push('• JavaScript bundle is large: Consider code splitting, tree shaking, or removing unused dependencies');
    }

    if (recommendations.length === 0) {
      return '✅ No major performance issues detected!\n';
    }

    return '💡 Recommendations:\n' + recommendations.join('\n') + '\n';
  }

  // Cleanup observers
  destroy() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
    this.isMonitoring = false;
    console.log('📊 Performance monitoring stopped');
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

// React hook for performance monitoring
export function usePerformanceMonitoring(enabled = true) {
  if (!enabled) return null;

  return {
    markRouteChangeStart: () => performanceMonitor.markRouteChangeStart(),
    markRouteChangeEnd: () => performanceMonitor.markRouteChangeEnd(),
    markComponentLoadStart: (name: string) => performanceMonitor.markComponentLoadStart(name),
    markComponentLoadEnd: (name: string) => performanceMonitor.markComponentLoadEnd(name),
    markApiStart: (name: string) => performanceMonitor.markApiStart(name),
    markApiEnd: (name: string, success?: boolean) => performanceMonitor.markApiEnd(name, success),
    getMetrics: () => performanceMonitor.getMetrics(),
    generateReport: () => performanceMonitor.generateReport(),
  };
}

// Navigation performance hook for Next.js
export function useNavigationPerformance() {
  const monitoring = usePerformanceMonitoring();

  // This would be used with Next.js router events
  // router.events.on('routeChangeStart', monitoring?.markRouteChangeStart);
  // router.events.on('routeChangeComplete', monitoring?.markRouteChangeEnd);

  return monitoring;
}