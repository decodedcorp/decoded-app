"use client";

import { useImageById } from "@/lib/hooks/useImages";
import { ImageDetailContent } from "./ImageDetailContent";
import { LenisProvider } from "./LenisProvider";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useRouter } from "next/navigation";
import { X, Share2 } from "lucide-react";

type Props = {
  imageId: string;
};

/**
 * Full page version of image detail
 * Used when directly accessing URL or refreshing page
 */
export function ImageDetailPage({ imageId }: Props) {
  const router = useRouter();
  const { data: image, isLoading, error } = useImageById(imageId);
  // #region agent log
  useEffect(() => {
    fetch("http://127.0.0.1:7242/ingest/89712f27-6a22-414e-81e7-beea00d23671", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location: "ImageDetailPage.tsx:25",
        message: "Data received from hook",
        data: {
          imageId,
          hasImage: !!image,
          itemCount: image?.items?.length,
          isLoading,
          error: error?.message,
        },
        timestamp: Date.now(),
        sessionId: "debug-session",
        hypothesisId: "H1",
      }),
    }).catch(() => {});
  }, [image, isLoading, error, imageId]);
  // #endregion
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
            {error instanceof Error ? error.message : "Failed to load image"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <LenisProvider>
      <div ref={pageRef} className="relative">
        {/* Action Buttons */}
        <div className="fixed right-4 top-4 z-50 flex gap-2">
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

        <ImageDetailContent image={image} />
      </div>
    </LenisProvider>
  );
}
