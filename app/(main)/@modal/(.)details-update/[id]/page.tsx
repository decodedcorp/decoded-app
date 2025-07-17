import { Suspense } from "react";
import { ImageSection } from "@/backup/app/details-update/[imageId]/components/image-section/image-section";
import { DetailsList } from "@/backup/app/details-update/[imageId]/components/item-list-section/server/details-list";
import { ItemDetailProvider } from '@/backup/app/details-update/[imageId]/context/item-detail-context';
import { DetailSectionLayout } from '@/backup/app/details-update/[imageId]/components/detail-section-layout';
import { ImageActions } from '@/backup/app/details-update/[imageId]/components/image-actions';
import { ProcessedImageData } from '@/lib/api/_types/image';
import { getImageDetails } from '@/backup/app/details-update/utils/hooks/fetchImageDetails';

export default async function ModalDetailsPage({ params }: { params: { id: string } }) {
  const imageData = await getImageDetails(params.id);

  if (!imageData) {
    return <div>이미지를 찾을 수 없습니다.</div>;
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ItemDetailProvider>
        <DetailSectionLayout 
          imageData={imageData} 
          selectedItemId={undefined}
          layoutType="list"
        >
          <div className="w-full max-w-[500px] mx-auto lg:mx-0 lg:sticky lg:top-4 lg:self-start">
            <div className="aspect-[4/5] w-full overflow-hidden rounded-lg">
              <ImageSection
                imageData={imageData}
                selectedItemId={undefined}
                layoutType="list"
              />
            </div>
            <ImageActions
              initialLikeCount={imageData.like || 0}
              imageId={imageData.doc_id}
              layoutType="list"
            />
          </div>
          <DetailsList
            imageData={imageData}
            selectedItemId={undefined}
          />
        </DetailSectionLayout>
      </ItemDetailProvider>
    </Suspense>
  );
} 