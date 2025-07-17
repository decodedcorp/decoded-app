'use client';

import { cn } from '@/lib/utils/style';
import Image from 'next/image';
import { useState } from 'react';

// 카테고리별 placeholder 이미지 매핑
const categoryPlaceholders: Record<string, string> = {
  'OUTER': '/images/placeholders/outer.webp',
  'TOP': '/images/placeholders/top.webp',
  'BOTTOM': '/images/placeholders/bottom.webp',
  'SHOES': '/images/placeholders/shoes.webp',
  'BAG': '/images/placeholders/bag.webp',
  'ACCESSORY': '/images/placeholders/accessory.webp',
} as const;

interface ItemImageProps {
  imgUrl?: string | null;
  category?: string;
  alt?: string;
  className?: string;
  imageClassName?: string;
  placeholderClassName?: string;
  width?: number;
  height?: number;
  priority?: boolean; // 이미지 우선순위
  quality?: number; // 이미지 품질
  onError?: () => void; // 이미지 로드 실패 핸들러
}

export function ItemImage({
  imgUrl,
  category,
  alt = "아이템 이미지",
  className,
  imageClassName,
  placeholderClassName,
  width = 80,
  height = 80,
  priority = false,
  quality = 75,
  onError,
}: ItemImageProps) {
  const [imageError, setImageError] = useState(false);
  const containerClasses = cn(
    "bg-[#1A1A1A]/[0.5] rounded-lg overflow-hidden relative",
    className
  );

  // 이미지가 없거나 에러가 발생한 경우 placeholder 이미지 표시
  if (!imgUrl || imageError) {
    const normalizedCategory = category?.toUpperCase();
    const placeholderSrc = normalizedCategory 
      ? categoryPlaceholders[normalizedCategory] 
      : '/images/placeholders/default.webp';

    return (
      <div 
        className={cn(containerClasses, "group")}
        style={{ width, height }}
      >
        <Image
          src={placeholderSrc}
          alt={`${category || '아이템'} 카테고리 이미지`}
          width={width}
          height={height}
          className={cn(
            "w-full h-full object-cover opacity-50",
            "transition-opacity duration-200",
            "group-hover:opacity-75",
            imageClassName
          )}
          unoptimized
        />
      </div>
    );
  }

  // 실제 이미지 표시
  return (
    <div 
      className={cn(containerClasses, "group")}
      style={{ width, height }}
    >
      <Image
        src={imgUrl}
        alt={alt}
        width={width}
        height={height}
        quality={quality}
        priority={priority}
        className={cn(
          "w-full h-full object-cover",
          "transition-transform duration-200",
          "group-hover:scale-105",
          imageClassName
        )}
        onError={() => {
          setImageError(true);
          onError?.();
        }}
        unoptimized
      />
    </div>
  );
} 