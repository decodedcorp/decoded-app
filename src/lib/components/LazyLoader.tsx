/**
 * Enhanced Lazy Loading System
 *
 * Optimized component loading with intelligent fallbacks and performance monitoring.
 * Provides better user experience during component loading and code splitting.
 */

'use client';

import React, { Suspense, ComponentType, ReactNode, useState, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

// Loading skeleton components
export const ComponentSkeleton = ({ className = '' }: { className?: string }) => (
  <div className={`animate-pulse bg-zinc-800 rounded-lg ${className}`}>
    <div className="h-4 bg-zinc-700 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-zinc-700 rounded w-1/2"></div>
  </div>
);

export const PageSkeleton = () => (
  <div className="min-h-screen p-6 space-y-6">
    <div className="animate-pulse">
      {/* Header skeleton */}
      <div className="h-8 bg-zinc-700 rounded w-1/3 mb-6"></div>

      {/* Content skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-40 bg-zinc-800 rounded-xl"></div>
        ))}
      </div>
    </div>
  </div>
);

export const CardSkeleton = () => (
  <div className="animate-pulse bg-zinc-800 rounded-xl p-4 space-y-3">
    <div className="h-32 bg-zinc-700 rounded-lg"></div>
    <div className="h-4 bg-zinc-700 rounded w-3/4"></div>
    <div className="h-4 bg-zinc-700 rounded w-1/2"></div>
  </div>
);

export const ModalSkeleton = () => (
  <div className="animate-pulse bg-zinc-900 rounded-xl p-6 space-y-4">
    <div className="h-6 bg-zinc-700 rounded w-1/2"></div>
    <div className="space-y-2">
      <div className="h-4 bg-zinc-700 rounded"></div>
      <div className="h-4 bg-zinc-700 rounded w-5/6"></div>
      <div className="h-4 bg-zinc-700 rounded w-3/4"></div>
    </div>
    <div className="flex gap-3 pt-4">
      <div className="h-10 bg-zinc-700 rounded w-20"></div>
      <div className="h-10 bg-zinc-700 rounded w-20"></div>
    </div>
  </div>
);

// Enhanced loading fallback with timeout
interface LoadingFallbackProps {
  children: ReactNode;
  timeout?: number;
  onTimeout?: () => void;
}

export const LoadingFallback = ({
  children,
  timeout = 5000,
  onTimeout
}: LoadingFallbackProps) => {
  const [showTimeout, setShowTimeout] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTimeout(true);
      onTimeout?.();
    }, timeout);

    return () => clearTimeout(timer);
  }, [timeout, onTimeout]);

  if (showTimeout) {
    return (
      <div className="p-6 text-center text-zinc-400">
        <div className="mb-4">
          <svg className="w-12 h-12 mx-auto text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-lg font-medium mb-2">Loading is taking longer than expected</p>
        <p className="text-sm">Please check your connection or try refreshing the page.</p>
      </div>
    );
  }

  return <>{children}</>;
};

// Error fallback for failed component loads
interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
  componentName?: string;
}

export const ComponentErrorFallback = ({
  error,
  resetErrorBoundary,
  componentName = 'Component'
}: ErrorFallbackProps) => (
  <div className="p-6 text-center border border-red-800 bg-red-900/20 rounded-lg">
    <div className="mb-4">
      <svg className="w-12 h-12 mx-auto text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
    </div>
    <h3 className="text-lg font-medium text-red-400 mb-2">
      {componentName} Failed to Load
    </h3>
    <p className="text-sm text-red-300 mb-4">
      {error.message || 'An unexpected error occurred'}
    </p>
    <button
      onClick={resetErrorBoundary}
      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
    >
      Try Again
    </button>
  </div>
);

// Lazy component wrapper with enhanced error handling
interface LazyWrapperProps<T = {}> {
  component: () => Promise<{ default: ComponentType<T> }>;
  fallback?: ReactNode;
  errorFallback?: ComponentType<ErrorFallbackProps>;
  componentName?: string;
  timeout?: number;
  props?: T;
}

export function createLazyComponent<T extends {} = {}>({
  component,
  fallback = <ComponentSkeleton className="h-40" />,
  errorFallback: ErrorFallbackComponent = ComponentErrorFallback,
  componentName = 'Component',
  timeout = 5000,
}: Omit<LazyWrapperProps<T>, 'props'>) {
  const LazyComponent = React.lazy(component);

  return function WrappedLazyComponent(props: T) {
    return (
      <ErrorBoundary
        FallbackComponent={(errorProps: any) =>
          React.createElement(ErrorFallbackComponent, { ...errorProps, componentName })
        }
        onReset={() => window.location.reload()}
      >
        <Suspense fallback={
          <LoadingFallback
            timeout={timeout}
            onTimeout={() => console.warn(`${componentName} loading timeout`)}
          >
            {fallback}
          </LoadingFallback>
        }>
          <LazyComponent {...(props as any)} />
        </Suspense>
      </ErrorBoundary>
    );
  };
}

// Preload hook for manual component preloading
export function useComponentPreload<T>(
  componentLoader: () => Promise<{ default: ComponentType<T> }>
) {
  const preload = React.useCallback(() => {
    // Preload the component
    componentLoader().catch(error => {
      console.warn('Component preload failed:', error);
    });
  }, [componentLoader]);

  return preload;
}

// Performance monitoring for lazy loading
export const LazyLoadingMetrics = {
  loadStart: new Map<string, number>(),

  markLoadStart(componentName: string) {
    this.loadStart.set(componentName, performance.now());
  },

  markLoadEnd(componentName: string) {
    const startTime = this.loadStart.get(componentName);
    if (startTime) {
      const loadTime = performance.now() - startTime;
      console.log(`📊 Component ${componentName} loaded in ${loadTime.toFixed(2)}ms`);
      this.loadStart.delete(componentName);

      // Report to analytics if needed
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'component_load_time', {
          component_name: componentName,
          load_time: Math.round(loadTime),
        });
      }
    }
  },
};

// HOC for automatic performance tracking
export function withLoadingMetrics<T extends {}>(
  Component: ComponentType<T>,
  componentName: string
) {
  return function MetricsWrappedComponent(props: T) {
    useEffect(() => {
      LazyLoadingMetrics.markLoadStart(componentName);
      return () => {
        LazyLoadingMetrics.markLoadEnd(componentName);
      };
    }, []);

    return <Component {...props} />;
  };
}