/**
 * Data mappers for transforming DB types to main page UI types
 */

import type {
  ImageWithPost,
  ItemWithImage,
  WhatsNewStyleData,
  TrendingKeyword,
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
 * Transforms an ImageWithPost to WeeklyBestStyle for UI display
 */
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

/**
 * Transforms an ItemWithImage to ItemCardData for UI display
 */
export function itemWithImageToItemCardData(data: ItemWithImage): ItemCardData {
  return {
    id: String(data.item.id),
    brand: data.item.brand ?? "Unknown Brand",
    name: data.item.product_name ?? "Unknown Item",
    imageUrl: data.imageUrl ?? undefined,
    link: `/items/${data.item.id}`,
    // Note: relatedStyles would need additional query to count
    relatedStyles: undefined,
    badge: undefined, // Could be computed based on ranking/metrics
  };
}

/**
 * Transforms an ImageWithPost to HeroData for UI display
 */
export function imageWithPostToHeroData(data: ImageWithPost): HeroData {
  return {
    artistName: data.account ?? "Featured",
    title: "오늘의 스타일을 확인해보세요",
    subtitle: "",
    imageUrl: data.image.image_url ?? undefined,
    link: `/feed/${data.image.id}`,
  };
}

/**
 * Transforms WhatsNewStyleData to StyleCardData for UI display
 */
export function whatsNewStyleToStyleCardData(
  data: WhatsNewStyleData
): StyleCardData {
  const artistName = data.account ?? "Unknown";
  const itemNames = data.items.map((item) => item.name).slice(0, 2);

  // Generate description based on items
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
    items: data.items.map((item) => ({
      id: String(item.id),
      label: item.label,
      brand: item.brand,
      name: item.name,
      imageUrl: item.imageUrl,
    })),
  };
}

/**
 * Transforms ItemWithImage to ItemCardData for What's New section
 * Optionally marks the item as new
 */
export function whatsNewItemToItemCardData(
  data: ItemWithImage,
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
