"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Point } from "@/types/model.d";
import { ImageContainer, ImageContainerHandle } from "./common/image-container";
import { cn } from "@/lib/utils/style";
import {
  ContextStepSidebar,
  // ContextAnswer 가져오지 않음
} from "./steps/context-step/context-step-sidebar";
import type { ContextAnswer as BaseContextAnswer } from "./steps/context-step/context-step-sidebar";
import { useRequestData } from "@/lib/hooks/features/images/useRequestData";
import { useRouter } from "next/navigation";
import { useLocaleContext } from "@/lib/contexts/locale-context";
import {
  StatusModal,
  StatusType,
  StatusMessageKey,
} from "@/components/ui/modal/status-modal";
import { useProtectedAction } from "@/lib/hooks/auth/use-protected-action";
import { useStatusMessage } from "@/components/ui/modal/status-modal/utils/use-status-message";
import { ArrowLeft, X, Trash2, Link } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ConfirmModal } from "./common/confirm-modal";
import { RequestImage } from "@/lib/api/_types/request";
import { motion } from "framer-motion";
import { 
  StyleContextSidebar, 
  ContextAnswer as StyleContextAnswer 
} from "./style-context-sidebar";
import { ModalHeader } from "./components/header/modal-header";
import { ProgressBar } from "./components/progress/progress-bar";
import { ImageContainerWrapper } from "./components/image-section/image-container-wrapper";
// CSS는 globals.css에서 import

// 간단한 모바일 환경 감지 훅
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // 초기 너비 체크
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // 초기 실행
    checkMobile();

    // 리사이즈 이벤트 리스너
    window.addEventListener("resize", checkMobile);

    // 클린업
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
}

interface RequestFormModalProps {
  isOpen: boolean;
  modalType: "request" | "style";
  onClose: () => void;
}

// 확장된 ContextAnswer 인터페이스 정의
interface ContextAnswer extends BaseContextAnswer {
  inspirationLinks?: Array<{
    id: string;
    category: string;
    url: string;
  }>;
}

// StylePoint 타입 수정
interface StylePoint extends Point {
  brand?: string;
  price?: string;
  isSecret?: boolean;
  context?: string;
}

