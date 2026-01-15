"use client";

import { ArrowLeft, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { type RequestStep } from "@/lib/stores/requestStore";
import { StepIndicator } from "./StepIndicator";

interface RequestFlowHeaderProps {
  title?: string;
  currentStep: RequestStep;
  onBack?: () => void;
  onClose?: () => void;
  showClose?: boolean;
}

export function RequestFlowHeader({
  title = "New Request",
  currentStep,
  onBack,
  onClose,
  showClose = true,
}: RequestFlowHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      router.push("/");
    }
  };

  return (
    <header className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <button
          type="button"
          onClick={handleBack}
          className="p-2 -ml-2 rounded-full hover:bg-foreground/5 transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <div className="flex flex-col items-center">
          <h1 className="text-base font-medium">{title}</h1>
          <StepIndicator currentStep={currentStep} className="mt-1" />
        </div>

        {showClose ? (
          <button
            type="button"
            onClick={handleClose}
            className="p-2 -mr-2 rounded-full hover:bg-foreground/5 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        ) : (
          <div className="w-9" /> // Spacer for alignment
        )}
      </div>
    </header>
  );
}
