'use client';

import { useState } from 'react';
import Image from 'next/image';
import { pickAspectBucket, getAspectRatioClass } from '@/lib/utils/aspectBucket';

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
}: CardMediaProps) {
  // Calculate aspect bucket if dimensions are provided
  const bucket = width && height ? pickAspectBucket(width, height) : 'SQUARE_1_1';
  const aspectClass = getAspectRatioClass(bucket);

  // Default responsive sizes for feed layouts
  const defaultSizes =
    sizes ||
    '(max-width: 640px) 100vw, ' +
      '(max-width: 1024px) 50vw, ' +
      '(max-width: 1536px) 33vw, ' +
      '25vw';

  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl ${aspectClass} max-h-96 ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes={defaultSizes}
        placeholder={blurDataURL ? 'blur' : 'empty'}
        blurDataURL={blurDataURL}
        priority={priority}
        quality={90} // Good balance between quality and file size
        onLoad={onLoad}
      />
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
}: CardMediaProps & { fallbackIcon?: string | React.ReactNode }) {
  const [imageError, setImageError] = useState(false);

  if (imageError) {
    return (
      <div
        className={`relative w-full overflow-hidden rounded-2xl bg-zinc-800 flex items-center justify-center max-h-96 ${className}`}
      >
        <div className="text-zinc-400 text-4xl">
          {typeof fallbackIcon === 'string' ? fallbackIcon : fallbackIcon}
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
    />
  );
}
