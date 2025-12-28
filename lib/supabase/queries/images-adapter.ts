/**
 * Unified adapter layer for post-centric image fetching
 * Combines post-based and orphan images with deduplication
 */

import type {
  FetchFilteredImagesParams,
  ImagePageWithPostId,
  ImageWithPostId,
} from "./images";
import { fetchImagesByPostImage, encodeCursor } from "./images";
import { fetchOrphanImages } from "./images-orphan";

/**
 * Unified adapter: merges post-based and orphan images
 * Applies deduplication policy based on context
 *
 * @param params - Fetch parameters including limit, cursor, filter, and search query
 * @param params.deduplicateByImageId - Whether to deduplicate by image.id (default: true for gallery mode)
 * @returns ImagePageWithPostId with stats on data sources
 */
export async function fetchUnifiedImages(
  params: FetchFilteredImagesParams & { deduplicateByImageId?: boolean }
): Promise<ImagePageWithPostId> {
  const { deduplicateByImageId = true, ...queryParams } = params;

  // Primary: fetch from post_image
  const postBasedResult = await fetchImagesByPostImage(queryParams);

  // Fallback: fetch orphans if not at capacity
  let orphanResult: ImagePageWithPostId = {
    items: [],
    nextCursor: null,
    hasMore: false,
    stats: { fromPostImage: 0, fromOrphans: 0 },
  };

  if (postBasedResult.items.length < (queryParams.limit || 50)) {
    const remainingSlots =
      (queryParams.limit || 50) - postBasedResult.items.length;
    orphanResult = await fetchOrphanImages({ limit: remainingSlots });
  }

  // Merge results
  let allItems = [...postBasedResult.items, ...orphanResult.items];

  // Apply deduplication if needed (for gallery mode)
  if (deduplicateByImageId) {
    const seen = new Map<string, ImageWithPostId>();
    allItems.forEach((item) => {
      if (!seen.has(item.id)) {
        seen.set(item.id, item);
      }
    });
    allItems = Array.from(seen.values());
  }

  // Sort by post_image.created_at (primary), image.created_at (fallback)
  allItems.sort((a, b) => {
    const timeA = new Date(a.postImageCreatedAt || a.created_at).getTime();
    const timeB = new Date(b.postImageCreatedAt || b.created_at).getTime();
    if (timeB !== timeA) {
      return timeB - timeA; // Descending
    }
    // Tie-breaker: use image ID
    return b.id.localeCompare(a.id);
  });

  const finalLimit = queryParams.limit || 50;
  const items = allItems.slice(0, finalLimit);
  const hasMore =
    allItems.length > finalLimit ||
    postBasedResult.hasMore ||
    orphanResult.hasMore;

  // Generate cursor: prefer postBasedResult cursor (for proper pagination)
  // Only use sorted result cursor if postBasedResult has no more pages
  let nextCursor = null;
  if (hasMore) {
    // Use postBasedResult cursor if available (maintains DB pagination consistency)
    if (postBasedResult.hasMore && postBasedResult.nextCursor) {
      nextCursor = postBasedResult.nextCursor;
    } else if (orphanResult.hasMore && orphanResult.nextCursor) {
      // Fallback to orphan cursor if post-based is exhausted
      nextCursor = orphanResult.nextCursor;
    } else if (items.length > 0) {
      // Last resort: generate from sorted result (shouldn't happen in normal flow)
      const lastItem = items[items.length - 1];
      nextCursor = encodeCursor(
        lastItem.postImageCreatedAt || lastItem.created_at,
        lastItem.id
      );
    }
  }

  // Log stats in development
  if (
    process.env.NODE_ENV === "development" ||
    process.env.ENABLE_QUERY_STATS
  ) {
    const fromPost =
      postBasedResult.stats?.fromPostImage || postBasedResult.items.length;
    const fromOrphans =
      orphanResult.stats?.fromOrphans || orphanResult.items.length;
    const deduplicatedCount = allItems.length;

    console.log("[fetchUnifiedImages] Stats:", {
      fromPostImage: fromPost,
      fromOrphans: fromOrphans,
      deduplicatedCount,
      finalCount: items.length,
      orphanRate:
        fromOrphans > 0
          ? ((fromOrphans / (fromPost + fromOrphans)) * 100).toFixed(2) + "%"
          : "0%",
    });
  }

  return {
    items,
    nextCursor,
    hasMore,
    stats: {
      fromPostImage:
        postBasedResult.stats?.fromPostImage || postBasedResult.items.length,
      fromOrphans: orphanResult.stats?.fromOrphans || orphanResult.items.length,
    },
  };
}
