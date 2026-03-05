"use client";

import { RefObject, useMemo, useState } from "react";
import type { ImageDetail } from "@/lib/supabase/queries/images";
import type { ImageDetailWithPostOwner } from "@/lib/api/adapters/postDetailToImageDetail";
import type { Json } from "@/lib/supabase/types";
import { normalizeItem, solutionToShopItem } from "./types";
import type { UiItem } from "./types";
import { HeroSection } from "./HeroSection";
import { InteractiveShowcase } from "./InteractiveShowcase";
import { ShopGrid } from "./ShopGrid";
import { RelatedImages } from "./RelatedImages";
import { SocialActions } from "@/lib/components/shared/SocialActions";
import { ImageCommentSection } from "./ImageCommentSection";
import { AddSolutionSheet } from "./AddSolutionSheet";
import { AISummarySection } from "./AISummarySection";
import { useAllSolutionsForSpots } from "@/lib/hooks/useSolutions";

type Props = {
  image: ImageDetail;
  isModal?: boolean;
  scrollContainerRef?: RefObject<HTMLElement>;
  // Controlled active index state (optional, for lifting state up)
  activeIndex?: number | null;
  onActiveIndexChange?: (index: number | null) => void;
  // If true, hides the hero/interactive image (useful for modal split layout where image is external)
  hideImage?: boolean;
  // Callback when hero image is clicked (for opening lightbox)
  onHeroClick?: () => void;
};

/**
 * Shared content component for image detail view
 * Used by both modal and full page versions
 *
 * Sections:
 * 1. Hero Section - Full-screen image with dramatic typography
 * 2. Interactive Showcase - Sticky layout with item highlights (if items exist)
 * 3. Shop Grid - Grid of items (if items exist)
 */
