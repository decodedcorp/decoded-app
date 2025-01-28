'use client';

import Image from 'next/image';
// import { useNewalImages } from '@/app/details/hooks/use-newal-images';
import AllBrandRelatedSection from './server/all-brand-related-section';
import ArtistRelatedSection from './server/artist-related-section';
import BrandRelatedSection from './server/brand-related-section';
import { useQuery } from '@tanstack/react-query';
import { imagesAPI } from '@/lib/api/client/images';
import { getImageDetails } from '@/app/details/utils/hooks/fetchImageDetails';
import { useEffect } from 'react';


export function RelatedStylingSection({ imageId }: { imageId: string }) {
  // 1. 이미지 내의 모든 브랜드 관련 섹션
  // 2. 아티스트 관련 섹션 (artistImages)
  // 3. 디테일 아이템에서의 브랜드 관련 섹션
  // 4. 정보가 없을경우 트렌딩 관련 섹션 (newalImages)

  // const { data: newalImages, isLoading } = useNewalImages();

  const { data: imageDetails } = useQuery({
    queryKey: ['imageDetails', imageId],
    queryFn: () => getImageDetails(imageId)
  });

  console.log('imageDetails', imageDetails);

  // Get the first value from metadata object
  const artistName = imageDetails?.metadata ? 
    Object.values(imageDetails.metadata)[0] : undefined;
  const artistId = imageDetails?.metadata ? 
    Object.keys(imageDetails.metadata)[0] : undefined;

  const { data: artistImages, isLoading: isArtistImagesLoading } =
    useArtistImages(imageId);

  function useArtistImages(imageId: string) {
    return useQuery({
      queryKey: ['artistImages'],
      queryFn: () => {
        console.log('Fetching artist images for:', { imageId, artistId });
        return imagesAPI.getArtistImages(imageId, artistId || '');
      },
    });
  }

  // Add effect to log artist images when data changes
  useEffect(() => {
    if (artistImages) {
      console.log('Artist Images Data:', artistImages);
    }
  }, [artistImages]);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-white text-2xl font-bold">
            {artistName}의 STYLING
          </h2>
          <p className="text-gray-400 mt-1">
            아티스트의 다양한 스타일을 확인해보세요
          </p>
        </div>
        <div className="text-gray-400">
          <span>더보기</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {artistImages?.data?.map((image) => (
          <div
            key={image.doc_id}
            className="aspect-[3/4] bg-gray-800 rounded-lg overflow-hidden"
          >
            <Image
              src={image.img_url}
              alt="Related styling image"
              width={300}
              height={400}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
