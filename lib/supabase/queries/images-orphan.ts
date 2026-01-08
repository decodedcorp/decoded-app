/**
 * Orphan image fallback query
 * Separate file to avoid conflicts during refactoring
 */

import { supabaseBrowserClient } from "../client";
import type { ImagePageWithPostId } from "./images";
import { encodeCursor, decodeCursor } from "./images";

/**
 * Fallback query for images without post_image entries
 * Returns images with synthetic post metadata for orphaned images
 *
 * Note: With 0% orphan rate (as of audit), this is primarily for future-proofing
 */
export async function fetchOrphanImages(params: {
  limit: number;
  cursor?: string | null;
}): Promise<ImagePageWithPostId> {
  const { limit, cursor } = params;

  // Fetch all images
  const query = supabaseBrowserClient
    .from("image")
    .select(
      `
      id,
      image_url,
      status,
      with_items,
      image_hash,
      created_at
    `
    )
    .not("image_url", "is", null)
    .eq("with_items", false)
    .gte("created_at", "2024-01-01"); // Only include data from 2024-01-01 onwards

  const { data: allImages, error: imagesError } = await query;

  if (imagesError) {
    throw imagesError;
  }

  // Fetch all linked image IDs from post_image
  const { data: linkedImages, error: linkedError } = await supabaseBrowserClient
    .from("post_image")
    .select("image_id");

  if (linkedError) {
    throw linkedError;
  }

  // Find orphans (images not in post_image)
  const linkedIds = new Set(linkedImages?.map((pi) => pi.image_id) || []);
  const orphans = allImages?.filter((img) => !linkedIds.has(img.id)) || [];

  // Apply cursor pagination
  let filteredOrphans = orphans;
  if (cursor) {
    const decoded = decodeCursor(cursor);
    if (decoded) {
      const { createdAt, id } = decoded;
      filteredOrphans = orphans.filter((img) => {
        if (img.created_at < createdAt) return true;
        if (img.created_at === createdAt && img.id < id) return true;
        return false;
      });
    }
  }

  // Sort by created_at descending
  filteredOrphans.sort((a, b) => {
    if (b.created_at !== a.created_at) {
      return b.created_at.localeCompare(a.created_at);
    }
    return b.id.localeCompare(a.id);
  });

  // Transform to ImageWithPostId with synthetic metadata
  const items: import("./images").ImageWithPostId[] = filteredOrphans
    .slice(0, limit)
    .map((img) => ({
      ...img,
      postId: `legacy:${img.id}`,
      postSource: "legacy" as const,
      postAccount: "Legacy", // Not "Archive" - avoids future naming collision
      postImageCreatedAt: img.created_at,
      postCreatedAt: img.created_at,
    }));

  const hasMore = filteredOrphans.length > limit;
  let nextCursor = null;
  if (hasMore && items.length > 0) {
    const lastItem = items[items.length - 1];
    nextCursor = encodeCursor(lastItem.created_at, lastItem.id);
  }

  return {
    items,
    nextCursor,
    hasMore,
    stats: {
      fromPostImage: 0,
      fromOrphans: items.length,
    },
  };
}
