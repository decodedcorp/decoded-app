/**
 * Optimized Image Component
 *
 * Enhanced image loading with intelligent optimization, lazy loading, and performance monitoring.
 * Provides better user experience with progressive loading and error handling.
 */

'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';
import { useIntersectionObserver } from '@/lib/hooks/useIntersectionObserver';

interface OptimizedImageProps extends Omit<ImageProps, 'onLoad' | 'onError'> {
  fallbackSrc?: string;
  showSkeleton?: boolean;
  skeletonClassName?: string;
  loadingStrategy?: 'lazy' | 'eager' | 'viewport';
  preloadPriority?: 'high' | 'medium' | 'low';
  onLoadComplete?: (result: { naturalWidth: number; naturalHeight: number }) => void;
  onError?: (error: string) => void;
  errorComponent?: React.ComponentType<{ error: string; retry: () => void }>;
  enableMetrics?: boolean;
  blurDataURL?: string;
  placeholder?: 'blur' | 'empty';
}

const ImageSkeleton = ({ className = '' }: { className?: string }) => (
  <div className={`animate-pulse bg-zinc-800 rounded ${className}`}>
    <div className="w-full h-full bg-zinc-700 rounded flex items-center justify-center">
      <svg className="w-8 h-8 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    </div>
  </div>
);

const DefaultErrorComponent = ({ error, retry }: { error: string; retry: () => void }) => (
  <div className="w-full h-full bg-zinc-900 rounded flex flex-col items-center justify-center p-4 text-center">
    <svg className="w-8 h-8 text-zinc-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <p className="text-xs text-zinc-500 mb-2">Failed to load image</p>
    <button
      onClick={retry}
      className="text-xs px-2 py-1 bg-zinc-700 hover:bg-zinc-600 text-zinc-300 rounded transition-colors"
    >
      Retry
    </button>
  </div>
);

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  fallbackSrc,
  showSkeleton = true,
  skeletonClassName = '',
  loadingStrategy = 'viewport',
  preloadPriority = 'medium',
  onLoadComplete,
  onError,
  errorComponent: ErrorComponent = DefaultErrorComponent,
  enableMetrics = false,
  blurDataURL,
  placeholder = 'blur',
  className = '',
  alt,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);
  const [shouldLoad, setShouldLoad] = useState(loadingStrategy === 'eager');
  const loadStartTime = useRef<number | undefined>(undefined);
  const imgRef = useRef<HTMLImageElement>(null);

  // Intersection observer for viewport-based loading
  const { isIntersecting } = useIntersectionObserver(imgRef as React.RefObject<Element>, {
    threshold: 0.1,
    rootMargin: '100px', // Start loading 100px before entering viewport
    enabled: loadingStrategy === 'viewport',
  });

  // Trigger loading when in viewport
  useEffect(() => {
    if (loadingStrategy === 'viewport' && isIntersecting && !shouldLoad) {
      setShouldLoad(true);
    }
  }, [isIntersecting, loadingStrategy, shouldLoad]);

  // Trigger loading for lazy strategy
  useEffect(() => {
    if (loadingStrategy === 'lazy') {
      const timer = setTimeout(() => setShouldLoad(true), 100);
      return () => clearTimeout(timer);
    }
  }, [loadingStrategy]);

  // Preload based on priority
  useEffect(() => {
    if (preloadPriority === 'high' && typeof src === 'string') {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);

      return () => {
        try {
          document.head.removeChild(link);
        } catch (e) {
          // Ignore if already removed
        }
      };
    }
  }, [src, preloadPriority]);

  // Performance metrics
  const markLoadStart = useCallback(() => {
    if (enableMetrics) {
      loadStartTime.current = performance.now();
    }
  }, [enableMetrics]);

  const markLoadEnd = useCallback((success: boolean) => {
    if (enableMetrics && loadStartTime.current) {
      const loadTime = performance.now() - loadStartTime.current;
      console.log(`📸 Image ${success ? 'loaded' : 'failed'} in ${loadTime.toFixed(2)}ms:`, src);

      // Report to analytics if available
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'image_load', {
          load_time: Math.round(loadTime),
          success,
          image_src: typeof src === 'string' ? src.substring(0, 100) : 'unknown',
        });
      }
    }
  }, [enableMetrics, src]);

  const handleLoad = useCallback((event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = event.currentTarget;
    setIsLoading(false);
    setHasError(false);
    markLoadEnd(true);

    onLoadComplete?.({
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
    });
  }, [onLoadComplete, markLoadEnd]);

  const handleError = useCallback(() => {
    markLoadEnd(false);

    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setHasError(false);
      setIsLoading(true);
      onError?.('Image failed to load, trying fallback');
    } else {
      setHasError(true);
      setIsLoading(false);
      onError?.('Image and fallback failed to load');
    }
  }, [fallbackSrc, currentSrc, markLoadEnd, onError]);

  const retry = useCallback(() => {
    setHasError(false);
    setIsLoading(true);
    setCurrentSrc(src);
    markLoadStart();
  }, [src, markLoadStart]);

  // Start metrics when loading begins
  useEffect(() => {
    if (shouldLoad && !hasError) {
      markLoadStart();
    }
  }, [shouldLoad, hasError, markLoadStart]);

  // Show skeleton while not ready to load or still loading
  if (!shouldLoad || (isLoading && showSkeleton && !hasError)) {
    return (
      <div ref={imgRef} className={`${className} ${skeletonClassName}`}>
        <ImageSkeleton className="w-full h-full" />
      </div>
    );
  }

  // Show error state
  if (hasError) {
    return (
      <div ref={imgRef} className={className}>
        <ErrorComponent error="Failed to load image" retry={retry} />
      </div>
    );
  }

  // Generate optimized blur data URL if not provided
  const optimizedBlurDataURL = blurDataURL || (placeholder === 'blur' ?
    `data:image/svg+xml;base64,${typeof Buffer !== 'undefined' ? Buffer.from(
      `<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#18181b"/>
        <rect width="100%" height="100%" fill="url(#gradient)" opacity="0.3"/>
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#27272a"/>
            <stop offset="100%" style="stop-color:#3f3f46"/>
          </linearGradient>
        </defs>
      </svg>`
    ).toString('base64') : btoa(`<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#18181b"/>
      </svg>`)}` : undefined
  );

  return (
    <div ref={imgRef} className={className}>
      <Image
        src={currentSrc}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        placeholder={placeholder}
        blurDataURL={optimizedBlurDataURL}
        quality={85} // Optimized quality for performance
        {...props}
        className="transition-opacity duration-300"
        style={{
          ...props.style,
          opacity: isLoading ? 0.7 : 1,
        }}
      />
    </div>
  );
};

