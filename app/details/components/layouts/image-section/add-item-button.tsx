'use client';

import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
import { AddItemModal } from '@/components/ui/modal/add-item-modal';

interface AddItemButtonProps {
  requestUrl: string;
  imageId: string;
  imageUrl: string;
  itemPositions: Array<{
    top: string;
    left: string;
  }>;
  className?: string;
}

export function AddItemButton({
  requestUrl,
  imageId,
  imageUrl,
  itemPositions,
  className,
}: AddItemButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddItem = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsModalOpen(true);
  };

  return (
    <>
      <button
        onClick={handleAddItem}
        className={`inline-flex items-center gap-1.5 bg-black/80 hover:bg-black px-3 py-1.5 rounded-md text-white text-sm font-medium transition-colors ${className}`}
      >
        <PlusIcon className="w-4 h-4 stroke-[2.5]" />
        <span className="translate-y-[0.5px]">아이템 추가</span>
      </button>

      <AddItemModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        requestUrl={requestUrl}
        imageId={imageId}
        imageUrl={imageUrl}
        itemPositions={itemPositions}
      />
    </>
  );
}
