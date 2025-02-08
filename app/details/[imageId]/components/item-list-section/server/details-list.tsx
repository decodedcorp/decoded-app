'use client';

import { ProcessedImageData, DecodedItem } from '@/lib/api/_types/image';
import { ItemListSection } from '../client/item-list';
import { getCategoryInfo } from '../../../../utils/hooks/category';
import { ItemActionsWrapper } from '../client/item-actions-wrapper';
import { DetailSlideSection } from '../../item-detail-section/detail-slide-section';

interface DetailsListProps {
  imageData: ProcessedImageData;
  selectedItemId?: string;
}

export function DetailsList({ imageData, selectedItemId }: DetailsListProps) {
  if (!imageData?.items?.length) {
    console.log('No items found in imageData:', imageData);
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-neutral-400">No items found</p>
      </div>
    );
  }

  const processedItems = imageData.items
    .map((item) => {
      const metadata = item?.item?.item?.metadata;
      if (!metadata) {
        console.log('No metadata found for item:', item);
        return null;
      }

      const categories = getCategoryInfo(metadata);
      const category = categories.find((cat) => cat.depth === 3)?.displayName;
      const subCategory = categories.find((cat) => cat.depth === 4)?.displayName;

      if (!category || !subCategory || !item?.item?.item?._id) {
        console.log('Missing required fields for item:', {
          category,
          subCategory,
          id: item?.item?.item?._id,
        });
        return null;
      }

      return {
        category,
        subCategory,
        imageUrl: item?.item?.item?.img_url || '',
        id: item?.item?.item?._id,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  const topLevelCategory =
    imageData.items
      .map((item) => getCategoryInfo(item?.item?.item?.metadata))
      .flat()
      .find((cat) => cat?.depth === 1)?.displayName || 'FASHION';

  return (
    <div className="w-full h-full flex flex-col relative">
      <div className="w-full h-full flex flex-col">
        {imageData.title && (
          <div className="px-3 py-2.5 border-b border-neutral-800">
            <h1 className="text-sm text-neutral-300 font-medium truncate">
              {imageData.title}
            </h1>
          </div>
        )}

        <div className="px-3 py-2.5 border-b border-neutral-800">
          <h2 className="text-sm font-medium text-neutral-400">
            {topLevelCategory}
          </h2>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto">
          {processedItems.length > 0 ? (
            <ItemListSection items={processedItems} />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-neutral-400">No items available</p>
            </div>
          )}
        </div>

        <div className="px-4 pt-3 border-t border-neutral-800">
          <ItemActionsWrapper
            initialLikeCount={imageData.like || 0}
            imageId={imageData.doc_id}
          />
        </div>
      </div>

      <DetailSlideSection />
    </div>
  );
}
