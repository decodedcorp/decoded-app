/**
 * Query layer for images table (client-side)
 *
 * This module establishes the pattern: "Supabase direct access only happens in this layer"
 * When RLS policies change, only these query functions need to be updated,
 * keeping frontend code changes minimal.
 *
 * Note: For server-side queries, use images.server.ts instead.
 */

import { supabaseBrowserClient } from "../client";
import type { Database, ImageRow } from "../types";
import { fetchItemsByImageId } from "./items";
// Re-export orphan query and unified adapter
export { fetchOrphanImages } from "./images-orphan";
export { fetchUnifiedImages } from "./images-adapter";

type ItemRow = Database["public"]["Tables"]["item"]["Row"];
type PostRow = Database["public"]["Tables"]["post"]["Row"];

export type PostImageRow = {
  post: PostRow;
  created_at: string;
  item_locations: any | null;
  item_locations_updated_at: string | null;
};

export type ImageDetail = ImageRow & {
  items: ItemRow[];
  posts: PostRow[]; // 기존 유지 (하위 호환성)
  postImages: PostImageRow[]; // post_image 메타데이터 포함
};

export type CategoryFilter = "all" | "newjeanscloset" | "blackpinkk.style";

export type PostSource = "post" | "legacy";

export type ImagePage = {
  items: ImageRow[];
  nextCursor: string | null;
  hasMore: boolean;
};

export type ImageWithPostId = ImageRow & {
  postId: string; // Required (no longer optional)
  postSource: PostSource; // Discriminator for UI logic
  postAccount: string; // Required: account name for badge display
  postImageCreatedAt: string; // Aliased from post_image.created_at (sorting baseline)
  postCreatedAt: string; // Aliased from post.created_at (context)
};

export type ImagePageWithPostId = {
  items: ImageWithPostId[];
  nextCursor: string | null;
  hasMore: boolean;
  stats?: {
    fromPostImage: number;
    fromOrphans: number;
  };
};

export type FetchFilteredImagesParams = {
  limit?: number;
  cursor?: string | null;
  filter?: CategoryFilter;
  search?: string;
};

// Helper to encode composite cursor
export function encodeCursor(createdAt: string, id: string): string {
  return btoa(JSON.stringify({ createdAt, id }));
}

// Helper to decode composite cursor
export function decodeCursor(
  cursor: string
): { createdAt: string; id: string } | null {
  try {
    return JSON.parse(atob(cursor));
  } catch (e) {
    return null;
  }
}

/**
 * Fetches the latest images from the database (client-side)
 *
 * @param limit - Maximum number of images to fetch (default: 20)
 * @returns Array of image rows, ordered by created_at descending
 * @throws Error if the query fails
 */
export async function fetchLatestImages(limit = 20): Promise<ImageRow[]> {
  const { data, error } = await supabaseBrowserClient
    .from("image")
    .select("*")
    .not("image_url", "is", null) // Only fetch records with images
    .eq("with_items", false) // Only fetch original images
    .gte("created_at", "2024-01-01") // Only include data from 2024-01-01 onwards
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw error;
  }

  return data ?? [];
}

/**
 * Fetches a single image by ID from the database (client-side)
 *
 * @param id - Image ID to fetch
 * @returns Image detail with items and posts, or null if not found
 * @throws Error if the query fails
 */
