/**
 * Unified adapter layer for post-centric image fetching (shared across web and mobile)
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
 */
export async function fetchUnifiedImages(
  params: FetchFilteredImagesParams & { deduplicateByImageId?: boolean }
): Promise<ImagePageWithPostId> {
  const { deduplicateByImageId = true, ...queryParams } = params;

  const postBasedResult = await fetchImagesByPostImage(queryParams);

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

  let allItems = [...postBasedResult.items, ...orphanResult.items];

  if (deduplicateByImageId) {
    const seen = new Map<string, ImageWithPostId>();
    allItems.forEach((item) => {
      if (!seen.has(item.id)) {
        seen.set(item.id, item);
      }
    });
    allItems = Array.from(seen.values());
  }

  allItems.sort((a, b) => {
    const timeA = new Date(a.postImageCreatedAt || a.created_at).getTime();
    const timeB = new Date(b.postImageCreatedAt || b.created_at).getTime();
    if (timeB !== timeA) {
      return timeB - timeA;
    }
    return b.id.localeCompare(a.id);
  });

  const finalLimit = queryParams.limit || 50;
  const items = allItems.slice(0, finalLimit);
  const hasMore =
    allItems.length > finalLimit ||
    postBasedResult.hasMore ||
    orphanResult.hasMore;

  let nextCursor = null;
  if (hasMore) {
    if (postBasedResult.hasMore && postBasedResult.nextCursor) {
      nextCursor = postBasedResult.nextCursor;
    } else if (orphanResult.hasMore && orphanResult.nextCursor) {
      nextCursor = orphanResult.nextCursor;
    } else if (items.length > 0) {
      const lastItem = items[items.length - 1];
      nextCursor = encodeCursor(
        lastItem.postImageCreatedAt || lastItem.created_at,
        lastItem.id
      );
    }
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
