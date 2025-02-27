'use client';

import { cn } from '@/lib/utils/style';
import Image from 'next/image';
import { Point } from '@/types/model.d';
import { ImageMarker } from '@/components/ui/image-marker';
import { useDragAndDrop } from '../steps/upload-step/use-drag-and-drop';
import { UploadGuide } from './upload-guide';
import type { ContextAnswer } from '../steps/context-step/context-step-sidebar';
import { useLocaleContext } from "@/lib/contexts/locale-context";
import Cropper from 'react-easy-crop';
import { useState, useCallback, useEffect, useRef } from 'react';
import { Area } from 'react-easy-crop';

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
  selectedPoint?: number | null;
  onCropComplete?: (croppedArea: Area, croppedAreaPixels: Area) => void;
}

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
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
  selectedPoint,
  onCropComplete,
}: ImageContainerProps) {
  const { t } = useLocaleContext();
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [showCropper, setShowCropper] = useState(false);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [initialCrop, setInitialCrop] = useState<CropArea>({ x: 0, y: 0, width: 100, height: 100 });
  const [initialZoom, setInitialZoom] = useState(1);
  const originalImageRef = useRef<{ url: string; file: File } | null>(null);

  const getLocationLabel = (value: string) => {
    return t.request.steps.context.questions.location.options[
      value as keyof typeof t.request.steps.context.questions.location.options
    ];
  };

  const handleImageUpload = (file: File) => {
    const fileUrl = URL.createObjectURL(file);
    // 최초 이미지 상태 저장
    originalImageRef.current = { url: fileUrl, file };
    onImageSelect(fileUrl, file);
    setShowCropper(true);
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

  const onCropChange = useCallback((location: { x: number; y: number }) => {
    setCrop(location);
  }, []);

  const onZoomChange = useCallback((zoom: number) => {
    setZoom(zoom);
  }, []);

  const handleCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSaveCrop = useCallback(async () => {
    if (!selectedImage || !imageFile || !croppedAreaPixels) return;

    try {
      const image: HTMLImageElement = new window.Image(croppedAreaPixels.width, croppedAreaPixels.height);
      image.src = selectedImage;
      
      await new Promise((resolve) => {
        image.onload = resolve;
      });

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      const croppedImage = canvas.toDataURL('image/jpeg');
      
      // 크롭된 이미지를 File 객체로 변환
      const response = await fetch(croppedImage);
      const blob = await response.blob();
      const croppedFile = new File([blob], imageFile.name, { type: 'image/jpeg' });
      
      // 크롭된 이미지와 파일 업데이트
      onImageSelect(croppedImage, croppedFile);
      setShowCropper(false);
    } catch (e) {
      console.error(e);
    }
  }, [selectedImage, imageFile, croppedAreaPixels, onImageSelect]);

  const handleResetCrop = useCallback(() => {
    if (originalImageRef.current) {
      // 최초 이미지로 복원
      onImageSelect(originalImageRef.current.url, originalImageRef.current.file);
      
      const image = new window.Image();
      image.src = originalImageRef.current.url;
      image.onload = () => {
        const { width, height } = image;
        const targetRatio = 4/5;
        const imageRatio = width/height;
        
        let newZoom = 1;
        let newCrop = { x: 0, y: 0 };

        if (imageRatio > targetRatio) {
          newZoom = (height / width) * (4/5);
          newCrop = { x: (100 - (newZoom * 100)) / 2, y: 0 };
        } else {
          newZoom = 1;
          newCrop = { x: 0, y: (100 - ((width/height) * (5/4) * 100)) / 2 };
        }
        
        setZoom(newZoom);
        setCrop(newCrop);
        setInitialZoom(newZoom);
        setInitialCrop({ x: newCrop.x, y: newCrop.y, width: 100, height: 100 });
      };
    }
  }, [onImageSelect]);

  // 이미지 로드 시 초기값 계산
  useEffect(() => {
    if (selectedImage) {
      const image = new window.Image();
      image.src = selectedImage;
      image.onload = () => {
        const { width, height } = image;
        setImageDimensions({ width, height });

        // 4:5 비율에 맞는 초기 줌 레벨 계산
        const targetRatio = 4/5;
        const imageRatio = width/height;
        
        let newZoom = 1;
        let newCrop = { x: 0, y: 0 };

        if (imageRatio > targetRatio) {
          // 이미지가 더 넓은 경우
          newZoom = (height / width) * (4/5);
          newCrop = { x: (100 - (newZoom * 100)) / 2, y: 0 };
        } else {
          // 이미지가 더 좁은 경우
          newZoom = 1;
          newCrop = { x: 0, y: (100 - ((width/height) * (5/4) * 100)) / 2 };
        }
        
        // 상태 업데이트
        setInitialZoom(newZoom);
        setZoom(newZoom);
        setInitialCrop({ x: newCrop.x, y: newCrop.y, width: 100, height: 100 });
        setCrop(newCrop);
      };
    }
  }, [selectedImage]);

  return (
    <div className="relative w-full h-full">
      <div className={cn('flex-shrink-0', 'w-full', 'max-w-[28rem]', 'mx-auto')}>
        <div
          className={cn(
            'relative w-full', 
            'aspect-[4/5]',
            'max-h-[70vh]',
            'overflow-hidden rounded-lg'
          )}
        >
          {step === 1 ? (
            <>
              {selectedImage && showCropper ? (
                <div 
                  className={cn(
                    "relative w-full aspect-[4/5]",
                    "rounded-lg overflow-hidden",
                    "bg-black"
                  )}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <Cropper
                    image={selectedImage}
                    crop={crop}
                    zoom={zoom}
                    aspect={4/5}
                    onCropChange={onCropChange}
                    onZoomChange={onZoomChange}
                    onCropComplete={handleCropComplete}
                    objectFit="contain"
                    initialCroppedAreaPercentages={initialCrop}
                    minZoom={initialZoom * 0.8}
                    maxZoom={initialZoom * 2.5}
                    showGrid={true}
                    restrictPosition={true}
                    classes={{
                      containerClassName: "!relative !rounded-lg !h-full",
                      mediaClassName: "!relative !rounded-lg",
                      cropAreaClassName: "!rounded-lg !border-2 !border-[#EAFD66]",
                    }}
                  />
                  <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleResetCrop();
                        }}
                        className="px-3 py-1.5 rounded-lg bg-black/40 text-white text-sm backdrop-blur-sm hover:bg-black/60 transition-colors"
                      >
                        <div className="flex items-center gap-1.5">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 12a9 9 0 1 1 18 0 9 9 0 0 1-18 0z" />
                            <path d="M12 8v4l3 3" />
                          </svg>
                          <span>원본</span>
                        </div>
                      </button>
                      <input
                        type="range"
                        value={zoom}
                        min={initialZoom * 0.8}
                        max={initialZoom * 2.5}
                        step={0.1}
                        aria-labelledby="Zoom"
                        onChange={(e) => {
                          onZoomChange(Number(e.target.value));
                        }}
                        className="flex-1 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-[#EAFD66] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setShowCropper(false);
                        }}
                        className="px-4 py-2 rounded-lg bg-black/40 text-white backdrop-blur-sm hover:bg-black/60 transition-colors"
                      >
                        취소
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleSaveCrop();
                        }}
                        className="px-4 py-2 rounded-lg bg-[#EAFD66] text-black hover:bg-[#EAFD66]/90 transition-colors"
                      >
                        완료
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
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
                    <>
                      <Image
                        src={selectedImage}
                        alt="Selected image"
                        fill
                        className="object-cover"
                      />
                      <button
                        onClick={(e) => {
                          e.preventDefault();  // 이벤트 버블링 방지
                          e.stopPropagation(); // label 클릭 이벤트 방지
                          setShowCropper(true);
                        }}
                        className="absolute bottom-4 right-4 px-4 py-2 rounded-lg bg-black/40 text-white backdrop-blur-sm hover:bg-black/60 transition-colors"
                      >
                        이미지 조정
                      </button>
                    </>
                  ) : (
                    <UploadGuide />
                  )}
                </label>
              )}
            </>
          ) : step === 3 ? (
            <>
              {selectedImage && (
                <ImageMarker
                  imageUrl={selectedImage}
                  points={points}
                  onPointsChange={onPointsChange}
                  selectedPointIndex={null}
                  className="w-full pointer-events-none"
                  disableEditing={true}
                />
              )}
              {/* {contextAnswers?.location && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-3 right-3 bg-gray-900/80 backdrop-blur-sm px-3 py-1.5 rounded-full z-10"
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
              )} */}
            </>
          ) : (
            selectedImage && (
              <ImageMarker
                imageUrl={selectedImage}
                points={points}
                onPointsChange={onPointsChange}
                onPointContextChange={(index, context) => {
                  if (onPointContextChange && index >= 0 && index < points.length) {
                    onPointContextChange(points[index], context);
                  }
                }}
                onPointRemove={(index) => {
                  const newPoints = points.filter((_, i) => i !== index);
                  onPointsChange(newPoints);
                }}
                selectedPointIndex={selectedPoint}
                className="w-full"
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}

