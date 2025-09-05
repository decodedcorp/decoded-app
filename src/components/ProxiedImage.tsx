import React, { forwardRef, useState, useRef } from 'react';

import Image from 'next/image';
import { getProxiedImageUrl } from '@/lib/utils/imageProxy';
import { useAdaptiveImageLoading, useImagePriority } from '@/lib/hooks/useAdaptiveImageLoading';
import { getSmartFallback } from '@/lib/utils/defaultImages';

interface ProxiedImageProps {
  src: string;
  alt: string;
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
  onError?: () => void;
  onLoad?: () => void;
  fallbackSrc?: string; // fallback 이미지 URL 추가
  downloadedSrc?: string; // 백엔드에서 다운로드한 이미지 URL (downloaded_img_url)
  imagePriority?: 'high' | 'medium' | 'low'; // 이미지 로딩 우선순위
  containerWidth?: number; // 컨테이너 너비 (적응형 사이즈용)
  imageType?: 'news' | 'avatar' | 'logo' | 'preview' | 'general'; // 이미지 타입 (smart fallback용)
}

/**
 * 외부 이미지를 안전하게 표시하는 컴포넌트
 * 외부 URL을 자동으로 프록시를 통해 로드합니다.
 */
export const ProxiedImage = forwardRef<HTMLImageElement, ProxiedImageProps>(
  (
    {
      src,
      alt,
      width,
      height,
      className,
      priority = false,
      placeholder = 'empty',
      blurDataURL,
      sizes,
      fill = false,
      quality = 90, // 품질 우선 설정 (next.config.ts의 qualities에 포함된 값)
      loading,
      onError,
      onLoad,
      fallbackSrc, // 기본 fallback 이미지
      downloadedSrc, // 백엔드에서 다운로드한 이미지 URL
      imagePriority = 'medium', // 기본 우선순위
      containerWidth, // 컨테이너 너비
      imageType = 'general', // 이미지 타입
      ...props
    },
    ref,
  ) => {
    const [hasError, setHasError] = useState(false);
    const [retryCount, setRetryCount] = useState(0);
    const [isRetrying, setIsRetrying] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const maxRetries = 2; // 최대 재시도 횟수

    // 적응형 이미지 로딩 옵션
    const adaptiveOptions = useAdaptiveImageLoading(containerWidth);
    const shouldLoad = useImagePriority(imagePriority);

    // 이미지 URL 우선순위: downloadedSrc > src > fallbackSrc
    const [currentSrc, setCurrentSrc] = useState<string>(() => {
      if (downloadedSrc && downloadedSrc.trim()) {
        return downloadedSrc;
      }
      return src;
    });

    // 원본 URL 추적 (retry 타임스탬프 제거를 위해)
    const [originalSrc, setOriginalSrc] = useState<string>(() => {
      if (downloadedSrc && downloadedSrc.trim()) {
        return downloadedSrc;
      }
      return src;
    });

    // 이미지 URL 결정 로직
    const finalSrc = React.useMemo(() => {
      if (!shouldLoad) return ''; // 우선순위가 낮으면 로딩 지연

      // downloadedSrc가 있으면 우선 사용 (백엔드에서 처리된 안전한 URL)
      if (downloadedSrc && downloadedSrc.trim() && currentSrc === downloadedSrc) {
        return downloadedSrc;
      }

      // R2 도메인 감지 (Cloudflare R2는 안전한 CDN이므로 proxy 우회)
      const isR2Domain =
        currentSrc.includes('.r2.dev') || currentSrc.includes('r2.cloudflarestorage.com');
      if (isR2Domain) {
        return currentSrc;
      }

      // 적응형 옵션을 적용한 프록시 로직 사용
      return getProxiedImageUrl(currentSrc, {
        size: adaptiveOptions.size,
        quality: adaptiveOptions.quality,
        format: 'webp',
      });
    }, [currentSrc, downloadedSrc, shouldLoad, adaptiveOptions]);

    const handleError = () => {
      console.warn(
        `[ProxiedImage] Failed to load image: ${currentSrc} (retry: ${retryCount}/${maxRetries})`,
      );

      // 재시도 로직 (최대 횟수까지)
      if (retryCount < maxRetries && !isRetrying) {
        setIsRetrying(true);
        setRetryCount((prev) => prev + 1);

        // 잠시 대기 후 재시도 (백오프 방식)
        setTimeout(() => {
          setIsRetrying(false);
          // 강제로 이미지 새로고침을 위해 timestamp 추가
          const timestamp = Date.now();
          const separator = currentSrc.includes('?') ? '&' : '?';
          setCurrentSrc((prev) => prev + `${separator}_retry=${timestamp}`);
        }, 1000 * retryCount); // 지수적 백오프
        return;
      }

      // downloadedSrc가 실패한 경우 원본 src로 폴백
      if (
        downloadedSrc &&
        downloadedSrc.trim() &&
        originalSrc === downloadedSrc &&
        src !== downloadedSrc
      ) {
        console.log(
          `[ProxiedImage] Downloaded image failed after retries, switching to original src: ${src}`,
        );
        setCurrentSrc(src);
        setOriginalSrc(src);
        setRetryCount(0); // 재시도 카운터 리셋
        return;
      }

      // fallback 이미지가 있고 아직 시도하지 않았다면 fallback으로 전환
      const smartFallback = fallbackSrc || getSmartFallback(imageType, width || 300, height || 200);
      if (!hasError && smartFallback && currentSrc !== smartFallback) {
        console.log(
          `[ProxiedImage] Switching to ${
            fallbackSrc ? 'custom' : 'smart'
          } fallback image: ${smartFallback}`,
        );
        setHasError(true);
        setCurrentSrc(smartFallback);
        setRetryCount(0); // 재시도 카운터 리셋
        return;
      }

      // fallback도 실패했거나 없다면 에러 상태로 설정
      setHasError(true);
      onError?.();
    };

    const handleLoad = () => {
      setHasError(false);
      setRetryCount(0); // 성공하면 재시도 카운터 리셋
      setIsRetrying(false);
      onLoad?.();
    };

    // 에러 상태일 때 fallback UI 표시
    const smartFallback = fallbackSrc || getSmartFallback(imageType, width || 300, height || 200);
    if (hasError && currentSrc === smartFallback) {
      return (
        <div
          className={`${className} bg-zinc-800/50 border border-zinc-700/50 rounded-lg flex flex-col items-center justify-center text-zinc-400`}
          style={{ width: width || '100%', height: height || '100%' }}
        >
          <svg
            className="w-8 h-8 text-zinc-500"
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
        </div>
      );
    }

    // 로딩되지 않은 상태 또는 재시도 중일 때 플레이스홀더 표시
    if (!shouldLoad || !finalSrc || isRetrying) {
      return (
        <div
          ref={containerRef}
          className={`${className} bg-zinc-800/30 border border-zinc-700/30 rounded-lg flex flex-col items-center justify-center`}
          style={{ width: width || '100%', height: height || '100%' }}
        >
          <div className="w-4 h-4 border-2 border-zinc-500 border-t-transparent rounded-full animate-spin" />
        </div>
      );
    }

    // quality 값이 next.config.ts에 설정된 값인지 확인
    const validQualities = [25, 50, 75, 90, 95, 100];
    const safeQuality = validQualities.includes(quality) ? quality : 90;

    return (
      <Image
        ref={ref}
        src={finalSrc}
        alt={alt}
        width={width}
        height={height}
        className={className}
        priority={imagePriority === 'high' || priority}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        sizes={sizes}
        fill={fill}
        quality={safeQuality}
        loading={loading || (imagePriority === 'high' ? 'eager' : 'lazy')}
        onError={handleError}
        onLoad={handleLoad}
        {...props}
      />
    );
  },
);

ProxiedImage.displayName = 'ProxiedImage';
