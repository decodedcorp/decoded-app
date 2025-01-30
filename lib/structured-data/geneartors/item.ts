import { ItemSchema } from "../types/schema";
import { DecodedItem } from "@/lib/api/types/image";

export function generateItemSchema(
  item: DecodedItem,
  artistName: string
): ItemSchema | null {
  if (!item?.item?.item) return null;
  const { metadata, img_url, link_info } = item.item.item;
  const { brand_name, brand_logo_image_url } = item.item;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: metadata?.name || "",
    description: metadata?.description || "",
    image: img_url || "",
    category: [
      metadata?.item_class,
      metadata?.item_sub_class,
      metadata?.category,
      metadata?.sub_category,
      metadata?.product_type,
    ]
      .filter(Boolean)
      .join(" > "),
    brand: brand_name
      ? {
          "@context": "https://schema.org",
          "@type": "Brand",
          name: brand_name,
          logo: brand_logo_image_url || undefined,
        }
      : undefined,
    about: {
      "@context": "https://schema.org",
      "@type": "Person",
      name: artistName,
    },
    sameAs:
      link_info?.map((link) => ({
        "@context": "https://schema.org",
        "@type": "URL",
        url: link.url,
        category: link.label || "관련 정보",
      })) || [],
  };
}
