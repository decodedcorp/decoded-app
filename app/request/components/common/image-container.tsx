'use client';

import { cn } from '@/lib/utils/style';
import Image from 'next/image';
import { Point } from '@/types/model.d';
import { ImageMarker } from '@/components/ui/image-marker';
import { useDragAndDrop } from '../steps/upload-step/use-drag-and-drop';

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
    <div className={cn('flex-shrink-0', 'w-[360px]')}>
      <div
        className={cn(
          'relative h-full rounded-lg overflow-hidden',
          step === 1 && 'aspect-[3/4]'
        )}
      >
        {step === 1 ? (
          <label
            className={cn(
              'relative h-full block cursor-pointer transition-all',
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
              <div className="h-full bg-[#1A1A1A] flex flex-col items-center justify-center p-8">
                <div className="w-full max-w-[280px] mx-auto">
                  <div className="mb-8 text-center">
                    <svg
                      className="w-10 h-10 text-gray-500 mx-auto mb-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="text-sm font-medium text-gray-400 mb-1">
                      이미지를 업로드해주세요
                    </p>
                    <p className="text-xs text-gray-500">
                      클릭하여 이미지를 선택하거나 드래그앤드롭 하세요
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-[#EAFD66]/10 border border-[#EAFD66]/30 text-[#EAFD66] flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                        !
                      </span>
                      <div>
                        <h3 className="text-xs font-medium text-gray-400 mb-1">
                          필수 입력사항
                        </h3>
                        <p className="text-xs text-gray-500">
                          아이템을 찾고 싶은 이미지를 업로드해주세요
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-gray-900 text-gray-400 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                        ?
                      </span>
                      <div>
                        <h3 className="text-xs font-medium text-gray-400 mb-1">
                          도움말
                        </h3>
                        <ul className="text-xs space-y-1 text-gray-500">
                          <li>• 최대 5MB까지 업로드 가능</li>
                          <li>• jpg, jpeg, png 형식만 가능</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </label>
        ) : (
          selectedImage && (
            <ImageMarker
              imageUrl={selectedImage}
              points={points}
              onPointsChange={onPointsChange}
              onPointContextChange={onPointContextChange}
              onPointSelect={(point) => onPointSelect?.(points.indexOf(point))}
              showPointList={false}
            />
          )
        )}
      </div>
    </div>
  );
}
