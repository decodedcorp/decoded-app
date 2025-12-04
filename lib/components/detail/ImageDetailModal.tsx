"use client";

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { X, Share2 } from 'lucide-react';
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

  const handleShare = async () => {
    const url = window.location.href;
    
    // Try Web Share API first (mobile/desktop)
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Image Details',
          url: url,
        });
        return;
      } catch (err) {
        // User cancelled or error occurred, fallback to clipboard
        if ((err as Error).name !== 'AbortError') {
          console.error('Error sharing:', err);
        }
      }
    }

    // Fallback to clipboard copy
    try {
      await navigator.clipboard.writeText(url);
      // You might want to show a toast notification here
    } catch (err) {
      console.error('Failed to copy URL to clipboard:', err);
    }
  };

  if (isLoading) {
    return (
      <div
        ref={modalRef}
        className="fixed inset-0 z-[10000] flex items-center justify-center bg-background/95 backdrop-blur-sm"
      >
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (error || !image) {
    return (
      <div
        ref={modalRef}
        className="fixed inset-0 z-[10000] flex items-center justify-center bg-background/95 backdrop-blur-sm"
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
      className="fixed inset-0 z-[10000] overflow-y-auto bg-background"
    >
      {/* Action Buttons */}
      <div className="fixed right-4 top-4 z-[10001] flex gap-2">
        <button
          onClick={handleShare}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm transition-colors hover:bg-background/90"
          aria-label="Share"
        >
          <Share2 className="h-5 w-5" />
        </button>
        <button
          onClick={handleClose}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm transition-colors hover:bg-background/90"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Content */}
      <ImageDetailContent image={image} />
    </div>
  );
}

