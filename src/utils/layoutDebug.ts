// Layout debugging and testing utilities for the new Flex + Sticky system
'use client';

import type { LayoutDomain } from './layout';

export interface LayoutTestResult {
  domain: LayoutDomain;
  passed: boolean;
  issues: string[];
  metrics: {
    scrollContainerExists: boolean;
    sidebarsStickyWorking: boolean;
    containerQueriesSupported: boolean;
    cssVariablesApplied: boolean;
    mobileResponsive: boolean;
    infiniteScrollWorking: boolean;
  };
}

/**
 * Comprehensive layout system test
 */
export async function testLayoutSystem(): Promise<LayoutTestResult[]> {
  const domains: LayoutDomain[] = ['home', 'channel', 'search', 'profile'];
  const results: LayoutTestResult[] = [];

  for (const domain of domains) {
    results.push(await testLayoutDomain(domain));
  }

  return results;
}

/**
 * Test specific domain layout
 */
export async function testLayoutDomain(domain: LayoutDomain): Promise<LayoutTestResult> {
  const issues: string[] = [];
  const metrics = {
    scrollContainerExists: false,
    sidebarsStickyWorking: false,
    containerQueriesSupported: false,
    cssVariablesApplied: false,
    mobileResponsive: false,
    infiniteScrollWorking: false,
  };

  // Test 1: Scroll container exists
  const scrollContainer = document.querySelector('.content-wrapper');
  metrics.scrollContainerExists = !!scrollContainer;
  if (!scrollContainer) {
    issues.push('Content wrapper (.content-wrapper) not found');
  }

  // Test 2: Sidebars have sticky positioning
  const leftSidebar = document.querySelector('.sidebar-left');
  const rightSidebar = document.querySelector('.sidebar-right');

  if (leftSidebar) {
    const leftStyles = window.getComputedStyle(leftSidebar);
    const isSticky = leftStyles.position === 'sticky';
    metrics.sidebarsStickyWorking = isSticky;
    if (!isSticky) {
      issues.push('Left sidebar does not have sticky positioning');
    }
  }

  // Test 3: Container queries support
  metrics.containerQueriesSupported = CSS.supports('container-type: inline-size');
  if (!metrics.containerQueriesSupported) {
    issues.push('Container queries not supported in this browser');
  }

  // Test 4: CSS variables applied
  const layoutElement = document.querySelector('.layout');
  if (layoutElement) {
    const styles = window.getComputedStyle(layoutElement);
    const hasContentMaxWidth = styles.getPropertyValue('--content-max-width').trim() !== '';
    const hasGapMain = styles.getPropertyValue('--gap-main').trim() !== '';
    metrics.cssVariablesApplied = hasContentMaxWidth && hasGapMain;
    if (!metrics.cssVariablesApplied) {
      issues.push('CSS variables not properly applied to layout');
    }
  }

  // Test 5: Mobile responsive behavior
  const originalWidth = window.innerWidth;
  // Simulate mobile width
  Object.defineProperty(window, 'innerWidth', { value: 375, configurable: true });
  window.dispatchEvent(new Event('resize'));

  await new Promise(resolve => setTimeout(resolve, 100)); // Wait for responsive changes

  const leftSidebarVisible = leftSidebar && window.getComputedStyle(leftSidebar).display !== 'none';
  metrics.mobileResponsive = !leftSidebarVisible; // Should be hidden on mobile

  if (leftSidebarVisible) {
    issues.push('Sidebars not properly hidden on mobile');
  }

  // Restore original width
  Object.defineProperty(window, 'innerWidth', { value: originalWidth, configurable: true });
  window.dispatchEvent(new Event('resize'));

  // Test 6: Infinite scroll working (basic check)
  const infiniteLoader = document.querySelector('[data-testid="infinite-loader"]');
  metrics.infiniteScrollWorking = !!infiniteLoader;

  const passed = issues.length === 0;

  return {
    domain,
    passed,
    issues,
    metrics,
  };
}

/**
 * Visual layout debugger
 */
export class LayoutDebugger {
  private overlay: HTMLDivElement | null = null;
  private isActive = false;

  enable() {
    if (this.isActive) return;

    this.isActive = true;
    document.documentElement.setAttribute('data-layout-debug', '1');
    this.createOverlay();
    this.attachKeyboardShortcuts();
  }

