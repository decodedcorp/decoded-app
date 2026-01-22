/**
 * Server-side query functions for main page sections
 *
 * This module contains server-only query functions for fetching data
 * displayed on the main page. Uses createSupabaseServerClient.
 */

import { createSupabaseServerClient } from "../server";
import type { ImageRow, ItemRow } from "../types";

/**
 * Image with associated post account information
 */
export interface ImageWithPost {
  image: ImageRow;
  account: string | null;
}

/**
 * Item data for style card display
 */
export interface StyleItemData {
  id: number;
  label: string;
  brand: string;
  name: string;
  imageUrl?: string;
}

/**
 * Style data for What's New section
 * Includes image, post account info, and associated items
 */
export interface WhatsNewStyleData {
  image: ImageRow;
  account: string | null;
  items: StyleItemData[];
}

/**
 * Item with its associated image
 */
export interface ItemWithImage {
  item: ItemRow;
  imageUrl: string | null;
}

/**
 * Fetches images for Weekly Best section (server-side)
 * Gets recent images with their associated post account names
 *
 * @param limit - Maximum number of images to fetch (default: 8)
 * @returns Array of images with account information
 */
export async function fetchWeeklyBestImagesServer(
  limit = 8
): Promise<ImageWithPost[]> {
  const supabase = await createSupabaseServerClient();

  // Fetch images joined with post_image and post to get account names
  const { data, error } = await supabase
    .from("post_image")
    .select(
      `
      image:image_id(id, image_url, created_at, image_hash, status, with_items),
      post:post_id(account)
    `
    )
    .not("image.image_url", "is", null)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching weekly best images:", error);
    return [];
  }

  // Transform and filter the data
  return (data ?? [])
    .filter((item) => item.image && item.image.image_url)
    .map((item) => ({
      image: item.image as ImageRow,
      account: (item.post as { account: string } | null)?.account ?? null,
    }));
}

/**
 * Fetches items for Best Item section (server-side)
 * Gets recent items with their cropped images
 *
 * @param limit - Maximum number of items to fetch (default: 6)
 * @returns Array of items with image URLs
 */
export async function fetchBestItemsServer(
  limit = 6
): Promise<ItemWithImage[]> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("item")
    .select("*")
    .not("cropped_image_path", "is", null)
    .not("product_name", "is", null)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching best items:", error);
    return [];
  }

  return (data ?? []).map((item) => ({
    item,
    imageUrl: item.cropped_image_path,
  }));
}

/**
 * Fetches a single featured image for Hero section (server-side)
 * Gets the most recent image with post account information
 *
 * @returns Featured image with account info or null
 */
export async function fetchFeaturedImageServer(): Promise<ImageWithPost | null> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("post_image")
    .select(
      `
      image:image_id(id, image_url, created_at, image_hash, status, with_items),
      post:post_id(account, article)
    `
    )
    .not("image.image_url", "is", null)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // No rows returned
      return null;
    }
    console.error("Error fetching featured image:", error);
    return null;
  }

  if (!data?.image || !(data.image as ImageRow).image_url) {
    return null;
  }

  return {
    image: data.image as ImageRow,
    account: (data.post as { account: string } | null)?.account ?? null,
  };
}

/**
 * Fetches styles for What's New section (server-side)
 * Gets recent images with their associated post account names and items
 *
 * @param limit - Maximum number of styles to fetch (default: 2)
 * @returns Array of styles with account info and items
 */
export async function fetchWhatsNewStylesServer(
  limit = 2
): Promise<WhatsNewStyleData[]> {
  const supabase = await createSupabaseServerClient();

  // Fetch images joined with post_image and post to get account names
  const { data: postImages, error: postImagesError } = await supabase
    .from("post_image")
    .select(
      `
      image:image_id(id, image_url, created_at, image_hash, status, with_items),
      post:post_id(account)
    `
    )
    .not("image.image_url", "is", null)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (postImagesError) {
    console.error("Error fetching what's new styles:", postImagesError);
    return [];
  }

  // Transform and filter the data, then fetch items for each image
  const stylesWithItems: WhatsNewStyleData[] = [];

  for (const item of postImages ?? []) {
    if (!item.image || !(item.image as ImageRow).image_url) {
      continue;
    }

    const image = item.image as ImageRow;

    // Fetch items for this image
    const { data: items, error: itemsError } = await supabase
      .from("item")
      .select("id, brand, product_name, cropped_image_path")
      .eq("image_id", image.id)
      .not("product_name", "is", null)
      .limit(3);

    if (itemsError) {
      console.error(`Error fetching items for image ${image.id}:`, itemsError);
    }

    const styleItems: StyleItemData[] = (items ?? []).map((dbItem, index) => ({
      id: dbItem.id,
      label: String.fromCharCode(65 + index), // A, B, C...
      brand: dbItem.brand ?? "Unknown Brand",
      name: dbItem.product_name ?? "Unknown Item",
      imageUrl: dbItem.cropped_image_path ?? undefined,
    }));

    stylesWithItems.push({
      image,
      account: (item.post as { account: string } | null)?.account ?? null,
      items: styleItems,
    });
  }

  return stylesWithItems;
}

