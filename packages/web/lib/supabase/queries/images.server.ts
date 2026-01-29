/**
 * Server-side query functions for images table
 *
 * This module contains server-only query functions that use createSupabaseServerClient.
 * These functions can only be used in Server Components and Route Handlers.
 */

import { createSupabaseServerClient } from "../server";
import type { ImageRow } from "../types";

/**
 * Fetches the latest images from the database (server-side)
 *
 * Use this function in Server Components and Route Handlers.
 *
 * @param limit - Maximum number of images to fetch (default: 20)
 * @returns Array of image rows, ordered by created_at descending (empty array on error)
 */
export async function fetchLatestImagesServer(limit = 20): Promise<ImageRow[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("image")
    // TODO: narrow down selected fields once UI is finalized
    .select("*")
    .not("image_url", "is", null) // Only fetch records with images
    .eq("with_items", false) // Only fetch original images
    .gte("created_at", "2024-01-01") // Only include data from 2024-01-01 onwards
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching latest images:", error);
    return [];
  }

  return data ?? [];
}

/**
 * Fetches a single image by ID from the database (server-side)
 *
 * Use this function in Server Components and Route Handlers.
 *
 * @param id - Image ID to fetch
 * @returns Image row or null if not found (null on error)
 */
export async function fetchImageByIdServer(
  id: string
): Promise<ImageRow | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("image")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // No rows returned
      return null;
    }
    console.error("Error fetching image by id:", error);
    return null;
  }

  return data;
}