export function ImageDetailContent({
  image,
  isModal = false,
  scrollContainerRef,
  activeIndex,
  onActiveIndexChange,
  hideImage = false,
  onHeroClick,
}: Props) {
  // Items are now pre-fetched via post.item_ids (if post_image exists)
  // Fallback to item.image_id if no post_image found
  const items = image.items || [];

  // Check if items were fetched via post (postImages exist)
  const itemsFromPost = image.postImages && image.postImages.length > 0;

  const firstPost = image.postImages?.[0]?.post || image.posts?.[0];
  const metadata = firstPost?.metadata;

  // Extract Anchor from metadata
  const anchor = useMemo(() => {
    if (!metadata) return null;
    const anchorTag = metadata.find(
      (tag) =>
        tag.toLowerCase().startsWith("anchor:") ||
        tag.toLowerCase().startsWith("summary:")
    );
    if (!anchorTag) return null;
    // Remove "Anchor:" or "Summary:" prefix and trim
    return anchorTag.replace(/^(anchor|summary):\s*/i, "").trim();
  }, [metadata]);

  // Normalize items with coordinates
  // Use item_locations from the first post_image if available to override item centers
  const firstPostImage = image.postImages?.[0];
  const itemLocations = firstPostImage?.item_locations;

  // Convert item_locations to a map for easy lookup if it's an array
  const itemLocationsMap = useMemo(() => {
    const map: Record<
      string,
      { bbox?: number[] | null; center?: Json | null; score?: number | null }
    > = {};
    if (Array.isArray(itemLocations)) {
      itemLocations.forEach((loc: any) => {
        if (loc && loc.item_id) {
          map[loc.item_id.toString()] = {
            bbox: loc.bbox,
            center: loc.center || loc,
            score: loc.score,
          };
        }
      });
    } else if (itemLocations && typeof itemLocations === "object") {
      Object.assign(map, itemLocations);
    }
    return map;
  }, [itemLocations]);

  const normalizedItems = useMemo(() => {
    return items.map((item) => {
      const overrideLocation = itemLocationsMap[item.id.toString()];
      return normalizeItem(item, undefined, overrideLocation);
    });
  }, [items, itemLocationsMap]);

  const spotIds = useMemo(
    () =>
      normalizedItems
        .map((i) => i.spot_id)
        .filter((id): id is string => !!id),
    [normalizedItems]
  );
  const { isLoading: solutionsLoading, allSolutionsWithSpot } =
    useAllSolutionsForSpots(spotIds);

  const shopItems: UiItem[] = useMemo(() => {
    if (spotIds.length === 0) return normalizedItems;
    const spotToBaseItem = new Map(
      normalizedItems
        .filter((i) => i.spot_id)
        .map((i) => [i.spot_id!, i])
    );
    const spotsWithSolutions = new Set(
      allSolutionsWithSpot.map(({ spotId }) => spotId)
    );
    const result: UiItem[] = [];
    const seenSolutionIds = new Set<string>();
    allSolutionsWithSpot.forEach(({ spotId, solution }) => {
      if (seenSolutionIds.has(solution.id)) return;
      seenSolutionIds.add(solution.id);
      const base = spotToBaseItem.get(spotId);
      if (base) result.push(solutionToShopItem(solution, base));
    });
    spotIds.forEach((spotId) => {
      if (!spotsWithSolutions.has(spotId)) {
        const base = spotToBaseItem.get(spotId);
        if (base) result.push(base);
      }
    });
    return result.sort((a, b) => {
      const aSpotted = a.normalizedCenter ? 1 : 0;
      const bSpotted = b.normalizedCenter ? 1 : 0;
      return bSpotted - aSpotted;
    });
  }, [normalizedItems, spotIds, allSolutionsWithSpot]);

  // Check if we have items (with or without coordinates)
  // Items without coordinates can still be displayed in ShopGrid
  const hasItems = normalizedItems.length > 0;
  const hasItemsWithCoordinates = normalizedItems.some(
    (item) => item.normalizedBox !== null
  );

  const [spotIdToAddSolution, setSpotIdToAddSolution] = useState<string | null>(
    null
  );

  return (
    <div className="detail-content relative">
      {/* Decorative Vertical Typography - Shown on desktop (Full Page & Modal) */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 hidden lg:block pointer-events-none select-none">
        <span className="font-serif text-[10px] uppercase tracking-[1em] text-primary/5 writing-mode-vertical-rl rotate-180 opacity-50">
          Decoded Editorial Archive — {new Date(image.created_at).getFullYear()}
        </span>
      </div>

      {/* Section 1: Hero - Hidden if hideImage is true */}
      {!hideImage && (
        <HeroSection image={image} isModal={isModal} onClick={onHeroClick} />
      )}

      {/* AI Summary Section */}
      <section
        className={`mx-auto px-6 ${isModal ? "max-w-5xl pt-10 pb-8" : "max-w-6xl pt-20 pb-16"}`}
      >
        <div className="w-full">
          <AISummarySection summary={anchor} isModal={isModal} />
        </div>
      </section>

      {/* Section 2: Interactive Showcase (only if items with coordinates exist) */}
      {hasItemsWithCoordinates && (
        <InteractiveShowcase
          image={image}
          items={normalizedItems}
          isModal={isModal}
          scrollContainerRef={scrollContainerRef}
          activeIndex={activeIndex}
          onActiveIndexChange={onActiveIndexChange}
          renderImage={!hideImage}
          onAddSolution={(spotId) => setSpotIdToAddSolution(spotId)}
          postOwnerId={
            (image as ImageDetailWithPostOwner).post_owner_id ?? null
          }
        />
      )}

      {/* Add Solution Sheet - for items without product info */}
      <AddSolutionSheet
        spotId={spotIdToAddSolution ?? ""}
        postId={image.id}
        isOpen={!!spotIdToAddSolution}
        onClose={() => setSpotIdToAddSolution(null)}
      />

      {/* Section 3: Shop Grid (show if any items exist, even without coordinates) */}
      {hasItems && (
        <div>
          {itemsFromPost && image.postImages && image.postImages.length > 0 && (
            <div className="mx-auto max-w-6xl px-4 py-3 md:px-8">
              <p className="text-sm text-muted-foreground">
                Items from post: @{image.postImages[0].post.account}
              </p>
            </div>
          )}
          <ShopGrid
            items={solutionsLoading ? normalizedItems : shopItems}
            isModal={isModal}
            postId={image.id}
            onAddSolutionClick={(spotId) => setSpotIdToAddSolution(spotId)}
          />
        </div>
      )}

      {/* Related Images Section - Always show if account is available */}
      {image.postImages?.[0]?.post?.account && (
        <RelatedImages
          currentPostId={image.id}
          account={image.postImages[0].post.account}
          isModal={isModal}
        />
      )}

      {/* ============================================================ */}
      {/* Social Actions & Comments                                     */}
      {/* ============================================================ */}
      <div className="px-6 py-6 md:px-10 border-t border-border">
        <SocialActions
          likeCount={42}
          commentCount={3}
          showComment
          variant="default"
        />
      </div>
      <ImageCommentSection imageId={image.id} />

      {/* Fallback: Show basic info if no items */}
      {!hasItems && (
        <div className="mx-auto max-w-4xl px-4 py-16 md:px-8">
          <div className="mb-8">
            <div className="mb-4 flex flex-wrap gap-2">
              {image.status && (
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wide ${
                    image.status === "pending"
                      ? "bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-100"
                      : image.status === "extracted"
                        ? "bg-emerald-100 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-100"
                        : "bg-slate-100 text-slate-900 dark:bg-slate-800/80 dark:text-slate-100"
                  }`}
                >
                  {image.status}
                </span>
              )}
              {image.with_items && (
                <span className="rounded-full bg-blue-500/80 px-3 py-1 text-xs font-medium uppercase tracking-wide text-blue-100">
                  Items Detected
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Created: {new Date(image.created_at).toLocaleDateString()}
            </p>
          </div>

          <div className="mb-12">
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">
              Image Details
            </h1>
            <p className="text-lg text-muted-foreground">
              Image ID:{" "}
              <code className="rounded bg-muted px-2 py-1 text-sm">
                {image.id}
              </code>
            </p>
          </div>

          <div>
            <h2 className="mb-4 text-2xl font-semibold">Details</h2>
            <p className="text-muted-foreground">
              No items with coordinates found for this image.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