export function RequestFormModal({
  isOpen,
  onClose,
  modalType = "request",
}: RequestFormModalProps) {
  const { t } = useLocaleContext();
  const isMobile = useIsMobile(); // 모바일 환경 감지
  const router = useRouter();
  const { createRequest } = useRequestData("");
  const { withAuth } = useProtectedAction();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  const [isStepComplete, setIsStepComplete] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [points, setPoints] = useState<StylePoint[]>([]);
  const [selectedPoint, setSelectedPoint] = useState<number | null>(null);
  const [contextAnswers, setContextAnswers] = useState<ContextAnswer | null>(
    null
  );
  const [showCropper, setShowCropper] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const imageContainerRef = useRef<ImageContainerHandle>(null);
  const isCroppingRef = useRef(false);
  const [isApplyingCrop, setIsApplyingCrop] = useState(false);
  const [modalConfig, setModalConfig] = useState<{
    type: StatusType;
    isOpen: boolean;
    messageKey?: StatusMessageKey;
    onClose: () => void;
  }>({
    type: "warning",
    isOpen: false,
    onClose: () => setModalConfig((prev) => ({ ...prev, isOpen: false })),
  });
  const [showMarkerGuide, setShowMarkerGuide] = useState(true);
  const { showLoadingStatus } = useStatusMessage();
  const [isApplying, setIsApplying] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [inspirationLinks, setInspirationLinks] = useState<{ id: string; url: string }[]>([]);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const bottomSheetRef = useRef<HTMLDivElement>(null);

  // 드래그 관련 상태 추가
  const [dragStartY, setDragStartY] = useState(0);
  const [currentDragY, setCurrentDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Reset state when modal is opened
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setSelectedImage(null);
      setImageFile(null);
      setPoints([]);
      setSelectedPoint(null);
      setContextAnswers(null);
      setShowCropper(false);
      setShowMarkerGuide(true);
    }
  }, [isOpen]);

  useEffect(() => {
    switch (currentStep) {
      case 1:
        setIsStepComplete(!!selectedImage);
        break;
      case 2:
        if (modalType === "style") {
          // style 모드에서는 모든 마커가 필수 정보(브랜드, 가격)를 가지고 있어야 함
          const allPointsHaveInfo = points.length > 0 && 
            points.every(point => point.brand && point.price);
          setIsStepComplete(allPointsHaveInfo);
        } else {
          // request 모드에서는 마커만 있으면 됨
          setIsStepComplete(points.length > 0);
        }
        break;
      case 3:
        if (modalType === "style") {
          // 스타일 모드에서는 링크가 없어도 완료로 처리
          setIsStepComplete(true);
        } else {
          setIsStepComplete(!!contextAnswers?.location);
        }
        break;
      default:
        setIsStepComplete(false);
    }
  }, [currentStep, selectedImage, points, contextAnswers?.location, modalType]);

  useEffect(() => {
    console.log("Selected point:", selectedPoint);
    console.log("Current step:", currentStep);
    console.log("Modal type:", modalType);
    console.log("Points:", points);
    console.log("Should show form:", currentStep === 2 && modalType === "style" && selectedPoint !== null);
  }, [selectedPoint, currentStep, modalType, points]);

  // 초기 상태 설정을 위한 useEffect 추가
  useEffect(() => {
    if (isMobile) {
      setIsBottomSheetOpen(false);
    }
  }, [isMobile]);

  // points가 변경될 때 마지막 아이템을 자동으로 선택하는 useEffect 수정
  useEffect(() => {
    if (points.length > 0) {
      // 마지막 아이템의 인덱스
      const lastIndex = points.length - 1;
      setSelectedPoint(lastIndex);
      
      // 새로운 마커가 추가된 경우 (points.length가 증가한 경우)
      if (isMobile) {
        setIsBottomSheetOpen(true);
      }
    }
  }, [points.length, isMobile]);

  // selectedPoint 상태 변경 감지를 위한 useEffect 수정
  useEffect(() => {
    if (selectedPoint !== null) {
      if (isMobile) {
        // 기존 마커 클릭 시 바텀시트 열기
        setIsBottomSheetOpen(true);
        
        // 스크롤 처리 - requestAnimationFrame 사용하여 더 부드러운 스크롤
        requestAnimationFrame(() => {
          const markerElement = document.getElementById(`marker-${selectedPoint}`);
          if (markerElement) {
            markerElement.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center',
              inline: 'nearest'
            });
          }
        });
      } else {
        // 데스크탑에서만 스크롤 동작
        requestAnimationFrame(() => {
          const markerElement = document.getElementById(`marker-${selectedPoint}`);
          if (markerElement) {
            markerElement.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center',
              inline: 'nearest'
            });
            markerElement.classList.add('bg-[#232323]/80');
            setTimeout(() => {
              markerElement.classList.remove('bg-[#232323]/80');
            }, 1000);
          }
        });
      }
    }
  }, [selectedPoint, isMobile]);

  // 이미지 최적화 함수 - 높은 해상도와 품질을 유지하도록 개선
  const compressImage = async (
    imageFile: File,
    maxWidth = 2500, // 최대 너비 증가
    maxHeight = 3125, // 4:5 비율에 맞춘 최대 높이 (2500 * 5/4 = 3125)
    quality = 1.0 // 최대 품질
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          // 원본 이미지 크기
          const originalWidth = img.width;
          const originalHeight = img.height;

          // 4:5 비율 계산을 위한 값
          const targetRatio = 4 / 5;

          // 새로운 크기 계산 - 4:5 비율 유지하면서 해상도 최대화
          let newWidth = originalWidth;
          let newHeight = originalHeight;
          
          // 원본 비율
          const originalRatio = originalWidth / originalHeight;

          // 비율 맞추기
          if (originalRatio > targetRatio) {
            // 너무 넓은 이미지는 높이에 맞추고 잘라내기
            newWidth = originalHeight * targetRatio;
            newHeight = originalHeight;
          } else if (originalRatio < targetRatio) {
            // 너무 높은 이미지는 넓이에 맞추고 잘라내기
            newWidth = originalWidth;
            newHeight = originalWidth / targetRatio;
          }

          // 최대 크기 제한 (해상도가 너무 높지 않도록)
          if (newWidth > maxWidth || newHeight > maxHeight) {
            if (newWidth > maxWidth) {
              const scale = maxWidth / newWidth;
              newWidth = maxWidth;
              newHeight = newHeight * scale;
            }
            
            if (newHeight > maxHeight) {
              const scale = maxHeight / newHeight;
              newHeight = maxHeight;
              newWidth = newWidth * scale;
            }
          }

          // 정수로 반올림
          newWidth = Math.round(newWidth);
          newHeight = Math.round(newHeight);

          // Canvas에 리사이징된 이미지 그리기
          const canvas = document.createElement("canvas");
          canvas.width = newWidth;
          canvas.height = newHeight;

          const ctx = canvas.getContext("2d");
          
          // 이미지가 4:5 비율에 맞게 중앙에 배치되도록 계산
          let sx = 0;
          let sy = 0;
          let sWidth = originalWidth;
          let sHeight = originalHeight;

          if (originalRatio > targetRatio) {
            // 원본이 더 넓은 경우 좌우 잘라내기
            sx = (originalWidth - (originalHeight * targetRatio)) / 2;
            sWidth = originalHeight * targetRatio;
          } else if (originalRatio < targetRatio) {
            // 원본이 더 높은 경우 상하 잘라내기
            sy = (originalHeight - (originalWidth / targetRatio)) / 2;
            sHeight = originalWidth / targetRatio;
          }

          // 이미지를 캔버스에 그릴 때 smoothing 품질 설정
          if (ctx) {
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, newWidth, newHeight);
          }

          try {
            // 최대 품질로 JPEG 형식으로 변환
            const compressedBase64 = canvas.toDataURL("image/jpeg", quality);

            // 포맷 검증 - 올바른 base64 문자열인지 확인
            if (
              !compressedBase64 ||
              !compressedBase64.startsWith("data:image/jpeg;base64,")
            ) {
              throw new Error("Invalid base64 format");
            }

            // 데이터 URL에서 base64 부분만 추출 ('data:image/jpeg;base64,' 제거)
            const base64String = compressedBase64.split(",")[1];

            // 결과 로깅
            console.log("Image processing completed:", {
              originalSize: originalWidth + "x" + originalHeight,
              originalRatio: originalRatio.toFixed(2),
              newSize: newWidth + "x" + newHeight,
              newRatio: (newWidth / newHeight).toFixed(2),
              targetRatio: targetRatio.toFixed(2),
              quality: quality,
              dataLength: base64String.length,
            });

            resolve(base64String);
          } catch (err) {
            console.error("Canvas processing error:", err);
            reject(err);
          }
        };

        img.onerror = (err) => {
          console.error("Image loading error:", err);
          reject(new Error("Failed to load image"));
        };

        img.src = event.target?.result as string;
      };

      reader.onerror = (err) => {
        console.error("File reading error:", err);
        reject(new Error("Failed to read file"));
      };

      reader.readAsDataURL(imageFile);
    });
  };

  const handleSubmit = withAuth(async (userId) => {
    if (!imageFile || points.length === 0 || !contextAnswers) {
      setModalConfig({
        type: "error",
        isOpen: true,
        onClose: () => setModalConfig((prev) => ({ ...prev, isOpen: false })),
      });
      return;
    }

    try {
      // 로딩 상태 표시
      setModalConfig({
        type: "loading",
        isOpen: true,
        onClose: () => {}
      });
      
      // 공통 이미지 압축 로직
      const base64Image = await compressImage(imageFile, 2500, 3125, 1.0);
      
      if (modalType === "style") {
        // 스타일 데이터 구성
        const styleData = {
          image_file: base64Image,
          name: contextAnswers.location,
          inspiration_links: inspirationLinks.map(link => ({
            id: link.id,
            category: "general",
            url: link.url
          })),
          user_id: userId,
          style_points: points.map(point => ({
            position: {
              left: typeof point.x === "number" ? String(point.x) : point.x ? String(point.x).replace("%", "") : "0",
              top: typeof point.y === "number" ? String(point.y) : point.y ? String(point.y).replace("%", "") : "0",
            },
            brand: point.brand || null,
            price: point.price || null,
            is_secret: point.isSecret || false, // 찔러보기 여부 추가
          })),
        };
        
        // 콘솔에 정보 출력
        console.log("====== STYLE 데이터 전송 ======");
        console.log("스타일 이름:", styleData.name);
        console.log("아이템 개수:", styleData.style_points.length);
        console.log("아이템 정보:", styleData.style_points);
        console.log("영감 링크 개수:", styleData.inspiration_links.length);
        console.log("영감 링크:", styleData.inspiration_links);
        console.log("============================");
        
        // API 호출을 대신하는 지연 (실제 환경에서는 API 호출로 대체)
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 성공 메시지 표시
        setModalConfig({
          type: "success",
          isOpen: true,
          onClose: () => {
            setModalConfig((prev) => ({ ...prev, isOpen: false }));
            onClose();
          },
        });
      } else {
        // request 모드: 기존 API 로직 유지
        const requestItems = points.map((point) => {
          // 포지션 값에서 % 기호 제거 - API는 숫자 문자열 형태를 예상함
          const leftPos = typeof point.x === "number" ? String(point.x) : point.x ? String(point.x).replace("%", "") : "0";
          const topPos = typeof point.y === "number" ? String(point.y) : point.y ? String(point.y).replace("%", "") : "0";

          return {
            item_class: null,
            item_sub_class: null,
            category: null,
            sub_category: null,
            product_type: null,
            context: point.context || null,
            position: {
              left: leftPos,
              top: topPos,
            },
          };
        });
        
        // 요청 데이터 구성
        const requestData = {
          image_file: base64Image,
          requestedItems: requestItems,
          request_by: userId,
          context: contextAnswers.location,
          source: contextAnswers?.source || null,
          metadata: {},
        };
        
        // 포지션 값 디버깅
        console.log(
          "Final position values:",
          requestItems.map((item) => item.position)
        );
        
        await createRequest(requestData as unknown as RequestImage, userId);
        
        // 성공 메시지 표시 및 모달 닫기
        setModalConfig({
          type: "success",
          isOpen: true,
          onClose: () => {
            setModalConfig((prev) => ({ ...prev, isOpen: false }));
            onClose();
          },
        });
      }
      
      // 일정 시간 후 모달 닫기
      setTimeout(() => {
        setModalConfig((prev) => ({ ...prev, isOpen: false }));
        onClose();
      }, 2000);
    } catch (error) {
      console.error("=== Submit Error ===");
      console.error("Error:", error);

      // 오류 메시지 표시
      setModalConfig({
        type: "error",
        isOpen: true,
        onClose: () => setModalConfig((prev) => ({ ...prev, isOpen: false })),
      });
    }
  });

  const onNext = () => {
    if (currentStep === 2) {
      setSelectedPoint(null);
    }
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const onPrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      if (currentStep === 2) {
        setContextAnswers(null);
      }
    }
  };

  const handleModalClose = () => {
    if (currentStep === 1 && !selectedImage) {
      // 첫 단계에서 이미지가 없는 경우 바로 닫기
      onClose();
    } else {
      // 작업 내용이 있는 경우 확인 모달 표시
      setShowConfirmModal(true);
    }
  };

  const handleConfirmClose = () => {
    // 확인 모달과 폼 모달 모두 닫기
    setShowConfirmModal(false);

    // 크롭퍼 관련 상태 초기화
    setShowCropper(false);
    setIsApplying(false);
    isCroppingRef.current = false;

    // 약간의 지연 후 메인 모달 닫기 (비동기 상태 업데이트 완료를 위해)
    setTimeout(() => {
      onClose();
    }, 100);
  };

  const handleImageSelect = (image: string, file: File) => {
    setSelectedImage(image);
    setImageFile(file);

    // 크롭 적용 중인 경우에는 크롭 모드로 자동 전환하지 않음
    if (isCroppingRef.current) {
      isCroppingRef.current = false;
      setShowCropper(false); // 크롭 모드 명시적으로 비활성화
      return;
    }

    // 이미지가 새로 선택되었을 때만 크롭 모드 자동 전환
    if (!selectedImage) {
      // 약간의 지연 후 크롭 모드로 전환 (이미지 로딩을 위한 시간)
      setTimeout(() => {
        setShowCropper(true);
      }, 300);
    }
  };

  const handleUpdateContext = (point: Point, context: string | null) => {
    const newPoints = [...points];
    const index = points.findIndex((p) => p.x === point.x && p.y === point.y);
    if (index !== -1) {
      newPoints[index] = { ...point, context: context || "" };
      setPoints(newPoints);
    }
  };

  const handleUpdateStylePoint = (index: number, updatedPoint: StylePoint) => {
    const newPoints = [...points];
    if (index !== -1 && index < newPoints.length) {
      newPoints[index] = { ...updatedPoint };
      setPoints(newPoints);
    }
  };

  // ImageContainer의 applyCrop 호출 시 크롭 적용 중 상태 설정
  const handleApplyCrop = useCallback(() => {
    // 중복 클릭 방지
    if (isApplying) return;

    setIsApplying(true);
    setIsApplyingCrop(true); // 크롭 적용 중 상태 설정 (모달 방지용)
    isCroppingRef.current = true; // 크롭 처리 중임을 명시적으로 설정

    // 직접 ImageContainer의 applyCrop 함수 호출
    if (imageContainerRef.current) {
      // 먼저 크롭퍼 모드를 비활성화 (한 번만 호출)
      setShowCropper(false);

      // 사용자에게 시각적 피드백 제공 - 로딩 상태 표시
      imageContainerRef.current
        .applyCrop()
        .then(() => {
          // 중복 호출 제거 - 위에서 이미 호출함
        })
        .catch((err) => {
          console.error("크롭 적용 중 오류:", err);
          // 오류 메시지 표시
          alert("이미지 크롭을 적용하는데 문제가 발생했습니다.");

          // 크롭퍼 재시작 시도
          setTimeout(() => {
            // 직접 상태 변경
            setShowCropper(false);
            setTimeout(() => setShowCropper(true), 500);
          }, 500);
        })
        .finally(() => {
          setIsApplying(false);
          setIsApplyingCrop(false); // 크롭 적용 완료 상태 설정
          // 중복 호출 제거

          // 약간의 지연 후 크롭 참조 상태 리셋 (다음 작업을 위해)
          setTimeout(() => {
            isCroppingRef.current = false;
          }, 500);
        });
    } else {
      // fallback
      console.error("ImageContainer 참조가 없습니다");
      setShowCropper(false);
      setIsApplying(false);
      setIsApplyingCrop(false);
      isCroppingRef.current = false; // 참조가 없는 경우에도 상태 리셋
      alert("이미지 처리 컴포넌트를 찾을 수 없습니다.");
    }
  }, [isApplying]);

  const handleSetShowCropper = (show: boolean) => {
    // 모든 상황에서 확인 없이 상태 변경
    setShowCropper(show);
  };

  // 크롭퍼 모드 종료 핸들러 - 이제 확인 없이 바로 종료됨
  const handleConfirmExitCropper = useCallback(() => {
    setShowCropper(false);
  }, []);

  const handleDeleteMarker = () => {
    if (selectedPoint !== null && selectedPoint >= 0 && selectedPoint < points.length) {
      const newPoints = [...points];
      newPoints.splice(selectedPoint, 1);
      setPoints(newPoints);
      setSelectedPoint(null);
    }
  };

  const handleAddInspirationLink = () => {
    if (newUrl.trim()) {
      setInspirationLinks([...inspirationLinks, { id: Date.now().toString(), url: newUrl }]);
      setNewUrl("");
    }
  };

  const handleRemoveInspirationLink = (id: string) => {
    const newInspirationLinks = inspirationLinks.filter((link) => link.id !== id);
    setInspirationLinks(newInspirationLinks);
  };

  const imageContainerProps = {
    modalType,
    step: currentStep,
    selectedImage: selectedImage,
    imageFile: imageFile,
    points: points,
    onImageSelect: handleImageSelect,
    onPointsChange: setPoints,
    onPointContextChange: modalType === "style" 
      ? undefined  // 스타일 모달에서는 context 변경 핸들러 제거
      : handleUpdateContext,
    onPointSelect: (pointIndex: number | null) => {
      setSelectedPoint(pointIndex);
    },
    contextAnswers,
    selectedPoint,
    fullscreenMode: false,
    showCropper,
    onCropperChange: handleSetShowCropper,
    themeColor: "#EAFD66",
    isCroppingRef,
    onPointRemove: (index: number) => {
      const newPoints = [...points];
      newPoints.splice(index, 1);
      setPoints(newPoints);
      setSelectedPoint(null);
    },
  };

  const markerStepProps = {
    points,
    selectedPoint,
    onSelect: (point: Point | null) =>
      setSelectedPoint(point ? points.indexOf(point) : null),
    onUpdateContext: handleUpdateContext,
  };

  // 헤더 관련 함수들
  const getHeaderTitle = () => {
    if (modalType === "request") {
      switch (currentStep) {
        case 1: return "새 게시물";
        case 2: return "아이템 추가";
        case 3: return "상세 정보";
        default: return "새 게시물";
      }
    } else {
      switch (currentStep) {
        case 1: return "스타일 추가";
        case 2: return "아이템 정보 입력";
        case 3: return "스타일 참고 링크";
        default: return "스타일 추가";
      }
    }
  };

  const getNextButtonText = () => {
    if (currentStep === totalSteps) return "공유";
    return "다음";
  };

  // 마우스 이벤트 핸들러 추가
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStartY(e.clientY);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    const deltaY = e.clientY - dragStartY;
    if (deltaY > 0) { // 아래로 드래그할 때만
      // 부드러운 드래그를 위해 deltaY에 감쇠 적용
      const dampedDeltaY = deltaY * 0.8;
      setCurrentDragY(dampedDeltaY);
    }
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    
    if (currentDragY > 100) { // 100px 이상 드래그되면 닫기
      handleBottomSheetClose();
    } else {
      setIsBottomSheetOpen(true);
    }
    
    setIsDragging(false);
    setCurrentDragY(0);
  };

  // 터치 이벤트 핸들러 수정
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setDragStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const deltaY = e.touches[0].clientY - dragStartY;
    if (deltaY > 0) { // 아래로 드래그할 때만
      // 부드러운 드래그를 위해 deltaY에 감쇠 적용
      const dampedDeltaY = deltaY * 0.8;
      setCurrentDragY(dampedDeltaY);
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    
    if (currentDragY > 100) { // 100px 이상 드래그되면 닫기
      handleBottomSheetClose();
    } else {
      setIsBottomSheetOpen(true);
    }
    
    setIsDragging(false);
    setCurrentDragY(0);
  };

  // 드래그 핸들 클릭 핸들러 수정
  const handleHandleClick = (e: React.MouseEvent) => {
    if (!isDragging) {
      handleBottomSheetClose();
    }
  };

  // 바텀시트가 닫힐 때 마커 포커스 해제
  const handleBottomSheetClose = () => {
    setIsBottomSheetOpen(false);
    setSelectedPoint(null);
  };

  // 이벤트 리스너 등록
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          if (!open && selectedPoint === null) {
            handleModalClose();
          }
        }}
      >
        <DialogContent className={cn(
          "p-0 border-0 overflow-hidden bg-[#1A1A1A]",
          "w-full h-screen max-w-full max-h-screen rounded-none",
          currentStep === 2 || currentStep === 3
            ? "sm:w-[min(1000px,95vw)] sm:h-[min(700px,90vh)]"
            : "sm:w-[min(450px,80vw)] sm:h-[min(600px,90vh)]",
          "sm:min-w-[320px] sm:min-h-[500px]",
          currentStep === 2 || currentStep === 3
            ? "lg:w-[min(1200px,90vw)] lg:h-[min(800px,80vh)]"
            : "lg:w-[min(500px,60vw)] lg:h-[min(650px,80vh)]",
          "sm:rounded-md flex flex-col"
        )}>
          <DialogTitle className="sr-only">
            {currentStep === 1 && selectedImage && showCropper
              ? "이미지 크롭"
              : getHeaderTitle()}
          </DialogTitle>

          <div className="flex flex-col h-full w-full">
            <ModalHeader
              currentStep={currentStep}
              modalType={modalType}
              isStepComplete={isStepComplete}
              onPrev={onPrev}
              onNext={onNext}
              onClose={handleModalClose}
              onSubmit={handleSubmit}
              isApplying={isApplying}
              showCropper={showCropper}
              onCropperChange={setShowCropper}
              onApplyCrop={handleApplyCrop}
            />

            <ProgressBar
              currentStep={currentStep}
              totalSteps={totalSteps}
              selectedImage={selectedImage}
            />

            <div className="flex-1 min-h-0 relative flex">
              {currentStep === 2 || currentStep === 3 ? (
                <div className="w-full h-full flex flex-col md:flex-row">
                  {/* 이미지 영역 - 모바일에서는 전체 화면 */}
                  <div className={cn(
                    "w-full h-full",
                    "flex items-center justify-center bg-[#1A1A1A] overflow-hidden relative p-0",
                    "md:w-[60%]"
                  )}>
                    <div className="relative aspect-[4/5] h-full flex items-center justify-center">
                      <ImageContainerWrapper
                        {...imageContainerProps}
                        ref={imageContainerRef}
                        isCroppingMode={false}
                      />
                    </div>
                  </div>

                  {/* 모바일용 바텀 시트 */}
                  <div className={cn(
                    "md:hidden fixed bottom-0 left-0 right-0",
                    "bg-[#1A1A1A] rounded-t-2xl",
                    "transition-all duration-300 ease-out", // ease-out으로 변경하여 더 자연스러운 움직임
                    "shadow-[0_-4px_20px_rgba(0,0,0,0.3)]",
                    "z-50",
                    isBottomSheetOpen ? "translate-y-0" : "translate-y-[calc(100%-40px)]",
                    isDragging && "transition-none"
                  )}
                  style={{
                    transform: isDragging 
                      ? `translateY(${currentDragY}px)` 
                      : isBottomSheetOpen 
                        ? 'translateY(0)' 
                        : 'translateY(calc(100% - 40px))',
                    willChange: 'transform' // 성능 최적화
                  }}>
                    {/* 드래그 핸들 */}
                    <div
                      ref={bottomSheetRef}
                      className="h-[40px] flex items-center justify-center cursor-grab active:cursor-grabbing"
                      onMouseDown={handleMouseDown}
                      onTouchStart={handleTouchStart}
                      onTouchMove={handleTouchMove}
                      onTouchEnd={handleTouchEnd}
                      onClick={handleHandleClick}
                    >
                      <div className="w-12 h-1 bg-gray-600 rounded-full" />
                    </div>

                    {/* 바텀 시트 컨텐츠 */}
                    <div className="h-[60vh] overflow-y-auto">
                      {modalType === "style" && (
                        <div className="h-full flex flex-col">
                          {currentStep === 2 && (
                            <div className="p-5 flex flex-col h-full flex-1">
                              <h3 className="text-base font-medium text-white mb-4">아이템 정보</h3>
                              {points.length === 0 ? (
                                <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                                  <div className="w-12 h-12 rounded-full bg-[#232323] flex items-center justify-center mb-4">
                                    <div className="w-6 h-6 border-2 border-[#EAFD66] rounded-full" />
                                  </div>
                                  <h4 className="text-base font-medium text-white mb-2">마커를 추가해주세요</h4>
                                  <p className="text-sm text-gray-400 max-w-[280px]">
                                    이미지에 원하는 위치를 클릭하여 마커를 추가하고, 브랜드와 가격 정보를 입력해주세요.
                                  </p>
                                </div>
                              ) : (
                                <div className="flex flex-col gap-2 overflow-y-auto pr-1">
                                  {points.map((point, index) => (
                                    <div
                                      key={index}
                                      id={`marker-${index}`}
                                      className={cn(
                                        "p-3 border rounded-lg transition-all",
                                        !point.brand || !point.price
                                          ? "bg-[#2A1A1A] border-red-500/20"
                                          : "bg-[#232323] border-gray-700/50",
                                        selectedPoint === index
                                          ? "border-[#EAFD66] bg-[#232323]/80"
                                          : "hover:border-[#EAFD66]/20"
                                      )}
                                    >
                                      {/* 아이템 헤더 */}
                                      <div className="flex items-center justify-between">
                                        <div 
                                          className="flex items-center gap-2 cursor-pointer flex-1"
                                          onClick={() => {
                                            setSelectedPoint(selectedPoint === index ? null : index);
                                          }}
                                        >
                                          <div className="w-5 h-5 flex items-center justify-center bg-[#EAFD66] text-[#1A1A1A] rounded-full text-[10px] font-bold">
                                            {index + 1}
                                          </div>
                                          <span className="text-sm text-white">아이템 {index + 1}</span>
                                        </div>

                                        {/* 오른쪽 영역 - 체크박스와 삭제 버튼 */}
                                        <div className="flex items-center gap-3">
                                          {/* 찔러보기 체크박스 */}
                                          <div 
                                            className="flex items-center gap-2"
                                            onClick={(e) => e.stopPropagation()}
                                          >
                                            <input
                                              type="checkbox"
                                              id={`secret-${index}`}
                                              checked={point.isSecret || false}
                                              onChange={(e) => {
                                                const newPoints = [...points];
                                                newPoints[index] = { ...point, isSecret: e.target.checked };
                                                setPoints(newPoints);
                                              }}
                                              className="w-4 h-4 rounded border-gray-600 bg-[#2A2A2A] text-[#EAFD66] focus:ring-[#EAFD66] focus:ring-offset-0 focus:ring-2 accent-[#EAFD66]"
                                            />
                                            <label 
                                              htmlFor={`secret-${index}`} 
                                              className="text-xs text-[#EAFD66] cursor-pointer whitespace-nowrap"
                                            >
                                              찔러보기
                                            </label>
                                          </div>
                                          {/* 삭제 버튼 */}
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              const newPoints = [...points];
                                              newPoints.splice(index, 1);
                                              setPoints(newPoints);
                                              if (selectedPoint === index) {
                                                setSelectedPoint(null);
                                              }
                                            }}
                                            className="p-1 hover:bg-white/5 rounded-full text-gray-400 hover:text-red-400 transition-colors"
                                          >
                                            <Trash2 size={14} />
                                          </button>
                                        </div>
                                      </div>

                                      {/* 아이템 상세 정보 */}
                                      {selectedPoint === index && (
                                        <div className="mt-3 space-y-2 pt-3 border-t border-gray-700/50">
                                          <div>
                                            <label className="text-xs text-gray-400 block mb-1">
                                              브랜드
                                            </label>
                                            <input
                                              type="text"
                                              value={point.brand || ""}
                                              onChange={(e) => {
                                                const newPoints = [...points];
                                                newPoints[index] = { ...point, brand: e.target.value };
                                                setPoints(newPoints);
                                              }}
                                              placeholder="브랜드명"
                                              className="w-full px-2 py-1.5 bg-[#2A2A2A] border border-gray-700 rounded text-sm text-white focus:border-[#EAFD66] focus:outline-none"
                                              onClick={(e) => e.stopPropagation()}
                                            />
                                          </div>
                                          <div>
                                            <label className="text-xs text-gray-400 block mb-1">
                                              가격
                                            </label>
                                            <input
                                              type="text"
                                              value={point.price || ""}
                                              onChange={(e) => {
                                                const newPoints = [...points];
                                                newPoints[index] = { ...point, price: e.target.value };
                                                setPoints(newPoints);
                                              }}
                                              placeholder="가격"
                                              className="w-full px-2 py-1.5 bg-[#2A2A2A] border border-gray-700 rounded text-sm text-white focus:border-[#EAFD66] focus:outline-none"
                                              onClick={(e) => e.stopPropagation()}
                                            />
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                          {currentStep === 3 && (
                            <div className="p-5 flex flex-col h-full flex-1">
                              <div className="flex items-center gap-2 mb-3">
                                <h3 className="text-base font-medium text-white">스타일 참고 링크</h3>
                                <div className="group relative">
                                  <div className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center cursor-help">
                                    <span className="text-[10px] font-medium text-gray-400">i</span>
                                  </div>
                                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-2 bg-[#232323] border border-gray-700 rounded-lg text-xs text-gray-300 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                    이 스타일을 만들 때 참고한 이미지나 영상의 링크를 추가해주세요. 다른 사용자들이 스타일의 영감을 얻는데 도움이 됩니다.
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col space-y-3">
                                <input
                                  type="text"
                                  value={newUrl}
                                  onChange={(e) => setNewUrl(e.target.value)}
                                  placeholder="URL을 입력하세요"
                                  className="w-full px-3 py-2.5 bg-[#232323] border border-gray-700 rounded-md text-sm text-white focus:border-[#EAFD66] focus:outline-none focus:ring-1 focus:ring-[#EAFD66]"
                                />
                                <button
                                  onClick={handleAddInspirationLink}
                                  disabled={!newUrl.trim()}
                                  className={cn(
                                    "w-full py-2.5 text-sm rounded-md transition-colors font-medium",
                                    newUrl.trim()
                                      ? "bg-[#EAFD66] text-[#1A1A1A] hover:bg-[#EAFD66]/90"
                                      : "bg-gray-700 text-gray-400 cursor-not-allowed"
                                  )}
                                >
                                  링크 추가
                                </button>
                              </div>
                              {inspirationLinks.length === 0 ? (
                                <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                                  <div className="w-12 h-12 rounded-full bg-[#232323] flex items-center justify-center mb-4">
                                    <Link className="w-6 h-6 text-[#EAFD66]" />
                                  </div>
                                  <h4 className="text-base font-medium text-white mb-2">참고 링크를 추가해주세요</h4>
                                  <p className="text-sm text-gray-400 max-w-[280px]">
                                    이 스타일을 만들 때 참고한 이미지나 영상의 링크를 추가하면 다른 사용자들에게 도움이 됩니다.
                                  </p>
                                </div>
                              ) : (
                                <div className="mt-4 flex-1 overflow-y-auto">
                                  <div className="flex flex-col gap-2 pr-1">
                                    {inspirationLinks.map((link) => (
                                      <div
                                        key={link.id}
                                        className="flex items-center justify-between p-2 bg-[#232323] border border-gray-700 rounded-md hover:border-gray-600 transition-colors"
                                      >
                                        <a
                                          href={link.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="flex items-center gap-2 text-xs text-[#EAFD66] hover:text-[#EAFD66]/80 hover:underline truncate"
                                        >
                                          <Link size={14} className="flex-shrink-0" />
                                          <span className="truncate">{link.url}</span>
                                        </a>
                                        <button
                                          onClick={() => handleRemoveInspirationLink(link.id)}
                                          className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                                        >
                                          <X size={14} />
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                      {modalType === "request" && (
                        <ContextStepSidebar
                          modalType="request"
                          onAnswerChange={(answer) => setContextAnswers(answer)}
                          onSubmit={handleSubmit}
                          isMobile={isMobile}
                        />
                      )}
                    </div>
                  </div>

                  {/* 데스크탑용 사이드바 */}
                  <div className="hidden md:block w-[40%] h-full border-l border-gray-800 overflow-y-auto">
                    {modalType === "style" && (
                      <div className="h-full flex flex-col">
                        {currentStep === 2 && (
                          <div className="p-5 flex flex-col h-full flex-1">
                            <h3 className="text-base font-medium text-white mb-4">아이템 정보</h3>
                            {points.length === 0 ? (
                              <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                                <div className="w-12 h-12 rounded-full bg-[#232323] flex items-center justify-center mb-4">
                                  <div className="w-6 h-6 border-2 border-[#EAFD66] rounded-full" />
                                </div>
                                <h4 className="text-base font-medium text-white mb-2">마커를 추가해주세요</h4>
                                <p className="text-sm text-gray-400 max-w-[280px]">
                                  이미지에 원하는 위치를 클릭하여 마커를 추가하고, 브랜드와 가격 정보를 입력해주세요.
                                </p>
                              </div>
                            ) : (
                              <div className="flex flex-col gap-2 overflow-y-auto pr-1">
                                {points.map((point, index) => (
                                  <div
                                    key={index}
                                    id={`marker-${index}`}
                                    className={cn(
                                      "p-3 border rounded-lg transition-all",
                                      !point.brand || !point.price
                                        ? "bg-[#2A1A1A] border-red-500/20"
                                        : "bg-[#232323] border-gray-700/50",
                                      selectedPoint === index
                                        ? "border-[#EAFD66] bg-[#232323]/80"
                                        : "hover:border-[#EAFD66]/20"
                                    )}
                                  >
                                    {/* 아이템 헤더 */}
                                    <div className="flex items-center justify-between">
                                      {/* 왼쪽 영역 - 클릭 시 펼치기/접기 */}
                                      <div 
                                        className="flex items-center gap-2 cursor-pointer flex-1"
                                        onClick={() => {
                                          setSelectedPoint(selectedPoint === index ? null : index);
                                        }}
                                      >
                                        <div className="w-5 h-5 flex items-center justify-center bg-[#EAFD66] text-[#1A1A1A] rounded-full text-[10px] font-bold">
                                          {index + 1}
                                        </div>
                                        <span className="text-sm text-white">아이템 {index + 1}</span>
                                      </div>

                                      {/* 오른쪽 영역 - 체크박스와 삭제 버튼 */}
                                      <div className="flex items-center gap-3">
                                        {/* 찔러보기 체크박스 */}
                                        <div 
                                          className="flex items-center gap-2"
                                          onClick={(e) => e.stopPropagation()}
                                        >
                                          <input
                                            type="checkbox"
                                            id={`secret-${index}`}
                                            checked={point.isSecret || false}
                                            onChange={(e) => {
                                              const newPoints = [...points];
                                              newPoints[index] = { ...point, isSecret: e.target.checked };
                                              setPoints(newPoints);
                                            }}
                                            className="w-4 h-4 rounded border-gray-600 bg-[#2A2A2A] text-[#EAFD66] focus:ring-[#EAFD66] focus:ring-offset-0 focus:ring-2 accent-[#EAFD66]"
                                          />
                                          <label 
                                            htmlFor={`secret-${index}`} 
                                            className="text-xs text-[#EAFD66] cursor-pointer whitespace-nowrap"
                                          >
                                            찔러보기
                                          </label>
                                        </div>
                                        {/* 삭제 버튼 */}
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            const newPoints = [...points];
                                            newPoints.splice(index, 1);
                                            setPoints(newPoints);
                                            if (selectedPoint === index) {
                                              setSelectedPoint(null);
                                            }
                                          }}
                                          className="p-1 hover:bg-white/5 rounded-full text-gray-400 hover:text-red-400 transition-colors"
                                        >
                                          <Trash2 size={14} />
                                        </button>
                                      </div>
                                    </div>

                                    {/* 아이템 상세 정보 */}
                                    {selectedPoint === index && (
                                      <div className="mt-3 space-y-2 pt-3 border-t border-gray-700/50">
                                        <div>
                                          <label className="text-xs text-gray-400 block mb-1">
                                            브랜드
                                          </label>
                                          <input
                                            type="text"
                                            value={point.brand || ""}
                                            onChange={(e) => {
                                              const newPoints = [...points];
                                              newPoints[index] = { ...point, brand: e.target.value };
                                              setPoints(newPoints);
                                            }}
                                            placeholder="브랜드명"
                                            className="w-full px-2 py-1.5 bg-[#2A2A2A] border border-gray-700 rounded text-sm text-white focus:border-[#EAFD66] focus:outline-none"
                                            onClick={(e) => e.stopPropagation()}
                                          />
                                        </div>
                                        <div>
                                          <label className="text-xs text-gray-400 block mb-1">
                                            가격
                                          </label>
                                          <input
                                            type="text"
                                            value={point.price || ""}
                                            onChange={(e) => {
                                              const newPoints = [...points];
                                              newPoints[index] = { ...point, price: e.target.value };
                                              setPoints(newPoints);
                                            }}
                                            placeholder="가격"
                                            className="w-full px-2 py-1.5 bg-[#2A2A2A] border border-gray-700 rounded text-sm text-white focus:border-[#EAFD66] focus:outline-none"
                                            onClick={(e) => e.stopPropagation()}
                                          />
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                        {currentStep === 3 && (
                          <div className="p-5 flex flex-col h-full flex-1">
                            <div className="flex items-center gap-2 mb-3">
                              <h3 className="text-base font-medium text-white">스타일 참고 링크</h3>
                              <div className="group relative">
                                <div className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center cursor-help">
                                  <span className="text-[10px] font-medium text-gray-400">i</span>
                                </div>
                                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-2 bg-[#232323] border border-gray-700 rounded-lg text-xs text-gray-300 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                  이 스타일을 만들 때 참고한 이미지나 영상의 링크를 추가해주세요. 다른 사용자들이 스타일의 영감을 얻는데 도움이 됩니다.
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col space-y-3">
                              <input
                                type="text"
                                value={newUrl}
                                onChange={(e) => setNewUrl(e.target.value)}
                                placeholder="URL을 입력하세요"
                                className="w-full px-3 py-2.5 bg-[#232323] border border-gray-700 rounded-md text-sm text-white focus:border-[#EAFD66] focus:outline-none focus:ring-1 focus:ring-[#EAFD66]"
                              />
                              <button
                                onClick={handleAddInspirationLink}
                                disabled={!newUrl.trim()}
                                className={cn(
                                  "w-full py-2.5 text-sm rounded-md transition-colors font-medium",
                                  newUrl.trim()
                                    ? "bg-[#EAFD66] text-[#1A1A1A] hover:bg-[#EAFD66]/90"
                                    : "bg-gray-700 text-gray-400 cursor-not-allowed"
                                )}
                              >
                                링크 추가
                              </button>
                            </div>
                            {inspirationLinks.length === 0 ? (
                              <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                                <div className="w-12 h-12 rounded-full bg-[#232323] flex items-center justify-center mb-4">
                                  <Link className="w-6 h-6 text-[#EAFD66]" />
                                </div>
                                <h4 className="text-base font-medium text-white mb-2">참고 링크를 추가해주세요</h4>
                                <p className="text-sm text-gray-400 max-w-[280px]">
                                  이 스타일을 만들 때 참고한 이미지나 영상의 링크를 추가하면 다른 사용자들에게 도움이 됩니다.
                                </p>
                              </div>
                            ) : (
                              <div className="mt-4 flex-1 overflow-y-auto">
                                <div className="flex flex-col gap-2 pr-1">
                                  {inspirationLinks.map((link) => (
                                    <div
                                      key={link.id}
                                      className="flex items-center justify-between p-2 bg-[#232323] border border-gray-700 rounded-md hover:border-gray-600 transition-colors"
                                    >
                                      <a
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-xs text-[#EAFD66] hover:text-[#EAFD66]/80 hover:underline truncate"
                                      >
                                        <Link size={14} className="flex-shrink-0" />
                                        <span className="truncate">{link.url}</span>
                                      </a>
                                      <button
                                        onClick={() => handleRemoveInspirationLink(link.id)}
                                        className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                                      >
                                        <X size={14} />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                    {modalType === "request" && (
                      <ContextStepSidebar
                        modalType="request"
                        onAnswerChange={(answer) => setContextAnswers(answer)}
                        onSubmit={handleSubmit}
                        isMobile={isMobile}
                      />
                    )}
                  </div>
                </div>
              ) : (
                <ImageContainerWrapper
                  {...imageContainerProps}
                  ref={imageContainerRef}
                  isCroppingMode={Boolean(selectedImage && showCropper)}
                />
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <StatusModal {...modalConfig} />
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmClose}
        title={t.request.modal.confirmClose.title}
        message={t.request.modal.confirmClose.message}
        confirmText={t.request.modal.confirmClose.confirm}
        cancelText={t.request.modal.confirmClose.cancel}
      />
    </>
  );
}
