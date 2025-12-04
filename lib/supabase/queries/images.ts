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

