import React, { forwardRef, useState } from 'react';

import Image from 'next/image';
import { getProxiedImageUrl } from '@/lib/utils/imageProxy';

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
      quality = 75,
      loading,
      onError,
      onLoad,
      fallbackSrc = '', // 기본 fallback 이미지
      downloadedSrc, // 백엔드에서 다운로드한 이미지 URL
      ...props
    },
    ref,
  ) => {
    const [hasError, setHasError] = useState(false);
    
    // 이미지 URL 우선순위: downloadedSrc > src > fallbackSrc
    const [currentSrc, setCurrentSrc] = useState<string>(() => {
      if (downloadedSrc && downloadedSrc.trim()) {
        return downloadedSrc;
      }
      return src;
    });

    // 이미지 URL 결정 로직
    const finalSrc = React.useMemo(() => {
      // downloadedSrc가 있으면 우선 사용 (백엔드에서 처리된 안전한 URL)
      if (downloadedSrc && downloadedSrc.trim() && currentSrc === downloadedSrc) {
        return downloadedSrc;
      }
      
      // R2 도메인 감지 (Cloudflare R2는 안전한 CDN이므로 proxy 우회)
      const isR2Domain = currentSrc.includes('.r2.dev') || currentSrc.includes('r2.cloudflarestorage.com');
      if (isR2Domain) {
        return currentSrc;
      }
      
      // 기존 프록시 로직 사용
      return getProxiedImageUrl(currentSrc);
    }, [currentSrc, downloadedSrc]);

    const handleError = () => {
      console.warn(`[ProxiedImage] Failed to load image: ${currentSrc}`);

      // downloadedSrc가 실패한 경우 원본 src로 폴백
      if (downloadedSrc && downloadedSrc.trim() && currentSrc === downloadedSrc && src !== downloadedSrc) {
        console.log(`[ProxiedImage] Downloaded image failed, switching to original src: ${src}`);
        setCurrentSrc(src);
        return;
      }

      // fallback 이미지가 있고 아직 시도하지 않았다면 fallback으로 전환
      if (!hasError && fallbackSrc && fallbackSrc.trim() && currentSrc !== fallbackSrc) {
        console.log(`[ProxiedImage] Switching to fallback image: ${fallbackSrc}`);
        setHasError(true);
        setCurrentSrc(fallbackSrc);
        return;
      }

      // fallback도 실패했거나 없다면 에러 상태로 설정
      setHasError(true);
      onError?.();
    };

    const handleLoad = () => {
      setHasError(false);
      onLoad?.();
    };

    // 에러 상태일 때 fallback UI 표시
    if (hasError && currentSrc === fallbackSrc) {
      return (
        <div
          className={`${className} bg-zinc-800/50 border border-zinc-700/50 rounded-lg flex flex-col items-center justify-center text-zinc-400`}
          style={{ width: width || '100%', height: height || '100%' }}
        >
          <svg className="w-8 h-8 mb-2 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-xs text-center">Image not available</span>
        </div>
      );
    }

    return (
      <Image
        ref={ref}
        src={finalSrc}
        alt={alt}
        width={width}
        height={height}
        className={className}
        priority={priority}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        sizes={sizes}
        fill={fill}
        quality={quality}
        loading={loading}
        onError={handleError}
        onLoad={handleLoad}
        {...props}
      />
    );
  },
);

ProxiedImage.displayName = 'ProxiedImage';