export async function fetchImageById(id: string): Promise<ImageDetail | null> {
  const { data, error } = await supabaseBrowserClient
    .from("image")
    .select(
      `
      *,
      items:item(*),
      post_images:post_image(
        created_at,
        item_locations,
        item_locations_updated_at,
        post(*)
      )
    `
    )
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // No rows returned
      return null;
    }
    throw error;
  }

  // Transform post_images join table to flat posts array (기존 유지 - 하위 호환성)
  const posts = data.post_images
    ? (data.post_images as any[]).map((pi) => pi.post).filter(Boolean)
    : [];

  // Extract post_image metadata (post + created_at + item_locations)
  const postImages = data.post_images
    ? (data.post_images as any[])
        .map((pi) => ({
          post: pi.post,
          created_at: pi.created_at,
          item_locations: pi.item_locations || null,
          item_locations_updated_at: pi.item_locations_updated_at || null,
        }))
        .filter((pi) => pi.post !== null)
    : [];

  // Try to fetch items via post.item_ids first (if post_image exists)
  let items: ItemRow[] = [];
  let itemsFetchedViaPost = false;

  if (postImages.length > 0) {
    // Use the first post's item_ids (or combine all posts' item_ids)
    // For now, use the first post
    const firstPost = postImages[0].post;
    if (firstPost && firstPost.item_ids) {
      try {
        const itemIds = Array.isArray(firstPost.item_ids)
          ? (firstPost.item_ids as string[])
          : [];

        if (itemIds.length > 0) {
          // Convert string IDs to numbers (item.id is bigint/number in DB)
          const itemIdsAsNumbers = itemIds.map((id) => parseInt(id, 10));

          const { data: itemsData, error: itemsError } =
            await supabaseBrowserClient
              .from("item")
              .select("*")
              .in("id", itemIdsAsNumbers);

          if (!itemsError && itemsData) {
            items = itemsData as ItemRow[];
            itemsFetchedViaPost = true;

            if (process.env.NODE_ENV === "development") {
              console.log(
                "[fetchImageById] Fetched items via post.item_ids:",
                items.length,
                "for image:",
                id,
                "post:",
                firstPost.id
              );
            }
          }
        }
      } catch (err) {
        if (process.env.NODE_ENV === "development") {
          console.warn(
            "[fetchImageById] Failed to fetch items via post.item_ids:",
            id,
            err
          );
        }
      }
    }
  }

  // Fallback: If post-based fetch didn't work, use traditional item.image_id approach
  if (!itemsFetchedViaPost) {
    // Ensure items is always an array (Supabase may return different types)
    items = (
      Array.isArray(data.items) ? data.items : data.items ? [data.items] : []
    ) as ItemRow[];

    // Fallback: If join query didn't return items, fetch them separately
    // This can happen if the relationship isn't properly configured or RLS blocks the join
    // This ensures all images with items can display them, regardless of join query success
    if (items.length === 0) {
      try {
        const fetchedItems = await fetchItemsByImageId(id);
        items = fetchedItems;

        if (process.env.NODE_ENV === "development" && fetchedItems.length > 0) {
          console.log(
            "[fetchImageById] Fallback: Fetched items separately:",
            fetchedItems.length,
            "for image:",
            id
          );
        }
      } catch (err) {
        // If separate fetch also fails, log but don't throw (items will be empty array)
        if (process.env.NODE_ENV === "development") {
          console.warn(
            "[fetchImageById] Failed to fetch items separately for image:",
            id,
            err
          );
        }
      }
    }
  }

  return {
    id: data.id,
    created_at: data.created_at,
    image_hash: data.image_hash,
    image_url: data.image_url,
    status: data.status,
    with_items: data.with_items,
    items: items as ItemRow[],
    posts: posts, // 기존 유지 (하위 호환성)
    postImages: postImages as PostImageRow[], // post_image 메타데이터 포함
  };
}

/**
 * Fetches filtered images based on category filter and search query with cursor-based pagination
 *
 * @param params - Fetch parameters including limit, cursor, filter, and search query
 * @returns ImagePage object with items, nextCursor, and hasMore
 * @throws Error if the query fails
 */
