"use client";

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { useImageById } from '@/lib/hooks/useImages';
import { useFlipEnter, useFlipExit } from '@/lib/hooks/useFlipTransition';
import { ImageDetailContent } from './ImageDetailContent';

type Props = {
  imageId: string;
};

/**
 * Modal version of image detail page
 * Used when navigating from grid (intercepting route)
 */
export function ImageDetailModal({ imageId }: Props) {
  const router = useRouter();
  const modalRef = useRef<HTMLDivElement>(null);
  const { data: image, isLoading, error } = useImageById(imageId);
  const playExitAnimation = useFlipExit(modalRef, () => {
    router.back();
  });

  // Enter animation
  useFlipEnter(modalRef, imageId);

  // Body scroll lock
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const handleClose = async () => {
    await playExitAnimation();
  };

  if (isLoading) {
    return (
      <div
        ref={modalRef}
        className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm"
      >
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (error || !image) {
    return (
      <div
        ref={modalRef}
        className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm"
      >
        <div className="text-center">
          <p className="mb-4 text-lg text-destructive">
            {error instanceof Error ? error.message : 'Failed to load image'}
          </p>
          <button
            onClick={handleClose}
            className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-50 overflow-y-auto bg-background"
    >
      {/* Close Button */}
      <button
        onClick={handleClose}
        className="fixed right-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm transition-colors hover:bg-background/90"
        aria-label="Close"
      >
        <X className="h-5 w-5" />
      </button>

      {/* Content */}
      <ImageDetailContent image={image} />
    </div>
  );
}