// Hook for image preloading
export function useImagePreload(src: string, enabled = true) {
  const [isPreloaded, setIsPreloaded] = useState(false);

  useEffect(() => {
    if (!enabled || !src) return;

    const img = document.createElement('img');
    img.onload = () => setIsPreloaded(true);
    img.onerror = () => setIsPreloaded(false);
    img.src = src;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, enabled]);

  return isPreloaded;
}

// Batch image preloader
export class ImagePreloader {
  private static queue: string[] = [];
  private static loading = new Set<string>();
  private static loaded = new Set<string>();
  private static maxConcurrent = 3;

  static preload(urls: string | string[]) {
    const urlArray = Array.isArray(urls) ? urls : [urls];

    urlArray.forEach(url => {
      if (!this.loaded.has(url) && !this.loading.has(url) && !this.queue.includes(url)) {
        this.queue.push(url);
      }
    });

    this.processQueue();
  }

  private static processQueue() {
    while (this.queue.length > 0 && this.loading.size < this.maxConcurrent) {
      const url = this.queue.shift();
      if (!url) continue;

      this.loading.add(url);

      const img = document.createElement('img');
      img.onload = () => {
        this.loading.delete(url);
        this.loaded.add(url);
        console.log('📸 Image preloaded:', url);
        this.processQueue();
      };
      img.onerror = () => {
        this.loading.delete(url);
        console.warn('📸 Image preload failed:', url);
        this.processQueue();
      };
      img.src = url;
    }
  }

  static isLoaded(url: string): boolean {
    return this.loaded.has(url);
  }

  static clear() {
    this.queue.length = 0;
    this.loading.clear();
    this.loaded.clear();
  }
}

// Progressive image loading component
export const ProgressiveImage: React.FC<OptimizedImageProps & {
  lowQualitySrc?: string;
}> = ({ lowQualitySrc, ...props }) => {
  const [isHighQualityLoaded, setIsHighQualityLoaded] = useState(false);

  return (
    <div className="relative">
      {/* Low quality image (if provided) */}
      {lowQualitySrc && !isHighQualityLoaded && (
        <OptimizedImage
          {...props}
          src={lowQualitySrc}
          className={`${props.className} absolute inset-0`}
          quality={20}
          showSkeleton={false}
        />
      )}

      {/* High quality image */}
      <OptimizedImage
        {...props}
        onLoadComplete={(result) => {
          setIsHighQualityLoaded(true);
          props.onLoadComplete?.(result);
        }}
        style={{
          ...props.style,
          opacity: isHighQualityLoaded ? 1 : lowQualitySrc ? 0 : 1,
        }}
      />
    </div>
  );
};