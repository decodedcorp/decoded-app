"use client";

import { usePostDetailForImage } from "@/lib/hooks/useImages";
import { ImageDetailContent } from "./ImageDetailContent";
import { LenisProvider } from "./LenisProvider";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useRouter } from "next/navigation";
import { X, Share2, Heart, Bookmark } from "lucide-react";
import { ReportErrorButton } from "./ReportErrorButton";
import { Lightbox } from "./Lightbox";
import { ErrorState } from "@/lib/components/shared";

type Props = {
  imageId: string;
};

/**
 * Full page version of image detail
 * Used when directly accessing URL or refreshing page
 * Now renders post data instead of old image data
 */
export function ImageDetailPage({ imageId }: Props) {
  const router = useRouter();
  const { data: image, isLoading, error } = usePostDetailForImage(imageId);
  const pageRef = useRef<HTMLDivElement>(null);
  const [showLightbox, setShowLightbox] = useState(false);

  // Fade-in animation for direct access
  useEffect(() => {
    if (!pageRef.current) return;

    gsap.fromTo(
      pageRef.current,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.4,
        ease: "power2.out",
      }
    );
  }, []);

  const handleClose = () => {
    router.back();
  };

  const handleShare = async () => {
    const url = window.location.href;

    // Try Web Share API first (mobile/desktop)
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Image Details",
          url: url,
        });
        return;
      } catch (err) {
        // User cancelled or error occurred, fallback to clipboard
        if ((err as Error).name !== "AbortError") {
          console.error("Error sharing:", err);
        }
      }
    }

    // Fallback to clipboard copy
    try {
      await navigator.clipboard.writeText(url);
      // You might want to show a toast notification here
    } catch (err) {
      console.error("Failed to copy URL to clipboard:", err);
    }
  };

  if (isLoading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        aria-busy="true"
      >
        <div className="space-y-4 w-full max-w-2xl px-4">
          <div className="aspect-[3/4] w-full animate-pulse rounded-2xl bg-muted" />
          <div className="space-y-2">
            <div className="h-6 w-3/4 animate-pulse rounded bg-muted" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !image) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <ErrorState
          message="Failed to load post"
          details={error instanceof Error ? error.message : undefined}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  return (
    <LenisProvider>
      <div ref={pageRef} className="relative">
        {/* Action Buttons */}
        <div className="fixed right-4 top-4 z-50 flex gap-2">
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm transition-transform transition-colors hover:scale-105 hover:bg-background/90"
            aria-label="Like"
          >
            <Heart className="h-5 w-5" />
          </button>
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm transition-transform transition-colors hover:scale-105 hover:bg-background/90"
            aria-label="Save"
          >
            <Bookmark className="h-5 w-5" />
          </button>
          <ReportErrorButton postId={image.id} size="md" />
          <button
            onClick={handleShare}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm transition-transform transition-colors hover:scale-105 hover:bg-background/90"
            aria-label="Share"
          >
            <Share2 className="h-5 w-5" />
          </button>
          <button
            onClick={handleClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm transition-transform transition-colors hover:scale-105 hover:bg-background/90"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <ImageDetailContent image={image} />

        {/* Lightbox */}
        <Lightbox
          isOpen={showLightbox}
          onClose={() => setShowLightbox(false)}
          imageUrl={(image as { image_url?: string }).image_url || ""}
          alt={`Post ${image.id}`}
        />
      </div>
    </LenisProvider>
  );
}