export async function fetchFilteredImages(
  params: FetchFilteredImagesParams
): Promise<ImagePage> {
  const { limit = 50, cursor, filter = "all", search = "" } = params;
  const hasAccountFilter = filter !== "all";
  const hasSearchQuery = search.trim().length > 0;

  let data: any[] | null = null;
  let error: any = null;

  // Strategy: Use different query base depending on filter to optimize DB performance
  if (hasAccountFilter) {
    // Strategy A: Filter by Account -> Query 'post_image' table to use index
    // Note: We use post(*) to get all post fields, then extract ts as string in JavaScript
    let queryBuilder = supabaseBrowserClient
      .from("post_image")
      .select(
        hasSearchQuery
          ? "created_at, image!inner(id, image_url, status, with_items, image_hash, created_at, item!inner(product_name, brand)), post!inner(account)"
          : "created_at, image!inner(id, image_url, status, with_items, image_hash, created_at), post!inner(account)"
      )
      .eq("post.account", filter);

    // Apply basic filters on the joined image table
    // Note: Supabase/Postgrest syntax for nested filtering
    queryBuilder = queryBuilder
      .not("image.image_url", "is", null)
      .eq("image.with_items", false);

    if (hasSearchQuery) {
      const searchTerm = search.trim();
      // Complex OR filter across joined tables is tricky in Supabase
      // Simplified: Filter on item fields
      queryBuilder = queryBuilder.or(
        `product_name.ilike.%${searchTerm}%,brand.ilike.%${searchTerm}%`,
        { foreignTable: "image.item" }
      );
    }

    // Note: We don't use cursor pagination here because we need to filter by post.ts
    // Instead, we fetch a larger batch and filter/sort by post.ts in memory
    queryBuilder = queryBuilder
      .order("created_at", { ascending: false })
      .order("image_id", { ascending: false })
      .limit(limit * 5); // Fetch more to account for post.ts filtering and pagination

    const result = await queryBuilder;
    data = result.data;
    error = result.error;
  } else {
    // Strategy B: No Filter -> Query 'image' table directly
    const selectColumns =
      "id, image_url, created_at, status, with_items, image_hash";

    let queryBuilder = supabaseBrowserClient
      .from("image")
      .select(
        hasSearchQuery
          ? `${selectColumns}, item!inner(product_name, brand)`
          : selectColumns
      )
      .not("image_url", "is", null)
      .eq("with_items", false)
      .gte("created_at", "2024-01-01"); // Only include data from 2024-01-01 onwards

    if (hasSearchQuery) {
      const searchTerm = search.trim();
      queryBuilder = queryBuilder.or(
        `product_name.ilike.%${searchTerm}%,brand.ilike.%${searchTerm}%`,
        { foreignTable: "item" }
      );
    }

    if (cursor) {
      const decoded = decodeCursor(cursor);
      if (decoded) {
        const { createdAt, id } = decoded;
        queryBuilder = queryBuilder.or(
          `and(created_at.eq.${createdAt},id.lt.${id}),created_at.lt.${createdAt}`
        );
      }
    }

    queryBuilder = queryBuilder
      .order("created_at", { ascending: false })
      .order("id", { ascending: false })
      .limit(limit + 1);

    const result = await queryBuilder;
    data = result.data;
    error = result.error;
  }

  if (error) {
    throw error;
  }

  // Extract and Normalize images
  const uniqueImages = new Map<string, ImageRow>();
  if (data) {
    if (hasAccountFilter) {
      // Strategy A: Fetch post.ts values in batch for filtering
      const postIds = new Set<string>();
      const rowData = new Map<string, any>();

      for (const row of data) {
        if (!row.image) continue;
        const postRow = Array.isArray(row.post) ? row.post[0] : row.post;
        if (postRow?.id) {
          postIds.add(postRow.id);
          rowData.set(postRow.id, row);
        }
      }

      // Fetch post.ts values in batch (as text to avoid timestamp parsing errors)
      const postTsMap = new Map<string, string>();
      if (postIds.size > 0) {
        const { data: postsData, error: postsError } =
          await supabaseBrowserClient
            .from("post")
            .select("id, ts")
            .in("id", Array.from(postIds));

        if (!postsError && postsData) {
          for (const post of postsData) {
            // Convert ts to string (it may come as Date or string)
            const tsValue = post.ts
              ? typeof post.ts === "string"
                ? post.ts
                : String(post.ts)
              : null;
            if (tsValue) {
              postTsMap.set(post.id, tsValue);
            }
          }
        }
      }

      // Decode cursor if provided (cursor contains post.ts value from previous page)
      let cursorPostTs: string | null = null;
      let cursorImageId: string | null = null;
      if (cursor) {
        const decoded = decodeCursor(cursor);
        if (decoded) {
          cursorPostTs = decoded.createdAt; // This is post.ts from previous page
          cursorImageId = decoded.id;
        }
      }

      // Process rows using post.ts for filtering
      for (const row of data) {
        if (!row.image) continue;
        const imageRow = Array.isArray(row.image) ? row.image[0] : row.image;
        const postRow = Array.isArray(row.post) ? row.post[0] : row.post;

        if (!postRow?.id) continue;

        // Get post.ts value (fallback to post_image.created_at if not available)
        const postTs = postTsMap.get(postRow.id) || row.created_at;

        // Filter by post.ts >= 2024-01-01
        if (!postTs || postTs < "2024-01-01") continue;

        // Apply cursor pagination filter (post.ts based)
        if (cursorPostTs) {
          // Skip items with post.ts >= cursorPostTs (already shown in previous page)
          if (postTs > cursorPostTs) continue;
          if (postTs === cursorPostTs && imageRow.id >= cursorImageId!)
            continue;
        }

        if (imageRow && imageRow.id && !uniqueImages.has(imageRow.id)) {
          const image: ImageRow = {
            id: imageRow.id,
            image_hash: imageRow.image_hash,
            image_url: imageRow.image_url,
            with_items: imageRow.with_items,
            status: imageRow.status,
            created_at: postTs, // Use post.ts for sorting
          };
          uniqueImages.set(imageRow.id, image);
        }
      }
    } else {
      // Strategy B: row is image
      for (const row of data) {
        const imageRow = row;
        const sortTime = row.created_at;

        // Filter by created_at >= 2024-01-01
        if (!sortTime || sortTime < "2024-01-01") continue;

        if (imageRow && imageRow.id && !uniqueImages.has(imageRow.id)) {
          const image: ImageRow = {
            id: imageRow.id,
            image_hash: imageRow.image_hash,
            image_url: imageRow.image_url,
            with_items: imageRow.with_items,
            status: imageRow.status,
            created_at: sortTime,
          };
          uniqueImages.set(imageRow.id, image);
        }
      }
    }
  }

  // Sort by created_at (post.ts for Strategy A, image.created_at for Strategy B) descending
  const allItems = Array.from(uniqueImages.values()).sort((a, b) => {
    let timeA: number;
    let timeB: number;
    try {
      timeA = new Date(a.created_at).getTime();
      timeB = new Date(b.created_at).getTime();
    } catch (e) {
      return 0; // Fallback: maintain order
    }
    if (timeB !== timeA) {
      return timeB - timeA; // Descending
    }
    return b.id.localeCompare(a.id);
  });

  const hasMore = allItems.length > limit;
  const items = hasMore ? allItems.slice(0, limit) : allItems;

  let nextCursor = null;
  if (hasMore && items.length > 0) {
    const lastItem = items[items.length - 1];
    nextCursor = encodeCursor(lastItem.created_at, lastItem.id);
  }

  return { items, nextCursor, hasMore };
}