  disable() {
    if (!this.isActive) return;

    this.isActive = false;
    document.documentElement.removeAttribute('data-layout-debug');
    this.removeOverlay();
    this.detachKeyboardShortcuts();
  }

  toggle() {
    if (this.isActive) {
      this.disable();
    } else {
      this.enable();
    }
  }

  private createOverlay() {
    this.overlay = document.createElement('div');
    this.overlay.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 16px;
      border-radius: 8px;
      font-family: monospace;
      font-size: 12px;
      z-index: 10000;
      max-width: 300px;
      backdrop-filter: blur(8px);
    `;

    this.updateOverlayContent();
    document.body.appendChild(this.overlay);
  }

  private updateOverlayContent() {
    if (!this.overlay) return;

    const layout = document.querySelector('.layout');
    const domain = layout?.getAttribute('data-domain') || 'unknown';
    const scrollContainer = document.querySelector('.content-wrapper');
    const styles = layout ? window.getComputedStyle(layout) : null;

    this.overlay.innerHTML = `
      <div style="margin-bottom: 12px; font-weight: bold; color: #eafd66;">
        🎯 Layout Debug - ${domain}
      </div>
      <div style="margin-bottom: 8px;">
        Domain: <span style="color: #60a5fa;">${domain}</span>
      </div>
      <div style="margin-bottom: 8px;">
        Max Width: <span style="color: #34d399;">${styles?.getPropertyValue('--content-max-width') || 'N/A'}</span>
      </div>
      <div style="margin-bottom: 8px;">
        Gap: <span style="color: #f59e0b;">${styles?.getPropertyValue('--gap-main') || 'N/A'}</span>
      </div>
      <div style="margin-bottom: 8px;">
        Scroll Container: <span style="color: ${scrollContainer ? '#10b981' : '#ef4444'}">${scrollContainer ? '✓' : '✗'}</span>
      </div>
      <div style="margin-bottom: 8px;">
        Container Queries: <span style="color: ${CSS.supports('container-type: inline-size') ? '#10b981' : '#ef4444'}">${CSS.supports('container-type: inline-size') ? '✓' : '✗'}</span>
      </div>
      <div style="margin-top: 12px; font-size: 10px; color: #9ca3af;">
        Press 'L' to toggle debug mode
      </div>
    `;
  }

  private removeOverlay() {
    if (this.overlay) {
      this.overlay.remove();
      this.overlay = null;
    }
  }

  private attachKeyboardShortcuts() {
    document.addEventListener('keydown', this.handleKeydown);
  }

  private detachKeyboardShortcuts() {
    document.removeEventListener('keydown', this.handleKeydown);
  }

  private handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'l' || event.key === 'L') {
      if (event.ctrlKey || event.metaKey) {
        event.preventDefault();
        this.toggle();
      }
    }
  };
}

/**
 * Performance monitoring for layout changes
 */
export class LayoutPerformanceMonitor {
  private observer: PerformanceObserver | null = null;
  private metrics: PerformanceEntry[] = [];

  start() {
    if (!('PerformanceObserver' in window)) {
      console.warn('PerformanceObserver not supported');
      return;
    }

    this.observer = new PerformanceObserver((list) => {
      this.metrics.push(...list.getEntries());
    });

    this.observer.observe({ entryTypes: ['layout-shift', 'paint', 'navigation'] });
  }

  stop() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }

  getMetrics() {
    return [...this.metrics];
  }

  getLayoutShiftScore() {
    return this.metrics
      .filter(entry => entry.entryType === 'layout-shift')
      .reduce((score, entry) => score + (entry as any).value, 0);
  }

  logReport() {
    console.group('🎯 Layout Performance Report');
    console.log('Layout Shift Score:', this.getLayoutShiftScore());
    console.log('Total Metrics:', this.metrics.length);
    console.log('Metrics by Type:',
      this.metrics.reduce((acc, entry) => {
        acc[entry.entryType] = (acc[entry.entryType] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    );
    console.groupEnd();
  }
}

// Global debug instance
export const layoutDebugger = new LayoutDebugger();
export const performanceMonitor = new LayoutPerformanceMonitor();

// Development mode auto-enable
if (process.env.NODE_ENV === 'development') {
  // Enable with Ctrl/Cmd + L
  document.addEventListener('keydown', (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'l') {
      event.preventDefault();
      layoutDebugger.toggle();
    }
  });
}