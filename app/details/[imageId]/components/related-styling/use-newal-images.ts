import { useQuery } from '@tanstack/react-query';
import { imagesAPI } from '@/lib/api/client/images';

interface ImageResponse {
  data: {
    image_doc_id: string;
    image_url: string;
  }[];
}

export function useNewalImages() {
  return useQuery({
    queryKey: ['newalImages'],
    queryFn: () => imagesAPI.getNewalImages(),
  });
}
