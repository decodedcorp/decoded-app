import { useQuery } from '@tanstack/react-query';
import {
  getExploreImages,
} from '@/lib/api/requests/explore';

export const useExplore = (of: 'identity' | 'brand') => {
  const { data } = useQuery({
    queryKey: ['explore', of],
    queryFn: async () => {
      const response = await getExploreImages(of);
      return response;
    }
  });

  return { images: data };
};
