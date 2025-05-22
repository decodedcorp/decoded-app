'use client';

import { useItemDetail } from '../context/item-detail-context';
import { ItemActionsWrapper } from './item-list-section/client/item-actions-wrapper';

interface ImageActionsProps {
  initialLikeCount: number;
  imageId: string;
  layoutType: string;
}

export function ImageActions({ initialLikeCount, imageId, layoutType }: ImageActionsProps) {
  const { selectedItemId } = useItemDetail();
  const isExpanded = !!selectedItemId;

  if (!isExpanded) return null;

  return (
    <div className="px-4 pt-3 border-t border-neutral-800">
      <ItemActionsWrapper
        initialLikeCount={initialLikeCount}
        imageId={imageId}
        layoutType={layoutType as 'masonry' | 'list'}
      />
    </div>
  );
} 