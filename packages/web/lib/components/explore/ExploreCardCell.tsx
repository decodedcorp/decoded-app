"use client";

import { memo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import { Flip } from "gsap/Flip";
import { Card } from "@/lib/design-system";
import { useTransitionStore } from "@/lib/stores/transitionStore";
import type { ItemConfig } from "@/lib/components/ThiingsGrid";

if (typeof window !== "undefined") {
  gsap.registerPlugin(Flip);
}

export interface ExploreCardCellProps extends ItemConfig {}

/**
 * ExploreCardCell Component
 *
 * Card cell for ThiingsGrid with FLIP page transitions.
 * Uses design-system Card with custom FLIP animation logic.
 */
export const ExploreCardCell = memo(function ExploreCardCell({
  gridIndex,
  item,
}: ExploreCardCellProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const setTransition = useTransitionStore((state) => state.setTransition);

  const isTopImage = gridIndex < 6;
  const imageUrl = item?.imageUrl;
  const imageId = item?.id;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!imageId) return;

    const target = e.currentTarget.querySelector("article") as HTMLElement;
    if (!target) return;

    // Capture FLIP state before navigation
    try {
      const state = Flip.getState(target);
      const rect = target.getBoundingClientRect();

      setTransition(imageId, state, rect, imageUrl ?? undefined);
    } catch (_error) {
      // Fallback: just store rect if Flip.getState fails
      const rect = target.getBoundingClientRect();
      setTransition(imageId, null, rect, imageUrl ?? undefined);
    }
  };

  if (!imageId || !imageUrl || imageError) {
    return (
      <div className="absolute inset-1 rounded-xl border border-border bg-card/60">
        <div className="h-full w-full bg-muted rounded-xl" />
      </div>
    );
  }

  return (
    <Link
      href={`/images/${imageId}`}
      scroll={false}
      onClick={handleClick}
      className="absolute inset-1"
    >
      <Card
        variant="default"
        size="sm"
        interactive
        className="h-full overflow-hidden p-0"
      >
        <article
          data-flip-id={`card-${imageId}`}
          className="relative aspect-[3/4] bg-muted"
        >
          <Image
            src={imageUrl}
            alt={`Image ${imageId}`}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={`object-cover transition-opacity duration-150 ease-out ${
              isLoaded ? "opacity-100" : "opacity-0"
            }`}
            priority={isTopImage}
            onError={() => setImageError(true)}
            onLoad={() => setIsLoaded(true)}
          />
        </article>
      </Card>
    </Link>
  );
});

/**
 * ExploreSkeletonCell Component
 *
 * Loading skeleton for ExploreCardCell with correct aspect ratio.
 */
export const ExploreSkeletonCell = memo(function ExploreSkeletonCell() {
  return (
    <div className="absolute inset-1 rounded-xl border border-border bg-card/60">
      <div className="relative aspect-[3/4] animate-pulse bg-muted rounded-xl" />
    </div>
  );
});
