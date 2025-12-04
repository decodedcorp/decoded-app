/**
 * Server-side query functions for images table
 *
 * This module contains server-only query functions that use createSupabaseServerClient.
 * These functions can only be used in Server Components and Route Handlers.
 */

import { createSupabaseServerClient } from '../server';
import type { ImageRow } from '../types';

/**
 * Fetches the latest images from the database (server-side)
 *
 * Use this function in Server Components and Route Handlers.
 *
 * @param limit - Maximum number of images to fetch (default: 20)
 * @returns Array of image rows, ordered by created_at descending
 * @throws Error if the query fails
 */
export async function fetchLatestImagesServer(limit = 20): Promise<ImageRow[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
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

