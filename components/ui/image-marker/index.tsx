"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Point,
  useImageMarker,
} from "@/lib/hooks/features/images/useImageMarker";
import { X, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils/style";

interface ImageMarkerProps {
  isRequest: boolean;
  imageUrl: string;
  points: Point[];
  onPointsChange: (points: Point[]) => void;
  onPointContextChange?: (index: number, context: string) => void;
  onPointRemove?: (index: number) => void;
  className?: string;
  disableEditing?: boolean;
  selectedPointIndex?: number | null;
}

export function ImageMarker({
  isRequest,
  imageUrl,
  points,
  onPointsChange,
  onPointContextChange,
  onPointRemove,
  className,
  disableEditing,
  selectedPointIndex,
}: ImageMarkerProps) {
  const imageRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingPoint, setEditingPoint] = useState<Point | null>(null);
  const [showWarning, setShowWarning] = useState(false);

  const { calculatePointPosition } = useImageMarker({
    initialPoints: points,
    onChange: onPointsChange,
  });

  useEffect(() => {
    if (selectedPointIndex === null) {
      setIsEditing(false);
      setEditingPoint(null);
    }
  }, [selectedPointIndex]);

  const handleDeleteClick = useCallback(
    (e: React.MouseEvent, index: number) => {
      e.preventDefault();
      e.stopPropagation();

      // onPointRemove가 있으면 그것을 사용하고, 없으면 onPointsChange 사용
      if (onPointRemove) {
        onPointRemove(index);
      } else {
        const newPoints = [...points];
        newPoints.splice(index, 1);
        onPointsChange(newPoints);
      }

      // UI 상태 초기화
      setIsEditing(false);
      setEditingPoint(null);
    },
    [points, onPointsChange, onPointRemove]
  );

  const handleCloseClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // 편집 모드만 종료
    setIsEditing(false);
    setEditingPoint(null);
  }, []);

  const handleImageClick = useCallback(
    (e: React.MouseEvent) => {
      if (disableEditing) return;

      const rect = imageRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      if (isRequest) {
        if (points.length > 0) {
          setShowWarning(true);
          setTimeout(() => setShowWarning(false), 2000);
          return;
        }
      }

      const newPoint = { x, y, context: "" };
      onPointsChange([...points, newPoint]);
      setIsEditing(true);
      setEditingPoint(newPoint);
    },
    [points, onPointsChange, disableEditing]
  );

  return (
    <div
      className={cn(
        "relative w-full aspect-[4/5] overflow-hidden cursor-crosshair",
        className
      )}
    >
      {showWarning && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 animate-fade-in w-full">
          <div className="flex items-center gap-2 bg-black/90 text-[#EAFD66] px-4 py-2.5 rounded-lg text-sm backdrop-blur-sm border border-[#EAFD66]/20">
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span>아이템은 하나만 지정할 수 있습니다</span>
          </div>
        </div>
      )}

      {points.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="flex items-center gap-2 bg-black/80 text-zinc-300 px-4 py-2.5 rounded-lg text-sm backdrop-blur-sm border border-zinc-800/50">
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
              />
            </svg>
            <span>이미지를 클릭하여 아이템 위치를 지정해주세요</span>
          </div>
        </div>
      )}

      <div
        ref={imageRef}
        className="relative w-full h-full"
        onClick={handleImageClick}
      >
        <Image
          src={imageUrl}
          alt="Marked image"
          fill
          className="object-cover"
          unoptimized
        />

        {points.map((point, index) => (
          <div
            key={`marker-${index}-${point.x}-${point.y}`}
            className="absolute -translate-x-1/2 -translate-y-1/2 group"
            style={{ left: `${point.x}%`, top: `${point.y}%` }}
            onClick={(e) => handleDeleteClick(e, index)}
          >
            <div className="relative w-4 h-4 hover:scale-125 transition-transform">
              <div className="absolute inset-0 border-2 border-[#EAFD66] rounded-full animate-pulse" />
              <div className="absolute inset-[2px] bg-[#EAFD66]/30 rounded-full backdrop-blur-sm" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
