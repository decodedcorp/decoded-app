import { useEffect, useState, useCallback } from "react";
import { imagesAPI } from "@/lib/api/endpoints/images";
import { ImageData, DecodedItem, ImageMetadata } from "@/lib/api/types/image";

// Types
interface MainImage {
  doc_id: string;
  img_url: string;
  title: string | null;
  style: string | null;
}

interface ItemImage {
  doc_id: string;
  img_url: string | null;
  title: string | null;
  style: string | null;
  position: {
    top: string;
    left: string;
  };
  item: {
    item: {
      _id: string;
      metadata: ImageMetadata;
      img_url: string | null;
      requester: string;
      requested_at: string;
      link_info: any;
      like: number;
    };
    brand_name: string | null;
    brand_logo_image_url: string | null;
  };
}

interface ProcessedImage {
  mainImage: MainImage;
  itemImages: ItemImage[];
}

interface HeroBannerState {
  processedImage: ProcessedImage | null;
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

export function isEmptyBannerState(
  loading: boolean,
  image: ProcessedImage | null
): boolean {
  return loading || !image;
}

function processImage(image: ImageData): ProcessedImage | null {
  if (!image.img_url) return null;

  // Try both image.items and image.img.items
  const rawItems = image.items || image.img?.items || {};

  // Helper function to safely convert a value to DecodedItem[]
  function toDecodedItems(value: unknown): DecodedItem[] {
    if (Array.isArray(value)) {
      return value;
    }
    if (typeof value === 'object' && value !== null) {
      // Handle nested objects (like left/right grouping)
      const nestedValues = Object.values(value);
      if (nestedValues.length > 0) {
        return nestedValues.flatMap(v => {
          if (Array.isArray(v)) return v;
          if (typeof v === 'object' && v !== null) return [v];
          return [];
        });
      }
      return [value as DecodedItem];
    }
    return [];
  }

  // Flatten and process all items
  const allItems = Object.entries(rawItems).flatMap(([_, value]) => toDecodedItems(value));

  const decodedItems = allItems
    .filter((item) => {
      try {
        // Basic structure check
        if (!item || typeof item !== 'object') {
          return false;
        }

        // Check if item is decoded
        if (!item.is_decoded) {
          return false;
        }

        // Check if item has the required properties and valid data
        const hasRequiredProps = 
          item.item?.item?._id &&
          item.item?.item?.img_url &&
          item.item?.item?.metadata?.name &&
          item.position?.top &&
          item.position?.left;

        return hasRequiredProps;
      } catch (error) {
        return false;
      }
    })
    .map((item) => ({
      doc_id: image.doc_id,
      img_url: item.item.item.img_url,
      title: item.item.item.metadata.name,
      style: null,
      position: item.position,
      item: {
        item: {
          _id: item.item.item._id,
          metadata: item.item.item.metadata,
          img_url: item.item.item.img_url,
          requester: item.item.item.requester,
          requested_at: item.item.item.requested_at,
          link_info: item.item.item.link_info,
          like: item.item.item.like,
        },
        brand_name: item.item.brand_name,
        brand_logo_image_url: item.item.brand_logo_image_url,
      },
    }));

  return {
    mainImage: {
      doc_id: image.doc_id,
      img_url: image.img_url,
      title: image.title,
      style: image.style,
    },
    itemImages: decodedItems,
  };
}

export function useHeroBannerImage(): HeroBannerState {
  const [processedImage, setProcessedImage] = useState<ProcessedImage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchImages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await imagesAPI.getImages();
      const images = response.data.images;

      if (!images?.length) {
        setProcessedImage(null);
        return;
      }

      const validImages = images
        .map(processImage)
        .filter((img): img is ProcessedImage => img !== null);

      if (!validImages.length) {
        throw new Error("No valid images found");
      }

      const randomImage = validImages[Math.floor(Math.random() * validImages.length)];
      setProcessedImage(randomImage);
    } catch (error) {
      console.error("Failed to fetch images:", error);
      setError(error instanceof Error ? error : new Error("Failed to fetch images"));
      setProcessedImage(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  return { processedImage, loading, error, refresh: fetchImages };
}
