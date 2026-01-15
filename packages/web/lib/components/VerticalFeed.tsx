"use client";

import { useEffect, useRef, memo } from "react";
import { FeedCard, FeedCardSkeleton, type FeedCardItem } from "./FeedCard";

interface VerticalFeedProps {
  items: FeedCardItem[];
  onReachEnd?: () => void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
}

/**
 * VerticalFeed - Instagram-style vertical scrolling feed
 *
 * Features:
 * - Full-width cards in single column
 * - Vertical scroll with native browser scrolling
 * - Infinite scroll with IntersectionObserver
 * - Smooth loading states
 */
export const VerticalFeed = memo(
  ({
    items,
    onReachEnd,
    hasMore = false,
    isLoadingMore = false,
  }: VerticalFeedProps) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const sentinelRef = useRef<HTMLDivElement>(null);

    // Infinite scroll using IntersectionObserver
    useEffect(() => {
      const sentinel = sentinelRef.current;
      const scrollContainer = scrollContainerRef.current;

      if (!sentinel || !onReachEnd || !hasMore) return;
      if (!scrollContainer) return;

      const observer = new IntersectionObserver(
        (entries) => {
          const [entry] = entries;
          if (entry.isIntersecting && hasMore && !isLoadingMore) {
            onReachEnd();
          }
        },
        {
          root: scrollContainer,
          rootMargin: "200px",
          threshold: 0,
        }
      );

      observer.observe(sentinel);

      return () => {
        observer.disconnect();
      };
    }, [onReachEnd, hasMore, isLoadingMore]);

    return (
      <div ref={scrollContainerRef} className="h-full overflow-y-auto">
        <div className="mx-auto max-w-lg px-4 py-4 pb-20 md:pb-4">
          {/* Feed cards */}
          <div className="flex flex-col gap-4">
            {items.map((item, index) => (
              <FeedCard
                key={item.id}
                item={item}
                index={index}
                priority={index < 3} // First 3 cards get priority loading
              />
            ))}
          </div>

          {/* Loading indicator */}
          {isLoadingMore && (
            <div className="mt-4 flex flex-col gap-4">
              <FeedCardSkeleton />
              <FeedCardSkeleton />
            </div>
          )}

          {/* Sentinel for infinite scroll */}
          {hasMore && (
            <div ref={sentinelRef} className="h-10 w-full" aria-hidden="true" />
          )}

          {/* End of feed message */}
          {!hasMore && items.length > 0 && (
            <div className="py-8 text-center text-sm text-muted-foreground">
              You&apos;ve reached the end
            </div>
          )}
        </div>
      </div>
    );
  }
);

VerticalFeed.displayName = "VerticalFeed";

/**
 * VerticalFeedSkeleton - Loading state for entire feed
 */
export const VerticalFeedSkeleton = memo(() => {
  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-lg px-4 py-4">
        <div className="flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <FeedCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  );
});

VerticalFeedSkeleton.displayName = "VerticalFeedSkeleton";
