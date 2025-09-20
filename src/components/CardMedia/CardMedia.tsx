'use client';

import { useState } from 'react';
import Image from 'next/image';
// Aspect bucket utilities are available for future use
// import { pickAspectBucket, getAspectRatioClass } from '@/lib/utils/aspectBucket';

export interface CardMediaProps {
  src: string;
  alt: string;
  width?: number; // Original width for aspect calculation
  height?: number; // Original height for aspect calculation
  blurDataURL?: string;
  priority?: boolean;
  className?: string;
  sizes?: string; // Custom sizes string for responsive images
  onLoad?: () => void; // Callback when image loads
  fitPolicy?: 'cover' | 'contain' | 'smart'; // Image fit policy
  contentType?: 'image' | 'video' | 'link' | 'text'; // Content type for smart policy
}

/**
 * CardMedia component with aspect ratio bucketing
 * Optimizes image display for feed layouts with consistent aspect ratios
 */
export function CardMedia({
  src,
  alt,
  width,
  height,
  blurDataURL,
  priority = false,
  className = '',
  sizes,
  onLoad,
  fitPolicy = 'smart',
  contentType = 'image',
}: CardMediaProps) {
  // 스마트 정책 로직 - 여백 최소화를 위해 cover 우선
  const getSmartFitPolicy = (contentType: string, aspectRatio: number): 'cover' | 'contain' => {
    // 1. 링크 미리보기: contain (정보 보존이 중요)
    if (contentType === 'link') return 'contain';

    // 2. 극단 비율: contain (정보 보존이 중요)
    if (aspectRatio < 0.4 || aspectRatio > 2.5) return 'contain';

    // 3. 기본: cover (여백 최소화 및 시각적 임팩트)
    return 'cover';
  };

  const [actualFit, setActualFit] = useState<'cover' | 'contain'>(() => {
    if (fitPolicy === 'smart' && width && height) {
      const ratio = width / height;
      return getSmartFitPolicy(contentType, ratio);
    }
    return fitPolicy === 'smart' ? 'cover' : fitPolicy;
  });

  // 폴백 비율 계산 (렌더링 중 상태 변경 없이)
  const aspectRatio = width && height ? `${width}/${height}` : '4/5';

  // 이미지 로드 시 fit 정책 재계산
  const handleImageLoad = () => {
    if (width && height && fitPolicy === 'smart') {
      const ratio = width / height;
      const smartFit = getSmartFitPolicy(contentType, ratio);
      setActualFit(smartFit);
    }

    onLoad?.();
  };

  // Default responsive sizes for feed layouts
  const defaultSizes =
    sizes || '(max-width: 640px) 92vw, ' + '(max-width: 1024px) 92vw, ' + '896px';

  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl ${className}`}
      style={{ aspectRatio }}
    >
      {/* Skeleton 배경 - 카드 색상과 일치 */}
      <div className="absolute inset-0 bg-zinc-900" />

      {/* 메인 이미지 */}
      <div className="absolute inset-0">
        <Image
          src={src}
          alt={alt}
          width={width || 800}
          height={height || 600}
          className={`w-full h-full drop-shadow-lg ${
            actualFit === 'cover' ? 'object-cover' : 'object-contain'
          }`}
          sizes={defaultSizes}
          placeholder={blurDataURL ? 'blur' : 'empty'}
          blurDataURL={blurDataURL}
          priority={priority}
          quality={90}
          onLoad={handleImageLoad}
        />
      </div>
    </div>
  );
}

/**
 * CardMedia with fallback for missing images
 */
export function CardMediaWithFallback({
  src,
  alt,
  width,
  height,
  blurDataURL,
  priority = false,
  className = '',
  sizes,
  onLoad,
  fallbackIcon = '📷',
  fitPolicy = 'smart',
  contentType = 'image',
}: CardMediaProps & { fallbackIcon?: string | React.ReactNode }) {
  const [imageError, setImageError] = useState(false);

  // 폴백 비율 계산 (렌더링 중 상태 변경 없이)
  const aspectRatio = width && height ? `${width}/${height}` : '4/5';

  if (imageError) {
    return (
      <div
        className={`relative w-full overflow-hidden rounded-2xl ${className}`}
        style={{ aspectRatio }}
      >
        {/* Skeleton 배경 - 카드 색상과 일치 */}
        <div className="absolute inset-0 bg-zinc-900" />
        {/* Fallback 아이콘 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-gray-300 text-6xl drop-shadow-lg">
            {typeof fallbackIcon === 'string' ? fallbackIcon : fallbackIcon}
          </div>
        </div>
      </div>
    );
  }

  return (
    <CardMedia
      src={src}
      alt={alt}
      width={width}
      height={height}
      blurDataURL={blurDataURL}
      priority={priority}
      className={className}
      sizes={sizes}
      onLoad={onLoad}
      fitPolicy={fitPolicy}
      contentType={contentType}
    />
  );
}
