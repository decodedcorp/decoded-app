'use client';

import { cn } from '@/lib/utils/style';
import Image from 'next/image';
import { Point } from '@/types/model.d';
import { ImageMarker } from '@/components/ui/image-marker';
import { useDragAndDrop } from '../steps/upload-step/use-drag-and-drop';
import { UploadGuide } from './upload-guide';

interface ImageContainerProps {
  step: number;
  selectedImage: string | null;
  imageFile: File | null;
  points: Point[];
  onImageSelect: (image: string, file: File) => void;
  onPointsChange: (points: Point[]) => void;
  onPointContextChange?: (pointIndex: number, context: string) => void;
  onPointSelect?: (pointIndex: number | null) => void;
  children?: React.ReactNode;
}

export function ImageContainer({
  step,
  selectedImage,
  imageFile,
  points,
  onImageSelect,
  onPointsChange,
  onPointContextChange,
  onPointSelect,
}: ImageContainerProps) {
  const handleImageUpload = (file: File) => {
    const fileUrl = URL.createObjectURL(file);
    onImageSelect(fileUrl, file);
  };

  const {
    isDragging,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileSelect,
  } = useDragAndDrop({
    onFileSelect: handleImageUpload,
  });

  return (
    <div className={cn('flex-shrink-0', 'w-full', 'max-w-[24rem]', 'mx-auto')}>
      <div
        className={cn(
          'relative rounded-lg overflow-hidden',
          'w-full',
          step === 1 && 'aspect-[3/4]'
        )}
      >
        {step === 1 ? (
          <label
            className={cn(
              'relative block w-full h-full cursor-pointer transition-all',
              isDragging
                ? 'ring-2 ring-[#EAFD66] ring-offset-2 ring-offset-black'
                : 'hover:opacity-90'
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              className="hidden"
              accept="image/jpeg,image/jpg,image/png"
              onChange={handleFileSelect}
            />
            {selectedImage ? (
              <Image
                src={selectedImage}
                alt="Selected image"
                fill
                className="object-fit"
              />
            ) : (
              <UploadGuide />
            )}
          </label>
        ) : step === 3 ? (
          selectedImage && (
            <div className={cn('relative aspect-[3/4]', 'w-full')}>
              <Image
                src={selectedImage}
                alt="Selected image"
                fill
                className="object-fit"
              />
            </div>
          )
        ) : (
          selectedImage && (
            <ImageMarker
              imageUrl={selectedImage}
              points={points}
              onPointsChange={onPointsChange}
              onPointContextChange={onPointContextChange}
              onPointSelect={(point) => onPointSelect?.(points.indexOf(point))}
              showPointList={false}
              className="w-full"
            />
          )
        )}
      </div>
    </div>
  );
}
