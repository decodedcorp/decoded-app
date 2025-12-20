/**
 * DEBUG ONLY: Query layer for posts table (client-side)
 *
 * This module is for debugging/reference purposes only.
 * Production code should use image-based queries instead.
 *
 * This module establishes the pattern: "Supabase direct access only happens in this layer"
 * When RLS policies change, only these query functions need to be updated,
 * keeping frontend code changes minimal.
 *
 * Note: For server-side queries, use posts.server.ts instead.
 */

import { supabaseBrowserClient } from "../../client";
import type { Database } from "../../types";

type PostRow = Database["public"]["Tables"]["post"]["Row"];

/**
 * Fetches the latest posts from the database (client-side)
 *
 * @param limit - Maximum number of posts to fetch (default: 10)
 * @returns Array of post rows, ordered by created_at descending
 * @throws Error if the query fails
 */
export async function fetchLatestPosts(limit = 10): Promise<PostRow[]> {
  const { data, error } = await supabaseBrowserClient
    .from("post")
    .select("*")
    .gte("ts", "2024-01-01")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw error;
  }

  return data ?? [];
}
