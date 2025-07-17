import { useQuery } from '@tanstack/react-query';
import { imagesService } from '@/lib/api/requests/images';

export const useImageDetails = (imageId: string) => {
  return useQuery({
    queryKey: ['imageDetail', imageId],
    queryFn: async () => {
      try {
        return await imagesService.getImageDetail(imageId);
      } catch (error) {
        console.error('이미지 상세 요청 오류:', error);
        return { data: null };
      }
    },
    enabled: !!imageId,
  });
}; 