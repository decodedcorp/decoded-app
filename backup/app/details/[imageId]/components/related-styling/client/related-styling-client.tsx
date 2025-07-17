'use client';

import { useState, useEffect } from 'react';
import { useImageDetails } from '../hooks/use-image-details';
import { useRelatedImages } from '../hooks/use-related-images';
import { mapToRelatedImage } from '../utils/image-mappers';
import { RelatedSection } from './related-section';
import { RelatedStylingLoader } from '../components/related-styling-loader';
import { RelatedStylingError } from '../components/related-styling-error';

const MIN_IMAGES_TO_SHOW = 1;
const MIN_IMAGES_PER_SECTION = 4;
const INITIAL_VISIBLE_IMAGES = 12; // 초기에 표시할 이미지 수

// 이미지 배열에서 중복을 제거하는 헬퍼 함수
const deduplicateImages = <T extends Record<string, any>>(
  images: T[],
  idField: keyof T = 'doc_id' as keyof T
): T[] => {
  const uniqueIds = new Set<string>();
  return images.filter(img => {
    const id = img[idField];
    if (!id) return true; // ID가 없는 경우는 유지
    const isDuplicate = uniqueIds.has(id as string);
    if (!isDuplicate) uniqueIds.add(id as string);
    return !isDuplicate;
  });
};

export function RelatedStylingClient({
  imageId,
  selectedItemId,
  artistId,
  artistName,
}: {
  imageId: string;
  selectedItemId?: string;
  artistId?: string;
  artistName?: string;
}) {
  const [showTrending, setShowTrending] = useState(false);

  // 이미지 세부 정보 가져오기
  const { data: imageDetails } = useImageDetails(imageId);

  // 브랜드 ID 추출
  const selectedItem = selectedItemId
    ? ((imageDetails?.data as any)?.items?.[selectedItemId] || [])[0]?.item
    : null;
  const brandId = selectedItem?.item?.brand_id;

  // 관련 이미지 데이터 가져오기
  const {
    data: relatedData,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useRelatedImages(imageId, artistId, brandId, selectedItemId);

  // 트렌딩 이미지 표시 여부 결정
  useEffect(() => {
    if (!isLoading && !error && relatedData?.pages[0]) {
      const firstPage = relatedData.pages[0];
      const hasArtistImagesOnFirstPage = firstPage.artistImages.length > 0;
      const hasBrandImagesOnFirstPage = firstPage.brandImages.length > 0;

      if (hasArtistImagesOnFirstPage) {
        setShowTrending(false);
      } else if (!hasBrandImagesOnFirstPage) {
        setShowTrending(true);
      }
    }
  }, [relatedData, isLoading, error]);

  if (isLoading && !relatedData) {
    return <RelatedStylingLoader />;
  }

  if (error || !relatedData) {
    return <RelatedStylingError error={error} />;
  }

  // 모든 페이지의 이미지 데이터 병합
  const allArtistImages = deduplicateImages(
    relatedData?.pages.flatMap((page) => page.artistImages) || []
  );
  const allBrandImages = deduplicateImages(
    relatedData?.pages.flatMap((page) => page.brandImages) || []
  );
  const allTrendingImages = deduplicateImages(
    relatedData?.pages.flatMap((page) => page.trendingImages) || []
  );

  // 각 섹션의 조건 설정
  const hasArtistImages = allArtistImages.length > 0;
  const hasBrandImages = allBrandImages.length > 0;
  const hasTrendingImages = allTrendingImages.length > 0;
  
  // 아티스트 이미지가 있으면 트렌딩 이미지를 표시하지 않음
  const shouldShowTrending = hasArtistImages ? false : showTrending || !hasBrandImages;

  // 추가 데이터 로드 처리
  const handleLoadMore = () => {
    if (!isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  };

  return (
    <div className="space-y-16">
      {hasArtistImages && (
        <RelatedSection
          images={allArtistImages.map(mapToRelatedImage)}
          isLoading={isFetchingNextPage}
          title={artistName ? `${artistName} 스타일링` : '아티스트 스타일링'}
          artistId={artistId}
          artistName={artistName}
          onLoadMore={handleLoadMore}
          hasMore={hasNextPage}
        />
      )}

      {hasBrandImages && (
        <RelatedSection
          images={allBrandImages.map(mapToRelatedImage)}
          isLoading={false}
          title="브랜드 스타일링"
        />
      )}

      {shouldShowTrending && hasTrendingImages && (
        <RelatedSection
          images={allTrendingImages.map(mapToRelatedImage)}
          isLoading={false}
          title="트렌딩 스타일링"
        />
      )}
    </div>
  );
}
