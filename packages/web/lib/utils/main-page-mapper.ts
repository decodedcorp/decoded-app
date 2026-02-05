/**
 * Data mappers for transforming DB types to main page UI types
 *
 * Updated to use new schema with 'posts' table
 */

import type {
  PostData,
  StyleCardServerData,
  TrendingKeyword,
  ImageWithPost,
  WhatsNewStyleData,
  StyleItemData,
} from "../supabase/queries/main-page.server";
import type { ItemCardData } from "../components/main/ItemCard";
import type { HeroData } from "../components/main/HeroSection";
import type { StyleCardData } from "../components/main/StyleCard";

// Re-export TrendingKeyword type for use in page.tsx
export type { TrendingKeyword };

/**
 * Weekly Best section style type
 */
export interface WeeklyBestStyle {
  id: string;
  artistName: string;
  imageUrl?: string;
  link: string;
}

/**
 * Transforms PostData to WeeklyBestStyle for UI display
 */
export function postToWeeklyBestStyle(post: PostData): WeeklyBestStyle {
  return {
    id: post.id,
    artistName: post.artistName || post.groupName || "Unknown",
    imageUrl: post.imageUrl ?? undefined,
    link: `/feed/${post.id}`,
  };
}

/**
 * Transforms PostData to ItemCardData for UI display
 * Note: In new schema, posts don't have item details, so we adapt
 */
export function postToItemCardData(post: PostData): ItemCardData {
  return {
    id: post.id,
    brand: post.context || "Style",
    name: post.mediaTitle || `${post.artistName || "Unknown"}'s Style`,
    imageUrl: post.imageUrl ?? undefined,
    link: `/feed/${post.id}`,
    relatedStyles: undefined,
    badge: undefined,
  };
}

/**
 * Transforms PostData to HeroData for UI display
 */
export function postToHeroData(post: PostData): HeroData {
  return {
    artistName: post.artistName || post.groupName || "Featured",
    title: post.mediaTitle || "오늘의 스타일을 확인해보세요",
    subtitle: post.context || "",
    imageUrl: post.imageUrl ?? undefined,
    link: `/feed/${post.id}`,
  };
}

/**
 * Transforms StyleCardServerData to StyleCardData for UI display
 */
export function styleCardServerToStyleCardData(
  data: StyleCardServerData
): StyleCardData {
  const artistName = data.post.artistName || data.post.groupName || "Unknown";

  // Generate description
  const description = data.post.mediaTitle
    ? `${artistName} - ${data.post.mediaTitle}`
    : `${artistName}의 새로운 스타일을 확인해보세요.`;

  return {
    id: data.post.id,
    title: `${artistName}의 스타일`,
    description,
    artistName,
    imageUrl: data.post.imageUrl ?? undefined,
    link: `/feed/${data.post.id}`,
    items: data.items.map((item) => ({
      id: String(item.id),
      label: item.label,
      brand: item.brand,
      name: item.name,
      imageUrl: item.imageUrl,
    })),
    spots: data.spots?.map((spot) => ({
      id: spot.id,
      x: parseFloat(spot.position_left),
      y: parseFloat(spot.position_top),
      label: spot.solutions?.[0]?.title || undefined,
    })),
  };
}

// =============================================================================
// Legacy function aliases for backward compatibility
// These map old function names to new implementations
// =============================================================================

/** @deprecated Use postToWeeklyBestStyle instead */
export function imageWithPostToWeeklyBestStyle(
  data: ImageWithPost
): WeeklyBestStyle {
  return {
    id: data.image.id,
    artistName: data.account ?? "Unknown",
    imageUrl: data.image.image_url ?? undefined,
    link: `/feed/${data.image.id}`,
  };
}

/** @deprecated Use postToHeroData instead */
export function imageWithPostToHeroData(data: ImageWithPost): HeroData {
  return {
    artistName: data.account ?? "Featured",
    title: "오늘의 스타일을 확인해보세요",
    subtitle: "",
    imageUrl: data.image.image_url ?? undefined,
    link: `/feed/${data.image.id}`,
  };
}

/** @deprecated Use styleCardServerToStyleCardData instead */
export function whatsNewStyleToStyleCardData(
  data: WhatsNewStyleData
): StyleCardData {
  const artistName = data.account ?? "Unknown";
  const itemNames = data.items
    .map((item: StyleItemData) => item.name)
    .slice(0, 2);

  const description =
    data.items.length > 0
      ? `${artistName}의 스타일에서 ${itemNames.join(", ")}을 확인해보세요.`
      : `${artistName}의 새로운 스타일을 확인해보세요.`;

  return {
    id: data.image.id,
    title: `${artistName}의 스타일`,
    description,
    artistName,
    imageUrl: data.image.image_url ?? undefined,
    link: `/feed/${data.image.id}`,
    items: data.items.map((item: StyleItemData) => ({
      id: String(item.id),
      label: item.label,
      brand: item.brand,
      name: item.name,
      imageUrl: item.imageUrl,
    })),
    spots: data.spots?.map((spot) => ({
      id: spot.id,
      x: parseFloat(spot.position_left),
      y: parseFloat(spot.position_top),
      label: spot.solutions?.[0]?.title || undefined,
    })),
  };
}

/** @deprecated Items not available in new schema */
export function itemWithImageToItemCardData(data: {
  item: {
    id: string | number;
    brand: string | null;
    product_name: string | null;
  };
  imageUrl: string | null;
}): ItemCardData {
  return {
    id: String(data.item.id),
    brand: data.item.brand ?? "Unknown Brand",
    name: data.item.product_name ?? "Unknown Item",
    imageUrl: data.imageUrl ?? undefined,
    link: `/items/${data.item.id}`,
    relatedStyles: undefined,
    badge: undefined,
  };
}

/** @deprecated Items not available in new schema */
export function whatsNewItemToItemCardData(
  data: {
    item: {
      id: string | number;
      brand: string | null;
      product_name: string | null;
    };
    imageUrl: string | null;
  },
  isNew = true
): ItemCardData {
  return {
    id: String(data.item.id),
    brand: data.item.brand ?? "Unknown Brand",
    name: data.item.product_name ?? "Unknown Item",
    imageUrl: data.imageUrl ?? undefined,
    link: `/items/${data.item.id}`,
    badge: isNew ? "NEW" : undefined,
    relatedStyles: undefined,
  };
}
