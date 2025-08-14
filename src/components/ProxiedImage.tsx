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
      ...props
    },
    ref,
  ) => {
    const [hasError, setHasError] = useState(false);
    const [currentSrc, setCurrentSrc] = useState<string>(src);

    // 외부 이미지 URL을 프록시 URL로 변환
    const proxiedSrc = getProxiedImageUrl(currentSrc);

    const handleError = () => {
      console.warn(`[ProxiedImage] Failed to load image: ${currentSrc}`);

      // fallback 이미지가 있고 아직 시도하지 않았다면 fallback으로 전환
      if (!hasError && fallbackSrc && currentSrc !== fallbackSrc) {
        console.log(`[ProxiedImage] Switching to fallback image: ${fallbackSrc}`);
        setHasError(true);
        setCurrentSrc(fallbackSrc);
        return;
      }

      // fallback도 실패했다면 에러 상태로 설정
      setHasError(true);
      onError?.();
    };

    const handleLoad = () => {
      setHasError(false);
      onLoad?.();
    };

    // 에러 상태일 때 검정 화면 표시
    if (hasError && currentSrc === fallbackSrc) {
      return (
        <div
          className={`${className} bg-black flex items-center justify-center`}
          style={{ width: width || '100%', height: height || '100%' }}
        />
      );
    }

    return (
      <Image
        ref={ref}
        src={proxiedSrc}
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