/**
 * Fetches images via post_image table with post_id information
 * This function always uses post_image table to ensure post context is available
 *
 * @param params - Fetch parameters including limit, cursor, filter, and search query
 * @returns ImagePageWithPostId object with items (including postId), nextCursor, and hasMore
 * @throws Error if the query fails
 */
export async function fetchImagesByPostImage(
  params: FetchFilteredImagesParams
): Promise<ImagePageWithPostId> {
  const { limit = 50, cursor, filter = "all", search = "" } = params;

  const hasAccountFilter = filter !== "all";
  const hasSearchQuery = search.trim().length > 0;

  // Always query post_image table to get post context
  // Note: We exclude post.ts from select to avoid PostgreSQL timestamp parsing errors
  // We'll use post_image.created_at for sorting/filtering instead (should be close to post.ts)
  let queryBuilder = supabaseBrowserClient
    .from("post_image")
    .select(
      hasSearchQuery
        ? "created_at, post_id, image!inner(id, image_url, status, with_items, image_hash, created_at, item!inner(product_name, brand)), post!inner(account, id, created_at)"
        : "created_at, post_id, image!inner(id, image_url, status, with_items, image_hash, created_at), post!inner(account, id, created_at)"
    );

  // Apply account filter if specified
  if (hasAccountFilter) {
    queryBuilder = queryBuilder.eq("post.account", filter);
  }

  // Apply basic filters on the joined image table
  queryBuilder = queryBuilder
    .not("image.image_url", "is", null)
    .eq("image.with_items", false);

  // Apply search filter if specified
  if (hasSearchQuery) {
    const searchTerm = search.trim();
    queryBuilder = queryBuilder.or(
      `product_name.ilike.%${searchTerm}%,brand.ilike.%${searchTerm}%`,
      { foreignTable: "image.item" }
    );
  }

  // Note: We don't use cursor pagination here because we need to filter by post.ts
  // Instead, we fetch a larger batch and filter/sort by post.ts in memory
  // Cursor will be generated based on post.ts after filtering
  queryBuilder = queryBuilder
    .order("created_at", { ascending: false })
    .order("image_id", { ascending: false })
    .limit(limit * 5); // Fetch more to account for post.ts filtering and pagination

  const { data, error } = await queryBuilder;

  if (error) {
    throw error;
  }

  // Extract and normalize images with full post metadata
  const uniqueImages = new Map<string, ImageWithPostId>();
  const postIdToRowMap = new Map<string, any>(); // Map to store row data by post_id

  if (data) {
    // First pass: collect all post_ids and row data
    const postIds = new Set<string>();
    for (const row of data) {
      if (!row.image) continue;
      const postRow = Array.isArray(row.post) ? row.post[0] : row.post;
      if (postRow?.id) {
        postIds.add(postRow.id);
        postIdToRowMap.set(postRow.id, row);
      }
    }

    // Fetch post.ts values in batch (as text to avoid timestamp parsing errors)
    const postTsMap = new Map<string, string>();
    if (postIds.size > 0) {
      const { data: postsData, error: postsError } = await supabaseBrowserClient
        .from("post")
        .select("id, ts")
        .in("id", Array.from(postIds));

      if (!postsError && postsData) {
        for (const post of postsData) {
          // Convert ts to string (it may come as Date or string)
          const tsValue = post.ts
            ? typeof post.ts === "string"
              ? post.ts
              : String(post.ts)
            : null;
          if (tsValue) {
            postTsMap.set(post.id, tsValue);
          }
        }
      }
    }

    // Decode cursor if provided (cursor contains post.ts value from previous page)
    let cursorPostTs: string | null = null;
    let cursorImageId: string | null = null;
    if (cursor) {
      const decoded = decodeCursor(cursor);
      if (decoded) {
        cursorPostTs = decoded.createdAt; // This is post.ts from previous page
        cursorImageId = decoded.id;
      }
    }

    // Second pass: filter and process rows using post.ts
    for (const row of data) {
      if (!row.image) continue;
      const imageRow = Array.isArray(row.image) ? row.image[0] : row.image;
      const postRow = Array.isArray(row.post) ? row.post[0] : row.post;

      if (!postRow?.id) continue;

      // Get post.ts value (fallback to post_image.created_at if not available)
      const postTs = postTsMap.get(postRow.id) || row.created_at;

      // Filter by post.ts >= 2024-01-01
      if (!postTs || postTs < "2024-01-01") continue;

      // Apply cursor pagination filter (post.ts based)
      if (cursorPostTs) {
        // Skip items with post.ts >= cursorPostTs (already shown in previous page)
        if (postTs > cursorPostTs) continue;
        if (postTs === cursorPostTs && imageRow.id >= cursorImageId!) continue;
      }

      if (
        imageRow &&
        imageRow.id &&
        postRow &&
        !uniqueImages.has(imageRow.id)
      ) {
        const image: ImageWithPostId = {
          id: imageRow.id,
          image_hash: imageRow.image_hash,
          image_url: imageRow.image_url,
          with_items: imageRow.with_items,
          status: imageRow.status,
          created_at: postTs, // Use post.ts for sorting
          postId: row.post_id,
          postSource: "post" as const,
          postAccount: postRow.account,
          postImageCreatedAt: postTs, // Use post.ts
          postCreatedAt: postRow.created_at, // post.created_at
        };
        uniqueImages.set(imageRow.id, image);
      }
    }
  }

  // Sort by post.ts descending, then by image id
  const allItems = Array.from(uniqueImages.values()).sort((a, b) => {
    let timeA: number;
    let timeB: number;
    try {
      timeA = new Date(a.created_at).getTime();
      timeB = new Date(b.created_at).getTime();
    } catch (e) {
      return 0; // Fallback: maintain order
    }
    if (timeB !== timeA) {
      return timeB - timeA; // Descending
    }
    return b.id.localeCompare(a.id);
  });

  const hasMore = allItems.length > limit;
  const items = hasMore ? allItems.slice(0, limit) : allItems;

  let nextCursor = null;
  if (hasMore && items.length > 0) {
    const lastItem = items[items.length - 1];
    nextCursor = encodeCursor(lastItem.created_at, lastItem.id);
  }

  return { items, nextCursor, hasMore };
}

