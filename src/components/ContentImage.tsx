import React from 'react';
import Image from 'next/image';

interface ContentImageProps {
  src: string;
  alt: string;
  title?: string;
  priority?: boolean;
  className?: string;
}

/**
 * 최적화된 콘텐츠 이미지 컴포넌트
 */
export function ContentImage({
  src,
  alt,
  title,
  priority = false,
  className = '',
}: ContentImageProps) {
  return (
    <div className={`relative aspect-video overflow-hidden rounded-lg bg-zinc-800 ${className}`}>
      <Image
        src={src}
        alt={alt}
        title={title}
        fill
        className="object-cover transition-opacity duration-300"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
        priority={priority}
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
        onLoad={(e) => {
          e.currentTarget.style.opacity = '1';
        }}
        onError={(e) => {
          e.currentTarget.style.opacity = '0.5';
          console.error('Failed to load image:', src);
        }}
      />
    </div>
  );
}