"use client";

import { memo, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { Flip } from "gsap/Flip";
import { useTransitionStore } from "@/lib/stores/transitionStore";
import { Card } from "@/lib/design-system";
import { cn } from "@/lib/utils";

// Register GSAP Flip plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(Flip);
}

/**
 * Get badge styles based on source
 */
function getSourceBadgeStyles(source?: string): string {
  switch (source?.toLowerCase()) {
    case "instagram":
      return "bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#8134AF]";
    case "tiktok":
      return "bg-black";
    default:
      return "bg-muted-foreground/60";
  }
}

/**
 * Format date as relative time
 */
function formatRelativeTime(date?: Date | string): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;
  return d.toLocaleDateString();
}

export interface FeedCardItem {
  id: string;
  imageUrl: string | null;
  status?: string;
  hasItems?: boolean;
  postId?: string;
  postSource?: string;
  postAccount?: string;
  postCreatedAt?: Date | string;
}

interface FeedCardProps {
  item: FeedCardItem;
  index: number;
  priority?: boolean;
}

/**
 * FeedCard - Instagram-style full-width card
 *
 * Minimal design with image and item count badge
 * Used in vertical feed layout (VerticalFeed)
 * Uses design-system Card component with GSAP Flip animations
 */
export const FeedCard = memo(
  ({ item, index: _index, priority = false }: FeedCardProps) => {
    const [imageError, setImageError] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const setTransition = useTransitionStore((state) => state.setTransition);

    const { id, imageUrl, hasItems } = item;

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (!id) return;

      const target = e.currentTarget.querySelector(
        "[data-flip-id]"
      ) as HTMLElement;
      if (!target) return;

      // Capture FLIP state before navigation
      try {
        const state = Flip.getState(target);
        const rect = target.getBoundingClientRect();
        setTransition(id, state, rect, imageUrl ?? undefined);
      } catch (_error) {
        const rect = target.getBoundingClientRect();
        setTransition(id, null, rect, imageUrl ?? undefined);
      }
    };

    const cardContent = (
      <Card
        data-flip-id={id ? `feed-card-${id}` : undefined}
        interactive
        className="relative w-full overflow-hidden p-0"
      >
        {/* Image container - 4:5 aspect ratio like Instagram */}
        <div className="relative aspect-[4/5] bg-muted">
          {imageUrl && !imageError ? (
            <img
              src={imageUrl}
              loading={priority ? "eager" : "lazy"}
              decoding="async"
              fetchPriority={priority ? "high" : "auto"}
              alt={`Image ${id}`}
              className={`h-full w-full object-cover transition-opacity duration-200 ease-out ${
                isLoaded ? "opacity-100" : "opacity-0"
              }`}
              onError={() => setImageError(true)}
              onLoad={() => setIsLoaded(true)}
            />
          ) : (
            <div className="h-full w-full bg-muted" />
          )}

          {/* Top overlay: Source badge + Item count */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            {/* Source badge */}
            {item.postSource && (
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-xs font-medium text-white",
                  getSourceBadgeStyles(item.postSource)
                )}
              >
                {item.postSource}
              </span>
            )}
            {/* Item count badge */}
            {hasItems && (
              <span className="rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
                Items
              </span>
            )}
          </div>

          {/* Bottom gradient overlay */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent p-4 pt-12">
            {/* Account name */}
            {item.postAccount && (
              <p className="font-semibold text-white text-base">
                @{item.postAccount}
              </p>
            )}
            {/* Relative time */}
            {item.postCreatedAt && (
              <p className="text-xs text-white/70 mt-0.5">
                {formatRelativeTime(item.postCreatedAt)}
              </p>
            )}
          </div>
        </div>
      </Card>
    );

    if (!id) {
      return cardContent;
    }

    return (
      <Link
        href={`/images/${id}`}
        scroll={false}
        onClick={handleClick}
        className="block"
      >
        {cardContent}
      </Link>
    );
  }
);

FeedCard.displayName = "FeedCard";

/**
 * FeedCardSkeleton - Loading placeholder for FeedCard
 */
export const FeedCardSkeleton = memo(() => {
  return (
    <Card className="relative w-full overflow-hidden p-0">
      <div className="relative aspect-[4/5] animate-pulse bg-muted">
        {/* Top badges skeleton */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <div className="h-5 w-16 animate-pulse rounded-full bg-muted-foreground/20" />
          <div className="h-6 w-14 animate-pulse rounded-full bg-muted-foreground/20" />
        </div>
        {/* Bottom info skeleton */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent p-4 pt-12">
          <div className="h-4 w-24 animate-pulse rounded bg-white/20 mb-1" />
          <div className="h-3 w-16 animate-pulse rounded bg-white/10" />
        </div>
      </div>
    </Card>
  );
});

FeedCardSkeleton.displayName = "FeedCardSkeleton";
