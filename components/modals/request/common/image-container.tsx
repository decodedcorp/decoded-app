"use client";

import { cn } from "@/lib/utils/style";
import Image from "next/image";
import { Point } from "@/types/model.d";
import { ImageMarker } from "@/components/ui/image-marker";
import { useDragAndDrop } from "../steps/upload-step/use-drag-and-drop";
import { UploadGuide } from "./upload-guide";
import type { ContextAnswer } from "../steps/context-step/context-step-sidebar";
import { useLocaleContext } from "@/lib/contexts/locale-context";
import { Cropper as ReactCropper } from "react-cropper";
import "cropperjs/dist/cropper.css";
import {
  useState,
  useCallback,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  useMemo,
} from "react";
import {
  Image as ImageIcon,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Check,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmModal } from "./confirm-modal";
import { debounce } from "lodash";

interface Area {
  x: number;
  y: number;
  width: number;
  height: number;
  left?: number;
  top?: number;
}

interface ImageContainerProps {
  isRequest: boolean;
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
  fullscreenMode?: boolean;
  showCropper?: boolean;
  onCropperChange?: (show: boolean) => void;
  themeColor?: string;
  lastCropInfo?: {
    area: Area;
    zoom: number;
    crop: { x: number; y: number };
  } | null;
  isCroppingRef?: React.MutableRefObject<boolean>;
}

export interface ImageContainerHandle {
  applyCrop: () => Promise<void>;
}

// 유틸리티 함수들을 컴포넌트 외부로 분리
const TARGET_ASPECT_RATIO = 4 / 5;
const MAX_IMAGE_SIZE = 1500;
const MIN_IMAGE_WIDTH = 600;
const MIN_IMAGE_HEIGHT = 750;
const MAX_ZOOM = 3;
const MIN_ZOOM = 0.1;
const CROP_BOX_SCALE = 0.85;

/**
 * 이미지가 크롭 영역 경계 내에 있는지 확인하고 필요시 조정하는 유틸리티 함수
 */
function ensureImageWithinCropBox(cropper: any): boolean {
  if (!cropper) return false;

  const cropBoxData = cropper.getCropBoxData();
  const canvasData = cropper.getCanvasData();
  let adjustedCanvasData = { ...canvasData };
  let needAdjust = false;

  // 너비 체크
  if (canvasData.width < cropBoxData.width) {
    // 이미지 너비가 너무 작은 경우
    adjustedCanvasData.left = cropBoxData.left;
    needAdjust = true;
  } else {
    // 좌측 경계 체크
    if (canvasData.left > cropBoxData.left) {
      adjustedCanvasData.left = cropBoxData.left;
      needAdjust = true;
    }
    // 우측 경계 체크
    if (
      canvasData.left + canvasData.width <
      cropBoxData.left + cropBoxData.width
    ) {
      adjustedCanvasData.left =
        cropBoxData.left + cropBoxData.width - canvasData.width;
      needAdjust = true;
    }
  }

  // 높이 체크
  if (canvasData.height < cropBoxData.height) {
    // 이미지 높이가 너무 작은 경우
    adjustedCanvasData.top = cropBoxData.top;
    needAdjust = true;
  } else {
    // 상단 경계 체크
    if (canvasData.top > cropBoxData.top) {
      adjustedCanvasData.top = cropBoxData.top;
      needAdjust = true;
    }
    // 하단 경계 체크
    if (
      canvasData.top + canvasData.height <
      cropBoxData.top + cropBoxData.height
    ) {
      adjustedCanvasData.top =
        cropBoxData.top + cropBoxData.height - canvasData.height;
      needAdjust = true;
    }
  }

  if (needAdjust) {
    cropper.setCanvasData(adjustedCanvasData);
  }

  return needAdjust;
}

/**
 * 이미지 크롭퍼 컴포넌트
 */
export const ImageContainer = forwardRef<
  ImageContainerHandle,
  ImageContainerProps
