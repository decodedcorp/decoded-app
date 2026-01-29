/**
 * Server-side query functions for main page sections
 *
 * This module contains server-only query functions for fetching data
 * displayed on the main page. Uses createSupabaseServerClient.
 *
 * Updated to use the new schema with 'posts' table.
 */

import { createSupabaseServerClient } from "../server";
import type { PostRow } from "../types";

/**
 * Post data for main page sections
 */
export interface PostData {
  id: string;
  imageUrl: string | null;
  artistName: string | null;
  groupName: string | null;
  mediaTitle: string | null;
  mediaType: string | null;
  context: string | null;
  viewCount: number;
  createdAt: string;
}

/**
 * Item data for style card display (placeholder for compatibility)
 */
export interface StyleItemData {
  id: number;
  label: string;
  brand: string;
  name: string;
  imageUrl?: string;
}

/**
 * Style data for style card display
 */
export interface StyleCardServerData {
  post: PostData;
  // Items are not available in new schema, will be empty
  items: StyleItemData[];
}

/**
 * Trending keyword data
 */
export interface TrendingKeyword {
  id: string;
  label: string;
  href: string;
}

/**
 * Transforms a raw post row to PostData
 */
function toPostData(row: PostRow): PostData {
  return {
    id: row.id,
    imageUrl: row.image_url,
    artistName: row.artist_name,
    groupName: row.group_name,
    mediaTitle: row.media_title,
    mediaType: row.media_type,
    context: row.context,
    viewCount: row.view_count,
    createdAt: row.created_at,
  };
}

/**
 * Fetches posts for Weekly Best section (server-side)
 * Gets recent posts ordered by view_count
 *
 * @param limit - Maximum number of posts to fetch (default: 8)
 * @returns Array of post data
 */
export async function fetchWeeklyBestPostsServer(
  limit = 8
): Promise<PostData[]> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("status", "active")
    .not("image_url", "is", null)
    .order("view_count", { ascending: false })
    .limit(limit);

  if (error) {
    console.error(
      "Error fetching weekly best posts:",
      JSON.stringify(error, null, 2)
    );
    return [];
  }

  return (data ?? []).map(toPostData);
}

/**
 * Fetches a single featured post for Hero section (server-side)
 * Gets the most viewed active post
 *
 * @returns Featured post or null
 */
export async function fetchFeaturedPostServer(): Promise<PostData | null> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("status", "active")
    .not("image_url", "is", null)
    .order("view_count", { ascending: false })
    .limit(1)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // No rows returned
      return null;
    }
    console.error(
      "Error fetching featured post:",
      JSON.stringify(error, null, 2)
    );
    return null;
  }

  return data ? toPostData(data) : null;
}

/**
 * Fetches posts for What's New section (server-side)
 * Gets recently created posts
 *
 * @param limit - Maximum number of posts to fetch (default: 2)
 * @returns Array of style card data
 */
export async function fetchWhatsNewPostsServer(
  limit = 2
): Promise<StyleCardServerData[]> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("status", "active")
    .not("image_url", "is", null)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error(
      "Error fetching what's new posts:",
      JSON.stringify(error, null, 2)
    );
    return [];
  }

  return (data ?? []).map((row) => ({
    post: toPostData(row),
    items: [], // Items not available in new schema
  }));
}

/**
 * Fetches data for Decoded Pick section (server-side)
 * Gets a style that is different from What's New section
 *
 * @param offset - Number of posts to skip (default: 2 to skip What's New)
 * @returns Style card data or null
 */
export async function fetchDecodedPickServer(
  offset = 2
): Promise<StyleCardServerData | null> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("status", "active")
    .not("image_url", "is", null)
    .order("created_at", { ascending: false })
    .range(offset, offset);

  if (error) {
    console.error(
      "Error fetching decoded pick:",
      JSON.stringify(error, null, 2)
    );
    return null;
  }

  if (!data || data.length === 0) {
    return null;
  }

  return {
    post: toPostData(data[0]),
    items: [],
  };
}

/**
 * Fetches posts for Artist Spotlight section (server-side)
 * Gets posts from different artists
 *
 * @param limit - Maximum number of posts to fetch (default: 2)
 * @param offset - Number of posts to skip (default: 3)
 * @returns Array of style card data
 */
export async function fetchArtistSpotlightServer(
  limit = 2,
  offset = 3
): Promise<StyleCardServerData[]> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("status", "active")
    .not("image_url", "is", null)
    .not("artist_name", "is", null)
    .order("view_count", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error(
      "Error fetching artist spotlight:",
      JSON.stringify(error, null, 2)
    );
    return [];
  }

  return (data ?? []).map((row) => ({
    post: toPostData(row),
    items: [],
  }));
}

/**
 * Fetches posts by artist name for Discover section (server-side)
 *
 * @param artistName - The artist name to filter by
 * @param limit - Maximum number of posts to fetch (default: 6)
 * @returns Array of post data
 */
export async function fetchPostsByArtistServer(
  artistName: string,
  limit = 6
): Promise<PostData[]> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("status", "active")
    .not("image_url", "is", null)
    .ilike("artist_name", `%${artistName}%`)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error(
      `Error fetching posts for artist ${artistName}:`,
      JSON.stringify(error, null, 2)
    );
    return [];
  }

  return (data ?? []).map(toPostData);
}

/**
 * Fetches trending keywords derived from popular artists (server-side)
 *
 * @param limit - Maximum number of keywords to fetch (default: 7)
 * @returns Array of trending keywords
 */
