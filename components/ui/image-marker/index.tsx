'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { Point, useImageMarker } from '@/lib/hooks/features/images/useImageMarker';
import { X, Trash2 } from 'lucide-react';

interface ImageMarkerProps {
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

  const handleImageClick = (e: React.MouseEvent) => {
    if (!imageRef.current || points.length > 0) return;
    const { x, y } = calculatePointPosition(
      imageRef.current,
      e.clientX,
      e.clientY
    );
    onPointsChange([{ x, y }]);
    setIsEditing(true);
  };

  const handleRemovePoint = () => {
    if (onPointRemove) {
      onPointRemove(0);
    } else {
      onPointsChange([]);
    }
    setIsEditing(false);
  };

  const handleCloseEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(false);
  };

  const handlePointClick = (point: Point, index: number) => {
    if (disableEditing) return;
    setIsEditing(true);
    setEditingPoint(point);
  };

  return (
    <div className="relative w-full aspect-[4/5] rounded-lg overflow-hidden cursor-crosshair">
      <div
        ref={imageRef}
        className={`relative w-full h-full ${className}`}
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
          >
            <div 
              className="relative w-4 h-4 hover:scale-125 transition-transform"
              onClick={(e) => {
                e.stopPropagation();
                handlePointClick(point, index);
              }}
            >
              <div className="absolute inset-0 border-2 border-[#EAFD66] rounded-full animate-pulse"></div>
              <div className="absolute inset-[2px] bg-[#EAFD66]/30 rounded-full backdrop-blur-sm flex items-center justify-center cursor-pointer">
                <span className="text-xs text-white font-semibold leading-none translate-y-[0.5px]">
                  1
                </span>
              </div>
            </div>

            {isEditing && editingPoint === point && (
              <div 
                className="absolute top-6 left-1/2 -translate-x-1/2 w-48 bg-[#1A1A1A]/95 backdrop-blur-sm rounded-lg border border-zinc-800/50 p-2 z-10"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-zinc-400">아이템 설명</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={handleRemovePoint}
                      className="p-1 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-red-400"
                      title="마커 삭제"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={handleCloseEdit}
                      className="p-1 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-zinc-300"
                      title="닫기"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <textarea
                  rows={2}
                  value={point.context || ''}
                  onChange={(e) => onPointContextChange?.(index, e.target.value)}
                  className="w-full text-xs p-1.5 rounded-md bg-zinc-900/50 text-zinc-300 border border-zinc-800 resize-none"
                  placeholder="아이템 설명 입력 (선택사항)"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
