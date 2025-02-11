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

    if (!imageData) {
      console.error(`No image data found for ID: ${imageId}`);
      return notFound();
    }

    const processedImageData: ProcessedImageData = {
      ...imageData,
      items: Object.values(imageData.items || {})
        .flat()
        .filter((item): item is DecodedItem => {
          return Boolean(item?.item?.item);
        }),
    };

    if (!processedImageData.items.length) {
      console.error("No valid items found in image data");
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
              }이(가) 착용한 패션 아이템`,
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
        <div className="min-h-screen pt-18 sm:pt-24 bg-black">
          <div className="max-w-4xl mx-auto px-4 space-y-16">
            <Suspense fallback={<LoadingDisplay />}>
              <div className="bg-[#1A1A1A] rounded-2xl p-4">
                <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,30rem)_minmax(0,36rem)] gap-6 items-start justify-center">
                  <ImageSection
                    imageData={processedImageData}
                    selectedItemId={selectedItemId}
                  />
                  <DetailsList
                    imageData={processedImageData}
                    selectedItemId={selectedItemId}
                  />
                </div>
              </div>
              <RelatedStylingSection 
                imageId={imageData.doc_id} 
                selectedItemId={selectedItemId}
              />
            </Suspense>
          </div>
        </div>
      </>
    );
  } catch (error) {
    // TODO: Support `en` locale
    console.error("Error in DetailsPage:", error);
    return <ErrorDisplay message={"페이지를 불러오는데 실패했습니다"} />;
  }
}
