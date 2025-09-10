'use client';

import React, { forwardRef, useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { RobustImageLoader, type RobustImageOptions } from '@/lib/utils/robustImageLoader';
import type { ImageLoadResult, ImageStatus, ImageSource } from '@/lib/utils/enhancedImageLoader';

interface UltraRobustImageProps {
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
  
  // 견고한 로딩 옵션
  imageType?: 'news' | 'avatar' | 'logo' | 'preview' | 'general';
  customFallbacks?: string[];
  maxRetries?: number;
  retryDelay?: number;
  enableDomainRotation?: boolean;
  enableFormatFallback?: boolean;
  enableCorsWorkaround?: boolean;
  
  // 이벤트 핸들러
  onLoad?: () => void;
  onError?: (error: string) => void;
  onRetry?: (retryCount: number) => void;
  onSourceChange?: (source: string) => void;
  
  // 스타일 관련
  showLoadingSpinner?: boolean;
  showRetryButton?: boolean;
  showSourceIndicator?: boolean;
  loadingClassName?: string;
  errorClassName?: string;
  
  // Next.js Image 사용 여부
  useNextImage?: boolean;
}

/**
 * Ultra Robust Image Component
 * 
 * 모든 실패 상황을 처리하는 최강 이미지 컴포넌트:
 * - 도메인 대안 시도
 * - CORS 우회
 * - 포맷 fallback  
 * - 커스텀 fallback
 * - 자동 재시도
 * - 로컬 SVG placeholder
 */
export const UltraRobustImage = forwardRef<HTMLImageElement, UltraRobustImageProps>(
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
      quality = 95,
      loading = 'lazy',
      imageType = 'general',
      customFallbacks = [],
      maxRetries = 3,
      retryDelay = 1000,
      enableDomainRotation = true,
      enableFormatFallback = true,
      enableCorsWorkaround = true,
      onLoad,
      onError,
      onRetry,
      onSourceChange,
      showLoadingSpinner = true,
      showRetryButton = true,
      showSourceIndicator = false,
      loadingClassName = 'bg-zinc-800/30 border border-zinc-700/30 rounded-lg',
      errorClassName = 'bg-zinc-800/50 border border-zinc-700/50 rounded-lg',
      useNextImage = true,
      ...props
    },
    ref
  ) => {
    const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
    const [status, setStatus] = useState<ImageStatus>('loading');
    const [source, setSource] = useState<ImageSource | null>(null);
    const [retryCount, setRetryCount] = useState(0);
    const [loadTime, setLoadTime] = useState<number | undefined>();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const loadImage = useCallback(async () => {
      if (isLoading) return;
      
      setIsLoading(true);
      setStatus('loading');
      setError(null);
      
      const startTime = Date.now();

      try {
        const result = await RobustImageLoader.loadWithFullFallback({
          downloadedUrl: downloadedSrc,
          originalUrl: src,
          imageType,
          containerWidth: width,
          containerHeight: height,
          customFallbacks,
          maxRetries,
          retryDelay,
          enableDomainRotation,
          enableFormatFallback,
          enableCorsWorkaround,
        });

        if (result.status === 'success') {
          setLoadedSrc(result.url);
          setStatus('success');
          setSource(result.source);
          setRetryCount(result.retryCount);
          setLoadTime(Date.now() - startTime);
          
          onLoad?.();
          onSourceChange?.(result.source);
          
          if (process.env.NODE_ENV === 'development') {
            console.log(`[UltraRobustImage] Successfully loaded from ${result.source}:`, {
              url: result.url,
              retryCount: result.retryCount,
              loadTime: Date.now() - startTime,
            });
          }
        } else {
          throw new Error(result.error || 'Failed to load image');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setStatus('error');
        setError(errorMessage);
        setRetryCount(prev => prev + 1);
        
        onError?.(errorMessage);
        
        console.warn('[UltraRobustImage] All loading methods failed:', errorMessage);
      } finally {
        setIsLoading(false);
      }
    }, [
      src,
      downloadedSrc,
      imageType,
      width,
      height,
      customFallbacks,
      maxRetries,
      retryDelay,
      enableDomainRotation,
      enableFormatFallback,
      enableCorsWorkaround,
      onLoad,
      onSourceChange,
      onError,
      isLoading
    ]);

    const handleManualRetry = useCallback(() => {
      onRetry?.(retryCount + 1);
      loadImage();
    }, [loadImage, retryCount, onRetry]);

    // 초기 로딩
    useEffect(() => {
      if (src) {
        loadImage();
      }
    }, [src]); // src 변경시에만 재로딩

    // 로딩 중 상태
    if (status === 'loading' || isLoading) {
      return (
        <div 
          className={`${loadingClassName} flex flex-col items-center justify-center relative ${className}`}
          style={{ 
            width: width || '100%', 
            height: height || '100%',
            minHeight: height || 200,
          }}
        >
          {showLoadingSpinner && (
            <>
              <div className="w-6 h-6 border-2 border-zinc-500 border-t-transparent rounded-full animate-spin mb-2" />
              <div className="text-xs text-zinc-400 text-center">
                견고한 로딩 중...
              </div>
              {retryCount > 0 && (
                <div className="text-xs text-zinc-500 mt-1">
                  재시도: {retryCount}번
                </div>
              )}
            </>
          )}
        </div>
      );
    }

    // 에러 상태 (최종 실패)
    if (status === 'error' || !loadedSrc) {
      return (
        <div 
          className={`${errorClassName} flex flex-col items-center justify-center text-zinc-400 p-4 relative ${className}`}
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
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          
          <div className="text-sm text-center mb-3">
            <div>이미지를 불러올 수 없습니다</div>
            <div className="text-xs text-zinc-500 mt-1">
              모든 로딩 방법 시도 완료
            </div>
            {retryCount > 0 && (
              <div className="text-xs text-zinc-500">
                총 {retryCount}번 재시도함
              </div>
            )}
          </div>
          
          {showRetryButton && (
            <button
              onClick={handleManualRetry}
              className="px-3 py-1.5 text-xs bg-zinc-700 hover:bg-zinc-600 text-zinc-300 rounded transition-colors"
              disabled={isLoading}
            >
              {isLoading ? '로딩 중...' : '다시 시도'}
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

    // 성공적으로 로드된 이미지
    const imageElement = useNextImage ? (
      <Image
        ref={ref}
        src={loadedSrc}
        alt={alt}
        width={width}
        height={height}
        className={`transition-all duration-300 ${className}`}
        priority={priority}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        sizes={sizes}
        fill={fill}
        quality={quality}
        loading={loading}
        {...props}
      />
    ) : (
      <img
        ref={ref}
        src={loadedSrc}
        alt={alt}
        width={width}
        height={height}
        className={`transition-all duration-300 ${className}`}
        loading={loading}
        {...props}
      />
    );

    return (
      <div className="relative overflow-hidden">
        {imageElement}
        
        {/* 소스 표시 */}
        {showSourceIndicator && source && (
          <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
            {source}
          </div>
        )}
        
        {/* 개발 환경에서 상세 정보 표시 */}
        {process.env.NODE_ENV === 'development' && (
          <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-2 py-1 rounded flex gap-1">
            <span className={`${
              source === 'downloaded' ? 'text-green-400' : 
              source === 'proxy' ? 'text-blue-400' : 
              source === 'original' ? 'text-yellow-400' : 
              'text-red-400'
            }`}>
              {source}
            </span>
            {loadTime && <span>({loadTime}ms)</span>}
            {retryCount > 0 && <span className="text-orange-400">R{retryCount}</span>}
          </div>
        )}
      </div>
    );
  }
);

UltraRobustImage.displayName = 'UltraRobustImage';

// 편의 컴포넌트들
export const BulletproofNewsImage = forwardRef<HTMLImageElement, Omit<UltraRobustImageProps, 'imageType'>>(
  (props, ref) => (
    <UltraRobustImage 
      ref={ref} 
      {...props} 
      imageType="news"
      enableDomainRotation={true}
      enableCorsWorkaround={true}
      customFallbacks={[
        'https://via.placeholder.com/600x400/374151/9CA3AF?text=News+Image'
      ]}
    />
  )
);
BulletproofNewsImage.displayName = 'BulletproofNewsImage';

export const FailsafeAvatarImage = forwardRef<HTMLImageElement, Omit<UltraRobustImageProps, 'imageType'>>(
  (props, ref) => (
    <UltraRobustImage 
      ref={ref} 
      {...props} 
      imageType="avatar"
      enableDomainRotation={true}
      customFallbacks={[
        'https://via.placeholder.com/200x200/374151/9CA3AF?text=Avatar'
      ]}
    />
  )
);
FailsafeAvatarImage.displayName = 'FailsafeAvatarImage';