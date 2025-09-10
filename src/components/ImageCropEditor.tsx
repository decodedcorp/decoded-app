'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import { Button } from '@decoded/ui';
import { X, RotateCw, ZoomIn, ZoomOut, Move, Crop as CropIcon } from 'lucide-react';

// ReactCrop CSS를 직접 추가
const cropStyles = `
  .ReactCrop {
    display: inline-block;
    position: relative;
    width: 100%;
    height: auto;
    background: #000;
    touch-action: none;
  }

  .ReactCrop__image {
    max-width: 100%;
    max-height: 100%;
    display: block;
  }

  .ReactCrop__crop-selection {
    position: absolute;
    top: 0;
    left: 0;
    transform: translate3d(0, 0, 0);
    box-sizing: border-box;
    cursor: move;
    box-shadow: 0 0 0 9999em rgba(0, 0, 0, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.5);
    touch-action: manipulation;
  }

  .ReactCrop__drag-handle {
    position: absolute;
    width: 12px;
    height: 12px;
    background-color: #fff;
    border: 1px solid #000;
    box-sizing: border-box;
  }

  .ReactCrop__drag-handle--n {
    top: -6px;
    left: 50%;
    transform: translateX(-50%);
    cursor: n-resize;
  }

  .ReactCrop__drag-handle--ne {
    top: -6px;
    right: -6px;
    cursor: ne-resize;
  }

  .ReactCrop__drag-handle--e {
    top: 50%;
    right: -6px;
    transform: translateY(-50%);
    cursor: e-resize;
  }

  .ReactCrop__drag-handle--se {
    bottom: -6px;
    right: -6px;
    cursor: se-resize;
  }

  .ReactCrop__drag-handle--s {
    bottom: -6px;
    left: 50%;
    transform: translateX(-50%);
    cursor: s-resize;
  }

  .ReactCrop__drag-handle--sw {
    bottom: -6px;
    left: -6px;
    cursor: sw-resize;
  }

  .ReactCrop__drag-handle--w {
    top: 50%;
    left: -6px;
    transform: translateY(-50%);
    cursor: w-resize;
  }

  .ReactCrop__drag-handle--nw {
    top: -6px;
    left: -6px;
    cursor: nw-resize;
  }

  .ReactCrop__drag-handle--disabled {
    cursor: inherit;
  }

  .ReactCrop__crop-selection--disabled {
    cursor: inherit;
  }

  .ReactCrop__crop-selection--circular .ReactCrop__drag-handle {
    border-radius: 50%;
  }

  .ReactCrop__crop-selection--circular .ReactCrop__crop-selection {
    border-radius: 50%;
  }
`;

interface ImageCropEditorProps {
  src: string;
  type: 'thumbnail' | 'banner';
  onSave: (croppedBase64: string) => void;
  onCancel: () => void;
}

