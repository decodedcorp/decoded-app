'use client';

import { ItemActions } from './item-actions';

interface ItemActionsWrapperProps {
  initialLikeCount: number;
  imageId: string;
}

export function ItemActionsWrapper({ initialLikeCount, imageId }: ItemActionsWrapperProps) {
  const handleLike = async () => {
    try {
      // TODO: 실제 API 호출 구현
      console.log('Like clicked for image:', imageId);
    } catch (error) {
      console.error('Error updating like:', error);
    }
  };

  return (
    <ItemActions 
      initialLikeCount={initialLikeCount}
      onLike={handleLike}
    />
  );
} 