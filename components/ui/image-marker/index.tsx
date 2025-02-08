'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import {
  Point,
  useImageMarker,
} from '@/lib/hooks/features/images/useImageMarker';

interface ImageMarkerProps {
  imageUrl: string;
  points: Point[];
  onPointsChange: (points: Point[]) => void;
  onPointContextChange?: (index: number, context: string) => void;
  onPointRemove?: (index: number) => void;
  showPointList?: boolean;
  className?: string;
  onPointSelect?: (point: Point) => void;
}

export function ImageMarker({
  imageUrl,
  points,
  onPointsChange,
  onPointContextChange,
  onPointRemove,
  showPointList = true,
  className,
  onPointSelect,
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

  const handlePointClick = (point: Point) => {
    onPointSelect?.(point);
  };

  return (
    <div className="space-y-6">
      <div
        ref={imageRef}
        className={`relative w-full aspect-[3/4] rounded-lg overflow-hidden cursor-crosshair ${className}`}
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
            className="absolute -translate-x-1/2 -translate-y-1/2 group"
            style={{ left: `${point.x}%`, top: `${point.y}%` }}
            onClick={(e) => {
              e.stopPropagation();
              handleRemovePoint(index);
            }}
          >
            <div className="relative w-4 h-4 hover:scale-125 transition-transform">
              <div className="absolute inset-0 border-2 border-yellow-400 rounded-full animate-pulse"></div>
              <div className="absolute inset-[2px] bg-yellow-400/30 rounded-full backdrop-blur-sm flex items-center justify-center cursor-pointer">
                <span className="text-xs text-white font-semibold leading-none translate-y-[0.5px]">
                  {index + 1}
                </span>
              </div>
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
                    <span className="text-xs text-back font-bold rounded-full p-1">
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
                    value={point.context || ''}
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
