'use client';

import Image from 'next/image';
import { ImageAreaProps } from '../types';
import { Caution } from './caution';
import { useState } from 'react';

export function ImageArea({
  handleImageClick,
  imageUrl,
  itemPositions,
  newMarkers,
  setNewMarkers,
}: ImageAreaProps) {
  const [imageError, setImageError] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  const handleMarkerClick = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    setNewMarkers((prev) => {
      const updatedMarkers = prev.filter((_, i) => i !== index);
      return updatedMarkers;
    });
  };

  const handleImageClickWrapper = (e: React.MouseEvent<HTMLDivElement>) => {
    if (newMarkers.length > 0) {
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 2000);
      return;
    }
    handleImageClick(e);
  };

  return (
    <div className="flex flex-col space-y-3">
      <div
        className="relative w-full overflow-hidden mx-auto bg-gray-900 rounded-lg cursor-crosshair"
        style={{ aspectRatio: '3/4' }}
        onClick={handleImageClickWrapper}
      >
        {showWarning && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 animate-fade-in w-full p-4">
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

        {newMarkers.length === 0 && (
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

        {imageUrl && !imageError ? (
          <Image
            src={imageUrl}
            alt="Item Image"
            fill
            className="object-cover"
            onError={() => setImageError(true)}
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500">
            {imageError ? 'Failed to load image' : 'No image available'}
          </div>
        )}

        {/* Existing markers */}
        {itemPositions.map((position, index) => (
          <div
            key={`existing-marker-${index}`}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${position.x}%`,
              top: `${position.y}%`,
            }}
          >
            <div className="w-4 h-4 rounded-full border-2 border-black/50 bg-white/50 cursor-not-allowed" />
          </div>
        ))}

        {/* New markers */}
        {newMarkers.map((marker, index) => (
          <div
            key={`new-marker-${index}`}
            className="absolute -translate-x-1/2 -translate-y-1/2 group"
            style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
            onClick={(e) => handleMarkerClick(e, index)}
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
