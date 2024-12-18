'use client';

import { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import { cn } from '@/lib/utils';

interface ImageWithFallbackProps extends Omit<ImageProps, 'onError'> {
  fallbackSrc?: string;
}

export function ImageWithFallback({ 
  src, 
  alt, 
  fallbackSrc = '/images/fallback.jpg',
  className,
  ...props 
}: ImageWithFallbackProps) {
  const [error, setError] = useState(false);

  return (
    <Image
      {...props}
      src={error ? fallbackSrc : src}
      alt={alt}
      className={cn('transition-opacity duration-300', className)}
      onError={() => {
        console.error('Image load error:', src);
        setError(true);
      }}
    />
  );
} 