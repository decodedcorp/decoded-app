/**
 * Query layer for items table (client-side)
 *
 * This module follows the same pattern as images.ts:
 * "Supabase direct access only happens in this layer"
 * When RLS policies change, only these query functions need to be updated.
 */

import { supabaseBrowserClient } from '../client';
import type { Database } from '../types';

export type ItemRow = Database['public']['Tables']['item']['Row'];

/**
 * Fetches all items for a given image ID (client-side)
 *
 * @param imageId - Image ID to fetch items for
 * @returns Array of item rows, ordered by created_at ascending
 * @throws Error if the query fails
 */
export async function fetchItemsByImageId(
  imageId: string
): Promise<ItemRow[]> {
  const { data, error } = await supabaseBrowserClient
    .from('item')
    .select('*')
    .eq('image_id', imageId)
    .order('created_at', { ascending: true });

  if (error) {
    throw error;
  }

  return data ?? [];
}

