'use client';

import { ImageDetail } from '../_types/image-grid';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  imageDetail: ImageDetail | null;
  isFetchingDetail: boolean;
  detailError: string | null;
}

export function ImageSidebar({
  isOpen,
  onClose,
  imageDetail,
  isFetchingDetail,
  detailError,
}: ImageSidebarProps) {
  return (
    <div className="h-full w-full bg-white shadow-lg">
      <div className="p-4">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
        
        {isFetchingDetail ? (
          <div>Loading...</div>
        ) : detailError ? (
          <div>Error loading details</div>
        ) : imageDetail ? (
          <div className="mt-8">
            <h2 className="text-xl font-bold">{imageDetail.title}</h2>
            <p className="mt-4">{imageDetail.description}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
} 