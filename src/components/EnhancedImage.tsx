'use client';

import React, { forwardRef, useState, useCallback } from 'react';
import Image from 'next/image';
import { useEnhancedImage, type UseEnhancedImageOptions } from '@/lib/hooks/useEnhancedImage';
import { type ImagePriority } from '@/lib/utils/enhancedImageLoader';

interface EnhancedImageProps {
  // 필수 props
  src: string;
  alt: string;
  
  // 백엔드 다운로드 이미지 URL (최우선)
  downloadedSrc?: string;
  
  // Next.js Image props
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  sizes?: string;
  fill?: boolean;
  quality?: number;
  loading?: 'lazy' | 'eager';
  
  // 커스텀 props
  fallbackSrc?: string;
  imageType?: 'news' | 'avatar' | 'logo' | 'preview' | 'general';
  imagePriority?: ImagePriority;
  containerWidth?: number;
  containerHeight?: number;
  enableProgressive?: boolean;
  enablePreload?: boolean;
  maxRetries?: number;
  retryDelay?: number;
  
  // 이벤트 핸들러
  onLoad?: () => void;
  onError?: (error: string) => void;
  onRetry?: (retryCount: number) => void;
  onSourceChange?: (source: string) => void;
  
  // 스타일 관련
  showLoadingSpinner?: boolean;
  showRetryButton?: boolean;
  loadingClassName?: string;
  errorClassName?: string;
  
  // Next.js Image 사용 여부 (기본값: true)
  useNextImage?: boolean;
}

/**
 * 강화된 이미지 컴포넌트 - AI 생성 콘텐츠용 최적화
 * 
 * 특징:
 * - 다운로드된 이미지 우선 사용
 * - 지능적인 fallback 시스템
 * - 재시도 메커니즘 내장
 * - 진보적 품질 향상
 * - 사전 로딩 지원
 */
