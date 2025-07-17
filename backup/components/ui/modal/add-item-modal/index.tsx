"use client";

import { useState, useEffect, useRef } from "react";
import { imagesAPI } from "@/lib/api/endpoints/images";
import useModalClose from "@/lib/hooks/common/useModalClose";
import { ImageArea } from "./components/image-area";
import { RequestButton } from "./components/request-button";
import { Point, AddItemModalProps, ImageData } from "./types";
import type { DecodedItem } from "@/lib/api/_types/image";
import { cn } from "@/lib/utils/style";
import { X } from "lucide-react";

export function AddItemModal({
  isOpen,
  onClose,
  imageId,
  requestUrl,
}: AddItemModalProps) {
  const [newMarkers, setNewMarkers] = useState<Point[]>([]);
  const { modalRef, isClosing, handleClose } = useModalClose({ onClose });
  const [imageData, setImageData] = useState<ImageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchImageData = async () => {
      if (!isOpen || !imageId) return;

      setIsLoading(true);
      try {
        const response = await imagesAPI.getImageDetail(imageId);
        if (!response?.data?.image) return;

        const itemsArray = Object.values(response.data.image.items).flat();
        const processedImage: ImageData = {
          ...response.data.image,
          items: itemsArray,
        };

        setImageData(processedImage);
      } catch (error) {
        console.error("API Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImageData();
  }, [imageId, isOpen]);

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const isNearExistingMarker = itemPositions.some((pos) => {
      const distance = Math.sqrt(
        Math.pow(pos.x - x, 2) + Math.pow(pos.y - y, 2)
      );
      return distance < 5;
    });

    if (!isNearExistingMarker) {
      const newPoint = { x, y, context: "" };
      setNewMarkers((prev) => [...prev, newPoint]);
    }
  };

  const handleAdd = async (markers: Point[]) => {
    try {
      handleClose();
    } catch (error) {
      console.error("Failed to add markers:", error);
    }
  };

  const formatItemPositions = (items: DecodedItem[]): Point[] => {
    if (!items || !Array.isArray(items)) return [];
    return items
      .filter((item) => item && item.position)
      .map((item) => ({
        x: parseFloat(item.position.left),
        y: parseFloat(item.position.top),
      }));
  };

  const itemPositions = imageData?.items
    ? formatItemPositions(imageData.items)
    : [];

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center",
        "bg-black/80 backdrop-blur-sm",
        isClosing ? "animate-fade-out" : "animate-fade-in"
      )}
    >
      <div
        ref={modalRef}
        className={cn(
          "relative w-[90vw] max-w-[420px] bg-[#1A1A1A] rounded-2xl",
          "flex flex-col shadow-xl",
          "border border-white/5"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <h2 className="text-base font-medium text-white/80">
            아이템 정보 요청
          </h2>
          <button
            onClick={handleClose}
            className={cn(
              "p-2 rounded-full text-white/80/60 hover:text-white/80",
              "hover:bg-white/5 transition-colors"
            )}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 컨텐츠 */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {isLoading ? (
              <div className="flex items-center justify-center h-48">
                <div className="text-white/80/40">이미지를 불러오는 중...</div>
              </div>
            ) : !imageData?.img_url ? (
              <div className="flex items-center justify-center h-48">
                <div className="text-white/80/40">
                  이미지를 찾을 수 없습니다
                </div>
              </div>
            ) : (
              <ImageArea
                handleImageClick={handleImageClick}
                imageUrl={imageData.img_url}
                itemPositions={itemPositions}
                newMarkers={newMarkers}
                setNewMarkers={setNewMarkers}
              />
            )}
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="flex-shrink-0 p-6 pt-0">
          <RequestButton
            newMarkers={newMarkers}
            handleAdd={handleAdd}
            image={{ docId: imageId }}
            onClose={handleClose}
          />
        </div>
      </div>
    </div>
  );
}
