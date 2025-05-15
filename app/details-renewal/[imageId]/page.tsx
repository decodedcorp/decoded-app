import { Suspense } from 'react';
import { LoadingDisplay } from './components/loading';
import { notFound } from 'next/navigation';
import { ErrorDisplay } from './components/error';
import { getImageDetails } from '@/app/details/utils/hooks/fetchImageDetails';
import { ImageDetails, DecodedItem } from '@/lib/api/_types/image';
import { generateItemSchema } from '@/lib/structured-data/geneartors/item';
import { MobileDetailsList } from './components/item-list-section/mobile/mobile-details-list';
import { MobileActions } from './components/item-list-section/mobile/mobile-actions';
import { GridWrapper } from './components/item-list-section/server/grid-wrapper';
import { ImageSectionWrapper } from './components/image-section-wrapper';
import { ArtistHeader } from './components/related-styling/client/artist-header';
import { LinkButton } from './components/modal/link-button';

// 타입 정의
interface PageProps {
  params: Promise<{
    imageId: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

interface ProcessedImageData extends Omit<ImageDetails, 'items'> {
  items: DecodedItem[];
}

interface imagesMetadata {
  [key: string]: string;
}

// 서버 컴포넌트
export default async function DetailPage({ params, searchParams }: PageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  if (!resolvedParams?.imageId) return notFound();

  const imageId = resolvedParams.imageId;
  const selectedItemId = Array.isArray(resolvedSearchParams?.selectedItem)
    ? resolvedSearchParams.selectedItem[0]
    : resolvedSearchParams?.selectedItem;

  try {
    const imageData = await getImageDetails(imageId);

    if (!imageData) {
      return notFound();
    }

    // metadata에서 아티스트 정보 추출 로직 개선
    const metadata = imageData.metadata || {};
    let artistId = '';
    let artistName = '';
    let profileImageUrl = '';

    // profile_image_url 키 제외한 첫 번째 키를 artistId로 사용
    const keys = Object.keys(metadata).filter(
      (key) => key !== 'profile_image_url'
    );
    if (keys.length > 0) {
      artistId = keys[0];
      artistName = metadata[artistId] || '';
    }

    // 프로필 이미지 URL 가져오기
    profileImageUrl = metadata.profile_image_url || '';

    const processedImageData: ProcessedImageData = {
      ...imageData,
      items: Object.values(imageData.items || {})
        .flat()
        .filter((item): item is DecodedItem => {
          return Boolean(item?.item?.item);
        }),
    };

    if (!processedImageData.items.length) {
      // TODO: Support `en` locale
      return <ErrorDisplay message={'상품 정보를 찾을 수 없습니다'} />;
    }

    const selectedItem = processedImageData.items.find(
      (item) => item.item?.item?._id === selectedItemId
    );

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ItemList',
              name: `${artistName}의 스타일`,
              image: imageData.img_url,
              description: `${artistName}이(가) 착용한 아이템`,
              numberOfItems: processedImageData.items.length,
              itemListElement: processedImageData.items.map((item, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                item: generateItemSchema(item, artistName),
              })),
            }),
          }}
        />
        {selectedItem && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(
                generateItemSchema(selectedItem, artistName || '')
              ),
            }}
          />
        )}
        <div className="min-h-screen bg-black">
          <div className="w-full mx-auto pt-16 sm:pt-24 px-4 sm:px-6">
            <Suspense fallback={<LoadingDisplay />}>
              <div className="overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-[minmax(300px,400px)_1fr] lg:grid-cols-[minmax(350px,500px)_1fr] items-start gap-4 md:gap-6">
                  <div className="w-full">
                    {/* 아티스트 정보 표시 */}
                    <div className="mb-3 md:mb-4 rounded-lg overflow-hidden">
                      {artistName && (
                        <ArtistHeader
                          artistId={artistId}
                          artistName={artistName}
                        />
                      )}
                    </div>
                    {/* 이미지 섹션 */}
                    <div className="aspect-[4/5] w-full overflow-hidden rounded-lg shadow-lg">
                      <ImageSectionWrapper
                        imageData={processedImageData}
                        selectedItemId={selectedItemId}
                      />
                    </div>
                  </div>
                  <div className="hidden md:block h-[100vh] overflow-y-auto custom-scrollbar p-3 md:p-4 rounded-lg bg-zinc-950/50 relative">
                    {/* 헤더와 필터링 섹션 */}
                    <div className="space-y-4 mb-6 md:mb-8">
                      <div className="flex justify-between items-center">
                        <h2 className="text-white text-lg md:text-xl font-medium">
                          DECODED
                        </h2>
                      </div>

                      {/* 필터링 섹션 - 심플 스타일 */}
                      <div className="flex items-center gap-6">
                        {/* 콘텐츠 타입 필터 */}
                        <div className="flex items-center gap-6">
                          {['전체', '아이템', '블로그', '쇼츠'].map((type) => (
                            <button
                              key={type}
                              className="text-sm text-zinc-400 hover:text-primary transition-colors"
                            >
                              {type}
                            </button>
                          ))}
                        </div>

                        {/* 구분선 */}
                        <div className="h-4 w-px bg-zinc-800" />

                        {/* 정렬 옵션 */}
                        <select className="text-sm text-zinc-400 hover:text-primary bg-transparent border-none focus:outline-none cursor-pointer">
                          <option value="latest">최신순</option>
                          <option value="popular">인기순</option>
                          <option value="trending">트렌딩</option>
                        </select>
                      </div>
                    </div>

                    <GridWrapper imageId={imageId} />

                    {/* 우측 하단 고정 버튼 */}
                    <div className="fixed bottom-8 right-8 z-50">
                      <LinkButton imageId={imageId} />
                    </div>
                  </div>
                </div>
              </div>
            </Suspense>
          </div>
          {/* <div className="w-full max-w-[1200px] mx-auto mt-8 px-4 sm:px-6">
            <Suspense fallback={<div className="h-20"></div>}>
              <RelatedStylingSection
                imageId={imageData.doc_id}
                selectedItemId={selectedItemId}
                artistId={artistId}
                artistName={artistName}
              />
            </Suspense>
          </div> */}
          <div className="md:hidden px-3 sm:px-4">
            <MobileDetailsList
              imageData={processedImageData}
              selectedItemId={selectedItemId}
            />

            <MobileActions
              initialLikeCount={imageData.like}
              imageId={imageData.doc_id}
              isFixed={true}
            />
          </div>
        </div>
      </>
    );
  } catch (error) {
    // TODO: Support `en` locale
    return <ErrorDisplay message={'페이지를 불러오는데 실패했습니다'} />;
  }
}
