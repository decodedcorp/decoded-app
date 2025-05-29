import { ArrowLeft, X } from "lucide-react";
import { cn } from "@/lib/utils/style";

interface ModalHeaderProps {
  currentStep: number;
  modalType: "request" | "style";
  isStepComplete: boolean;
  onPrev: () => void;
  onNext: () => void;
  onClose: () => void;
  onSubmit: () => void;
  isApplying?: boolean;
  showCropper?: boolean;
  onCropperChange?: (show: boolean) => void;
  onApplyCrop?: () => void;
}

export function ModalHeader({
  currentStep,
  modalType,
  isStepComplete,
  onPrev,
  onNext,
  onClose,
  onSubmit,
  isApplying,
  showCropper,
  onCropperChange,
  onApplyCrop
}: ModalHeaderProps) {
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
    if (currentStep === 3) return "공유";
    return "다음";
  };

  if (currentStep === 1 && showCropper) {
    return (
      <header className="flex items-center justify-between h-12 px-4 z-30 border-b border-gray-800 bg-[#1A1A1A] flex-shrink-0">
        <button
          onClick={() => onCropperChange?.(false)}
          className="p-2 -ml-2 hover:bg-gray-800 rounded-full transition-colors text-white/80"
        >
          <ArrowLeft size={20} />
        </button>

        <h1 className="text-base font-medium text-white/80">편집</h1>

        <button
          onClick={onApplyCrop}
          className={cn(
            "text-sm font-semibold px-3 py-1.5",
            "text-[#1A1A1A] bg-[#EAFD66]",
            "rounded-md shadow-md",
            isApplying
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-[#EAFD66]/90 transition-colors"
          )}
          disabled={isApplying}
        >
          {isApplying ? "처리 중..." : "적용"}
        </button>
      </header>
    );
  }

  return (
    <header className="flex items-center justify-between h-12 px-4 z-30 border-b border-gray-800 bg-[#1A1A1A] flex-shrink-0">
      <button
        onClick={currentStep > 1 ? onPrev : onClose}
        className="p-2 -ml-2 hover:bg-gray-800 rounded-full transition-colors text-white/80"
      >
        {currentStep > 1 ? <ArrowLeft size={20} /> : <X size={20} />}
      </button>

      <h1 className="text-base font-medium text-white/80">
        {getHeaderTitle()}
      </h1>

      <button
        onClick={currentStep === 3 ? onSubmit : onNext}
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
    </header>
  );
} 