>(
  (
    {
      isRequest,
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
      fullscreenMode = false,
      showCropper = false,
      onCropperChange,
      themeColor = "#EAFD66",
      lastCropInfo = null,
      isCroppingRef,
    },
    ref
  ) => {
    const { t } = useLocaleContext();
    const [imageDimensions, setImageDimensions] = useState({
      width: 0,
      height: 0,
    });
    const [originalImageState, setOriginalImageState] = useState<{
      dataUrl: string;
      file: File;
    } | null>(null);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [isResetting, setIsResetting] = useState(false);
    const cropperRef = useRef<any>(null);
    const originalImageRef = useRef<{ url: string; file: File } | null>(null);
    const firstUploadRef = useRef<{ dataUrl: string; file: File } | null>(null);

    // 줌 제한을 위한 상수
    const MIN_ZOOM = 0.1; // 최소 줌 레벨
    const MAX_ZOOM = 3.0; // 최대 줌 레벨

    // 이미지가 크롭 박스를 벗어나지 않도록 조정하는 헬퍼 함수
    const ensureImageWithinCropBox = useCallback((cropper: any) => {
      try {
        if (!cropper) return;

        // 크롭 박스와 캔버스 데이터 가져오기
        const cropBoxData = cropper.getCropBoxData();
        const canvasData = cropper.getCanvasData();

        // 이미지가 크롭 박스보다 작아진 경우 최소 크기로 조정
        if (
          canvasData.width < cropBoxData.width ||
          canvasData.height < cropBoxData.height
        ) {
          const imageData = cropper.getImageData();
          const minZoomX = cropBoxData.width / imageData.naturalWidth;
          const minZoomY = cropBoxData.height / imageData.naturalHeight;
          const minZoom = Math.max(minZoomX, minZoomY) * 1.01;

          cropper.zoomTo(minZoom);
          return;
        }

        // 캔버스가 크롭 박스 영역을 벗어났는지 확인하고 조정
        let needsUpdate = false;
        const newCanvasData = { ...canvasData };

        // 왼쪽 경계 확인
        if (canvasData.left > cropBoxData.left) {
          newCanvasData.left = cropBoxData.left;
          needsUpdate = true;
        }

        // 오른쪽 경계 확인
        if (
          canvasData.left + canvasData.width <
          cropBoxData.left + cropBoxData.width
        ) {
          newCanvasData.left =
            cropBoxData.left + cropBoxData.width - canvasData.width;
          needsUpdate = true;
        }

        // 위쪽 경계 확인
        if (canvasData.top > cropBoxData.top) {
          newCanvasData.top = cropBoxData.top;
          needsUpdate = true;
        }

        // 아래쪽 경계 확인
        if (
          canvasData.top + canvasData.height <
          cropBoxData.top + cropBoxData.height
        ) {
          newCanvasData.top =
            cropBoxData.top + cropBoxData.height - canvasData.height;
          needsUpdate = true;
        }

        // 필요한 경우 캔버스 위치 업데이트
        if (needsUpdate) {
          cropper.setCanvasData(newCanvasData);
        }
      } catch (err) {
        console.error("이미지 위치 조정 실패:", err);
      }
    }, []);

    // 파일 이름으로만 세션 스토리지 키 생성
    const getOriginalImageKey = useCallback((file: File) => {
      return `ORIGINAL_IMAGE_${file.name}`; // 파일 크기 제외
    }, []);

    // 원본 이미지를 세션 스토리지에 저장하는 함수
    const saveToSessionStorage = useCallback(
      (dataUrl: string, file: File) => {
        try {
          const key = getOriginalImageKey(file);
          const data = {
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size,
            lastModified: file.lastModified,
            timestamp: Date.now(),
            dataUrl: dataUrl, // 원본 이미지 데이터URL도 저장
          };

          try {
            sessionStorage.removeItem(key);
            sessionStorage.setItem(key, JSON.stringify(data));
          } catch (e) {
            console.error("세션 스토리지 저장 실패:", e);
          }

          return key;
        } catch (err) {
          console.error("세션 스토리지 저장 실패:", err);
          return null;
        }
      },
      [getOriginalImageKey]
    );

    // 세션 스토리지에서 원본 이미지 로드
    const loadFromSessionStorage = useCallback(
      (file: File) => {
        try {
          const key = getOriginalImageKey(file);
          const storedData = sessionStorage.getItem(key);

          if (!storedData) {
            return null;
          }

          // 세션 스토리지에서 불러온 데이터 반환
          return JSON.parse(storedData);
        } catch (err) {
          console.error("세션 스토리지 로드 실패:", err);
          return null;
        }
      },
      [getOriginalImageKey]
    );

    // 이미지 미리 로드 함수 - 최적화
    useEffect(() => {
      if (!selectedImage) return;

      setImageLoaded(false);

      const img = new window.Image();
      img.crossOrigin = "anonymous";

      img.onload = () => {
        setImageLoaded(true);
        setImageDimensions({
          width: img.width,
          height: img.height,
        });
      };

      img.onerror = (err: Event | string) => {
        console.error("이미지 로드 실패:", err);
        setImageLoaded(false);
      };

      img.src = selectedImage;
    }, [selectedImage]);

    const handleImageUpload = useCallback(
      (file: File) => {
        console.log("🔄 이미지 업로드 시작:", file.name, file.size);

        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            const base64Data = e.target.result as string;

            console.log("✅ 최초 이미지 저장 시작");

            // 파일 이름만으로 키 생성하여 세션 스토리지에 저장
            const key = getOriginalImageKey(file);
            try {
              sessionStorage.setItem(
                key,
                JSON.stringify({
                  fileName: file.name,
                  fileType: file.type,
                  originalSize: file.size, // 원본 파일 크기 저장
                  dataUrl: base64Data,
                })
              );
              console.log("💾 원본 이미지 세션 스토리지 저장 완료:", key);
            } catch (e) {
              console.error("❌ 세션 스토리지 저장 실패:", e);
            }

            // 기존 처리...
            setOriginalImageState({
              dataUrl: base64Data,
              file: new File([file], file.name, { type: file.type }),
            });
            onImageSelect(base64Data, file);
          }
        };

        reader.readAsDataURL(file);
      },
      [getOriginalImageKey, onImageSelect, setOriginalImageState]
    );

    const {
      isDragging,
      handleDragOver,
      handleDragLeave,
      handleDrop,
      handleFileSelect,
    } = useDragAndDrop({
      onFileSelect: handleImageUpload,
    });

    // 줌 인/아웃 함수 - 최적화된 버전
    const handleZoomIn = useCallback(() => {
      if (!cropperRef.current?.cropper) return;

      try {
        cropperRef.current.cropper.zoom(0.1);

        // 줌인 후 크롭 영역 내 이미지 유지
        setTimeout(() => {
          if (cropperRef.current?.cropper) {
            const cropper = cropperRef.current.cropper;
            // 이미지 경계 유지
            const cropBoxData = cropper.getCropBoxData();
            const canvasData = cropper.getCanvasData();

            // 이미지 중앙에 위치하도록 조정
            if (
              canvasData.width > cropBoxData.width &&
              canvasData.height > cropBoxData.height
            ) {
              cropper.setCanvasData({
                left:
                  cropBoxData.left + (cropBoxData.width - canvasData.width) / 2,
                top:
                  cropBoxData.top +
                  (cropBoxData.height - canvasData.height) / 2,
              });
            }
          }
        }, 50);
      } catch (err) {
        console.error("Zoom in 실패:", err);
      }
    }, []);

    const handleZoomOut = useCallback(() => {
      if (!cropperRef.current?.cropper) return;

      try {
        // 확실하게 음수값 전달하여 축소
        cropperRef.current.cropper.zoom(-0.1);

        // 축소 후 이미지 크기와 위치 확인
        setTimeout(() => {
          if (cropperRef.current?.cropper) {
            const cropper = cropperRef.current.cropper;
            const cropBoxData = cropper.getCropBoxData();
            const canvasData = cropper.getCanvasData();

            // 이미지가 너무 작아졌는지 확인
            if (
              canvasData.width < cropBoxData.width ||
              canvasData.height < cropBoxData.height
            ) {
              // 최소 크기로 조정
              const imageData = cropper.getImageData();
              const minZoomX = cropBoxData.width / imageData.naturalWidth;
              const minZoomY = cropBoxData.height / imageData.naturalHeight;
              const minZoom = Math.max(minZoomX, minZoomY) * 1.01;

              // 최소 줌 적용
              cropper.zoomTo(minZoom);
            }

            // 이미지 중앙에 위치하도록 조정
            if (
              canvasData.width > cropBoxData.width &&
              canvasData.height > cropBoxData.height
            ) {
              cropper.setCanvasData({
                left:
                  cropBoxData.left + (cropBoxData.width - canvasData.width) / 2,
                top:
                  cropBoxData.top +
                  (cropBoxData.height - canvasData.height) / 2,
              });
            }
          }
        }, 50);
      } catch (err) {
        console.error("Zoom out 실패:", err);
      }
    }, []);

    // 이미지 크로퍼 초기화 핸들러 - 중앙 정렬 개선
    const handleCropperReady = useCallback(() => {
      if (!cropperRef.current?.cropper) {
        return;
      }

      setTimeout(() => {
        try {
          const cropper = cropperRef.current?.cropper;
          if (!cropper) return;

          cropper.reset();

          const containerData = cropper.getContainerData();
          let imageData;

          try {
            imageData = cropper.getImageData();
          } catch (err) {
            console.error("이미지 데이터를 가져올 수 없습니다:", err);
            return;
          }

          const maxCropBoxWidth = 450;
          const minCropBoxWidth = 280;

          let cropBoxWidth = Math.min(
            maxCropBoxWidth,
            Math.max(minCropBoxWidth, Math.floor(containerData.width * 0.8))
          );

          const cropBoxHeight = Math.floor(cropBoxWidth / TARGET_ASPECT_RATIO);

          const left = Math.max(0, (containerData.width - cropBoxWidth) / 2);
          const top = Math.max(0, (containerData.height - cropBoxHeight) / 2);

          cropper.setCropBoxData({
            left: left,
            top: top,
            width: cropBoxWidth,
            height: cropBoxHeight,
          });

          // 초기화 시에만 중앙 정렬 수행
          const centerImageAndSave = () => {
            try {
              if (!cropperRef.current?.cropper) return;

              const cropBoxData = cropperRef.current.cropper.getCropBoxData();
              const canvasData = cropperRef.current.cropper.getCanvasData();

              // 초기 위치만 중앙으로 설정
              cropperRef.current.cropper.setCanvasData({
                left:
                  cropBoxData.left + (cropBoxData.width - canvasData.width) / 2,
                top:
                  cropBoxData.top +
                  (cropBoxData.height - canvasData.height) / 2,
              });

              // 초기 상태 저장
              cropperRef.current.initialCropBoxData = { ...cropBoxData };
              cropperRef.current.initialCanvasData =
                cropperRef.current.cropper.getCanvasData();
              cropperRef.current.initialScale =
                cropperRef.current.cropper.getData().scaleX || 1;
            } catch (err) {
              console.error("캔버스 위치 조정 중 오류:", err);
            }
          };

          try {
            const scaleX = cropBoxWidth / imageData.naturalWidth;
            const scaleY = cropBoxHeight / imageData.naturalHeight;

            const scale = Math.max(scaleX, scaleY) * 1.01;

            if (isFinite(scale) && scale > 0) {
              cropper.zoomTo(scale);
              // 초기화 시에만 한 번 중앙 정렬
              setTimeout(centerImageAndSave, 100);
            } else {
              cropper.zoomTo(1);
              // 초기화 시에만 한 번 중앙 정렬
              setTimeout(centerImageAndSave, 100);
            }
          } catch (err) {
            console.error("줌 적용 중 오류:", err);
            cropper.zoomTo(1);
            // 초기화 시에만 한 번 중앙 정렬
            setTimeout(centerImageAndSave, 100);
          }
        } catch (err) {
          console.error("크로퍼 초기화 중 오류:", err);
        }
      }, 200);
    }, []);

    // 이미지 초기화 함수 - 완전 원본 이미지 복원 기능 강화
    const handleReset = useCallback(() => {
      if (!cropperRef.current?.cropper) return;

      try {
        // 원본 이미지 상태가 있는 경우, 완전히 원본 상태로 복원
        if (originalImageState?.dataUrl && originalImageState?.file) {
          console.log("원본 이미지로 완전 복원 시작");

          // 원본 파일로 다시 이미지 선택 처리
          onImageSelect(originalImageState.dataUrl, originalImageState.file);

          // 사용자 피드백을 위한 UI 표시
          if (cropperRef.current?.cropper) {
            try {
              cropperRef.current.cropper.clear();
            } catch (err) {
              console.error("크로퍼 클리어 오류:", err);
            }
          }

          // 크로퍼 인스턴스를 완전히 다시 초기화하여 원본 이미지 로드
          setTimeout(() => {
            if (!cropperRef.current) return;

            try {
              if (cropperRef.current.cropper) {
                cropperRef.current.cropper.destroy();
              }

              // 약간의 지연 후 초기화 핸들러 실행 (이미지 로드 후)
              setTimeout(() => {
                if (cropperRef.current?.cropper) {
                  cropperRef.current.cropper.replace(
                    originalImageState.dataUrl
                  );

                  // 추가 지연으로 안정적인 초기화 보장
                  setTimeout(handleCropperReady, 200);
                }
              }, 100);
            } catch (err) {
              console.error("크로퍼 재설정 오류:", err);

              // 오류 발생 시 강제로 원본 이미지 복원
              if (onCropperChange) {
                onCropperChange(false); // 크로퍼 닫기

                // 약간의 지연 후 원본 이미지 표시
                setTimeout(() => {
                  onImageSelect(
                    originalImageState.dataUrl,
                    originalImageState.file
                  );
                }, 100);
              }
            }
          }, 50);

          return;
        }

        // 원본 이미지 상태가 없다면 세션 스토리지에서 시도
        if (imageFile) {
          const storedData = loadFromSessionStorage(imageFile);
          if (storedData && storedData.dataUrl) {
            console.log("세션 스토리지에서 원본 이미지 복원");

            // 원본 파일 재생성
            fetch(storedData.dataUrl)
              .then((res) => res.blob())
              .then((blob) => {
                const originalFile = new File(
                  [blob],
                  storedData.fileName || "original.jpg",
                  {
                    type: storedData.fileType || "image/jpeg",
                    lastModified: storedData.lastModified || Date.now(),
                  }
                );

                // 원본 이미지 상태 업데이트
                setOriginalImageState({
                  dataUrl: storedData.dataUrl,
                  file: originalFile,
                });

                // 이미지 선택 처리
                onImageSelect(storedData.dataUrl, originalFile);

                // 크로퍼 종료 (새로 시작하기 위해)
                if (onCropperChange) {
                  onCropperChange(false);

                  // 약간의 지연 후 크로퍼 다시 열기 옵션
                  // setTimeout(() => onCropperChange(true), 300);
                }
              })
              .catch((err) => {
                console.error("원본 이미지 복원 실패:", err);
                fallbackReset(); // 실패 시 기본 리셋 사용
              });

            return;
          }
        }

        // 모든 방법이 실패하면 기본 리셋 사용
        fallbackReset();
      } catch (err) {
        console.error("Reset 실패:", err);
        fallbackReset(); // 오류 발생 시 기본 리셋 사용
      }
    }, [
      onImageSelect,
      originalImageState,
      handleCropperReady,
      imageFile,
      loadFromSessionStorage,
      onCropperChange,
    ]);

    // 기본 리셋 함수 (기존 리셋 로직을 별도 함수로 분리)
    const fallbackReset = useCallback(() => {
      if (!cropperRef.current?.cropper) return;

      try {
        const cropper = cropperRef.current.cropper;

        // 초기 상태가 있는 경우 복원
        if (
          cropperRef.current.initialCropBoxData &&
          cropperRef.current.initialCanvasData &&
          cropperRef.current.initialScale
        ) {
          cropper.reset();
          cropper.setCropBoxData(cropperRef.current.initialCropBoxData);
          cropper.zoomTo(cropperRef.current.initialScale);

          // requestAnimationFrame으로 캔버스 위치 복원 (더 부드러운 동작)
          requestAnimationFrame(() => {
            if (
              cropperRef.current?.cropper &&
              cropperRef.current.initialCanvasData
            ) {
              cropperRef.current.cropper.setCanvasData(
                cropperRef.current.initialCanvasData
              );
            }
          });
        } else {
          // 기본 리셋
          cropper.reset();

          // 컨테이너 중앙에 이미지 배치
          const containerData = cropper.getContainerData();
          cropper.moveTo(containerData.width / 2, containerData.height / 2);
        }
      } catch (err) {
        console.error("기본 리셋 실패:", err);
      }
    }, []);

    // 줌 이벤트 핸들러 - 디바운스 적용 (최적화)
    const handleZoom = useCallback(
      (e: any) => {
        if (!cropperRef.current?.cropper) return;

        const cropper = cropperRef.current.cropper;

        // 줌 제한만 처리하고 위치 조정은 하지 않음
        if (e.detail.ratio > MAX_ZOOM) {
          e.preventDefault();
          cropper.zoomTo(MAX_ZOOM);
          return;
        } else if (e.detail.ratio < MIN_ZOOM) {
          e.preventDefault();
          cropper.zoomTo(MIN_ZOOM);
          return;
        }

        // 중요: 위치 자동 조정 코드 제거
        // 사용자가 직접 위치시킨대로 두기
      },
      [MAX_ZOOM, MIN_ZOOM]
    );

    // 크롭 종료 핸들러
    const handleCropEnd = useCallback(() => {
      if (!cropperRef.current?.cropper) return;

      // 크롭 종료 후 자동 위치 조정 코드 제거
      // 사용자가 직접 위치시킨대로 유지

      // 크롭 완료 콜백 호출만 유지
      if (onCropComplete) {
        try {
          const cropper = cropperRef.current.cropper;
          const cropBoxData = cropper.getCropBoxData();
          const imageData = cropper.getImageData();

          // 크롭된 영역 정보 계산
          const pixelRatio = imageData.naturalWidth / imageData.width;

          // 화면 상의 영역 (표시용)
          const displayArea: Area = {
            x: cropBoxData.left,
            y: cropBoxData.top,
            width: cropBoxData.width,
            height: cropBoxData.height,
          };

          // 실제 픽셀 단위 영역 (처리용)
          const pixelArea: Area = {
            x: Math.round(cropBoxData.left * pixelRatio),
            y: Math.round(cropBoxData.top * pixelRatio),
            width: Math.round(cropBoxData.width * pixelRatio),
            height: Math.round(cropBoxData.height * pixelRatio),
          };

          // 캔버스 준비
          const canvas = cropper.getCroppedCanvas({
            width: Math.round(pixelArea.width),
            height: Math.round(pixelArea.height),
            imageSmoothingEnabled: true,
            imageSmoothingQuality: "high",
            minWidth: 280,
            minHeight: 350,
            maxWidth: 1500,
            maxHeight: 1500,
          });

          if (canvas) {
            // 두 개의 인자 전달 (displayArea, pixelArea)
            onCropComplete(displayArea, pixelArea);
          }
        } catch (err) {
          console.error("크롭 정보 계산 중 오류:", err);
        }
      }

      // 크롭 상태 업데이트
      if (isCroppingRef) {
        isCroppingRef.current = false;
      }
    }, [onCropComplete, isCroppingRef]);

    // 크롭 적용 함수 - 최적화된 버전
    const applyCrop = useCallback((): Promise<void> => {
      return new Promise<void>((resolve, reject) => {
        if (!cropperRef.current?.cropper) {
          reject(new Error("Cropper 인스턴스가 없습니다"));
          return;
        }

        try {
          const cropper = cropperRef.current.cropper;
          const cropBoxData = cropper.getCropBoxData();
          const imageData = cropper.getImageData();

          // 최적의 캔버스 크기 계산 (단순화)
          const cropRatio = imageData.naturalWidth / imageData.width;
          let targetWidth = cropBoxData.width * cropRatio;
          let targetHeight = cropBoxData.height * cropRatio;

          // 최대 크기 제한 (비율 유지)
          if (targetWidth > MAX_IMAGE_SIZE || targetHeight > MAX_IMAGE_SIZE) {
            const scale = MAX_IMAGE_SIZE / Math.max(targetWidth, targetHeight);
            targetWidth *= scale;
            targetHeight *= scale;
          }

          // 최소 크기 보장
          targetWidth = Math.max(targetWidth, MIN_IMAGE_WIDTH);
          targetHeight = Math.max(targetHeight, MIN_IMAGE_HEIGHT);

          // 크롭된 캔버스 가져오기 (최적화된 설정)
          const canvas = cropper.getCroppedCanvas({
            width: Math.round(targetWidth),
            height: Math.round(targetHeight),
            imageSmoothingEnabled: true,
            imageSmoothingQuality: "high",
            minWidth: 256,
            minHeight: 320,
            maxWidth: MAX_IMAGE_SIZE,
            maxHeight: MAX_IMAGE_SIZE,
          });

          if (!canvas) {
            reject(new Error("크롭된 캔버스를 가져올 수 없습니다"));
            return;
          }

          // 프로그레시브 품질 설정으로 크기 최적화
          const quality = Math.min(
            0.92,
            800000 / (targetWidth * targetHeight * 0.3)
          );
          const croppedImage = canvas.toDataURL("image/jpeg", quality);

          // File 객체로 변환
          fetch(croppedImage)
            .then((res) => res.blob())
            .then((blob) => {
              // 원본 파일명 유지하면서 확장자는 jpg로
              const fileName = imageFile?.name
                ? imageFile.name.replace(/\.[^/.]+$/, "") + ".jpg"
                : "cropped.jpg";

              const file = new File([blob], fileName, { type: "image/jpeg" });

              // 이미지 업데이트
              onImageSelect(croppedImage, file);

              // 부모에게 크롭퍼 종료 알림
              if (onCropperChange) {
                onCropperChange(false);
              }

              resolve();
            })
            .catch((err: Error) => {
              console.error("파일 변환 중 오류:", err);
              reject(err);
            });
        } catch (err) {
          console.error("크롭 처리 중 오류:", err);
          reject(err instanceof Error ? err : new Error(String(err)));
        }
      });
    }, [onImageSelect, imageFile, onCropperChange]);

    // 외부에서 접근할 수 있는 함수 노출
    useImperativeHandle(ref, () => ({
      applyCrop,
    }));

    // showCropper 상태가 변경될 때 크롭퍼 초기화
    useEffect(() => {
      if (showCropper && cropperRef.current?.cropper) {
        console.log("크롭퍼 표시 상태 변경됨: 초기화 시작");

        // 다음 렌더 사이클에서 초기화 수행 (모달 애니메이션 이후)
        const timer = setTimeout(() => {
          try {
            // 초기화 로직 실행 (차이: 더 긴 지연 시간)
            handleCropperReady();
          } catch (err) {
            console.error("크롭퍼 초기화 중 오류:", err);
          }
        }, 300); // 모달 애니메이션 완료 후에 실행되도록 충분한 지연

        return () => clearTimeout(timer);
      }
    }, [showCropper, handleCropperReady]);

    // 이미지 업로드 UI
    const renderUploadUI = useCallback(
      () => (
        <div
          className={cn(
            "relative w-full h-full transition-all duration-300",
            "flex flex-col items-center justify-center",
            "bg-[#1A1A1A]"
          )}
        >
          <label
            className={cn(
              "relative w-full h-full flex items-center justify-center cursor-pointer transition-all",
              isDragging ? "bg-[#EAFD66]/5" : "hover:bg-black/20"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              className="hidden"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFileSelect}
            />
            {selectedImage ? (
              <div
                className="relative overflow-hidden"
                style={{
                  position: "relative",
                  width: "100%",
                  height: "100%",
                  margin: "auto",
                  aspectRatio: "4/5",
                }}
              >
                <img
                  src={selectedImage}
                  alt="Selected image"
                  className="object-contain max-h-full max-w-full"
                  style={{
                    objectFit: "contain",
                    width: "100%",
                    height: "100%",
                  }}
                  onError={(e) => {
                    console.error("Image load error");
                    e.currentTarget.src = "/images/fallback.jpg"; // fallback 이미지 경로로 설정
                  }}
                />
              </div>
            ) : (
              <UploadGuide
                onFileSelect={() => {
                  // 파일 선택 다이얼로그 열기
                  const fileInput = document.createElement("input");
                  fileInput.type = "file";
                  fileInput.accept =
                    "image/jpeg,image/jpg,image/png,image/webp";
                  fileInput.click();

                  fileInput.onchange = (e: Event) => {
                    const target = e.target as HTMLInputElement;
                    const file = target.files?.[0];
                    if (file) {
                      handleImageUpload(file);
                    }
                  };
                }}
                themeColor={themeColor}
              />
            )}
          </label>
        </div>
      ),
      [
        isDragging,
        handleDragOver,
        handleDragLeave,
        handleDrop,
        handleFileSelect,
        selectedImage,
        handleImageUpload,
        themeColor,
      ]
    );

    // 이미지 뷰어 컴포넌트
    const ImageViewer = useCallback(
      () => (
        <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
          <img
            src={selectedImage || ""}
            alt="Selected image"
            className="max-w-full max-h-full object-contain"
            style={{ margin: "auto" }}
            onError={(e) => {
              console.error("Image load error in viewer");
              e.currentTarget.src = "/images/fallback.jpg"; // fallback 이미지 경로로 설정
            }}
          />
          <div className="absolute top-4 right-4 z-10">
            <button
              className="px-3 py-1.5 bg-[#333]/80 text-white/80 rounded-md text-sm hover:bg-[#444]/80 transition-colors"
              onClick={() => onCropperChange?.(true)}
            >
              이미지 편집
            </button>
          </div>
        </div>
      ),
      [selectedImage, onCropperChange]
    );

    // 이 함수를 수정하여 튀는 현상 방지
    const handleCompleteReset = useCallback(() => {
      console.log("🔄 원본 이미지 복원 시도");

      if (imageFile) {
        const key = getOriginalImageKey(imageFile);
        console.log("🔍 원본 이미지 키 확인:", key);

        const storedData = sessionStorage.getItem(key);
        if (storedData) {
          try {
            const data = JSON.parse(storedData);
            console.log("✅ 원본 이미지 찾음");

            // 리셋 진행 중임을 표시 (로딩 상태)
            setIsResetting(true);

            // Blob으로 변환
            fetch(data.dataUrl)
              .then((res) => res.blob())
              .then((blob) => {
                const originalFile = new File(
                  [blob],
                  data.fileName || imageFile.name,
                  {
                    type: data.fileType || imageFile.type,
                    lastModified: Date.now(),
                  }
                );

                if (showCropper && cropperRef.current?.cropper) {
                  // 크로퍼가 열려있는 상태라면 크로퍼의 이미지만 교체
                  try {
                    console.log("✅ 크로퍼 이미지 교체");
                    // 원본 이미지 상태 업데이트
                    setOriginalImageState({
                      dataUrl: data.dataUrl,
                      file: originalFile,
                    });

                    // 크로퍼에 이미지 교체
                    cropperRef.current.cropper.replace(data.dataUrl);

                    // 이미지 업데이트 (UI 일관성을 위해)
                    onImageSelect(data.dataUrl, originalFile);

                    // 크로퍼 초기화 (200ms 지연)
                    setTimeout(() => {
                      if (cropperRef.current?.cropper) {
                        handleCropperReady();
                      }
                      setIsResetting(false); // 리셋 완료
                    }, 200);
                  } catch (err) {
                    console.error("❌ 크로퍼 이미지 교체 실패:", err);
                    // 실패 시 기존 방식으로 대체
                    fallbackReset();
                    setIsResetting(false);
                  }
                } else {
                  // 크로퍼가 닫혀있다면 그냥 이미지만 교체
                  console.log("✅ 원본 이미지 적용");
                  // 원본 이미지 상태 업데이트
                  setOriginalImageState({
                    dataUrl: data.dataUrl,
                    file: originalFile,
                  });
                  onImageSelect(data.dataUrl, originalFile);
                  setIsResetting(false); // 리셋 완료
                }
              })
              .catch((err) => {
                console.error("❌ 원본 이미지 변환 실패:", err);
                setIsResetting(false); // 리셋 완료 (실패)
              });

            return;
          } catch (err) {
            console.error("❌ 세션 스토리지 데이터 파싱 실패:", err);
            setIsResetting(false);
          }
        } else {
          console.log("❌ 세션 스토리지에 원본 이미지 없음:", key);
        }
      }

      console.log("❌ 원본 이미지를 찾을 수 없음");
      alert("원본 이미지를 찾을 수 없습니다.");
    }, [
      imageFile,
      getOriginalImageKey,
      onImageSelect,
      showCropper,
      handleCropperReady,
      setOriginalImageState,
      fallbackReset,
    ]);

    // 이미지 크로퍼 컴포넌트 수정 - 리셋 중 로딩 오버레이 추가
    const ImageCropper = useCallback(
      () => (
        <div className="w-full h-full flex flex-col">
          <div className="flex-1 relative flex items-center justify-center bg-[#1A1A1A] overflow-hidden">
            {/* 커스텀 스타일을 head에 추가하여 크로퍼 스타일 커스터마이징 */}
            <style jsx global>{`
              .cropper-view-box,
              .cropper-face {
                border-color: ${themeColor} !important;
                outline-color: ${themeColor} !important;
              }
              .cropper-line,
              .cropper-point {
                background-color: ${themeColor} !important;
              }
              .cropper-view-box {
                outline: 1px solid ${themeColor} !important;
                outline-color: ${themeColor} !important;
              }
              .cropper-modal {
                opacity: 0.6 !important;
              }
            `}</style>

            {/* 리셋 중 로딩 오버레이 */}
            {isResetting && (
              <div className="absolute inset-0 z-50 bg-black/70 flex items-center justify-center">
                <div className="text-white/80 text-center">
                  <div className="animate-spin h-8 w-8 border-4 border-white border-t-transparent rounded-full mx-auto mb-2"></div>
                  <p>원본 이미지 복원 중...</p>
                </div>
              </div>
            )}

            <ReactCropper
              src={selectedImage || ""}
              style={{
                height: "100%",
                width: "100%",
                background: "#1A1A1A",
                margin: "0 auto",
                maxHeight: "90vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              guides={true}
              viewMode={1}
              dragMode="move"
              ref={cropperRef}
              aspectRatio={TARGET_ASPECT_RATIO}
              zoomable={true}
              scalable={false}
              rotatable={false}
              autoCropArea={1}
              responsive={true}
              restore={true}
              checkOrientation={true}
              center={false}
              cropBoxMovable={false}
              cropBoxResizable={false}
              toggleDragModeOnDblclick={false}
              background={false}
              highlight={false}
              modal={true}
              minCropBoxWidth={280}
              minCropBoxHeight={350}
              initialAspectRatio={TARGET_ASPECT_RATIO}
              onInitialized={(instance) => {
                if (instance) {
                  instance.setDragMode("move");
                }
              }}
              ready={() => {
                // 한 번만 초기화
                setTimeout(handleCropperReady, 100);
              }}
              cropend={handleCropEnd}
              zoom={handleZoom}
              className="mx-auto flex items-center justify-center"
            />

            {/* 컨트롤 버튼 영역 - 리셋 버튼 제거하고 완전 원본 이미지 버튼만 남김 */}
            <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
              <button
                onClick={handleZoomIn}
                className="p-2 bg-[#333]/80 text-white/80 rounded-md hover:bg-[#444]/80 transition-colors"
                title="확대"
                disabled={isResetting}
              >
                <ZoomIn size={18} />
              </button>
              <button
                onClick={handleZoomOut}
                className="p-2 bg-[#333]/80 text-white/80 rounded-md hover:bg-[#444]/80 transition-colors"
                title="축소"
                disabled={isResetting}
              >
                <ZoomOut size={18} />
              </button>

              {/* 최초 업로드 이미지로 완전 복원 버튼 */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log("🔘 원본 복원 버튼 클릭됨");
                  handleCompleteReset();
                }}
                className="p-2 bg-[#333]/80 text-white/80 rounded-md hover:bg-[#444]/80 transition-colors"
                title="원본 이미지로 복원"
                disabled={isResetting}
              >
                <RotateCcw size={18} />
              </button>
            </div>
          </div>
        </div>
      ),
      [
        selectedImage,
        handleCropperReady,
        handleCropEnd,
        handleZoom,
        handleZoomIn,
        handleZoomOut,
        handleCompleteReset,
        themeColor,
        isResetting,
      ]
    );

    // 마커 컴포넌트 (포인트 표시)
    const MarkerComponent = useCallback(() => {
      console.log(
        "Rendering MarkerComponent with image:",
        selectedImage ? "provided" : "missing"
      );

      if (!selectedImage) {
        return (
          <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white/80">
            이미지를 불러올 수 없습니다.
          </div>
        );
      }

      return (
        <div className="relative w-full h-full max-h-full overflow-hidden flex items-center justify-center bg-[#232323]">
          <ImageMarker
            isRequest={isRequest}
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
            className="max-w-full max-h-full object-contain"
          />
        </div>
      );
    }, [
      selectedImage,
      points,
      onPointsChange,
      onPointContextChange,
      selectedPoint,
    ]);

    // 읽기 전용 마커 컴포넌트
    const ReadOnlyMarkerComponent = useCallback(() => {
      console.log(
        "Rendering ReadOnlyMarkerComponent with image:",
        selectedImage ? "provided" : "missing"
      );

      if (!selectedImage) {
        return (
          <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white/80">
            이미지를 불러올 수 없습니다.
          </div>
        );
      }

      return (
        <div className="relative w-full h-full flex items-center justify-center bg-[#232323] p-2">
          <div className="relative w-[90%] h-[90%] flex items-center justify-center bg-[#1A1A1A]">
            {/* 이미지 컨테이너 */}
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Next.js Image를 img 태그로 대체 */}
              <img
                src={selectedImage}
                alt="Image with markers"
                loading="lazy"
                width={imageDimensions.width || 800}
                height={imageDimensions.height || 1000}
                className="max-w-full max-h-full object-contain"
                onLoad={(e) => {
                  // 이미지 로드 완료 시 처리
                  if (window.performance) {
                    const performanceEntries =
                      performance.getEntriesByName(selectedImage);
                    if (performanceEntries.length > 0) {
                      console.log(
                        "이미지 로드 시간:",
                        performanceEntries[0].duration + "ms"
                      );
                    }
                  }
                }}
                onError={(e) => {
                  console.error("Image failed to load");
                  e.currentTarget.src = "/images/fallback.jpg";
                }}
              />

              {/* 위치 정보 태그 */}
              {contextAnswers?.location && (
                <div className="absolute top-3 right-3 z-10">
                  <div
                    className="px-3 py-1.5 bg-[#222]/80 backdrop-blur-sm rounded-full 
                                border border-[#EAFD66]/30 text-[#EAFD66] text-sm font-medium
                                shadow-sm flex items-center"
                  >
                    <span className="mr-0.5">#</span>
                    <span>
                      {contextAnswers.location.charAt(0).toUpperCase() +
                        contextAnswers.location.slice(1)}
                    </span>
                  </div>
                </div>
              )}

              {/* 마커 오버레이 */}
              {points.length > 0 && (
                <div className="absolute inset-0 pointer-events-none">
                  {points.map((point, index) => (
                    <div
                      key={`marker-${index}`}
                      className="absolute -translate-x-1/2 -translate-y-1/2 group"
                      style={{
                        left: `${point.x}%`,
                        top: `${point.y}%`,
                      }}
                    >
                      <div className="relative w-4 h-4">
                        <div className="absolute inset-0 border-2 border-[#EAFD66] rounded-full animate-pulse" />
                        <div className="absolute inset-[2px] bg-[#EAFD66]/30 rounded-full backdrop-blur-sm" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }, [selectedImage, points, contextAnswers]);

    // 기본 이미지 표시 컴포넌트 - 마커 없이
    const BasicImageComponent = useCallback(() => {
      console.log(
        "Rendering BasicImageComponent with image:",
        selectedImage ? "provided" : "missing"
      );

      if (!selectedImage) {
        return (
          <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white/80">
            이미지를 불러올 수 없습니다.
          </div>
        );
      }

      return (
        <div className="relative w-full h-full flex items-center justify-center bg-[#232323] p-2">
          <div
            className="debug-image-container border border-gray-700 p-1 flex items-center justify-center"
            style={{ width: "90%", height: "90%", background: "#1A1A1A" }}
          >
            <img
              src={selectedImage}
              alt="Image"
              className="max-w-full max-h-full object-contain"
              style={{ display: "block" }}
              onError={(e) => {
                console.error("Image failed to load:");
                e.currentTarget.src = "/images/fallback.jpg";
              }}
            />
          </div>
        </div>
      );
    }, [selectedImage]);

    // 디버깅 정보
    useEffect(() => {
      console.log("ImageContainer rendered with step:", step);
      console.log(
        "Image URL:",
        selectedImage?.substring(0, 100) +
          (selectedImage && selectedImage.length > 100 ? "..." : "")
      );
      console.log("Image file:", imageFile?.name, imageFile?.size);
      console.log("Points:", points.length);
    }, [step, selectedImage, imageFile, points]);

    useEffect(() => {
      console.log(
        "🔄 firstUploadRef 상태:",
        firstUploadRef.current ? "있음" : "없음"
      );
      if (firstUploadRef.current) {
        console.log("🔍 firstUploadRef 데이터:", {
          파일명: firstUploadRef.current.file.name,
          파일크기: firstUploadRef.current.file.size,
          데이터URL길이: firstUploadRef.current.dataUrl.length,
        });
      }
    }, []);

    useEffect(() => {
      console.log("🔄 컴포넌트 마운트됨");
      console.log(
        "🔍 firstUploadRef 초기 상태:",
        firstUploadRef.current ? "있음" : "없음"
      );

      // 이미지 정보 확인
      if (imageFile) {
        console.log("🔍 현재 이미지 파일:", imageFile.name, imageFile.size);

        // 세션 스토리지 확인
        const key = `INITIAL_UPLOAD_${imageFile.name}_${imageFile.size}`;
        const hasStoredImage = sessionStorage.getItem(key) !== null;
        console.log("🔍 세션 스토리지 원본 이미지 존재 여부:", hasStoredImage);
      } else {
        console.log("🔍 현재 이미지 파일 없음");
      }
    }, [imageFile]);

    return (
      <div className="relative w-full h-full">
        <div
          className={cn(
            "flex-shrink-0",
            "w-full",
            "h-full",
            "flex items-center justify-center",
            "overflow-hidden"
          )}
        >
          <div
            className={cn(
              "relative w-full h-full",
              "aspect-[4/5]",
              "overflow-hidden",
              "flex items-center justify-center",
              "h-full",
              "w-full"
            )}
          >
            {step === 1 ? (
              <>
                {selectedImage ? (
                  <div className="relative w-full h-full flex items-center justify-center bg-[#1A1A1A]">
                    {showCropper ? (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-[#1A1A1A] overflow-hidden">
                        <div className="w-full h-full relative">
                          {showCropper && (
                            <ImageCropper key={`cropper-${selectedImage}`} />
                          )}
                        </div>
                      </div>
                    ) : (
                      <ImageViewer />
                    )}
                  </div>
                ) : (
                  renderUploadUI()
                )}
              </>
            ) : step === 2 ? (
              <>{selectedImage ? <MarkerComponent /> : renderUploadUI()}</>
            ) : // 단계 3에서 ReadOnlyMarkerComponent 사용하여 마커 표시하되 수정은 불가능하게
            selectedImage ? (
              <ReadOnlyMarkerComponent />
            ) : (
              renderUploadUI()
            )}
          </div>
        </div>
      </div>
    );
  }
);

ImageContainer.displayName = "ImageContainer";