export async function fetchTrendingKeywordsServer(
  limit = 7
): Promise<TrendingKeyword[]> {
  const supabase = await createSupabaseServerClient();
  const keywords: TrendingKeyword[] = [];

  // Get popular artists (most posts/views)
  const { data: posts, error } = await supabase
    .from("posts")
    .select("artist_name, group_name")
    .eq("status", "active")
    .not("artist_name", "is", null)
    .order("view_count", { ascending: false })
    .limit(50);

  if (!error && posts) {
    // Count artist occurrences
    const artistCounts = new Map<string, number>();
    for (const post of posts) {
      const name = post.artist_name || post.group_name;
      if (name) {
        artistCounts.set(name, (artistCounts.get(name) || 0) + 1);
      }
    }

    // Sort by count and take top entries
    const topArtists = [...artistCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([artist]) => artist);

    for (const artist of topArtists) {
      keywords.push({
        id: `artist-${artist}`,
        label: artist,
        href: `/search?q=${encodeURIComponent(artist)}`,
      });
    }
  }

  return keywords.slice(0, limit);
}

// =============================================================================
// Legacy type exports for backward compatibility
// =============================================================================

/** Legacy ImageWithPost type */
export interface ImageWithPost {
  image: {
    id: string;
    image_url: string | null;
    created_at: string;
    image_hash: string;
    status: "extracted";
    with_items: boolean;
  };
  account: string | null;
}

/** Legacy WhatsNewStyleData type */
export interface WhatsNewStyleData {
  image: {
    id: string;
    image_url: string | null;
    created_at: string;
    image_hash: string;
    status: "extracted";
    with_items: boolean;
  };
  account: string | null;
  items: StyleItemData[];
}

/** Legacy ItemWithImage type */
export interface ItemWithImage {
  item: { id: number; brand: string | null; product_name: string | null };
  imageUrl: string | null;
}

// =============================================================================
// Legacy function aliases for backward compatibility
// These map old function names to new implementations
// =============================================================================

/** @deprecated Use fetchWeeklyBestPostsServer instead */
export async function fetchWeeklyBestImagesServer(
  limit = 8
): Promise<ImageWithPost[]> {
  const posts = await fetchWeeklyBestPostsServer(limit);
  return posts.map((post) => ({
    image: {
      id: post.id,
      image_url: post.imageUrl,
      created_at: post.createdAt,
      image_hash: "",
      status: "extracted" as const,
      with_items: false,
    },
    account: post.artistName || post.groupName,
  }));
}

/** @deprecated Use fetchFeaturedPostServer instead */
export async function fetchFeaturedImageServer(): Promise<ImageWithPost | null> {
  const post = await fetchFeaturedPostServer();
  if (!post) return null;
  return {
    image: {
      id: post.id,
      image_url: post.imageUrl,
      created_at: post.createdAt,
      image_hash: "",
      status: "extracted" as const,
      with_items: false,
    },
    account: post.artistName || post.groupName,
  };
}

/** @deprecated Use fetchWhatsNewPostsServer instead */
export async function fetchWhatsNewStylesServer(
  limit = 2
): Promise<WhatsNewStyleData[]> {
  const styles = await fetchWhatsNewPostsServer(limit);
  return styles.map((style) => ({
    image: {
      id: style.post.id,
      image_url: style.post.imageUrl,
      created_at: style.post.createdAt,
      image_hash: "",
      status: "extracted" as const,
      with_items: false,
    },
    account: style.post.artistName || style.post.groupName,
    items: style.items,
  }));
}

/** @deprecated Items not available in new schema, returns empty array */
export async function fetchWhatsNewItemsServer(
  _limit = 4
): Promise<ItemWithImage[]> {
  return [];
}

/** @deprecated Items not available in new schema, returns empty array */
export async function fetchBestItemsServer(
  _limit = 6
): Promise<ItemWithImage[]> {
  return [];
}

/** @deprecated Use fetchDecodedPickServer instead */
export async function fetchDecodedPickStyleServer(
  offset = 2
): Promise<{ style: WhatsNewStyleData | null; items: ItemWithImage[] }> {
  const pick = await fetchDecodedPickServer(offset);
  if (!pick)
    return {
      style: null,
      items: [],
    };
  return {
    style: {
      image: {
        id: pick.post.id,
        image_url: pick.post.imageUrl,
        created_at: pick.post.createdAt,
        image_hash: "",
        status: "extracted" as const,
        with_items: false,
      },
      account: pick.post.artistName || pick.post.groupName,
      items: [],
    },
    items: [],
  };
}

/** @deprecated Use fetchArtistSpotlightServer instead */
export async function fetchArtistSpotlightStylesServer(
  limit = 2,
  offset = 3
): Promise<WhatsNewStyleData[]> {
  const styles = await fetchArtistSpotlightServer(limit, offset);
  return styles.map((style) => ({
    image: {
      id: style.post.id,
      image_url: style.post.imageUrl,
      created_at: style.post.createdAt,
      image_hash: "",
      status: "extracted" as const,
      with_items: false,
    },
    account: style.post.artistName || style.post.groupName,
    items: [],
  }));
}

/** @deprecated Use fetchPostsByArtistServer instead */
export async function fetchItemsByAccountServer(
  _account: string,
  _limit = 6
): Promise<ItemWithImage[]> {
  // Items not available, return empty
  return [];
}
