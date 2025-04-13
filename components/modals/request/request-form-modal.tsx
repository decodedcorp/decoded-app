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
import { ArrowLeft, X, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ConfirmModal } from "./common/confirm-modal";
import { RequestImage } from "@/lib/api/_types/request";
import { motion } from "framer-motion";
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

// 기존 Point 인터페이스 확장 - context 제거
interface StylePoint extends Point {
  brand?: string;
  price?: string;
  // context는 제거
}

// 스타일 영감 링크 인터페이스 추가
interface InspirationLink {
  id: string;
  category: string;
  url: string;
}

// 확장된 ContextAnswer 인터페이스 정의
interface ContextAnswer extends BaseContextAnswer {
  inspirationLinks?: InspirationLink[];
}

// Style Form만을 위한 StyleContextSidebar 컴포넌트 추가
function StyleContextSidebar({
  onAnswerChange,
  onSubmit,
  isMobile = false,
}: {
  onAnswerChange: (answer: ContextAnswer) => void;
  onSubmit?: () => void;
  isMobile?: boolean;
}) {
  const { t } = useLocaleContext();
  const [styleName, setStyleName] = useState("");
  const [inspirationLinks, setInspirationLinks] = useState<InspirationLink[]>([]);
  const [newCategory, setNewCategory] = useState("영상");
  const [newUrl, setNewUrl] = useState("");
  
  // 모바일 시트 관련 상태 추가
  const [sheetHeight, setSheetHeight] = useState<number>(isMobile ? 42 : 100);
  const [isDragging, setIsDragging] = useState(false);
  const [sheetPosition, setSheetPosition] = useState<"collapsed" | "middle" | "expanded">("middle");
  
  // 카테고리 옵션
  const categoryOptions = ["영상", "글", "쇼핑몰", "음악", "영화", "기타"];

  // 스타일 이름 변경 핸들러 - 즉시 반영되도록 수정
  const handleStyleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setStyleName(newName);
    
    // 한글 입력을 위해 디바운스 없이 바로 업데이트
    onAnswerChange({
      location: newName,
      inspirationLinks
    });
  };

  const handleAddInspirationLink = () => {
    if (newUrl.trim()) {
      const newLinks = [
        ...inspirationLinks,
        {
          id: String(inspirationLinks.length), // 인덱스 기반 ID 사용
          category: newCategory,
          url: newUrl.trim(),
        },
      ];
      setInspirationLinks(newLinks);
      setNewUrl("");
      
      // 링크 추가 후 부모에게 바로 알림
      onAnswerChange({
        location: styleName,
        inspirationLinks: newLinks
      });
    }
  };

  const handleRemoveInspirationLink = (id: string) => {
    const newLinks = inspirationLinks.filter(link => link.id !== id);
    setInspirationLinks(newLinks);
    
    // 링크 삭제 후 부모에게 바로 알림
    onAnswerChange({
      location: styleName,
      inspirationLinks: newLinks
    });
  };

  // 모바일 시트 드래그 관련 핸들러 추가
  const handleDrag = (info: any) => {
    if (!isMobile) return;

    const newHeight = Math.max(
      20,
      Math.min(90, sheetHeight - info.delta.y * 0.2)
    );
    setSheetHeight(newHeight);
  };

  const handleDragStart = () => setIsDragging(true);
  const handleDragEnd = () => {
    setIsDragging(false);

    if (sheetHeight < 25) {
      setSheetHeight(20);
      setSheetPosition("collapsed");
    } else if (sheetHeight > 60) {
      setSheetHeight(80);
      setSheetPosition("expanded");
    } else {
      setSheetHeight(42);
      setSheetPosition("middle");
    }
  };

  const toggleSheetHeight = () => {
    if (sheetPosition !== "expanded") {
      setSheetHeight(80);
      setSheetPosition("expanded");
    } else {
      setSheetHeight(42);
      setSheetPosition("middle");
    }
  };

  const handleBackdropClick = () => {
    if (sheetPosition === "expanded") {
      setSheetHeight(42);
      setSheetPosition("middle");
    } else {
      setSheetHeight(20);
      setSheetPosition("collapsed");
    }
  };

  return (
    <>
      {isMobile && (
        <div
          className="fixed top-16 inset-x-0 bottom-0 bg-black/30 z-30"
          style={{
            opacity: sheetPosition === "collapsed" ? 0 : 0.3,
            transition: "opacity 0.3s ease",
          }}
          onClick={handleBackdropClick}
        />
      )}

      <motion.div
        className={cn(
          "w-full h-full flex flex-col bg-[#1A1A1A]",
          isMobile &&
            "fixed bottom-0 left-0 right-0 rounded-t-2xl shadow-lg z-40"
        )}
        style={
          isMobile
            ? {
                height: `${sheetHeight}vh`,
                transition: isDragging
                  ? "none"
                  : "height 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
              }
            : undefined
        }
        initial={isMobile ? { y: "100%" } : undefined}
        animate={isMobile ? { y: 0 } : undefined}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
      >
        {isMobile && (
          <motion.div
            className="h-10 w-full flex flex-col items-center justify-center cursor-grab active:cursor-grabbing py-3 bg-[#1A1A1A]"
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.1}
            onDrag={handleDrag}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onTap={toggleSheetHeight}
          >
            <div className="w-14 h-1 bg-zinc-600 rounded-full mb-1"></div>
            {sheetPosition !== "expanded" && (
              <span className="text-xs text-zinc-500 mt-1">펼쳐서 보기</span>
            )}
          </motion.div>
        )}
        <div className="p-5 space-y-6">
          <div className="space-y-3">
            <label className="block text-sm font-medium text-white">
              스타일 이름
            </label>
            <input
              type="text"
              value={styleName}
              onChange={handleStyleNameChange}
              placeholder="스타일의 이름을 입력하세요"
              className="w-full px-3 py-2.5 bg-[#232323] border border-gray-700 rounded-md text-sm text-white focus:border-[#EAFD66] focus:outline-none focus:ring-1 focus:ring-[#EAFD66]"
            />
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                영감 링크 추가
              </label>
              
              {/* 링크 입력 폼 */}
              <div className="flex flex-col space-y-3">
                <div className="grid grid-cols-4 gap-2">
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="col-span-1 px-3 py-2.5 bg-[#232323] border border-gray-700 rounded-md text-sm text-white focus:border-[#EAFD66] focus:outline-none focus:ring-1 focus:ring-[#EAFD66]"
                  >
                    {categoryOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    placeholder="URL을 입력하세요"
                    className="col-span-3 px-3 py-2.5 bg-[#232323] border border-gray-700 rounded-md text-sm text-white focus:border-[#EAFD66] focus:outline-none focus:ring-1 focus:ring-[#EAFD66]"
                  />
                </div>
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
            </div>
            
            {/* 추가된 링크 목록 */}
            {inspirationLinks.length > 0 && (
              <div className="mt-5">
                <h3 className="text-sm font-medium text-white mb-3">추가된 영감 링크</h3>
                <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                  {inspirationLinks.map(link => (
                    <div 
                      key={link.id} 
                      className="flex items-center justify-between p-3 bg-[#232323] border border-gray-700 rounded-md hover:border-gray-600 transition-colors"
                    >
                      <div className="flex items-center space-x-2 max-w-[85%]">
                        <span className="text-xs px-2 py-1 bg-[#2A2A2A] rounded text-[#EAFD66] whitespace-nowrap">
                          {link.category}
                        </span>
                        <a 
                          href={link.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-400 hover:text-blue-300 hover:underline truncate"
                        >
                          {link.url}
                        </a>
                      </div>
                      <button
                        onClick={(e) => {
                          // 이벤트 전파 방지
                          e.stopPropagation();
                          handleRemoveInspirationLink(link.id);
                        }}
                        className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
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

  useEffect(() => {
    console.log("Selected point:", selectedPoint);
    console.log("Current step:", currentStep);
    console.log("Modal type:", modalType);
    console.log("Points:", points);
    console.log("Should show form:", currentStep === 2 && modalType === "style" && selectedPoint !== null);
  }, [selectedPoint, currentStep, modalType, points]);

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
          inspiration_links: contextAnswers.inspirationLinks || [],
          user_id: userId,
          style_points: points.map(point => ({
            position: {
              left: typeof point.x === "number" ? String(point.x) : point.x ? String(point.x).replace("%", "") : "0",
              top: typeof point.y === "number" ? String(point.y) : point.y ? String(point.y).replace("%", "") : "0",
            },
            brand: point.brand || null,
            price: point.price || null,
          })),
        };
        
        // 콘솔에 정보 출력
        console.log("====== STYLE 데이터 전송 ======");
        console.log("스타일 이름:", styleData.name);
        console.log("마커 개수:", styleData.style_points.length);
        console.log("마커 정보:", styleData.style_points);
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
      console.log("Point selected:", pointIndex);
      
      // request 모달에서는 마커를 클릭하면 바로 삭제 (기존 방식과 일치)
      if (modalType === "request" && pointIndex !== null && currentStep === 2) {
        const newPoints = [...points];
        newPoints.splice(pointIndex, 1);
        setPoints(newPoints);
        setSelectedPoint(null);
      } else {
        // style 모달에서는 선택된 마커 정보를 설정
        setSelectedPoint(pointIndex);
      }
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

  // 현재 단계에 따른 헤더 타이틀 결정
  const getHeaderTitle = () => {
    if (modalType === "request") {
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
    } else if (modalType === "style") {
      switch (currentStep) {
        case 1:
          return "스타일 추가";
        case 2:
          return "마커 추가";
        case 3:
          return "스타일 영감 추가";
        default:
          return "스타일 추가";
      }
    }
  };

  // 현재 단계에 따른 다음 버튼 텍스트 결정
  const getNextButtonText = () => {
    if (currentStep === totalSteps) {
      return "공유";
    }
    return "다음";
  };

  // 여기서 StylePointForm 컴포넌트를 분리
  function StylePointForm() {
    const pointData = selectedPoint !== null ? points[selectedPoint] as StylePoint : null;
    const [localBrand, setLocalBrand] = useState("");
    const [localPrice, setLocalPrice] = useState("");
    
    // 선택된 점이 변경될 때마다 로컬 상태를 업데이트
    useEffect(() => {
      if (pointData) {
        setLocalBrand(pointData.brand || "");
        setLocalPrice(pointData.price || "");
      }
    }, [pointData]);
    
    const handleSave = () => {
      if (selectedPoint !== null) {
        const newPoints = [...points];
        newPoints[selectedPoint] = {
          ...newPoints[selectedPoint],
          brand: localBrand,
          price: localPrice
        } as StylePoint;
        setPoints(newPoints);
        setSelectedPoint(null);
      }
    };
    
    if (!pointData) return null;
    
    return (
      <Dialog 
        open={selectedPoint !== null && currentStep === 2 && modalType === "style"} 
        onOpenChange={(open) => {
          // open이 false일 때만 처리하고, 아이템 정보 모달만 닫음
          if (!open) {
            setSelectedPoint(null);
          }
        }}
      >
        <DialogContent 
          className="bg-[#1A1A1A] border border-gray-700 p-5 rounded-lg max-w-xs w-full shadow-xl"
          onInteractOutside={(e) => {
            e.preventDefault();
            // 이벤트 전파 중단하여 부모 모달에 영향 없게 함
            e.stopPropagation();
          }}
          onEscapeKeyDown={(e) => {
            e.preventDefault();
            // 이벤트 전파 중단하여 부모 모달에 영향 없게 함
            e.stopPropagation();
          }}
          style={{ zIndex: 300000 }}
        >
          <div className="flex justify-between items-center mb-4">
            <DialogTitle className="text-base font-medium text-white">아이템 정보</DialogTitle>
            <button 
              onClick={(e) => {
                // 이벤트 전파 방지
                e.stopPropagation();
                setSelectedPoint(null);
              }}
              className="p-1.5 rounded-full hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </div>
          
          <div className="space-y-5">
            <div>
              <label className="text-sm text-gray-300 block mb-1.5">브랜드</label>
              <input
                type="text"
                value={localBrand}
                onChange={(e) => setLocalBrand(e.target.value)}
                placeholder="브랜드명"
                className="w-full px-3 py-2.5 bg-[#232323] border border-gray-700 rounded-md text-sm text-white focus:border-[#EAFD66] focus:outline-none focus:ring-1 focus:ring-[#EAFD66]"
              />
            </div>
            
            <div>
              <label className="text-sm text-gray-300 block mb-1.5">가격</label>
              <input
                type="text"
                value={localPrice}
                onChange={(e) => setLocalPrice(e.target.value)}
                placeholder="가격"
                className="w-full px-3 py-2.5 bg-[#232323] border border-gray-700 rounded-md text-sm text-white focus:border-[#EAFD66] focus:outline-none focus:ring-1 focus:ring-[#EAFD66]"
              />
            </div>
            
            <div className="flex space-x-3 mt-5">
              <button
                onClick={handleDeleteMarker}
                className="flex items-center justify-center py-2.5 px-3 bg-red-600/20 text-red-400 hover:bg-red-600/30 border border-red-600/30 rounded-md text-sm font-medium transition-colors"
              >
                <Trash2 size={15} className="mr-1.5" />
                마커 삭제
              </button>
              
              <button
                onClick={handleSave}
                className="flex-1 py-2.5 bg-[#EAFD66] text-[#1A1A1A] rounded-md text-sm font-medium hover:bg-[#EAFD66]/90 transition-colors"
              >
                저장
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      {/* Main Modal Content */}
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          // open이 false일 때(모달 닫기 시도) && 스타일 포인트 모달이 열려있지 않을 때만 처리
          if (!open && selectedPoint === null) {
            handleModalClose();
          }
        }}
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
                      {modalType === "style" 
                        ? "이미지를 클릭하여 스타일의 특징적인 부분을 표시해주세요"
                        : "이미지를 클릭하여 궁금한 아이템의 위치를 표시해주세요"}
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
                    {modalType === "style" ? (
                      <StyleContextSidebar
                        onAnswerChange={(answer) => setContextAnswers(answer)}
                        onSubmit={handleSubmit}
                        isMobile={true}
                      />
                    ) : (
                      <ContextStepSidebar
                        modalType={modalType}
                        onAnswerChange={(answer) => setContextAnswers(answer)}
                        onSubmit={handleSubmit}
                        isMobile={true}
                      />
                    )}
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
                      {modalType === "style" ? (
                        <StyleContextSidebar
                          onAnswerChange={(answer) => setContextAnswers(answer)}
                          onSubmit={handleSubmit}
                          isMobile={isMobile}
                        />
                      ) : (
                        <ContextStepSidebar
                          modalType="request"
                          onAnswerChange={(answer) => setContextAnswers(answer)}
                          onSubmit={handleSubmit}
                          isMobile={isMobile}
                        />
                      )}
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

      {/* 스타일 아이템 정보 모달 - 스타일 모달에서만 표시 */}
      {modalType === "style" && <StylePointForm />}

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
