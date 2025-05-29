'use client';

import { useRef } from 'react';
import { ProcessedImageData, DecodedItem } from '@/lib/api/_types/image';
import { ItemListSection } from '../client/item-list';
import { getCategoryInfo } from '../../../../utils/hooks/category';
import { ItemActionsWrapper } from '../client/item-actions-wrapper';
import { useItemDetail } from '../../../context/item-detail-context';

interface DetailsListProps {
  imageData: ProcessedImageData;
  selectedItemId?: string;
  mainContainerRef?: React.RefObject<HTMLDivElement>;
  bgContainerRef?: React.RefObject<HTMLDivElement>;
  gridLayoutRef?: React.RefObject<HTMLDivElement>;
  isExpanded?: boolean;
}

export function DetailsList({ 
  imageData, 
  selectedItemId,
  mainContainerRef,
  bgContainerRef,
  gridLayoutRef,
  isExpanded
}: DetailsListProps) {
  const { selectedItemId: contextSelectedItemId } = useItemDetail();

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
      const subCategory = categories.find(
        (cat) => cat.depth === 4
      )?.displayName;

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

  return (
    <div className="w-full h-full flex flex-col justify-between relative">
      <div className="w-full h-full flex flex-col">
        <div className="flex-1 min-h-0 overflow-y-auto">
          {processedItems.length > 0 ? (
            <ItemListSection 
              items={processedItems} 
              mainContainerRef={mainContainerRef}
              bgContainerRef={bgContainerRef}
              gridLayoutRef={gridLayoutRef}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-neutral-400">No items available</p>
            </div>
          )}
        </div>
        {!isExpanded && !contextSelectedItemId && (
          <div className="flex-shrink-0 mt-auto px-4 pt-3 border-t border-neutral-800">
            <ItemActionsWrapper
              initialLikeCount={imageData.like || 0}
              imageId={imageData.doc_id}
              layoutType="masonry"
            />
          </div>
        )}
      </div>
    </div>
  );
}
