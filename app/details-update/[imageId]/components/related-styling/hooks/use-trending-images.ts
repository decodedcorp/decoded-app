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
      try {
        const response = await imagesAPI.getNewalImages();
        console.log('트렌딩 이미지 응답:', response); // 디버깅용
        
        // 실제 API 응답 구조에 맞게 데이터 추출
        const trendingImages = response.data.images || [];
        
        return trendingImages.map((item): RelatedImage => ({
          image_doc_id: item.image_doc_id,
          image_url: item.image_url,
        }));
      } catch (error) {
        console.error('트렌딩 이미지 가져오기 오류:', error);
        throw error;
      }
    }
  });   
} 