/**
 * Fetches related images from the same account
 *
 * @param currentImageId - ID of the current image (to exclude)
 * @param account - Account name to fetch images for
 * @param limit - Maximum number of images to fetch (default: 6)
 * @returns Array of image rows
 */
export async function fetchRelatedImagesByAccount(
  currentImageId: string,
  account: string,
  limit: number = 6
): Promise<ImageRow[]> {
  const { data, error } = await supabaseBrowserClient
    .from("post_image")
    .select(
      "created_at, image!inner(id, image_url, status, with_items, image_hash, created_at), post!inner(account)"
    )
    .eq("post.account", account)
    .not("image.id", "eq", currentImageId) // Exclude current image
    .not("image.image_url", "is", null)
    .eq("image.with_items", false)
    .order("created_at", { ascending: false })
    .limit(limit * 3); // Fetch more to handle potential duplicates and post.ts filtering

  if (error) {
    throw error;
  }

  // Deduplicate and extract images
  const uniqueImages = new Map<string, ImageRow>();
  if (data) {
    // First pass: collect all post_ids
    const postIds = new Set<string>();
    for (const row of data) {
      if (!row.image) continue;
      const postRow = Array.isArray(row.post) ? row.post[0] : row.post;
      if (postRow?.id) {
        postIds.add(postRow.id);
      }
    }

    // Fetch post.ts values in batch (as text to avoid timestamp parsing errors)
    const postTsMap = new Map<string, string>();
    if (postIds.size > 0) {
      const { data: postsData, error: postsError } = await supabaseBrowserClient
        .from("post")
        .select("id, ts")
        .in("id", Array.from(postIds));

      if (!postsError && postsData) {
        for (const post of postsData) {
          // Convert ts to string (it may come as Date or string)
          const tsValue = post.ts
            ? typeof post.ts === "string"
              ? post.ts
              : String(post.ts)
            : null;
          if (tsValue) {
            postTsMap.set(post.id, tsValue);
          }
        }
      }
    }

    // Second pass: filter and process rows using post.ts
    for (const row of data) {
      // row is post_image, contains image object
      if (!row.image) continue;
      const imageRow = Array.isArray(row.image) ? row.image[0] : row.image;
      const postRow = Array.isArray(row.post) ? row.post[0] : row.post;

      if (!postRow?.id) continue;

      // Get post.ts value (fallback to post_image.created_at if not available)
      const postTs = postTsMap.get(postRow.id) || row.created_at;

      // Filter by post.ts >= 2024-01-01
      if (!postTs || postTs < "2024-01-01") continue;

      if (imageRow && imageRow.id && !uniqueImages.has(imageRow.id)) {
        const image: ImageRow = {
          id: imageRow.id,
          image_hash: imageRow.image_hash,
          image_url: imageRow.image_url,
          with_items: imageRow.with_items,
          status: imageRow.status,
          created_at: postTs, // Use post.ts
        };
        uniqueImages.set(imageRow.id, image);

        if (uniqueImages.size >= limit) break;
      }
    }
  }

  // Sort by post.ts descending
  const sortedImages = Array.from(uniqueImages.values()).sort((a, b) => {
    const timeA = new Date(a.created_at).getTime();
    const timeB = new Date(b.created_at).getTime();
    if (timeB !== timeA) {
      return timeB - timeA; // Descending
    }
    return b.id.localeCompare(a.id);
  });

  return sortedImages.slice(0, limit);
}
