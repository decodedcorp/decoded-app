import { useEffect, useState, useCallback } from "react";
import { imagesAPI } from "@/lib/api/client/images";
import { ImageData, ImageMetadata, ImageItem } from "@/lib/api/_types/image";
import type { RandomImageResource } from "@/lib/api/client/images";

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
    item: ImageItem;
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

function processRandomImage(image: RandomImageResource): ProcessedImage | null {
  if (!image.img_url) return null;

  return {
    mainImage: {
      doc_id: image.doc_id,
      img_url: image.img_url,
      title: image.title,
      style: image.style,
    },
    itemImages: [],
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
      
      const response = await imagesAPI.getRandomResources(1);
      const { label, resources } = response.data;

      if (label !== 'image' || !resources.length) {
        setProcessedImage(null);
        return;
      }

      const images = resources as RandomImageResource[];
      const validImages = images
        .map(processRandomImage)
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
