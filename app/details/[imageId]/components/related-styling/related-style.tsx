'use client';

import { useQuery } from '@tanstack/react-query';
import { getImageDetails } from '@/app/details/utils/hooks/fetchImageDetails';
import { useEffect, useState } from 'react';
import { imagesAPI } from '@/lib/api/client/images';
import { RelatedSection } from './client/related-section';
import { 
  RelatedImage, 
  APIResponse,
  ArtistImagesResponse, 
  BrandImagesResponse,
  TrendingImagesResponse,
  RelatedImagesData,
  ItemDetailResponse
} from './types';

const MIN_IMAGES_TO_SHOW = 1;

export function RelatedStylingSection({ 
  imageId, 
  selectedItemId 
}: { 
  imageId: string;
  selectedItemId?: string;
}) {
  const [showTrending, setShowTrending] = useState(false);

  const { data: imageDetails } = useQuery({
    queryKey: ['imageDetails', imageId],
    queryFn: () => getImageDetails(imageId)
  });

  const artistName = imageDetails?.metadata ? 
    Object.values(imageDetails.metadata)[0] : undefined;
  const artistId = imageDetails?.metadata ? 
    Object.keys(imageDetails.metadata)[0] : undefined;

  const { data: relatedData, isLoading, error } = useQuery({
    queryKey: ['relatedImages', imageId, artistId, selectedItemId],
    queryFn: async (): Promise<RelatedImagesData> => {
      console.log('Fetching related images with:', {
        imageId,
        artistId,
        selectedItemId
      });

      try {
        const [artistResponse, brandResponse, trendingResponse] = await Promise.all([
          artistId 
            ? imagesAPI.getArtistImages(imageId, artistId).then(response => {
                console.log('Artist Images Response:', response);
                return response;
              })
            : Promise.resolve({ data: { images: [] }, status_code: 200, description: 'success' }),
          selectedItemId 
            ? imagesAPI.getItemDetail(selectedItemId).then(async response => {
                console.log('Item Detail Response:', response);
                const itemData = response.data.docs;
                const brandId = itemData?.metadata?.brand;
                
                console.log('Brand ID from Item:', {
                  selectedItemId,
                  brandId: brandId || 'Not found, using imageId as fallback'
                });
                
                if (brandId) {
                  const brandResponse = await imagesAPI.getBrandImages(brandId);
                  console.log('Brand Images by Item Brand:', brandResponse);
                  return brandResponse;
                }
                return {
                  status_code: 200,
                  description: 'success',
                  data: { items: [] }
                };
              })
            : imagesAPI.getBrandImages(imageId).then(response => {
                console.log('Brand Images by ImageId:', response);
                return response;
              }),
          imagesAPI.getNewalImages().then(response => {
            console.log('Trending Images Response:', response);
            return response;
          })
        ]);

        const result = {
          artistImages: artistResponse.data.images || [],
          brandImages: (brandResponse.data.items || []).map(item => ({
            image_doc_id: item._id,
            image_url: item.img_url
          })),
          trendingImages: trendingResponse.data.images || []
        };

        console.log('Final processed data:', {
          artistImagesCount: result.artistImages.length,
          brandImagesCount: result.brandImages.length,
          trendingImagesCount: result.trendingImages.length
        });

        return result;
      } catch (error) {
        console.error('Failed to fetch related images:', error);
        throw error;
      }
    },
    enabled: !!imageId
  });

  useEffect(() => {
    if (!isLoading && !error) {
      const hasEnoughArtistImages = (relatedData?.artistImages?.length ?? 0) >= MIN_IMAGES_TO_SHOW;
      const hasEnoughBrandImages = (relatedData?.brandImages?.length ?? 0) >= MIN_IMAGES_TO_SHOW;
      
      if (!hasEnoughArtistImages && !hasEnoughBrandImages) {
        setShowTrending(true);
      }
    }
  }, [relatedData, isLoading, error]);

  if (isLoading) {
    return (
      <div className="w-full py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-700 rounded w-1/4"></div>
          <div className="flex gap-4 overflow-x-auto">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex-none w-72 aspect-[4/5] bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !relatedData) {
    return null;
  }

  return (
    <div className="space-y-16">
      {relatedData.artistImages.length > 0 && (
        <RelatedSection
          images={relatedData.artistImages}
          isLoading={false}
        />
      )}

      {relatedData.brandImages.length > 0 && (
        <RelatedSection
          images={relatedData.brandImages}
          isLoading={false}
        />
      )}

      {showTrending && 
       !relatedData.artistImages.length && 
       !relatedData.brandImages.length && 
       relatedData.trendingImages.length > 0 && (
        <RelatedSection
          images={relatedData.trendingImages}
          isLoading={false}
        />
      )}
    </div>
  );
}
