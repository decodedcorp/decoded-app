"use client";

import { memo, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { Flip } from "gsap/Flip";
import { useTransitionStore } from "@/lib/stores/transitionStore";

// Register GSAP Flip plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(Flip);
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
 */
export const FeedCard = memo(
  ({ item, index: _index, priority = false }: FeedCardProps) => {
    const [imageError, setImageError] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const setTransition = useTransitionStore((state) => state.setTransition);

    const { id, imageUrl, hasItems } = item;

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (!id) return;

      const target = e.currentTarget.querySelector("article") as HTMLElement;
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
      <article
        data-flip-id={id ? `feed-card-${id}` : undefined}
        className="relative w-full overflow-hidden rounded-xl border border-border bg-card/60 transition-shadow hover:shadow-lg"
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

          {/* Item count badge - bottom right */}
          {hasItems && (
            <div className="absolute bottom-3 right-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
              Items
            </div>
          )}
        </div>

        {/* Metadata footer - only in development */}
        {process.env.NODE_ENV === "development" && (
          <div className="flex items-center justify-between border-t border-border px-3 py-2">
            <span className="text-[10px] font-mono text-muted-foreground">
              #{id?.slice(0, 8)}
            </span>
            {item.postAccount && (
              <span className="text-[10px] text-muted-foreground">
                @{item.postAccount}
              </span>
            )}
          </div>
        )}
      </article>
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
    <article className="relative w-full overflow-hidden rounded-xl border border-border bg-card/60">
      <div className="relative aspect-[4/5] animate-pulse bg-muted">
        {/* Skeleton badge placeholder */}
        <div className="absolute bottom-3 right-3 h-6 w-14 animate-pulse rounded-full bg-muted-foreground/20" />
      </div>
    </article>
  );
});

FeedCardSkeleton.displayName = "FeedCardSkeleton";
