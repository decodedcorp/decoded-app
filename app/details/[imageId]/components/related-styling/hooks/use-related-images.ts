import { useInfiniteQuery } from '@tanstack/react-query';
import { 
  imagesService, 
  PageParams, 
  RelatedImagesResponse 
} from '@/lib/api/requests/images';

const IMAGES_PER_PAGE = 8;

export const useRelatedImages = (
  imageId: string, 
  artistId?: string, 
  brandId?: string, 
  selectedItemId?: string
) => {
  return useInfiniteQuery<RelatedImagesResponse>({
    queryKey: ['relatedImages', imageId, artistId, brandId, selectedItemId],
    initialPageParam: null,
    queryFn: async ({ pageParam = null }) => {
      try {
        // 페이지 매개변수 구조 분해
        const { artistNextId, brandNextId, trendingNextId } =
          (pageParam as PageParams) || {
            artistNextId: null,
            brandNextId: null,
            trendingNextId: null,
          };

        // 병렬로 세 가지 유형의 이미지 가져오기
        const [artistResponse, brandResponse, trendingResponse] =
          await Promise.all([
            // 아티스트 이미지
            artistId
              ? imagesService.getArtistImages(imageId, artistId, {
                  limit: IMAGES_PER_PAGE,
                  next_id: artistNextId ?? undefined,
                }).catch(() => ({ 
                  data: { images: [], maybe_next_id: null }
                }))
              : Promise.resolve({
                  data: { images: [], maybe_next_id: null }
                }),

            // 브랜드 이미지
            brandId
              ? imagesService.getBrandImages(brandId, {
                  limit: IMAGES_PER_PAGE,
                  next_id: brandNextId ?? undefined,
                }).catch(() => ({ 
                  data: { docs: [], next_id: null } 
                }))
              : Promise.resolve({
                  data: { docs: [], next_id: null }
                }),

            // 트렌딩 이미지
            imagesService.getImages({
              limit: 8,
              next_id: trendingNextId ?? undefined,
            }).catch(() => ({ 
              data: { images: [], maybe_next_id: null } 
            })),
          ]);

        // 다음 페이지 ID 추출
        const nextParams: PageParams = {
          artistNextId: artistResponse?.data && 'maybe_next_id' in artistResponse.data ? artistResponse.data.maybe_next_id : null,
          brandNextId: brandResponse?.data && 'next_id' in brandResponse.data ? brandResponse.data.next_id : null,
          trendingNextId: trendingResponse?.data && 'maybe_next_id' in trendingResponse.data ? trendingResponse.data.maybe_next_id : null,
        };

        // 응답 데이터 가공
        return {
          artistImages: artistResponse?.data && 'images' in artistResponse.data ? artistResponse.data.images : [],
          brandImages: brandResponse?.data && 'docs' in brandResponse.data ? brandResponse.data.docs : [],
          trendingImages: trendingResponse?.data && 'images' in trendingResponse.data ? trendingResponse.data.images : [],
          nextParams,
        };
      } catch (error) {
        throw {
          message: '이미지를 불러오는데 실패했습니다. 네트워크 연결을 확인해주세요.',
          originalError: error,
        };
      }
    },
    getNextPageParam: (lastPage) => {
      const { artistNextId, brandNextId, trendingNextId } = lastPage.nextParams;
      return artistNextId || brandNextId || trendingNextId
        ? lastPage.nextParams
        : null;
    },
  });
}; 