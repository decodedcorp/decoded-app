'use client';

import React, { useRef, useState, useCallback } from 'react';
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Button } from '@decoded/ui';
import { X, RotateCw, ZoomIn, ZoomOut } from 'lucide-react';

interface ImageCropEditorProps {
  src: string;
  type: 'thumbnail' | 'banner';
  onSave: (croppedBase64: string) => void;
  onCancel: () => void;
}

export function ImageCropEditor({ src, type, onSave, onCancel }: ImageCropEditorProps) {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 썸네일/배너별 기본 크롭 비율 설정
  const aspectRatio = type === 'thumbnail' ? 1 : 3; // 1:1 또는 3:1

  const onImageLoad = useCallback(
    (img: HTMLImageElement) => {
      const { width, height } = img;

      // 이미지 중앙에 기본 크롭 영역 설정
      const cropSize = Math.min(width, height * aspectRatio);
      const crop = centerCrop(
        makeAspectCrop(
          {
            unit: 'px',
            width: cropSize,
            height: cropSize / aspectRatio,
          },
          aspectRatio,
          width,
          height,
        ),
        width,
        height,
      );

      setCrop(crop);
    },
    [aspectRatio],
  );

  const handleRotation = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev * 1.2, 3));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev / 1.2, 0.5));
  };

  const handleSave = useCallback(async () => {
    if (!completedCrop || !imgRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y, width, height } = completedCrop;
    canvas.width = width;
    canvas.height = height;

    // 고품질 이미지 그리기
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // 회전과 스케일 적용
    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(scale, scale);
    ctx.drawImage(
      imgRef.current,
      x - width / 2,
      y - height / 2,
      width,
      height,
      -width / 2,
      -height / 2,
      width,
      height,
    );
    ctx.restore();

    // Base64 변환 (고품질)
    const croppedBase64 = canvas.toDataURL('image/jpeg', 0.95);
    onSave(croppedBase64);
  }, [completedCrop, rotation, scale, onSave]);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 rounded-lg p-6 max-w-4xl max-h-[90vh] overflow-auto w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white text-lg font-semibold">
            {type === 'thumbnail' ? '썸네일 편집' : '배너 편집'}
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="mb-4">
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={aspectRatio}
            minWidth={100}
            minHeight={100}
            className="max-h-96"
          >
            <img
              ref={imgRef}
              src={src}
              alt="Crop me"
              onLoad={(e) => onImageLoad(e.currentTarget)}
              className="max-w-full max-h-96 object-contain"
              style={{
                transform: `rotate(${rotation}deg) scale(${scale})`,
                transformOrigin: 'center',
              }}
            />
          </ReactCrop>
        </div>

        {/* 편집 도구 */}
        <div className="flex items-center gap-4 mb-6 p-4 bg-zinc-800 rounded-lg">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRotation}
              className="text-zinc-300 hover:text-white"
            >
              <RotateCw className="w-4 h-4 mr-1" />
              회전
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomOut}
              className="text-zinc-300 hover:text-white"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-sm text-zinc-400 min-w-12 text-center">
              {Math.round(scale * 100)}%
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomIn}
              className="text-zinc-300 hover:text-white"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
          </div>

          <div className="ml-auto text-sm text-zinc-400">
            {type === 'thumbnail' ? '정사각형 비율 (1:1)' : '가로형 비율 (3:1)'}
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onCancel}>
            취소
          </Button>
          <Button onClick={handleSave} disabled={!completedCrop}>
            저장
          </Button>
        </div>

        {/* 숨겨진 캔버스 */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}