/**
 * Fetches items for What's New section (server-side)
 * Gets recent items with their cropped images
 *
 * @param limit - Maximum number of items to fetch (default: 4)
 * @returns Array of items with image URLs
 */
export async function fetchWhatsNewItemsServer(
  limit = 4
): Promise<ItemWithImage[]> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("item")
    .select("*")
    .not("cropped_image_path", "is", null)
    .not("product_name", "is", null)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching what's new items:", error);
    return [];
  }

  return (data ?? []).map((item) => ({
    item,
    imageUrl: item.cropped_image_path,
  }));
}

/**
 * Fetches data for Decoded Pick section (server-side)
 * Gets a style and items that are different from What's New section
 *
 * @param styleOffset - Number of styles to skip (default: 2 to skip What's New styles)
 * @param itemOffset - Number of items to skip (default: 4 to skip What's New items)
 * @returns Object with style and items data
 */
export async function fetchDecodedPickServer(
  styleOffset = 2,
  itemOffset = 4
): Promise<{
  style: WhatsNewStyleData | null;
  items: ItemWithImage[];
}> {
  const supabase = await createSupabaseServerClient();

  // Fetch a single style (skipping the ones used in What's New)
  const { data: postImages, error: postImagesError } = await supabase
    .from("post_image")
    .select(
      `
      image:image_id(id, image_url, created_at, image_hash, status, with_items),
      post:post_id(account)
    `
    )
    .not("image.image_url", "is", null)
    .order("created_at", { ascending: false })
    .range(styleOffset, styleOffset);

  if (postImagesError) {
    console.error("Error fetching decoded pick style:", postImagesError);
    return { style: null, items: [] };
  }

  let style: WhatsNewStyleData | null = null;

  if (postImages && postImages.length > 0) {
    const item = postImages[0];
    if (item.image && (item.image as ImageRow).image_url) {
      const image = item.image as ImageRow;

      // Fetch items for this image
      const { data: items, error: itemsError } = await supabase
        .from("item")
        .select("id, brand, product_name, cropped_image_path")
        .eq("image_id", image.id)
        .not("product_name", "is", null)
        .limit(3);

      if (itemsError) {
        console.error(
          `Error fetching items for image ${image.id}:`,
          itemsError
        );
      }

      const styleItems: StyleItemData[] = (items ?? []).map((dbItem, index) => ({
        id: dbItem.id,
        label: String.fromCharCode(65 + index),
        brand: dbItem.brand ?? "Unknown Brand",
        name: dbItem.product_name ?? "Unknown Item",
        imageUrl: dbItem.cropped_image_path ?? undefined,
      }));

      style = {
        image,
        account: (item.post as { account: string } | null)?.account ?? null,
        items: styleItems,
      };
    }
  }

  // Fetch 2 items (skipping the ones used in What's New)
  const { data: itemsData, error: itemsError } = await supabase
    .from("item")
    .select("*")
    .not("cropped_image_path", "is", null)
    .not("product_name", "is", null)
    .order("created_at", { ascending: false })
    .range(itemOffset, itemOffset + 1);

  if (itemsError) {
    console.error("Error fetching decoded pick items:", itemsError);
    return { style, items: [] };
  }

  const items: ItemWithImage[] = (itemsData ?? []).map((item) => ({
    item,
    imageUrl: item.cropped_image_path,
  }));

  return { style, items };
}

/**
 * Fetches styles for Artist Spotlight section (server-side)
 * Gets recent images with their associated post account names
 *
 * @param limit - Maximum number of styles to fetch (default: 2)
 * @param offset - Number of styles to skip (default: 3 to skip What's New and Decoded Pick)
 * @returns Array of styles with account info
 */
