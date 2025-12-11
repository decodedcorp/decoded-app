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
 * Fetches filtered images based on category filter and search query (client-side)
 *
 * @param filter - Category filter key ('all', 'newjeanscloset', 'blackpinkk.style')
 * @param searchQuery - User-entered search query (debounced)
 * @param limit - Maximum number of images to fetch (default: 50)
 * @returns Array of image rows matching the filter/search criteria, ordered by created_at descending
 * @throws Error if the query fails
 */
export async function fetchFilteredImages(
  filter: CategoryFilter = 'all',
  searchQuery: string = '',
  limit: number = 50
): Promise<ImageRow[]> {
  const hasAccountFilter = filter !== 'all';
  const hasSearchQuery = searchQuery.trim().length > 0;

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
    // Filter by the account in the joined post table
    // Note: The !inner join above ensures we only get images that have a matching post
    queryBuilder = queryBuilder.eq('post_image.post.account', filter);
  }

  // Apply search query if active
  // Note: Searching items while with_items=false might be contradictory if that flag means "no items"
  // But we'll keep the search capability in case "with_items=false" just means "display as raw"
  if (hasSearchQuery) {
    // We need to join items to search them
    // If we already joined post_image, we add item join to the select
    const selectQuery = hasAccountFilter
      ? '*, post_image!inner(post!inner(account)), item!inner(*)'
      : '*, item!inner(*)';
    
    queryBuilder = queryBuilder.select(selectQuery);

    const searchTerm = searchQuery.trim();
    queryBuilder = queryBuilder.or(`product_name.ilike.%${searchTerm}%,brand.ilike.%${searchTerm}%`, { foreignTable: 'item' });
  }

  // Order by created_at descending
  queryBuilder = queryBuilder.order('created_at', { ascending: false });

  // Apply limit
  queryBuilder = queryBuilder.limit(limit);

  const { data, error } = await queryBuilder;

  if (error) {
    throw error;
  }

  // Extract unique images and clean up nested data
  const uniqueImages = new Map<string, ImageRow>();
  if (data) {
    for (const row of data) {
      const imageRow = row as any;
      const imageId = imageRow.id;

      if (imageId && !uniqueImages.has(imageId)) {
        // Extract just the image fields
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

  return Array.from(uniqueImages.values());
}
