"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { Point, useImageMarker } from "@/lib/hooks/features/images/useImageMarker";

interface ImageMarkerProps {
  imageUrl: string;
  points: Point[];
  onPointsChange: (points: Point[]) => void;
  onPointContextChange?: (index: number, context: string) => void;
  onPointRemove?: (index: number) => void;
  showPointList?: boolean;
  className?: string;
}

export function ImageMarker({
  imageUrl,
  points,
  onPointsChange,
  onPointContextChange,
  onPointRemove,
  showPointList = true,
  className,
}: ImageMarkerProps) {
  const imageRef = useRef<HTMLDivElement>(null);
  const { calculatePointPosition } = useImageMarker({
    initialPoints: points,
    onChange: onPointsChange,
  });

  const handleImageClick = (e: React.MouseEvent) => {
    if (!imageRef.current) return;
    const { x, y } = calculatePointPosition(
      imageRef.current,
      e.clientX,
      e.clientY
    );
    onPointsChange([...points, { x, y }]);
  };

  const handleRemovePoint = (index: number) => {
    if (onPointRemove) {
      onPointRemove(index);
    } else {
      onPointsChange(points.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="space-y-6">
      <div
        ref={imageRef}
        className={`relative aspect-[3/4] rounded-lg overflow-hidden cursor-crosshair ${className}`}
        onClick={handleImageClick}
      >
        <Image
          src={imageUrl}
          alt="Marked image"
          fill
          className="object-cover"
        />

        {points.map((point, index) => (
          <div
            key={index}
            className="absolute w-6 h-6 -ml-3 -mt-3 group"
            style={{ left: `${point.x}%`, top: `${point.y}%` }}
          >
            <div className="relative">
              <div className="absolute w-4 h-4 animate-ping rounded-full bg-[#EAFD66] opacity-75"></div>
              <div className="relative w-4 h-4 rounded-full bg-[#EAFD66] flex items-center justify-center">
                <span className="text-xs text-black font-bold">
                  {index + 1}
                </span>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemovePoint(index);
                }}
                className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full text-white 
                  flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>

      {showPointList && points.length > 0 && (
        <div className="space-y-3">
          {points.map((point, index) => (
            <div
              key={index}
              className="bg-[#1A1A1A] rounded-lg overflow-hidden"
            >
              <div className="p-3 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-4 h-4 rounded-full bg-[#EAFD66] flex items-center justify-center">
                    <span className="text-xs text-black font-bold rounded-full p-1">
                      {index + 1}
                    </span>
                  </span>
                </div>
                <button
                  onClick={() => handleRemovePoint(index)}
                  className="text-gray-400 hover:text-red-500 p-1"
                >
                  <svg
                    className="w-5 h-5"
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

              {onPointContextChange && (
                <div className="p-3">
                  <textarea
                    rows={2}
                    value={point.context || ""}
                    onChange={(e) =>
                      onPointContextChange(index, e.target.value)
                    }
                    className="w-full text-sm p-2 rounded-md bg-[#1A1A1A] text-gray-400"
                    placeholder="이 아이템에 대한 추가 정보를 입력해주세요 (선택사항)"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
