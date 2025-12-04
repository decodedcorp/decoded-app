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

/**
 * Mini-ADR: Filter & Search Implementation Strategy
 *
 * Decision: Use ilike pattern matching on item.product_name and item.brand for filtering/searching.
 * Reason: MVP speed, minimal schema changes required. Works immediately once item data is populated.
 * Future: Migrate to image.category column or dedicated tags table when schema matures.
 *
 * Assumptions:
 * - image ↔ item relationship: item.image_id -> image.id (1:N, one image can have multiple items)
 * - Filter categories are text-based enum-like values: 'all' | 'latest' | 'clothing' | 'accessories' | 'shoes' | 'bags'
 * - Data volume is manageable for ilike '%keyword%' performance (thousands to tens of thousands of records)
 *
 * Reversibility: High - query layer is isolated, can be replaced with category column or view/RPC later.
 */

export type CategoryFilter = 'all' | 'latest' | 'clothing' | 'accessories' | 'shoes' | 'bags';

/**
 * Maps UI filter keys to search keywords for ilike pattern matching
 *
 * This is a temporary mapping layer. When category column is introduced,
 * this will be replaced with direct column equality checks.
 */
const CATEGORY_KEYWORDS: Record<CategoryFilter, string[]> = {
  all: [],
  latest: [], // 'latest' is handled by ordering, not keyword matching
  clothing: ['jacket', 'coat', 'dress', 'shirt', 'pants', 'jeans', 'top', 'bottom', '상의', '하의', '의류'],
  accessories: ['accessory', 'accessories', 'jewelry', 'watch', 'hat', 'cap', '액세서리', '장신구'],
  shoes: ['shoe', 'sneaker', 'boot', 'sandal', 'heel', 'loafer', '신발', '부츠', '운동화'],
  bags: ['bag', 'tote', 'clutch', 'backpack', 'handbag', 'shoulder', '가방', '백', '핸드백'],
};

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
    // TODO: narrow down selected fields once UI is finalized
    .select('*')
    .not('image_url', 'is', null) // Only fetch records with images
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
 * This function implements server-side filtering using ilike pattern matching on item fields.
 * See Mini-ADR comment at top of file for strategy details.
 *
 * @param filter - Category filter key ('all', 'latest', 'clothing', etc.)
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
  // Determine if we need to filter by category or search query
  const keywords = filter !== 'all' && filter !== 'latest' ? CATEGORY_KEYWORDS[filter] : [];
  const hasCategoryFilter = keywords.length > 0;
  const hasSearchQuery = searchQuery.trim().length > 0;
  const needsItemJoin = hasCategoryFilter || hasSearchQuery;

  // Build the base query with appropriate select
  // Assumption: item.image_id -> image.id (1:N relationship)
  // TODO: Update join when schema relationship changes
  let queryBuilder = needsItemJoin
    ? supabaseBrowserClient.from('image').select('*, item!inner(*)')
    : supabaseBrowserClient.from('image').select('*');

  // Apply base filter: only images with image_url
  queryBuilder = queryBuilder.not('image_url', 'is', null);

  // Build combined OR conditions for both category keywords and search query
  if (needsItemJoin) {
    const allConditions: string[] = [];
    
    // Add category keyword conditions
    if (hasCategoryFilter) {
      keywords.forEach((keyword) => {
        allConditions.push(`item.product_name.ilike.%${keyword}%`);
        allConditions.push(`item.brand.ilike.%${keyword}%`);
      });
    }
    
    // Add search query conditions
    if (hasSearchQuery) {
      const searchTerm = searchQuery.trim();
      allConditions.push(`item.product_name.ilike.%${searchTerm}%`);
      allConditions.push(`item.brand.ilike.%${searchTerm}%`);
    }
    
    // Apply combined OR filter
    if (allConditions.length > 0) {
      queryBuilder = queryBuilder.or(allConditions.join(','));
    }
  }

  // Order by created_at descending (newest first)
  // 'latest' filter is handled here via ordering
  queryBuilder = queryBuilder.order('created_at', { ascending: false });

  // Apply limit
  queryBuilder = queryBuilder.limit(limit);

  const { data, error } = await queryBuilder;

  if (error) {
    throw error;
  }

  // Extract unique images (since join with item can create duplicates)
  // Group by image.id and take the first occurrence
  const uniqueImages = new Map<string, ImageRow>();
  if (data) {
    for (const row of data) {
      // Handle both cases: row might be ImageRow directly or have nested structure from join
      const imageRow = row as any;
      const imageId = imageRow.id;
      
      if (imageId && !uniqueImages.has(imageId)) {
        // Extract just the image fields (exclude nested item data)
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

