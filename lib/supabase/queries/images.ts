/**
 * Query layer for images table (client-side)
 *
 * This module establishes the pattern: "Supabase direct access only happens in this layer"
 * When RLS policies change, only these query functions need to be updated,
 * keeping frontend code changes minimal.
 *
 * Note: For server-side queries, use images.server.ts instead.
 */

import { supabaseBrowserClient } from '../client';
import type { ImageRow } from '../types';

export type CategoryFilter = 'all' | 'newjeanscloset' | 'blackpinkk.style';

export type ImagePage = {
  items: ImageRow[];
  nextCursor: string | null;
  hasMore: boolean;
};

export type FetchFilteredImagesParams = {
  limit?: number;
  cursor?: string | null;
  filter?: CategoryFilter;
  search?: string;
};

// Helper to encode composite cursor
function encodeCursor(createdAt: string, id: string): string {
  return btoa(JSON.stringify({ createdAt, id }));
}

// Helper to decode composite cursor
function decodeCursor(cursor: string): { createdAt: string; id: string } | null {
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
    .from('image')
    .select('*')
    .not('image_url', 'is', null) // Only fetch records with images
    .eq('with_items', false) // Only fetch original images
    .order('created_at', { ascending: false })
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
 * @returns Image row or null if not found
 * @throws Error if the query fails
 */
export async function fetchImageById(id: string): Promise<ImageRow | null> {
  const { data, error } = await supabaseBrowserClient
    .from('image')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned
      return null;
    }
    throw error;
  }

  return data;
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
  const { limit = 50, cursor, filter = 'all', search = '' } = params;
  const hasAccountFilter = filter !== 'all';
  const hasSearchQuery = search.trim().length > 0;

  // Build the query
  // Start with 'image' and basic filters
  let queryBuilder = supabaseBrowserClient.from('image').select(
    hasAccountFilter
      ? '*, post_image!inner(post!inner(account))' // Join post for account filtering
      : '*'
  );

  // Always apply these base filters
  queryBuilder = queryBuilder
    .not('image_url', 'is', null)
    .eq('with_items', false);

  // Apply account filter if active
  if (hasAccountFilter) {
    queryBuilder = queryBuilder.eq('post_image.post.account', filter);
  }

  // Apply search query if active
  if (hasSearchQuery) {
    const selectQuery = hasAccountFilter
      ? '*, post_image!inner(post!inner(account)), item!inner(*)'
      : '*, item!inner(*)';
    
    queryBuilder = queryBuilder.select(selectQuery);
    const searchTerm = search.trim();
    queryBuilder = queryBuilder.or(`product_name.ilike.%${searchTerm}%,brand.ilike.%${searchTerm}%`, { foreignTable: 'item' });
  }

  // Apply cursor pagination
  if (cursor) {
    const decoded = decodeCursor(cursor);
    if (decoded) {
      // Composite cursor condition: (created_at < cursorTime) OR (created_at = cursorTime AND id < cursorId)
      // Since Supabase doesn't support complex OR conditions easily across fields in a single .or() string without raw SQL,
      // and we want to keep using the query builder for type safety as much as possible,
      // we'll stick to a simpler approach first or use a raw filter if needed.
      // However, typical reliable pagination uses just one field if unique, or filter.
      // For strictly correct cursor pagination with (created_at desc, id desc):
      // row(created_at, id) < row(cursorTime, cursorId)
      
      // Let's rely on filter composition which Supabase handles well for simple cases.
      // But for composite keys, we need to be careful.
      // A common simplification is to trust created_at implies order, but duplicates can happen.
      // We will try to filter strictly less than created_at for simplicity in this MVP step, 
      // but the Plan asked for composite logic.
      // Supabase-js syntax for composite comparison is tricky without RPC.
      // We will filter: created_at <= cursorTime.
      // Then if created_at == cursorTime, filter id < cursorId.
      // Since .or() is powerful, let's try to construct the composite logic string.
      
      const { createdAt, id } = decoded;
      // Note: we need to verify timestamp format safe for URL/Query
      
      // OR syntax: .or('and(created_at.eq.time,id.lt.uuid),created_at.lt.time')
      queryBuilder = queryBuilder.or(`and(created_at.eq.${createdAt},id.lt.${id}),created_at.lt.${createdAt}`);
    }
  }

  // Order by created_at descending, then id descending for stability
  queryBuilder = queryBuilder
    .order('created_at', { ascending: false })
    .order('id', { ascending: false });

  // Limit + 1 to check hasMore
  queryBuilder = queryBuilder.limit(limit + 1);

  const { data, error } = await queryBuilder;

  if (error) {
    throw error;
  }

  // Extract unique images
  const uniqueImages = new Map<string, ImageRow>();
  if (data) {
    for (const row of data) {
      const imageRow = row as any;
      const imageId = imageRow.id;

      if (imageId && !uniqueImages.has(imageId)) {
        const image: ImageRow = {
          id: imageRow.id,
          image_hash: imageRow.image_hash,
          image_url: imageRow.image_url,
          with_items: imageRow.with_items,
          status: imageRow.status,
          created_at: imageRow.created_at,
        };
        uniqueImages.set(imageId, image);
      }
    }
  }

  const allItems = Array.from(uniqueImages.values());
  const hasMore = allItems.length > limit;
  const items = hasMore ? allItems.slice(0, limit) : allItems;
  
  let nextCursor = null;
  if (hasMore && items.length > 0) {
    const lastItem = items[items.length - 1];
    nextCursor = encodeCursor(lastItem.created_at, lastItem.id);
  }

  return { items, nextCursor, hasMore };
}
