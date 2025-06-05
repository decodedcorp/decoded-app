"use client";

import { Suspense } from "react";
import { ImageSection } from "@/app/details-update/[imageId]/components/image-section/image-section";
import { DetailsList } from "@/app/details-update/[imageId]/components/item-list-section/server/details-list";
import { ItemDetailProvider } from '@/app/details-update/[imageId]/context/item-detail-context';
import { DetailSectionLayout } from '@/app/details-update/[imageId]/components/detail-section-layout';
import { ImageActions } from '@/app/details-update/[imageId]/components/image-actions';
import { ProcessedImageData } from '@/lib/api/_types/image';

interface DetailsUpdateModalProps {
  imageId: string;
  imageData: ProcessedImageData;
}

export default function DetailsUpdateModal({ imageId, imageData }: DetailsUpdateModalProps) {
  if (!imageData) return null;

  // Ensure metadata exists with a default value
  const processedImageData = {
    ...imageData,
    metadata: imageData.metadata || { name: '이미지' }
  };

  return (
    <ItemDetailProvider>
      <DetailSectionLayout 
        imageData={processedImageData} 
        selectedItemId={undefined}
        layoutType="list"
      >
        <div className="w-full max-w-[500px] mx-auto lg:mx-0 lg:sticky lg:top-4 lg:self-start">
          <div className="aspect-[4/5] w-full overflow-hidden rounded-lg">
            <ImageSection
              imageData={processedImageData}
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
          imageData={processedImageData}
          selectedItemId={undefined}
        />
      </DetailSectionLayout>
    </ItemDetailProvider>
  );
} 