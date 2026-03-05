/**
 * Query layer for profile-related data (client-side)
 *
 * Provides user-scoped queries for posts, spots, and solutions
 * displayed on the profile page.
 */

import { supabaseBrowserClient } from "../client";
import type { PostRow, SpotRow, SolutionRow } from "../types";

/**
 * Spot row with joined post image for thumbnail display
 */
export type SpotWithPost = SpotRow & {
  post: { image_url: string | null } | null;
};

/**
 * Fetches posts by user ID for the profile page
 *
 * @param userId - User ID to filter by
 * @param limit - Maximum number of posts to fetch (default: 20)
 * @returns Array of PostRow
 */
export async function fetchPostsByUserProfile(
  userId: string,
  limit = 20
): Promise<PostRow[]> {
  const { data, error } = await supabaseBrowserClient
    .from("posts")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    if (process.env.NODE_ENV === "development") {
      console.error(
        "[fetchPostsByUserProfile] Error:",
        JSON.stringify(error, null, 2)
      );
    }
    return [];
  }

  return data || [];
}

/**
 * Fetches spots by user ID with joined post image
 *
 * @param userId - User ID to filter by
 * @param limit - Maximum number of spots to fetch (default: 20)
 * @returns Array of SpotRow with post image_url
 */
export async function fetchSpotsByUser(
  userId: string,
  limit = 20
): Promise<SpotWithPost[]> {
  const { data, error } = await supabaseBrowserClient
    .from("spots")
    .select("*, post:posts(image_url)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    if (process.env.NODE_ENV === "development") {
      console.error(
        "[fetchSpotsByUser] Error:",
        JSON.stringify(error, null, 2)
      );
    }
    return [];
  }

  return (data as SpotWithPost[]) || [];
}

/**
 * Fetches solutions by user ID
 *
 * @param userId - User ID to filter by
 * @param limit - Maximum number of solutions to fetch (default: 20)
 * @returns Array of SolutionRow
 */
export async function fetchSolutionsByUser(
  userId: string,
  limit = 20
): Promise<SolutionRow[]> {
  const { data, error } = await supabaseBrowserClient
    .from("solutions")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    if (process.env.NODE_ENV === "development") {
      console.error(
        "[fetchSolutionsByUser] Error:",
        JSON.stringify(error, null, 2)
      );
    }
    return [];
  }

  return data || [];
}
