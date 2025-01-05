import { useState, useEffect, useCallback } from 'react';
import { imagesAPI } from '@/lib/api/endpoints/images';
import type { ImageData } from '@/lib/api/types/image';

interface UseImageDataReturn {
  images: ImageData[];
  currentImage: ImageData | null;
  isLoading: boolean;
  error: Error | null;
  refreshImages: () => Promise<void>;
  updateItem: (
    imageId: string,
    itemId: string,
    data: {
      links?: string[];
      provider?: string;
    }
  ) => Promise<void>;
}

export function useImageData(initialImageId?: string): UseImageDataReturn {
  const [images, setImages] = useState<ImageData[]>([]);
  const [currentImage, setCurrentImage] = useState<ImageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchImages = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await imagesAPI.getImages();
      setImages(response.data.images);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch images'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchCurrentImage = useCallback(async (imageId: string) => {
    try {
      setIsLoading(true);
      const response = await imagesAPI.getImageDetail(imageId);
      setCurrentImage(response.data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch image'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  useEffect(() => {
    if (initialImageId) {
      fetchCurrentImage(initialImageId);
    }
  }, [initialImageId, fetchCurrentImage]);

  const updateItem = useCallback(async (
    imageId: string,
    itemId: string,
    data: {
      links?: string[];
      provider?: string;
    }
  ) => {
    try {
      setIsLoading(true);
      await imagesAPI.updateImageItem(imageId, itemId, data);
      
      // Refresh the current image if it's the one being updated
      if (currentImage?.doc_id === imageId) {
        await fetchCurrentImage(imageId);
      }
      
      // Update the image in the list
      await fetchImages();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update item'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [currentImage, fetchCurrentImage, fetchImages]);

  const refreshImages = useCallback(async () => {
    await fetchImages();
  }, [fetchImages]);

  return {
    images,
    currentImage,
    isLoading,
    error,
    refreshImages,
    updateItem
  };
} 