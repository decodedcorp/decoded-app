"use client";

import { useImageById } from '@/lib/hooks/useImages';
import { ImageDetailContent } from './ImageDetailContent';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

type Props = {
  imageId: string;
};

/**
 * Full page version of image detail
 * Used when directly accessing URL or refreshing page
 */
export function ImageDetailPage({ imageId }: Props) {
  const { data: image, isLoading, error } = useImageById(imageId);
  const pageRef = useRef<HTMLDivElement>(null);

  // Fade-in animation for direct access
  useEffect(() => {
    if (!pageRef.current) return;

    gsap.fromTo(
      pageRef.current,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.4,
        ease: 'power2.out',
      }
    );
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (error || !image) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-lg text-destructive">
            {error instanceof Error ? error.message : 'Failed to load image'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div ref={pageRef}>
      <ImageDetailContent image={image} />
    </div>
  );
}