export async function fetchArtistSpotlightServer(
  limit = 2,
  offset = 3
): Promise<WhatsNewStyleData[]> {
  const supabase = await createSupabaseServerClient();

  // Fetch images joined with post_image and post to get account names
  const { data: postImages, error: postImagesError } = await supabase
    .from("post_image")
    .select(
      `
      image:image_id(id, image_url, created_at, image_hash, status, with_items),
      post:post_id(account)
    `
    )
    .not("image.image_url", "is", null)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (postImagesError) {
    console.error("Error fetching artist spotlight styles:", postImagesError);
    return [];
  }

  // Transform and filter the data
  const styles: WhatsNewStyleData[] = [];

  for (const item of postImages ?? []) {
    if (!item.image || !(item.image as ImageRow).image_url) {
      continue;
    }

    const image = item.image as ImageRow;

    // Fetch items for this image
    const { data: items, error: itemsError } = await supabase
      .from("item")
      .select("id, brand, product_name, cropped_image_path")
      .eq("image_id", image.id)
      .not("product_name", "is", null)
      .limit(3);

    if (itemsError) {
      console.error(`Error fetching items for image ${image.id}:`, itemsError);
    }

    const styleItems: StyleItemData[] = (items ?? []).map((dbItem, index) => ({
      id: dbItem.id,
      label: String.fromCharCode(65 + index),
      brand: dbItem.brand ?? "Unknown Brand",
      name: dbItem.product_name ?? "Unknown Item",
      imageUrl: dbItem.cropped_image_path ?? undefined,
    }));

    styles.push({
      image,
      account: (item.post as { account: string } | null)?.account ?? null,
      items: styleItems,
    });
  }

  return styles;
}

/**
 * Fetches items by account for Discover Items section (server-side)
 * Gets items from posts matching the given account name
 *
 * @param account - The account name to filter by
 * @param limit - Maximum number of items to fetch (default: 6)
 * @returns Array of items with image URLs
 */
export async function fetchItemsByAccountServer(
  account: string,
  limit = 6
): Promise<ItemWithImage[]> {
  const supabase = await createSupabaseServerClient();

  // First, get image IDs from posts matching the account
  const { data: postImages, error: postImagesError } = await supabase
    .from("post_image")
    .select(
      `
      image_id,
      post:post_id(account)
    `
    )
    .ilike("post.account", `%${account}%`)
    .limit(50);

  if (postImagesError) {
    console.error(
      `Error fetching post images for account ${account}:`,
      postImagesError
    );
    return [];
  }

  // Get unique image IDs where account matches
  const imageIds = (postImages ?? [])
    .filter(
      (pi) =>
        pi.post &&
        (pi.post as { account: string }).account
          ?.toLowerCase()
          .includes(account.toLowerCase())
    )
    .map((pi) => pi.image_id)
    .filter((id): id is number => id !== null);

  if (imageIds.length === 0) {
    return [];
  }

  // Fetch items for these images
  const { data: items, error: itemsError } = await supabase
    .from("item")
    .select("*")
    .in("image_id", imageIds)
    .not("cropped_image_path", "is", null)
    .not("product_name", "is", null)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (itemsError) {
    console.error(`Error fetching items for account ${account}:`, itemsError);
    return [];
  }

  return (items ?? []).map((item) => ({
    item,
    imageUrl: item.cropped_image_path,
  }));
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
 * Fetches trending keywords derived from popular accounts and brands (server-side)
 *
 * @param limit - Maximum number of keywords to fetch (default: 7)
 * @returns Array of trending keywords
 */
export async function fetchTrendingKeywordsServer(
  limit = 7
): Promise<TrendingKeyword[]> {
  const supabase = await createSupabaseServerClient();
  const keywords: TrendingKeyword[] = [];

  // Get popular accounts (most recent posts)
  const { data: recentPosts, error: postsError } = await supabase
    .from("post")
    .select("account")
    .not("account", "is", null)
    .order("created_at", { ascending: false })
    .limit(20);

  if (!postsError && recentPosts) {
    // Count account occurrences
    const accountCounts = new Map<string, number>();
    for (const post of recentPosts) {
      if (post.account) {
        accountCounts.set(
          post.account,
          (accountCounts.get(post.account) || 0) + 1
        );
      }
    }

    // Sort by count and take top entries
    const topAccounts = [...accountCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([account]) => account);

    for (const account of topAccounts) {
      keywords.push({
        id: `account-${account}`,
        label: account,
        href: `/search?q=${encodeURIComponent(account)}`,
      });
    }
  }

  // Get popular brands
  const { data: items, error: itemsError } = await supabase
    .from("item")
    .select("brand")
    .not("brand", "is", null)
    .order("created_at", { ascending: false })
    .limit(50);

  if (!itemsError && items) {
    // Count brand occurrences
    const brandCounts = new Map<string, number>();
    for (const item of items) {
      if (item.brand) {
        brandCounts.set(item.brand, (brandCounts.get(item.brand) || 0) + 1);
      }
    }

    // Sort by count and take remaining slots
    const remainingSlots = limit - keywords.length;
    const topBrands = [...brandCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, remainingSlots)
      .map(([brand]) => brand);

    for (const brand of topBrands) {
      keywords.push({
        id: `brand-${brand}`,
        label: brand,
        href: `/search?q=${encodeURIComponent(brand)}`,
      });
    }
  }

  return keywords.slice(0, limit);
}
