'use client';

import { cn } from '@/lib/utils/style';
import Image from 'next/image';
import { Point } from '@/types/model.d';
import { ImageMarker } from '@/components/ui/image-marker';
import { useDragAndDrop } from '../steps/upload-step/use-drag-and-drop';
import { UploadGuide } from './upload-guide';
import { motion } from 'framer-motion';
import type { ContextAnswer } from '../steps/context-step/context-step-sidebar';
import { useLocaleContext } from "@/lib/contexts/locale-context";

interface ImageContainerProps {
  step: number;
  selectedImage: string | null;
  imageFile: File | null;
  points: Point[];
  onImageSelect: (image: string, file: File) => void;
  onPointsChange: (points: Point[]) => void;
  onPointContextChange?: (point: Point, context: string | null) => void;
  onPointSelect?: (pointIndex: number | null) => void;
  children?: React.ReactNode;
  contextAnswers?: ContextAnswer | null;
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
  contextAnswers,
}: ImageContainerProps) {
  const { t } = useLocaleContext();

  const getLocationLabel = (value: string) => {
    return t.request.steps.context.questions.location.options[
      value as keyof typeof t.request.steps.context.questions.location.options
    ];
  };

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
    <div className="relative w-full h-full">
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
                  className="object-cover"
                />
              ) : (
                <UploadGuide />
              )}
            </label>
          ) : step === 3 ? (
            selectedImage && (
              <ImageMarker
                imageUrl={selectedImage}
                points={points}
                onPointsChange={onPointsChange}
                onPointContextChange={(index, context) => {
                  if (
                    onPointContextChange &&
                    index >= 0 &&
                    index < points.length
                  ) {
                    onPointContextChange(points[index], context);
                  }
                }}
                onPointSelect={
                  onPointSelect &&
                  ((point) => {
                    const index = points.indexOf(point);
                    onPointSelect(index >= 0 ? index : null);
                  })
                }
                showPointList={false}
                className="w-full pointer-events-none"
              />
            )
          ) : (
            selectedImage && (
              <ImageMarker
                imageUrl={selectedImage}
                points={points}
                onPointsChange={onPointsChange}
                onPointContextChange={(index, context) => {
                  if (
                    onPointContextChange &&
                    index >= 0 &&
                    index < points.length
                  ) {
                    onPointContextChange(points[index], context);
                  }
                }}
                onPointSelect={
                  onPointSelect &&
                  ((point) => {
                    const index = points.indexOf(point);
                    onPointSelect(index >= 0 ? index : null);
                  })
                }
                showPointList={false}
                className="w-full"
              />
            )
          )}
        </div>
      </div>
      
      {/* Location indicator */}
      {contextAnswers?.location && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-3 right-3 bg-gray-900/80 backdrop-blur-sm px-3 py-1.5 rounded-full"
        >
          <div className="flex items-center gap-2 text-sm text-gray-200">
            <svg 
              className="w-4 h-4" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
              />
            </svg>
            <span className="leading-none pt-[2px]">{getLocationLabel(contextAnswers.location)}</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
