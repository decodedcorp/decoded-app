'use client';

import React, { forwardRef, useState, useCallback } from 'react';
import Image from 'next/image';
import { useAdvancedImage, type UseAdvancedImageOptions } from '@/lib/hooks/useAdvancedImage';
import type { ImagePriority } from '@/lib/utils/enhancedImageLoader';

interface SuperiorImageProps {
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
  maxRetries?: number;
  retryDelay?: number;
  
  // 이벤트 핸들러
  onLoad?: () => void;
  onError?: (error: string) => void;
  onRetry?: (retryCount: number) => void;
  onSourceChange?: (source: string) => void;
  onQualityUpgrade?: (upgraded: any, original: any) => void;
  
  // 스타일 관련
  showLoadingSpinner?: boolean;
  showRetryButton?: boolean;
  showQualityIndicator?: boolean;
  loadingClassName?: string;
  errorClassName?: string;
  
  // Next.js Image 사용 여부 (기본값: true)
  useNextImage?: boolean;
}

/**
 * Superior Image Component - AI 콘텐츠용 최고급 이미지 시스템
 * 
 * 특징:
 * - 다운로드된 이미지 최우선 사용
 * - 스마트 재시도 메커니즘
 * - 실시간 품질 업그레이드
 * - 네트워크 상태 기반 적응
 * - 포괄적인 에러 복구
 */
export const SuperiorImage = forwardRef<HTMLImageElement, SuperiorImageProps>(
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
      fallbackSrc,
      imageType = 'general',
      imagePriority = 'medium',
      containerWidth = width,
      containerHeight = height,
      maxRetries = 4,
      retryDelay = 800,
      onLoad,
      onError,
      onRetry,
      onSourceChange,
      onQualityUpgrade,
      showLoadingSpinner = true,
      showRetryButton = true,
      showQualityIndicator = false,
      loadingClassName = 'bg-zinc-800/30 border border-zinc-700/30 rounded-lg',
      errorClassName = 'bg-zinc-800/50 border border-zinc-700/50 rounded-lg',
      useNextImage = true,
      ...props
    },
    ref
  ) => {
    const [userTriggeredRetry, setUserTriggeredRetry] = useState(0);

    // 고급 이미지 로딩 훅 사용
    const {
      src: loadedSrc,
      status,
      source,
      retryCount,
      loadTime,
      error,
      isUpgraded,
      retry,
    } = useAdvancedImage(downloadedSrc, src, {
      fallbackUrl: fallbackSrc,
      imageType,
      containerWidth,
      containerHeight,
      priority: imagePriority,
      maxRetries,
      retryDelay,
      enableQualityUpgrade: true,
      enableSmartRetry: true,
      onSuccess: (result) => {
        onLoad?.();
        onSourceChange?.(result.source);
        
        if (process.env.NODE_ENV === 'development') {
          console.log(`[SuperiorImage] Loaded successfully from ${result.source}:`, {
            loadTime: result.loadTime,
            retryCount: result.retryCount,
            url: result.url,
            isUpgraded: isUpgraded,
          });
        }
      },
      onError: (errorMessage) => {
        onError?.(errorMessage);
        console.warn('[SuperiorImage] Loading failed:', errorMessage);
      },
      onQualityUpgrade: (upgraded, original) => {
        onQualityUpgrade?.(upgraded, original);
        
        if (process.env.NODE_ENV === 'development') {
          console.log('[SuperiorImage] Quality upgraded:', {
            from: original.source,
            to: upgraded.source,
          });
        }
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
                {status === 'retrying' ? `재시도 중... (${retryCount + 1}/${maxRetries})` : '고품질 로딩 중...'}
              </div>
              {retryCount > 0 && (
                <div className="text-xs text-zinc-500 mt-1">
                  스마트 재시도 적용됨
                </div>
              )}
            </>
          )}
        </div>
      );
    }

    // 모든 시도가 실패한 에러 상태
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
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          
          <div className="text-sm text-center mb-3">
            <div>고품질 이미지를 불러올 수 없습니다</div>
            {retryCount > 0 && (
              <div className="text-xs text-zinc-500 mt-1">
                스마트 재시도 {retryCount}번 후 실패
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

    // 성공적으로 로드된 이미지
    const imageElement = useNextImage ? (
      // Next.js Image 사용
      <Image
        ref={ref}
        src={loadedSrc}
        alt={alt}
        width={width}
        height={height}
        className={`transition-all duration-300 ${isUpgraded ? 'brightness-105' : ''} ${className}`}
        priority={imagePriority === 'high' || priority}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        sizes={sizes}
        fill={fill}
        quality={quality}
        loading={imagePriority === 'high' ? 'eager' : loading}
        {...props}
      />
    ) : (
      // 일반 img 태그 사용
      <img
        ref={ref}
        src={loadedSrc}
        alt={alt}
        width={width}
        height={height}
        className={`transition-all duration-300 ${isUpgraded ? 'brightness-105' : ''} ${className}`}
        loading={imagePriority === 'high' ? 'eager' : loading}
        {...props}
      />
    );

    return (
      <div className="relative overflow-hidden">
        {imageElement}
        
        {/* 품질 업그레이드 표시 */}
        {showQualityIndicator && isUpgraded && (
          <div className="absolute top-2 right-2 bg-green-600/80 text-white text-xs px-2 py-1 rounded-full">
            HD
          </div>
        )}
        
        {/* 개발 환경에서 상세 정보 표시 */}
        {process.env.NODE_ENV === 'development' && (
          <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-2 py-1 rounded flex gap-1">
            <span className={`${source === 'downloaded' ? 'text-green-400' : source === 'proxy' ? 'text-blue-400' : 'text-yellow-400'}`}>
              {source}
            </span>
            {loadTime && <span>({loadTime}ms)</span>}
            {isUpgraded && <span className="text-green-400">↗HD</span>}
          </div>
        )}
      </div>
    );
  }
);

SuperiorImage.displayName = 'SuperiorImage';

// 편의 컴포넌트들 - 고품질 버전
export const HighQualityNewsImage = forwardRef<HTMLImageElement, Omit<SuperiorImageProps, 'imageType'>>(
  (props, ref) => (
    <SuperiorImage 
      ref={ref} 
      {...props} 
      imageType="news" 
      imagePriority="high" 
      quality={98}
      showQualityIndicator={true}
    />
  )
);
HighQualityNewsImage.displayName = 'HighQualityNewsImage';

export const PremiumAvatarImage = forwardRef<HTMLImageElement, Omit<SuperiorImageProps, 'imageType'>>(
  (props, ref) => (
    <SuperiorImage 
      ref={ref} 
      {...props} 
      imageType="avatar" 
      imagePriority="medium" 
      quality={95}
    />
  )
);
PremiumAvatarImage.displayName = 'PremiumAvatarImage';

export const OptimizedPreviewImage = forwardRef<HTMLImageElement, Omit<SuperiorImageProps, 'imageType'>>(
  (props, ref) => (
    <SuperiorImage 
      ref={ref} 
      {...props} 
      imageType="preview" 
      imagePriority="medium" 
      quality={92}
    />
  )
);
OptimizedPreviewImage.displayName = 'OptimizedPreviewImage';