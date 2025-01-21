'use client';

import { Heart } from 'lucide-react';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { cn } from '@/lib/utils/style';
import { AddItemModal } from '@/components/ui/modal/add-item-modal';

interface ItemActionsProps {
  initialLikeCount: number;
  onLike?: () => Promise<void>;
}

export function ItemActions({ initialLikeCount, onLike }: ItemActionsProps) {
  const params = useParams();
  const imageId = params.imageId as string;
  
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);

  const handleLike = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      await onLike?.();
      setIsLiked(!isLiked);
      setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    } catch (error) {
      console.error('Error updating like:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button 
            onClick={handleLike}
            disabled={isLoading}
            className={cn(
              "text-neutral-400 hover:text-white transition-colors",
              isLiked && "text-red-500 hover:text-red-400",
              isLoading && "opacity-50 cursor-not-allowed"
            )}
          >
            <Heart className="w-4 h-4" fill={isLiked ? "currentColor" : "none"} />
          </button>
          <span className="text-xs text-neutral-400">{likeCount}</span>
        </div>
        <button 
          onClick={() => setIsAddItemModalOpen(true)}
          className="px-4 py-2 rounded text-xs font-medium bg-neutral-800 text-white hover:bg-neutral-700 transition-colors"
        >
          아이템 추가
        </button>
      </div>

      {isAddItemModalOpen && (
        <AddItemModal
          isOpen={isAddItemModalOpen}
          onClose={() => setIsAddItemModalOpen(false)}
          imageId={imageId}
          requestUrl={`request/image/${imageId}/add/item`}
        />
      )}
    </>
  );
}
