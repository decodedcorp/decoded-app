import { useQuery } from '@tanstack/react-query';
import { imagesAPI } from '@/lib/api/client/images';
import { RelatedImage, TrendingImage } from '../types';

// Adjust the interface if necessary
interface APIResponse<T> {
  images: T[];
  maybe_next_id: string | null;
}

export function useTrendingImages() {
  return useQuery({
    queryKey: ['trendingImages'],
    queryFn: async () => {
      const response = await imagesAPI.getNewalImages();
      // Type assertion to match the actual API response structure
      const trendingImages = response.data.images as unknown as TrendingImage[];
      return trendingImages.map((item): RelatedImage => ({
        image_doc_id: item.image_doc_id,
        image_url: item.image_url,
      }));
    }
  });   
} 