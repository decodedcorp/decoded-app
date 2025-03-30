import { Suspense } from "react";
import { LoadingDisplay } from "./components/loading";
import { notFound } from "next/navigation";
import { ErrorDisplay } from "./components/error";
import { getImageDetails } from "@/app/details/utils/hooks/fetchImageDetails";
import { ImageSection } from "./components/image-section/image-section";
import { DetailsList } from "./components/item-list-section/server/details-list";
import { RelatedStylingSection } from "./components/related-styling/related-style";
import { ImageDetails, DecodedItem } from "@/lib/api/_types/image";
import { generateItemSchema } from "@/lib/structured-data/geneartors/item";
import { MobileDetailsList } from "./components/item-list-section/mobile/mobile-details-list";
import { MobileActions } from "./components/item-list-section/mobile/mobile-actions";

// 타입 정의
interface PageProps {
  params: Promise<{
    imageId: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

interface ProcessedImageData extends Omit<ImageDetails, "items"> {
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
    console.log(imageData);
    if (!imageData) {
      return notFound();
    }

    // metadata에서 첫 번째 키를 아티스트 ID로 사용
    const metadataKeys = Object.keys(imageData.metadata || {});
    const potentialArtistId =
      metadataKeys.length > 0 ? metadataKeys[0] : undefined;

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
      return <ErrorDisplay message={"상품 정보를 찾을 수 없습니다"} />;
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
              "@context": "https://schema.org",
              "@type": "ItemList",
              name: `${Object.values(imageData.metadata)[0]}의 스타일`,
              image: imageData.img_url,
              description: `${
                Object.values(imageData.metadata)[0]
              }이(가) 착용한 아이템`,
              numberOfItems: processedImageData.items.length,
              itemListElement: processedImageData.items.map((item, index) => ({
                "@type": "ListItem",
                position: index + 1,
                item: generateItemSchema(
                  item,
                  Object.values(imageData.metadata)[0]
                ),
              })),
            }),
          }}
        />
        {selectedItem && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(
                generateItemSchema(
                  selectedItem,
                  Object.values(imageData.metadata)[0] || ""
                )
              ),
            }}
          />
        )}
        <div className="min-h-screen pt-16 sm:pt-24 bg-black">
          <div className="w-full sm:max-w-[960px] mx-auto px-0 sm:px-4 mb-0 sm:mb-8 lg:mb-16">
            <Suspense fallback={<LoadingDisplay />}>
              <div className="bg-transparent sm:bg-transparent lg:bg-[#1A1A1A] sm:rounded-2xl p-0 sm:p-4 lg:p-6">
                <div className="grid grid-cols-1 lg:grid-cols-[minmax(350px,500px)_minmax(350px,1fr)] items-start justify-center gap-6">
                  <div className="w-screen sm:w-full max-w-[500px] mx-auto lg:mx-0">
                    <div className="aspect-[4/5] w-full overflow-hidden rounded-none sm:rounded-lg">
                      <ImageSection
                        imageData={processedImageData}
                        selectedItemId={selectedItemId}
                      />
                    </div>
                  </div>
                  <div className="hidden lg:block h-full">
                    <DetailsList
                      imageData={processedImageData}
                      selectedItemId={selectedItemId}
                    />
                  </div>
                </div>
              </div>
            </Suspense>
          </div>
          <div className="w-full">
            <Suspense fallback={<div className="h-20"></div>}>
              <RelatedStylingSection
                imageId={imageData.doc_id}
                selectedItemId={selectedItemId}
                artistId={potentialArtistId}
                artistName={Object.values(imageData.metadata)[0] || undefined}
              />
            </Suspense>
          </div>
        </div>
        <div className="lg:hidden">
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
      </>
    );
  } catch (error) {
    // TODO: Support `en` locale
    return <ErrorDisplay message={"페이지를 불러오는데 실패했습니다"} />;
  }
}
