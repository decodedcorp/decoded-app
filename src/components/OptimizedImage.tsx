'use client';

import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { optimizeImageUrl, createImageObserver, imageCache } from '@/lib/utils/imageOptimization';
import { isValidImageUrl } from '@/lib/utils/imageUtils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  quality?: number;
  className?: string;
  loading?: 'lazy' | 'eager';
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
  useNextImage?: boolean; // Next.js Image 사용 여부
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  quality = 80,
  className = '',
  loading = 'lazy',
  placeholder,
  onLoad,
  onError,
  useNextImage = true, // 기본값은 Next.js Image 사용
}) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(loading === 'eager');
  const [hasError, setHasError] = useState(false);

  // 최적화된 이미지 URL 생성
  const optimizedSrc = React.useMemo(() => {
    const optimized = optimizeImageUrl(src, { width, height, quality });
    if (process.env.NODE_ENV === 'development') {
      console.log('[OptimizedImage] Original src:', src);
      console.log('[OptimizedImage] Optimized src:', optimized);
    }
    return optimized;
  }, [src, width, height, quality]);

  // Intersection Observer 설정
  useEffect(() => {
    if (loading === 'eager' || !imgRef.current) {
      if (process.env.NODE_ENV === 'development') {
        console.log('[OptimizedImage] Skipping observer setup:', {
          loading,
          hasRef: !!imgRef.current,
        });
      }
      return;
    }

    const observer = createImageObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (process.env.NODE_ENV === 'development') {
              console.log('[OptimizedImage] Image in view:', optimizedSrc);
            }
            setIsInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '100px' }, // 더 넓은 마진으로 조정
    );

    observer.observe(imgRef.current);

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, [loading, optimizedSrc]);

  // 이미지 로딩 처리
  const handleLoad = () => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[OptimizedImage] Image loaded successfully:', optimizedSrc);
    }
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    if (process.env.NODE_ENV === 'development') {
      console.error('[OptimizedImage] Image failed to load:', optimizedSrc);
    }
    setHasError(true);
    onError?.();
  };

  // 캐시된 이미지 확인
  useEffect(() => {
    if (isInView && imageCache.has(optimizedSrc)) {
      if (process.env.NODE_ENV === 'development') {
        console.log('[OptimizedImage] Using cached image:', optimizedSrc);
      }
      setIsLoaded(true);
    }
  }, [isInView, optimizedSrc]);

  // 지연 로딩 대신 즉시 로딩으로 폴백
  useEffect(() => {
    if (loading === 'lazy' && !isInView) {
      // 1초 후에도 화면에 들어오지 않으면 강제로 로딩 시작
      const timer = setTimeout(() => {
        if (process.env.NODE_ENV === 'development') {
          console.log('[OptimizedImage] Force loading after timeout:', optimizedSrc);
        }
        setIsInView(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [loading, isInView, optimizedSrc]);

  if (process.env.NODE_ENV === 'development') {
    console.log('[OptimizedImage] Render state:', {
      src: optimizedSrc,
      isInView,
      isLoaded,
      hasError,
      loading,
      useNextImage,
    });
  }

  // Next.js Image 사용 (도메인 제한 있음)
  if (useNextImage && isValidImageUrl(optimizedSrc)) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        {/* 플레이스홀더 */}
        {!isLoaded && !hasError && placeholder && (
          <div
            className="absolute inset-0 bg-zinc-800 animate-pulse"
            style={{ backgroundImage: `url(${placeholder})`, backgroundSize: 'cover' }}
          />
        )}

        {/* 에러 상태 */}
        {hasError && (
          <div className="absolute inset-0 bg-zinc-800 flex items-center justify-center">
            <div className="text-zinc-400 text-sm">Failed to load image</div>
          </div>
        )}

        {/* Next.js Image */}
        {isInView && !hasError && (
          <Image
            src={optimizedSrc}
            alt={alt}
            width={width}
            height={height}
            className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={handleLoad}
            onError={handleError}
            loading={loading}
            quality={quality}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          />
        )}

        {/* 로딩 스켈레톤 */}
        {!isLoaded && !hasError && !placeholder && (
          <div className="absolute inset-0 bg-zinc-800 animate-pulse" />
        )}
      </div>
    );
  }

  // 일반 img 태그 사용 (도메인 제한 없음)
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* 플레이스홀더 */}
      {!isLoaded && !hasError && placeholder && (
        <div
          className="absolute inset-0 bg-zinc-800 animate-pulse"
          style={{ backgroundImage: `url(${placeholder})`, backgroundSize: 'cover' }}
        />
      )}

      {/* 에러 상태 */}
      {hasError && (
        <div className="absolute inset-0 bg-zinc-800 flex items-center justify-center">
          <div className="text-zinc-400 text-sm">Failed to load image</div>
        </div>
      )}

      {/* 일반 img 태그 */}
      {isInView && !hasError && (
        <img
          ref={imgRef}
          src={optimizedSrc}
          alt={alt}
          width={width}
          height={height}
          className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={handleLoad}
          onError={handleError}
          loading={loading}
        />
      )}

      {/* 로딩 스켈레톤 */}
      {!isLoaded && !hasError && !placeholder && (
        <div className="absolute inset-0 bg-zinc-800 animate-pulse" />
      )}
    </div>
  );
};

// 지연 로딩 이미지 컴포넌트
export const LazyImage: React.FC<Omit<OptimizedImageProps, 'loading'>> = (props) => {
  return <OptimizedImage {...props} loading="lazy" />;
};

// 즉시 로딩 이미지 컴포넌트
export const EagerImage: React.FC<Omit<OptimizedImageProps, 'loading'>> = (props) => {
  return <OptimizedImage {...props} loading="eager" />;
};

// 도메인 제한 없는 이미지 컴포넌트
export const UnrestrictedImage: React.FC<Omit<OptimizedImageProps, 'useNextImage'>> = (props) => {
  return <OptimizedImage {...props} useNextImage={false} />;
};
