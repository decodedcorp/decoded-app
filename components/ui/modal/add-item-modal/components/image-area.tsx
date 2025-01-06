"use client";

import Image from "next/image";
import { ImageAreaProps } from "../types";
import { Caution } from "./caution";
import { useState } from "react";

export function ImageArea({
  handleImageClick,
  imageUrl,
  itemPositions,
  newMarkers,
  setNewMarkers,
}: ImageAreaProps) {
  const [imageError, setImageError] = useState(false);

  const handleMarkerClick = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    setNewMarkers((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col space-y-3">
      <Caution />
      <div
        className="relative w-full overflow-hidden mx-auto bg-gray-900 rounded-lg"
        style={{
          aspectRatio: "3/4",
          width: "100%",
          maxWidth: "380px",
        }}
      >
        <div
          className="absolute inset-0 cursor-crosshair"
          onClick={handleImageClick}
        >
          {imageUrl && (
            <Image
              src={imageUrl}
              alt="Item image"
              fill
              className="object-cover"
              sizes="(max-width: 380px) 100vw, 380px"
              onError={() => setImageError(true)}
              priority
            />
          )}

          {imageError && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs text-gray-400">
                이미지를 불러올 수 없습니다
              </span>
            </div>
          )}

          <div className="absolute inset-0 bg-black/10" />

          {/* 기존 마커들 */}
          {itemPositions.map((position, idx) => (
            <div
              key={`existing-${idx}`}
              className="absolute w-4 h-4 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              style={{
                top: `${position.top}%`,
                left: `${position.left}%`,
              }}
            >
              <div className="absolute inset-0 border border-gray-400/30 rounded-full"></div>
              <div className="absolute inset-[2px] bg-gray-400/50 rounded-full backdrop-blur-sm"></div>
            </div>
          ))}

          {/* 새로운 마커들 */}
          {newMarkers.map((marker, idx) => (
            <div
              key={`new-${idx}`}
              onClick={(e) => handleMarkerClick(e, idx)}
              className="absolute w-4 h-4 -translate-x-1/2 -translate-y-1/2 cursor-pointer 
                hover:scale-125 transition-transform"
              style={{
                top: `${marker.y}%`,
                left: `${marker.x}%`,
              }}
            >
              <div className="absolute inset-0 border-2 border-yellow-400 rounded-full animate-pulse"></div>
              <div className="absolute inset-[2px] bg-yellow-400/30 rounded-full backdrop-blur-sm"></div>
            </div>
          ))}
        </div>
      </div>
      <p className="text-xs text-gray-500 text-center">
        이미지를 클릭하여 아이템 위치를 지정해주세요
      </p>
    </div>
  );
}