export const ImageCropEditor = React.memo(
  function ImageCropEditor({ src, type, onSave, onCancel }: ImageCropEditorProps) {
    console.log('🎨 ImageCropEditor mounted with:', { type, srcLength: src?.length });

    const [crop, setCrop] = useState<Crop>();
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
    const [rotation, setRotation] = useState(0);
    const [scale, setScale] = useState(1);
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const imgRef = useRef<HTMLImageElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const previewCanvasRef = useRef<HTMLCanvasElement>(null);

    // 썸네일/배너별 기본 크롭 비율 설정
    const aspectRatio = type === 'thumbnail' ? 1 : 3; // 1:1 또는 3:1

    const onImageLoad = useCallback(
      (img: HTMLImageElement) => {
        console.log('🖼️ Image loaded:', { width: img.width, height: img.height, aspectRatio });
        const { width, height } = img;
        setIsImageLoaded(true);

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

        console.log('🎯 Setting initial crop:', crop);
        setCrop(crop);
      },
      [aspectRatio],
    );

    const handleRotation = useCallback(() => {
      setRotation((prev) => (prev + 90) % 360);
    }, []);

    const handleZoomIn = useCallback(() => {
      setScale((prev) => Math.min(prev * 1.2, 3));
    }, []);

    const handleZoomOut = useCallback(() => {
      setScale((prev) => Math.max(prev / 1.2, 0.5));
    }, []);

    const onCropChange = useCallback((crop: Crop) => {
      setCrop(crop);
    }, []);

    const onCropComplete = useCallback((crop: PixelCrop) => {
      console.log('🎯 Crop completed:', crop);
      setCompletedCrop(crop);
    }, []);

    // 실시간 미리보기 생성
    const generatePreview = useCallback(() => {
      if (!completedCrop || !imgRef.current || !previewCanvasRef.current) return;

      const canvas = previewCanvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const { x, y, width, height } = completedCrop;
      canvas.width = width;
      canvas.height = height;

      // 고품질 이미지 그리기
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // 디버깅 로그
      console.log('🔍 Preview generation:', {
        completedCrop: { x, y, width, height },
        rotation,
        scale,
        imgNaturalWidth: imgRef.current.naturalWidth,
        imgNaturalHeight: imgRef.current.naturalHeight,
        imgDisplayWidth: imgRef.current.width,
        imgDisplayHeight: imgRef.current.height,
      });

      // 회전과 스케일을 적용한 상태로 이미지 그리기
      ctx.save();
      ctx.translate(width / 2, height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(scale, scale);
      
      // 원본 이미지에서 크롭 영역을 정확히 추출
      ctx.drawImage(
        imgRef.current,
        x, // 원본 이미지에서의 시작 x 좌표
        y, // 원본 이미지에서의 시작 y 좌표
        width, // 크롭할 너비
        height, // 크롭할 높이
        -width / 2, // 캔버스에서의 시작 x 좌표 (중앙 기준)
        -height / 2, // 캔버스에서의 시작 y 좌표 (중앙 기준)
        width, // 캔버스에 그릴 너비
        height, // 캔버스에 그릴 높이
      );
      ctx.restore();

      // 미리보기 URL 생성
      const previewDataUrl = canvas.toDataURL('image/jpeg', 0.8);
      setPreviewUrl(previewDataUrl);
    }, [completedCrop, rotation, scale]);

    // 크롭이나 회전/스케일 변경 시 미리보기 업데이트
    useEffect(() => {
      if (completedCrop && isImageLoaded) {
        generatePreview();
      }
    }, [completedCrop, rotation, scale, isImageLoaded, generatePreview]);

    const handleSave = useCallback(async () => {
      console.log('💾 Save button clicked');
      if (!completedCrop || !imgRef.current || !canvasRef.current) {
        console.error('❌ Missing required elements for save:', {
          hasCompletedCrop: !!completedCrop,
          hasImgRef: !!imgRef.current,
          hasCanvasRef: !!canvasRef.current,
        });
        return;
      }

      console.log('✅ All elements available, proceeding with save');
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const { x, y, width, height } = completedCrop;
      canvas.width = width;
      canvas.height = height;

      // 고품질 이미지 그리기
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // 디버깅 로그
      console.log('🔍 Save generation:', {
        completedCrop: { x, y, width, height },
        rotation,
        scale,
        imgNaturalWidth: imgRef.current.naturalWidth,
        imgNaturalHeight: imgRef.current.naturalHeight,
        imgDisplayWidth: imgRef.current.width,
        imgDisplayHeight: imgRef.current.height,
      });

      // 회전과 스케일을 적용한 상태로 이미지 그리기
      ctx.save();
      ctx.translate(width / 2, height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(scale, scale);
      
      // 원본 이미지에서 크롭 영역을 정확히 추출
      ctx.drawImage(
        imgRef.current,
        x, // 원본 이미지에서의 시작 x 좌표
        y, // 원본 이미지에서의 시작 y 좌표
        width, // 크롭할 너비
        height, // 크롭할 높이
        -width / 2, // 캔버스에서의 시작 x 좌표 (중앙 기준)
        -height / 2, // 캔버스에서의 시작 y 좌표 (중앙 기준)
        width, // 캔버스에 그릴 너비
        height, // 캔버스에 그릴 높이
      );
      ctx.restore();

      // Base64 변환 (고품질)
      const croppedBase64 = canvas.toDataURL('image/jpeg', 0.95);
      console.log('✅ Image processed, calling onSave');
      onSave(croppedBase64);
    }, [completedCrop, rotation, scale, onSave]);

    return (
      <>
        {/* CSS 스타일 주입 */}
        <style dangerouslySetInnerHTML={{ __html: cropStyles }} />

        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 rounded-lg p-6 max-w-6xl max-h-[90vh] overflow-auto w-full">
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 편집 영역 */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-zinc-400">
                  <CropIcon className="w-4 h-4" />
                  <span>편집 영역</span>
                </div>

                <div className="flex justify-center">
                  <div className="max-w-full max-h-96 overflow-hidden border border-zinc-700 rounded-lg">
                    <ReactCrop
                      crop={crop}
                      onChange={onCropChange}
                      onComplete={onCropComplete}
                      aspect={aspectRatio}
                      minWidth={50}
                      minHeight={50}
                      className="max-h-96"
                      style={{ maxHeight: '400px' }}
                    >
                      <img
                        ref={imgRef}
                        src={src}
                        alt="Crop me"
                        onLoad={(e) => {
                          onImageLoad(e.currentTarget);
                        }}
                        onError={(e) => {
                          console.error('❌ Image load error:', e);
                        }}
                        className="max-w-full max-h-96 object-contain"
                        style={{
                          maxHeight: '400px',
                          maxWidth: '100%',
                          display: 'block',
                        }}
                      />
                    </ReactCrop>
                  </div>
                </div>
              </div>

              {/* 미리보기 영역 */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-zinc-400">
                  <Move className="w-4 h-4" />
                  <span>미리보기</span>
                </div>

                <div className="flex justify-center">
                  <div
                    className={`border border-zinc-700 rounded-lg overflow-hidden bg-zinc-800 ${
                      type === 'thumbnail' ? 'w-32 h-32' : 'w-64 h-20'
                    }`}
                  >
                    {previewUrl ? (
                      <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-500">
                        <div className="text-center">
                          <CropIcon className="w-8 h-8 mx-auto mb-2" />
                          <p className="text-xs">크롭 영역을 선택하세요</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 미리보기 정보 */}
                {completedCrop && (
                  <div className="text-xs text-zinc-400 text-center">
                    <p>
                      크롭 크기: {Math.round(completedCrop.width)} ×{' '}
                      {Math.round(completedCrop.height)}
                    </p>
                    <p>
                      회전: {rotation}° | 확대: {Math.round(scale * 100)}%
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* 편집 도구 */}
            <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-zinc-800 rounded-lg">
              {/* 회전 도구 */}
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
                <span className="text-xs text-zinc-500">{rotation}°</span>
              </div>

              {/* 확대/축소 도구 */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleZoomOut}
                  className="text-zinc-300 hover:text-white"
                  disabled={scale <= 0.5}
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
                  disabled={scale >= 3}
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
              </div>

              {/* 비율 정보 */}
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <div className="w-2 h-2 bg-zinc-600 rounded-full"></div>
                <span>{type === 'thumbnail' ? '정사각형 (1:1)' : '가로형 (3:1)'}</span>
              </div>

              {/* 크롭 가이드 */}
              <div className="ml-auto text-xs text-zinc-500">
                <p>• 드래그하여 크롭 영역 이동</p>
                <p>• 모서리를 드래그하여 크기 조절</p>
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

            {/* 숨겨진 캔버스들 */}
            <canvas ref={canvasRef} className="hidden" />
            <canvas ref={previewCanvasRef} className="hidden" />
          </div>
        </div>
      </>
    );
  },
  (prevProps, nextProps) => {
    // Only re-render if src or type changes
    const srcEqual = prevProps.src === nextProps.src;
    const typeEqual = prevProps.type === nextProps.type;
    const onSaveEqual = prevProps.onSave === nextProps.onSave;
    const onCancelEqual = prevProps.onCancel === nextProps.onCancel;
    const shouldNotRerender = srcEqual && typeEqual && onSaveEqual && onCancelEqual;

    if (!shouldNotRerender) {
      console.log('🔍 React.memo: Component will re-render', {
        srcEqual,
        typeEqual,
        onSaveEqual,
        onCancelEqual,
        prevSrc: prevProps.src?.substring(0, 50),
        nextSrc: nextProps.src?.substring(0, 50),
      });
    }

    return shouldNotRerender;
  },
);
