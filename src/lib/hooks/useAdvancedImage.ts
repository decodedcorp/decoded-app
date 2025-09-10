'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { AdvancedImageLoader, type AdvancedImageOptions } from '@/lib/utils/advancedImageLoader';
import type { ImageLoadResult, ImageStatus, ImageSource } from '@/lib/utils/enhancedImageLoader';

export interface UseAdvancedImageOptions extends Partial<AdvancedImageOptions> {
  enabled?: boolean;
  onSuccess?: (result: ImageLoadResult) => void;
  onError?: (error: string) => void;
  onQualityUpgrade?: (upgraded: ImageLoadResult, original: ImageLoadResult) => void;
}

export interface UseAdvancedImageReturn {
  src: string | null;
  status: ImageStatus;
  source: ImageSource | null;
  retryCount: number;
  loadTime?: number;
  error: string | null;
  isUpgraded: boolean;
  retry: () => void;
}

export function useAdvancedImage(
  downloadedUrl: string | undefined,
  originalUrl: string,
  options: UseAdvancedImageOptions = {}
): UseAdvancedImageReturn {
  const {
    enabled = true,
    onSuccess,
    onError,
    onQualityUpgrade,
    ...loadingOptions
  } = options;

  const [src, setSrc] = useState<string | null>(null);
  const [status, setStatus] = useState<ImageStatus>('loading');
  const [source, setSource] = useState<ImageSource | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [loadTime, setLoadTime] = useState<number | undefined>();
  const [error, setError] = useState<string | null>(null);
  const [isUpgraded, setIsUpgraded] = useState(false);
  
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

    if (result.status === 'success') {
      onSuccess?.(result);
    } else if (result.status === 'error' && result.error) {
      onError?.(result.error);
    }
  }, [onSuccess, onError]);

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
    setIsUpgraded(false);

    const loadingPromise = AdvancedImageLoader.loadWithQualityPriority({
      downloadedUrl,
      originalUrl,
      enableQualityUpgrade: true,
      enableSmartRetry: true,
      ...loadingOptions,
    });

    loadingRef.current = loadingPromise;

    try {
      const result = await loadingPromise;
      
      if (mountedRef.current) {
        updateState(result);
        
        // 개발 환경에서 로딩 정보 출력
        if (process.env.NODE_ENV === 'development') {
          console.log(`[useAdvancedImage] Loaded from ${result.source}:`, {
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
    setIsUpgraded(false);
    loadImage();
  }, [loadImage]);

  // 품질 업그레이드 이벤트 리스너
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    const handleQualityUpgrade = (event: CustomEvent) => {
      const { upgraded, original } = event.detail;
      
      if (mountedRef.current && upgraded && original) {
        // 현재 이미지와 관련된 업그레이드인지 확인
        const isRelatedUpgrade = 
          original.url === src || 
          upgraded.url.includes(originalUrl) ||
          (downloadedUrl && upgraded.url.includes(downloadedUrl));

        if (isRelatedUpgrade) {
          setSrc(upgraded.url);
          setSource(upgraded.source);
          setIsUpgraded(true);
          
          onQualityUpgrade?.(upgraded, original);
          
          if (process.env.NODE_ENV === 'development') {
            console.log('[useAdvancedImage] Quality upgraded:', {
              from: original.source,
              to: upgraded.source,
              url: upgraded.url,
            });
          }
        }
      }
    };

    window.addEventListener('imageQualityUpgrade', handleQualityUpgrade as EventListener);
    
    return () => {
      window.removeEventListener('imageQualityUpgrade', handleQualityUpgrade as EventListener);
    };
  }, [enabled, src, originalUrl, downloadedUrl, onQualityUpgrade]);

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
    isUpgraded,
    retry,
  };
}

// 다중 이미지를 위한 고급 훅
export function useAdvancedImages(
  images: Array<{ downloadedUrl?: string; originalUrl: string }>,
  options: UseAdvancedImageOptions = {}
): Array<UseAdvancedImageReturn & { index: number }> {
  const [results, setResults] = useState<Array<UseAdvancedImageReturn & { index: number }>>([]);

  useEffect(() => {
    const loadAllImages = async () => {
      const loadPromises = images.map(async (image, index) => {
        const result = await AdvancedImageLoader.loadWithQualityPriority({
          downloadedUrl: image.downloadedUrl,
          originalUrl: image.originalUrl,
          enableQualityUpgrade: true,
          enableSmartRetry: true,
          ...options,
        });

        return {
          src: result.url,
          status: result.status,
          source: result.source,
          retryCount: result.retryCount,
          loadTime: result.loadTime,
          error: result.error || null,
          isUpgraded: false, // 초기값
          retry: () => {
            AdvancedImageLoader.loadWithQualityPriority({
              downloadedUrl: image.downloadedUrl,
              originalUrl: image.originalUrl,
              enableSmartRetry: true,
              ...options,
            });
          },
          index,
        };
      });

      try {
        const loadedResults = await Promise.all(loadPromises);
        setResults(loadedResults);
      } catch (error) {
        console.error('[useAdvancedImages] Error loading images:', error);
      }
    };

    if (images.length > 0) {
      loadAllImages();
    }
  }, [images, options]);

  return results;
}