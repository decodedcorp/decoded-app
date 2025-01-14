'use client';

import { useState, useEffect, useRef } from 'react';
import { Point, RequestedItem } from '@/types/model.d';
import { networkManager } from '@/lib/network/network';
import { AddItemModalProps } from './types';
import { ImageArea } from './components/image-area';
import { MarkersArea } from './components/markers-area';
import { RequestButton } from './components/request-button';
import { ScrollIndicator } from './components/scroll-indicator';
import useModalClose from '@/lib/hooks/common/useModalClose';

export function AddItemModal({
  isOpen,
  onClose,
  requestUrl,
  imageId,
  imageUrl,
  itemPositions,
}: AddItemModalProps) {
  const [newMarkers, setNewMarkers] = useState<Point[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { modalRef, isClosing, handleClose } = useModalClose({
    onClose,
  });

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setNewMarkers((prev) => [...prev, { x, y }]);
  };

  const handleAdd = async (points: Point[]) => {
    if (sessionStorage.getItem('USER_DOC_ID') === null) {
      alert('로그인이 필요합니다');
      return;
    }

    const items: RequestedItem[] = points.map((point) => ({
      position: {
        top: point.y.toString(),
        left: point.x.toString(),
      },
      imageId,
      originalPosition: itemPositions[0],
    }));

    const requestAddItem = {
      requestBy: sessionStorage.getItem('USER_DOC_ID'),
      items,
    };

    try {
      await networkManager.request(
        `request/image/${imageId}/add/item`,
        'POST',
        requestAddItem
      );
      alert('요청이 완료되었습니다.');
      setNewMarkers([]);
      handleClose();
    } catch (error: any) {
      alert(error.response?.data?.description || '요청중 오류가 발생했습니다.');
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={handleOverlayClick}
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50
        ${isClosing ? 'animate-fade-out' : 'animate-fade-in'}`}
    >
      <div
        ref={modalRef}
        className="relative w-[420px] max-h-[80vh] bg-[#1A1A1A] rounded-xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
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

        {/* Scrollable Content including Footer */}
        <div
          ref={scrollContainerRef}
          className="relative flex-1 overflow-y-auto min-h-0"
        >
          <div className="p-5 space-y-4 flex flex-col min-h-full">
            <div className="flex-1 space-y-4">
              <ImageArea
                handleImageClick={handleImageClick}
                imageUrl={imageUrl}
                itemPositions={itemPositions}
                newMarkers={newMarkers}
                setNewMarkers={setNewMarkers}
              />
              <MarkersArea
                newMarkers={newMarkers}
                setNewMarkers={setNewMarkers}
              />
            </div>

            {/* Footer - Scrollable */}
            <div className="flex-shrink-0 pt-4 border-t border-gray-800">
              <RequestButton
                newMarkers={newMarkers}
                handleAdd={handleAdd}
                image={{ docId: imageId }}
                onClose={handleClose}
              />
            </div>
          </div>
          <ScrollIndicator containerRef={scrollContainerRef} />
        </div>
      </div>
    </div>
  );
}