export const EnhancedImage = forwardRef<HTMLImageElement, EnhancedImageProps>(
  (
    {
      src,
      alt,
      downloadedSrc,
      width,
      height,
      className,
      priority = false,
      placeholder = 'empty',
      blurDataURL,
      sizes,
      fill = false,
      quality = 95, // 90 -> 95로 기본 품질 향상
      loading = 'lazy',
      fallbackSrc,
      imageType = 'general',
      imagePriority = 'medium',
      containerWidth = width,
      containerHeight = height,
      enableProgressive = true,
      enablePreload = false,
      maxRetries = 4, // 3 -> 4로 재시도 횟수 증가
      retryDelay = 800, // 1000 -> 800으로 지연 시간 단축
      onLoad,
      onError,
      onRetry,
      onSourceChange,
      showLoadingSpinner = true,
      showRetryButton = true,
      loadingClassName = 'bg-zinc-800/30 border border-zinc-700/30 rounded-lg',
      errorClassName = 'bg-zinc-800/50 border border-zinc-700/50 rounded-lg',
      useNextImage = true,
      ...props
    },
    ref
  ) => {
    const [userTriggeredRetry, setUserTriggeredRetry] = useState(0);

    // 강화된 이미지 로딩 훅 사용
    const {
      src: loadedSrc,
      status,
      source,
      retryCount,
      loadTime,
      error,
      retry,
    } = useEnhancedImage(downloadedSrc, src, {
      fallbackUrl: fallbackSrc,
      imageType,
      containerWidth,
      containerHeight,
      priority: imagePriority,
      maxRetries,
      retryDelay,
      preload: enablePreload,
      enableProgressive,
      onSuccess: (result) => {
        onLoad?.();
        onSourceChange?.(result.source);
        
        if (process.env.NODE_ENV === 'development') {
          console.log(`[EnhancedImage] Loaded successfully from ${result.source}:`, {
            loadTime: result.loadTime,
            retryCount: result.retryCount,
            url: result.url,
          });
        }
      },
      onError: (errorMessage) => {
        onError?.(errorMessage);
        console.warn('[EnhancedImage] Loading failed:', errorMessage);
      },
    });

    // 사용자가 수동으로 재시도 버튼을 클릭했을 때
    const handleManualRetry = useCallback(() => {
      setUserTriggeredRetry(prev => prev + 1);
      onRetry?.(retryCount + 1);
      retry();
    }, [retry, retryCount, onRetry]);

    // 로딩 중 상태
    if (status === 'loading' || status === 'retrying') {
      return (
        <div 
          className={`${loadingClassName} flex flex-col items-center justify-center ${className}`}
          style={{ 
            width: width || '100%', 
            height: height || '100%',
            minHeight: height || 200,
          }}
        >
          {showLoadingSpinner && (
            <>
              <div className="w-6 h-6 border-2 border-zinc-500 border-t-transparent rounded-full animate-spin mb-2" />
              <div className="text-xs text-zinc-400">
                {status === 'retrying' ? `재시도 중... (${retryCount + 1}/${maxRetries})` : '로딩 중...'}
              </div>
            </>
          )}
        </div>
      );
    }

    // 모든 시도가 실패한 에러 상태
    if (status === 'error' || !loadedSrc) {
      return (
        <div 
          className={`${errorClassName} flex flex-col items-center justify-center text-zinc-400 p-4 ${className}`}
          style={{ 
            width: width || '100%', 
            height: height || '100%',
            minHeight: height || 200,
          }}
        >
          <svg
            className="w-8 h-8 text-zinc-500 mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          
          <div className="text-sm text-center mb-3">
            <div>이미지를 불러올 수 없습니다</div>
            {retryCount > 0 && (
              <div className="text-xs text-zinc-500 mt-1">
                {retryCount}번 재시도 후 실패
              </div>
            )}
          </div>
          
          {showRetryButton && retryCount < maxRetries && (
            <button
              onClick={handleManualRetry}
              className="px-3 py-1.5 text-xs bg-zinc-700 hover:bg-zinc-600 text-zinc-300 rounded transition-colors"
            >
              다시 시도
            </button>
          )}
          
          {process.env.NODE_ENV === 'development' && error && (
            <div className="text-xs text-red-400 mt-2 max-w-full overflow-hidden text-ellipsis">
              {error}
            </div>
          )}
        </div>
      );
    }

    // Next.js Image 컴포넌트 사용
    if (useNextImage) {
      // Next.js Image 호환성 개선: 더 많은 도메인 지원
      const isNextImageCompatible = loadedSrc.startsWith('/') || 
        loadedSrc.includes(process.env.NEXT_PUBLIC_APP_URL || 'localhost') ||
        source === 'downloaded' || // 다운로드된 이미지는 대부분 안전
        loadedSrc.includes('r2.dev') || // R2 CDN
        loadedSrc.includes('cloudflare');

      if (isNextImageCompatible) {
        return (
          <div className="relative overflow-hidden">
            <Image
              ref={ref}
              src={loadedSrc}
              alt={alt}
              width={width}
              height={height}
              className={`transition-opacity duration-300 ${className}`}
              priority={imagePriority === 'high' || priority}
              placeholder={placeholder}
              blurDataURL={blurDataURL}
              sizes={sizes}
              fill={fill}
              quality={quality}
              loading={imagePriority === 'high' ? 'eager' : loading}
              {...props}
            />
            
            {/* 소스 정보 표시 (개발 환경) */}
            {process.env.NODE_ENV === 'development' && (
              <div className="absolute top-1 right-1 bg-black/70 text-white text-xs px-1 py-0.5 rounded">
                {source} {loadTime && `(${loadTime}ms)`}
              </div>
            )}
          </div>
        );
      }
    }

    // 일반 img 태그 사용 (도메인 제한 없음)
    return (
      <div className="relative overflow-hidden">
        <img
          ref={ref}
          src={loadedSrc}
          alt={alt}
          width={width}
          height={height}
          className={`transition-opacity duration-300 ${className}`}
          loading={imagePriority === 'high' ? 'eager' : loading}
          {...props}
        />
        
        {/* 소스 정보 표시 (개발 환경) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="absolute top-1 right-1 bg-black/70 text-white text-xs px-1 py-0.5 rounded">
            {source} {loadTime && `(${loadTime}ms)`}
          </div>
        )}
      </div>
    );
  }
);

EnhancedImage.displayName = 'EnhancedImage';

// 편의 컴포넌트들
export const NewsImage = forwardRef<HTMLImageElement, Omit<EnhancedImageProps, 'imageType'>>(
  (props, ref) => (
    <EnhancedImage ref={ref} {...props} imageType="news" imagePriority="high" />
  )
);
NewsImage.displayName = 'NewsImage';

export const AvatarImage = forwardRef<HTMLImageElement, Omit<EnhancedImageProps, 'imageType'>>(
  (props, ref) => (
    <EnhancedImage ref={ref} {...props} imageType="avatar" imagePriority="medium" />
  )
);
AvatarImage.displayName = 'AvatarImage';

export const PreviewImage = forwardRef<HTMLImageElement, Omit<EnhancedImageProps, 'imageType'>>(
  (props, ref) => (
    <EnhancedImage ref={ref} {...props} imageType="preview" imagePriority="low" />
  )
);
PreviewImage.displayName = 'PreviewImage';