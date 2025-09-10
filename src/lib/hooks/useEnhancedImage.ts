'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  enhancedImageLoader,
  type ImageLoadResult,
  type ImageLoadingOptions,
  type ImageStatus,
  type ImageSource,
} from '@/lib/utils/enhancedImageLoader';

export interface UseEnhancedImageOptions extends Partial<ImageLoadingOptions> {
  enabled?: boolean;
  onSuccess?: (result: ImageLoadResult) => void;
  onError?: (error: string) => void;
  onStatusChange?: (status: ImageStatus) => void;
}

export interface UseEnhancedImageReturn {
  src: string | null;
  status: ImageStatus;
  source: ImageSource | null;
  retryCount: number;
  loadTime?: number;
  error: string | null;
  retry: () => void;
  preload: () => Promise<boolean>;
}

export function useEnhancedImage(
  downloadedUrl: string | undefined,
  originalUrl: string,
  options: UseEnhancedImageOptions = {}
): UseEnhancedImageReturn {
  const {
    enabled = true,
    onSuccess,
    onError,
    onStatusChange,
    ...loadingOptions
  } = options;

  const [src, setSrc] = useState<string | null>(null);
  const [status, setStatus] = useState<ImageStatus>('loading');
  const [source, setSource] = useState<ImageSource | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [loadTime, setLoadTime] = useState<number | undefined>();
  const [error, setError] = useState<string | null>(null);
  
  const loadingRef = useRef<Promise<ImageLoadResult> | null>(null);
  const mountedRef = useRef(true);

  const updateState = useCallback((result: ImageLoadResult) => {
    if (!mountedRef.current) return;

    setSrc(result.url);
    setStatus(result.status);
    setSource(result.source);
    setRetryCount(result.retryCount);
    setLoadTime(result.loadTime);
    setError(result.error || null);

    // 콜백 호출
    onStatusChange?.(result.status);
    
    if (result.status === 'success') {
      onSuccess?.(result);
    } else if (result.status === 'error' && result.error) {
      onError?.(result.error);
    }
  }, [onSuccess, onError, onStatusChange]);

  const loadImage = useCallback(async () => {
    if (!enabled || !originalUrl) {
      return;
    }

    // 중복 로딩 방지
    if (loadingRef.current) {
      return loadingRef.current;
    }

    setStatus('loading');
    setError(null);

    const loadingPromise = enhancedImageLoader.loadImage({
      downloadedUrl,
      originalUrl,
      ...loadingOptions,
    });

    loadingRef.current = loadingPromise;

    try {
      const result = await loadingPromise;
      
      if (mountedRef.current) {
        updateState(result);
        
        // 개발 환경에서 로딩 정보 출력
        if (process.env.NODE_ENV === 'development') {
          console.log(`[useEnhancedImage] Loaded from ${result.source}:`, {
            url: result.url,
            loadTime: result.loadTime,
            retryCount: result.retryCount,
          });
        }
      }
      
      return result;
    } catch (err) {
      if (mountedRef.current) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setStatus('error');
        setError(errorMessage);
        onError?.(errorMessage);
      }
      throw err;
    } finally {
      if (mountedRef.current) {
        loadingRef.current = null;
      }
    }
  }, [enabled, downloadedUrl, originalUrl, loadingOptions, updateState, onError]);

  const retry = useCallback(() => {
    if (loadingRef.current) {
      loadingRef.current = null;
    }
    loadImage();
  }, [loadImage]);

  const preload = useCallback(async (): Promise<boolean> => {
    if (!originalUrl) return false;
    
    try {
      return await enhancedImageLoader.preloadImage(originalUrl);
    } catch {
      return false;
    }
  }, [originalUrl]);

  // 초기 로딩
  useEffect(() => {
    if (enabled && originalUrl) {
      loadImage();
    }

    return () => {
      mountedRef.current = false;
      loadingRef.current = null;
    };
  }, [loadImage, enabled, originalUrl]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return {
    src,
    status,
    source,
    retryCount,
    loadTime,
    error,
    retry,
    preload,
  };
}

// 이미지 배열을 위한 훅
export function useEnhancedImages(
  images: Array<{ downloadedUrl?: string; originalUrl: string }>,
  options: UseEnhancedImageOptions = {}
): Array<UseEnhancedImageReturn & { index: number }> {
  const [results, setResults] = useState<Array<UseEnhancedImageReturn & { index: number }>>([]);

  useEffect(() => {
    const loadAllImages = async () => {
      const loadPromises = images.map(async (image, index) => {
        const result = await enhancedImageLoader.loadImage({
          downloadedUrl: image.downloadedUrl,
          originalUrl: image.originalUrl,
          ...options,
        });

        return {
          src: result.url,
          status: result.status,
          source: result.source,
          retryCount: result.retryCount,
          loadTime: result.loadTime,
          error: result.error || null,
          retry: () => {
            // 개별 재시도 로직
            enhancedImageLoader.loadImage({
              downloadedUrl: image.downloadedUrl,
              originalUrl: image.originalUrl,
              ...options,
            });
          },
          preload: () => enhancedImageLoader.preloadImage(image.originalUrl),
          index,
        };
      });

      try {
        const loadedResults = await Promise.all(loadPromises);
        setResults(loadedResults);
      } catch (error) {
        console.error('[useEnhancedImages] Error loading images:', error);
      }
    };

    if (images.length > 0) {
      loadAllImages();
    }
  }, [images, options]);

  return results;
}

// 이미지 사전 로딩을 위한 훅
export function useImagePreloader() {
  const [preloadedUrls, setPreloadedUrls] = useState<Set<string>>(new Set());
  const [isPreloading, setIsPreloading] = useState(false);

  const preloadImages = useCallback(async (urls: string[]) => {
    setIsPreloading(true);
    
    try {
      const results = await Promise.all(
        urls.map(url => enhancedImageLoader.preloadImage(url))
      );

      const successful = urls.filter((_, index) => results[index]);
      setPreloadedUrls(prev => new Set([...prev, ...successful]));
      
      return results;
    } finally {
      setIsPreloading(false);
    }
  }, []);

  const clearPreloaded = useCallback(() => {
    setPreloadedUrls(new Set());
  }, []);

  return {
    preloadImages,
    preloadedUrls,
    isPreloading,
    clearPreloaded,
  };
}