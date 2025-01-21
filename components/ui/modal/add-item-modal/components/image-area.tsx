'use client';

import Image from 'next/image';
import { ImageAreaProps } from '../types';
import { Caution } from './caution';
import { useState } from 'react';
import { ImageNewMarker } from '../../../image-marker/image-new-marker';

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
          aspectRatio: '3/4',
          width: '100%',
        }}
        onClick={handleImageClick}
      >
        {imageUrl && !imageError ? (
          <Image
            src={imageUrl}
            alt="Item Image"
            fill
            className="object-cover"
            onError={() => {
              console.error('Failed to load image:', imageUrl);
              setImageError(true);
            }}
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
            className="absolute w-4 h-4 -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${position.x}%`,
              top: `${position.y}%`,
            }}
          >
            <div className="w-full h-full rounded-full border-2 border-black/50 bg-white/50 cursor-not-allowed" />
          </div>
        ))}

        {/* New markers */}
        {newMarkers.map((marker, index) => (
          <ImageNewMarker
            key={`new-marker-${index}`}
            position={marker}
            onClick={(e) => handleMarkerClick(e, index)}
          />
        ))}
      </div>
      <p className="text-xs text-gray-500 text-center">
        이미지를 클릭하여 아이템 위치를 지정해주세요
      </p>
    </div>
  );
}
