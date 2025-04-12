"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Point } from "@/types/model.d";
import { ImageContainer, ImageContainerHandle } from "./common/image-container";
import { cn } from "@/lib/utils/style";
import {
  ContextStepSidebar,
  ContextAnswer,
} from "./steps/context-step/context-step-sidebar";
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
import { ArrowLeft, X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ConfirmModal } from "./common/confirm-modal";
import { RequestImage } from "@/lib/api/_types/request";
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
  isRequest: boolean;
  onClose: () => void;
}

export function RequestFormModal({
  isOpen,
  onClose,
  isRequest,
}: RequestFormModalProps) {
  const { t } = useLocaleContext();
  const router = useRouter();
  const { createRequest } = useRequestData("");
  const { withAuth } = useProtectedAction();
  const isMobile = useIsMobile(); // 모바일 환경 감지
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  const [isStepComplete, setIsStepComplete] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [points, setPoints] = useState<Point[]>([]);
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
        setIsStepComplete(points.length > 0);
        break;
      case 3:
        setIsStepComplete(!!contextAnswers?.location);
        break;
      default:
        setIsStepComplete(false);
    }
  }, [currentStep, selectedImage, points, contextAnswers?.location]);

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
      // 이미지 압축 - 품질 1.0으로 최대 품질 유지
      const base64Image = await compressImage(imageFile, 2500, 3125, 1.0);

      // position 객체 명시적 생성 및 검증
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

      // 요청 데이터 구성 - 속성명 수정 (requestedItems -> requested_items)
      const requestData = {
        image_file: base64Image,
        requested_items: requestItems,
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

      await createRequest(requestData as RequestImage, userId);
      onClose(); // Close the modal on success
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
      if (currentStep === 3) {
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

  const imageContainerProps = {
    isRequest,
    step: currentStep,
    selectedImage: selectedImage,
    imageFile: imageFile,
    points: points,
    onImageSelect: handleImageSelect,
    onPointsChange: setPoints,
    onPointContextChange: handleUpdateContext,
    onPointSelect: setSelectedPoint,
    contextAnswers,
    selectedPoint,
    fullscreenMode: false,
    showCropper,
    onCropperChange: handleSetShowCropper,
    themeColor: "#EAFD66",
    isCroppingRef,
  };

  const markerStepProps = {
    points,
    selectedPoint,
    onSelect: (point: Point | null) =>
      setSelectedPoint(point ? points.indexOf(point) : null),
    onUpdateContext: handleUpdateContext,
  };

  // 현재 단계에 따른 헤더 타이틀 결정
  const getHeaderTitle = () => {
    switch (currentStep) {
      case 1:
        return t.request.steps.upload.title || "새 게시물";
      case 2:
        return t.request.steps.marker.title || "마커 추가";
      case 3:
        return t.request.steps.context.title || "상세 정보";
      default:
        return "새 게시물";
    }
  };

  // 현재 단계에 따른 다음 버튼 텍스트 결정
  const getNextButtonText = () => {
    if (currentStep === totalSteps) {
      return "공유";
    }
    return "다음";
  };

  return (
    <>
      {/* Main Modal Content */}
      <Dialog
        open={isOpen}
        onOpenChange={(open) => !open && handleModalClose()}
      >
        <DialogContent
          className={cn(
            "p-0 border-0 overflow-hidden bg-[#1A1A1A]",
            // 모바일에서는 전체화면으로 설정
            "w-full h-screen max-w-full max-h-screen rounded-none",
            // 태블릿 이상에서는 적절한 크기로 제한
            currentStep === 3
              ? "sm:w-[min(900px,95vw)] sm:h-[min(600px,90vh)]" // 3단계에서는 더 넓게
              : "sm:w-[min(450px,80vw)] sm:h-[min(600px,90vh)]",
            "sm:min-w-[320px] sm:min-h-[500px]",
            // 데스크탑에서도 너무 커지지 않도록 제한
            currentStep === 3
              ? "lg:w-[min(1000px,90vw)] lg:h-[min(700px,80vh)]" // 3단계에서는 더 넓게
              : "lg:w-[min(500px,60vw)] lg:h-[min(650px,80vh)]",
            "sm:rounded-md flex flex-col"
          )}
        >
          {/* 접근성을 위한 DialogTitle */}
          <DialogTitle className="sr-only">
            {currentStep === 1 && selectedImage && showCropper
              ? "이미지 크롭"
              : getHeaderTitle()}
          </DialogTitle>

          <div className="flex flex-col h-full w-full">
            <header
              className={cn(
                "flex items-center justify-between h-12 px-4 z-30 border-b border-gray-800",
                "bg-[#1A1A1A] flex-shrink-0"
              )}
            >
              {currentStep === 1 && selectedImage && showCropper ? (
                <>
                  <button
                    onClick={() => handleSetShowCropper(false)}
                    className="p-2 -ml-2 hover:bg-gray-800 rounded-full transition-colors text-white/80"
                  >
                    <ArrowLeft size={20} />
                  </button>

                  <h1 className="text-base font-medium text-white/80">편집</h1>

                  <button
                    onClick={() => {
                      // 직접 함수 호출하여 이벤트 버블링 방지
                      handleApplyCrop();
                    }}
                    className={cn(
                      "text-sm font-semibold px-3 py-1.5",
                      "text-[#1A1A1A] bg-[#EAFD66]",
                      "rounded-md shadow-md", // 그림자 추가하여 버튼 가시성 향상
                      isApplying
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-[#EAFD66]/90 transition-colors"
                    )}
                    disabled={isApplying}
                  >
                    {isApplying ? "처리 중..." : "적용"}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() =>
                      currentStep > 1 ? onPrev() : handleModalClose()
                    }
                    className="p-2 -ml-2 hover:bg-gray-800 rounded-full transition-colors text-white/80"
                  >
                    {currentStep > 1 ? (
                      <ArrowLeft size={20} />
                    ) : (
                      <X size={20} />
                    )}
                  </button>

                  <h1 className="text-base font-medium text-white/80">
                    {getHeaderTitle()}
                  </h1>

                  <button
                    onClick={currentStep === totalSteps ? handleSubmit : onNext}
                    disabled={!isStepComplete}
                    className={cn(
                      "text-sm font-semibold px-2 py-1",
                      isStepComplete
                        ? "text-[#EAFD66] hover:text-[#EAFD66]/90 transition-colors"
                        : "text-gray-500 cursor-not-allowed"
                    )}
                  >
                    {getNextButtonText()}
                  </button>
                </>
              )}
            </header>

            <div
              className={cn(
                "w-full h-0.5 bg-gray-800 overflow-hidden",
                "opacity-100 flex-shrink-0",
                "transition-all duration-300"
              )}
            >
              <div
                className="h-full bg-[#EAFD66] transition-all duration-300"
                style={{
                  width: selectedImage
                    ? `${(currentStep / totalSteps) * 100}%`
                    : "0%",
                }}
              />
            </div>

            {/* 마커 단계에서 필수 입력사항 안내 - flex-shrink-0 추가 */}
            {currentStep === 2 && showMarkerGuide && (
              <div className="px-4 py-2 bg-[#232323] border-b border-gray-800 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-300">
                      필수 입력사항
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      이미지를 클릭하여 궁금한 아이템의 위치를 표시해주세요
                    </p>
                  </div>
                  <button
                    onClick={() => setShowMarkerGuide(false)}
                    className="p-1 hover:bg-gray-800 text-gray-400 hover:text-white/80"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            )}

            <div
              className={cn(
                "flex-1",
                "min-h-0 relative",
                "flex",
                currentStep === 1 && selectedImage && showCropper
                  ? "overflow-hidden bg-[#1A1A1A] pt-0"
                  : "overflow-hidden bg-[#1A1A1A]"
              )}
            >
              {currentStep === 3 ? (
                // 3단계일 때 - 모바일 환경에 따른 레이아웃 분기
                isMobile ? (
                  // 모바일에서는 이미지 위에 ContextStepSidebar가 오버레이됨
                  <div className="relative w-full h-full">
                    {/* 이미지 영역 - 전체 화면으로 표시 */}
                    <div className="absolute inset-0 flex items-center justify-center bg-[#1A1A1A]">
                      {selectedImage && (
                        <div className="w-full h-full flex items-center justify-center p-1 pt-0">
                          <ImageContainer
                            {...imageContainerProps}
                            showCropper={false}
                            onCropperChange={() => {}}
                            onPointsChange={() => {}} // 읽기 전용
                            onPointSelect={() => {}} // 읽기 전용
                          />
                        </div>
                      )}

                      {/* 이미지 위에 그라데이션 오버레이 추가 - 슬라이드 메뉴와의 대비 강화 */}
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background:
                            "linear-gradient(to bottom, transparent 70%, rgba(0,0,0,0.4) 100%)",
                        }}
                      />
                    </div>

                    {/* 모바일용 드래그 힌트 - 처음에만 잠깐 표시됨 */}
                    {currentStep === 3 && (
                      <div className="absolute bottom-3 left-0 right-0 flex justify-center items-center pointer-events-none">
                        <div className="bg-black/50 text-white/80 text-xs px-3 py-1.5 rounded-full flex items-center gap-1 animate-pulse">
                          <span>위로 드래그하여 정보 입력</span>
                        </div>
                      </div>
                    )}

                    {/* 모바일용 슬라이드 컨텍스트 사이드바 */}
                    <ContextStepSidebar
                      onAnswerChange={(answer) => setContextAnswers(answer)}
                      onSubmit={handleSubmit}
                      isMobile={true}
                    />
                  </div>
                ) : (
                  // 데스크톱에서는 기존 그리드 레이아웃 유지
                  <div className="grid grid-cols-1 sm:grid-cols-[6fr_4fr] w-full h-full">
                    {/* 왼쪽 이미지 섹션 */}
                    <div
                      className="relative flex items-center justify-center p-3 bg-[#232323] sm:border-r sm:border-gray-800 overflow-hidden"
                      style={{
                        minHeight: "300px",
                      }}
                    >
                      <div
                        className="relative mx-auto my-auto flex items-center justify-center max-h-full"
                        style={{
                          minHeight: "250px",
                          minWidth: "200px",
                        }}
                      >
                        {/* 2단계에서 넘겨받은 마커를 그대로 표시하기 위해 ImageContainer 사용 */}
                        {selectedImage && (
                          <div className="w-full h-full flex items-center justify-center p-2">
                            <ImageContainer
                              {...imageContainerProps}
                              showCropper={false}
                              onCropperChange={() => {}}
                              onPointsChange={() => {}} // 읽기 전용으로 설정
                              onPointSelect={() => {}} // 읽기 전용으로 설정
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 오른쪽 폼 섹션 */}
                    <div className="h-full w-full bg-[#1A1A1A]">
                      <ContextStepSidebar
                        onAnswerChange={(answer) => setContextAnswers(answer)}
                        onSubmit={handleSubmit}
                        isMobile={false}
                      />
                    </div>
                  </div>
                )
              ) : (
                // 1-2단계에서는 이미지만 표시
                <div className="w-full h-full flex items-center justify-center overflow-hidden p-0">
                  {currentStep === 1 && selectedImage && showCropper ? (
                    // 크롭 모드 컨테이너 스타일 조정
                    <div
                      className={cn(
                        "w-full h-full",
                        "flex items-center justify-center",
                        "p-0",
                        "overflow-hidden",
                        "bg-[#1A1A1A]"
                      )}
                    >
                      <ImageContainer
                        {...imageContainerProps}
                        ref={imageContainerRef}
                      />
                    </div>
                  ) : (
                    // 일반 이미지 컨테이너 (크롭 모드 아닐 때)
                    <div
                      className={cn(
                        "relative flex items-center justify-center",
                        "h-full w-full p-0 mx-auto overflow-hidden",
                        "bg-[#1A1A1A]"
                      )}
                    >
                      <div
                        className={cn(
                          "relative aspect-[4/5] h-full max-h-[calc(100% - 10px)]",
                          "flex items-center justify-center overflow-hidden"
                        )}
                      >
                        <ImageContainer
                          {...imageContainerProps}
                          ref={imageContainerRef}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* StatusModal - Dialog 외부로 이동시켜 최상위 z-index 보장 */}
      <StatusModal
        isOpen={modalConfig.isOpen}
        onClose={modalConfig.onClose}
        type={modalConfig.type}
        messageKey={modalConfig.messageKey}
      />

      {/* Confirmation Modal for closing the entire form */}
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
