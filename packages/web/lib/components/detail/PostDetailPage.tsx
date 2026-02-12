"use client";

import { usePostById } from "@/lib/hooks/usePosts";
import { PostDetailContent } from "./PostDetailContent";
import { LenisProvider } from "./LenisProvider";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useRouter } from "next/navigation";
import { X, Share2, Flag } from "lucide-react";
import { Card, Heading, Text } from "@/lib/design-system";
import { AlertCircle } from "lucide-react";
import { ReportModal } from "@/lib/components/shared/ReportModal";

type Props = {
  postId: string;
};

/**
 * Full page version of post detail
 * Used when directly accessing URL or refreshing page
 *
 * Features:
 * - Full-page skeleton loading state (hero placeholder + content blocks)
 * - Design system error state (Card with AlertCircle icon)
 * - Action buttons (report, share, close) matching decoded.pen design
 * - LenisProvider for smooth scroll
 * - GSAP fade-in entrance animation
 */
export function PostDetailPage({ postId }: Props) {
  const router = useRouter();
  const { data: postDetail, isLoading, error } = usePostById(postId);
  const pageRef = useRef<HTMLDivElement>(null);
  const [reportOpen, setReportOpen] = useState(false);

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
    const title = postDetail?.post?.media_title || "Post Details";

    // Try Web Share API first (mobile/desktop)
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
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
    } catch (err) {
      console.error("Failed to copy URL to clipboard:", err);
    }
  };

  const handleReport = () => {
    setReportOpen(true);
  };

  // Loading state: full-page skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background -mt-14 md:-mt-[72px]">
        {/* Skeleton Hero */}
        <div className="relative h-[426px] md:h-[60vh] md:max-h-[600px] w-full bg-muted animate-pulse">
          {/* Skeleton gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          {/* Skeleton hero content */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
            {/* Badge skeleton */}
            <div className="mb-4 h-8 w-36 rounded-full bg-white/10 animate-pulse" />
            {/* Title skeleton */}
            <div className="mb-3 h-12 w-3/4 max-w-lg rounded-md bg-white/10 animate-pulse" />
            {/* Meta skeleton */}
            <div className="h-4 w-48 rounded bg-white/10 animate-pulse" />
          </div>
        </div>

        {/* Skeleton content blocks */}
        <div className="mx-auto max-w-4xl px-6 py-10">
          {/* Tags skeleton */}
          <div className="mb-8 flex gap-2">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-7 w-20 rounded-full bg-muted animate-pulse"
              />
            ))}
          </div>

          {/* Article skeleton */}
          <div className="space-y-4 mb-12">
            <div className="h-5 w-full rounded bg-muted animate-pulse" />
            <div className="h-5 w-5/6 rounded bg-muted animate-pulse" />
            <div className="h-5 w-4/5 rounded bg-muted animate-pulse" />
            <div className="h-5 w-full rounded bg-muted animate-pulse" />
          </div>

          {/* Items section header skeleton */}
          <div className="mb-6">
            <div className="h-3 w-24 rounded bg-muted animate-pulse mb-2" />
            <div className="h-7 w-40 rounded bg-muted animate-pulse" />
          </div>

          {/* Items grid skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="aspect-square rounded-lg bg-muted animate-pulse" />
                <div className="h-3 w-16 rounded bg-muted animate-pulse" />
                <div className="h-4 w-full rounded bg-muted animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state: design system Card with destructive styling
  if (error || !postDetail) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 bg-background -mt-14 md:-mt-[72px]">
        <Card className="max-w-md w-full text-center p-8">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
          </div>

          <Heading variant="h3" className="mb-2">
            Failed to Load Post
          </Heading>
          <Text textColor="muted" className="mb-6">
            {error instanceof Error
              ? error.message
              : "The post could not be found or an error occurred while loading."}
          </Text>

          <button
            onClick={handleClose}
            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go Back
          </button>
        </Card>
      </div>
    );
  }

  return (
    <LenisProvider>
      <div ref={pageRef} className="relative -mt-14 md:-mt-[72px]">
        {/* Action Buttons - matching decoded.pen design */}
        <div className="fixed right-4 top-4 z-50 flex gap-2">
          <button
            onClick={handleReport}
            className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm transition-colors hover:bg-black/70"
            aria-label="Report"
          >
            <Flag className="h-4 w-4 md:h-5 md:w-5 text-white" />
          </button>
          <button
            onClick={handleShare}
            className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm transition-colors hover:bg-black/70"
            aria-label="Share"
          >
            <Share2 className="h-4 w-4 md:h-5 md:w-5 text-white" />
          </button>
          <button
            onClick={handleClose}
            className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm transition-colors hover:bg-black/70"
            aria-label="Close"
          >
            <X className="h-4 w-4 md:h-5 md:w-5 text-white" />
          </button>
        </div>

        <PostDetailContent postDetail={postDetail} />

        <ReportModal
          open={reportOpen}
          onClose={() => setReportOpen(false)}
          targetType="post"
        />
      </div>
    </LenisProvider>
  );
}
