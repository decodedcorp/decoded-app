'use client';

import { useState, useEffect, useRef } from 'react';
import { imagesAPI } from '@/lib/api/endpoints/images';
import useModalClose from '@/lib/hooks/common/useModalClose';
import { ImageArea } from './components/image-area';
import { MarkersArea } from './components/markers-area';
import { RequestButton } from './components/request-button';
import { ScrollIndicator } from './components/scroll-indicator';
import {
  Point,
  AddItemModalProps,
  APIResponse,
  ImageDetailResponse,
} from './types';
import { DecodedItem, ImageData } from '@/lib/api/types/image';

export function AddItemModal({
  isOpen,
  onClose,
  imageId,
  requestUrl,
}: AddItemModalProps) {
  const [newMarkers, setNewMarkers] = useState<Point[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { modalRef, isClosing, handleClose } = useModalClose({ onClose });
  const [imageData, setImageData] = useState<ImageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchImageData = async () => {
      if (!isOpen || !imageId) return;

      try {
        const response = await imagesAPI.getImageDetail(imageId);
        if (response.status_code === 200 && response.data?.images?.[0]) {
          setImageData(response.data.images[0] as unknown as ImageData);
          setIsLoading(false);
        } else {
          console.error('Invalid API response:', response);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('API Error:', error);
        setIsLoading(false);
      }
    };

    fetchImageData();
  }, [imageId, isOpen]);

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // 기존 마커 근처 클릭 방지 (5% 반경 내)
    const isNearExistingMarker = itemPositions.some((pos) => {
      const distance = Math.sqrt(
        Math.pow(pos.x - x, 2) + Math.pow(pos.y - y, 2)
      );
      return distance < 5; // 5% 반경 내 클릭 방지
    });

    if (!isNearExistingMarker) {
      setNewMarkers((prev) => [...prev, { x, y }]);
    }
  };

  const handleAdd = async (markers: Point[]) => {
    try {
      handleClose();
    } catch (error) {
      console.error('Failed to add markers:', error);
    }
  };

  const formatItemPositions = (
    items: Record<string, DecodedItem[]>
  ): Point[] => {
    if (!items) return [];

    const allItems = Object.values(items).flat();
    return allItems.map((item) => ({
      x: parseFloat(item.position.left),
      y: parseFloat(item.position.top),
    }));
  };

  const itemPositions = imageData?.items
    ? formatItemPositions(imageData.items)
    : [];

  console.log('Current Image Data:', imageData);
  console.log('Item Positions:', itemPositions);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50
        ${isClosing ? 'animate-fade-out' : 'animate-fade-in'}`}
    >
      <div
        ref={modalRef}
        className="relative w-[420px] max-h-[80vh] bg-[#1A1A1A] rounded-xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-shrink-0 flex items-center justify-between px-5 py-3 border-b border-gray-800">
          <h2 className="text-base font-medium text-gray-400">
            아이템 정보 요청
          </h2>
          <button
            onClick={handleClose}
            className="p-1 rounded-full hover:bg-gray-800 transition-colors"
          >
            <svg
              className="w-4 h-4 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div
          ref={scrollContainerRef}
          className="relative flex-1 overflow-y-auto min-h-0"
        >
          <div className="p-5 space-y-4 flex flex-col min-h-full">
            {isLoading ? (
              <div className="flex items-center justify-center h-48">
                <div className="text-gray-400">Loading...</div>
              </div>
            ) : (
              <>
                <ImageArea
                  handleImageClick={handleImageClick}
                  imageUrl={imageData?.img_url}
                  itemPositions={itemPositions}
                  newMarkers={newMarkers}
                  setNewMarkers={setNewMarkers}
                />
                {/* <MarkersArea
                  newMarkers={newMarkers}
                  setNewMarkers={setNewMarkers}
                /> */}
                <div className="flex-shrink-0 pt-4 border-t border-gray-800">
                  <RequestButton
                    newMarkers={newMarkers}
                    handleAdd={handleAdd}
                    image={{ docId: imageId }}
                    onClose={handleClose}
                  />
                </div>
              </>
            )}
          </div>
          <ScrollIndicator containerRef={scrollContainerRef} />
        </div>
      </div>
    </div>
  );
}
