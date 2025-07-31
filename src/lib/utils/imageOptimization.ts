/**
 * 이미지 최적화 유틸리티
 */

import React from 'react';

interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'avif' | 'jpeg' | 'png';
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
}

/**
 * 이미지 URL을 최적화된 형태로 변환
 */
export const optimizeImageUrl = (
  originalUrl: string,
  options: ImageOptimizationOptions = {},
): string => {
  if (!originalUrl) return originalUrl;

  const { width, height, quality = 80, format = 'webp', fit = 'cover' } = options;

  // Unsplash 이미지 최적화
  if (originalUrl.includes('unsplash.com')) {
    try {
      const url = new URL(originalUrl);

      // 기존 파라미터 유지하면서 최적화
      if (width) url.searchParams.set('w', width.toString());
      if (height) url.searchParams.set('h', height.toString());
      url.searchParams.set('fit', fit);
      url.searchParams.set('q', quality.toString());

      // WebP 포맷 지원 확인 후 적용
      if (format === 'webp') {
        url.searchParams.set('fm', 'webp');
      }

      if (process.env.NODE_ENV === 'development') {
        console.log('[optimizeImageUrl] Optimized URL:', url.toString());
      }

      return url.toString();
    } catch (error) {
      console.error('[optimizeImageUrl] Error optimizing URL:', error);
      return originalUrl;
    }
  }

  // 일반 이미지 URL (CDN이나 다른 서비스)
  return originalUrl;
};

/**
 * 반응형 이미지 URL 생성
 */
export const getResponsiveImageUrl = (
  originalUrl: string,
  sizes: { width: number; height?: number }[],
): string[] => {
  return sizes.map(({ width, height }) => optimizeImageUrl(originalUrl, { width, height }));
};

/**
 * 이미지 지연 로딩을 위한 Intersection Observer 설정
 */
export const createImageObserver = (
  callback: (entries: IntersectionObserverEntry[]) => void,
  options: IntersectionObserverInit = {},
): IntersectionObserver => {
  const defaultOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: '50px', // 50px 전에 로딩 시작
    threshold: 0.1,
    ...options,
  };

  return new IntersectionObserver(callback, defaultOptions);
};

/**
 * 이미지 프리로딩
 */
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

/**
 * 이미지 캐시 관리
 */
class ImageCache {
  private cache = new Map<string, HTMLImageElement>();
  private maxSize = 50;

  set(key: string, image: HTMLImageElement): void {
    if (this.cache.size >= this.maxSize) {
      // LRU 캐시: 가장 오래된 항목 제거
      const firstKey = this.cache.keys().next().value;
      if (typeof firstKey === 'string') {
        this.cache.delete(firstKey);
      }
    }
    this.cache.set(key, image);
  }

  get(key: string): HTMLImageElement | undefined {
    return this.cache.get(key);
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }

  clear(): void {
    this.cache.clear();
  }
}

export const imageCache = new ImageCache();

/**
 * 이미지 로딩 상태 관리
 */
export const useImageLoading = (src: string) => {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    if (!src) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(false);

    const img = new Image();
    img.onload = () => {
      setLoading(false);
      imageCache.set(src, img);
    };
    img.onerror = () => {
      setLoading(false);
      setError(true);
    };
    img.src = src;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  return { loading, error };
};

/**
 * 이미지 압축 품질 추천
 */
export const getRecommendedImageQuality = (fileSize: number): number => {
  if (fileSize < 100 * 1024) return 90; // 100KB 미만
  if (fileSize < 500 * 1024) return 80; // 500KB 미만
  if (fileSize < 1024 * 1024) return 70; // 1MB 미만
  return 60; // 1MB 이상
};

/**
 * 이미지 크기 추천
 */
export const getRecommendedImageSize = (context: string): { width: number; height: number } => {
  switch (context) {
    case 'thumbnail':
      return { width: 300, height: 200 };
    case 'card':
      return { width: 400, height: 300 };
    case 'hero':
      return { width: 1200, height: 600 };
    case 'gallery':
      return { width: 800, height: 600 };
    default:
      return { width: 600, height: 400 };
  }
};

/**
 * 브라우저 지원 확인
 */
export const getSupportedImageFormat = (): 'webp' | 'avif' | 'jpeg' => {
  if (typeof window === 'undefined') return 'jpeg';

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) return 'jpeg';

  // AVIF 지원 확인
  if (canvas.toDataURL('image/avif').startsWith('data:image/avif')) {
    return 'avif';
  }

  // WebP 지원 확인
  if (canvas.toDataURL('image/webp').startsWith('data:image/webp')) {
    return 'webp';
  }

  return 'jpeg';
};
