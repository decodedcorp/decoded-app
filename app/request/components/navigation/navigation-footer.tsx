"use client";

import { NextButton } from "./buttons";
import { PrevButton } from "./buttons";

interface NavigationFooterProps {
  currentStep: number;
  totalSteps: number;
  isStepComplete: boolean;
  onNext: () => void;
  onPrev: () => void;
  onSubmit: () => Promise<void>;
}

export function NavigationFooter({
  currentStep,
  totalSteps,
  isStepComplete,
  onNext,
  onPrev,
  onSubmit,
}: NavigationFooterProps) {
  return (
    <div className="sticky bottom-0">
      <div className="bg-gradient-to-t from-black via-black/30 to-transparent pt-10">
        <div className="max-w-4xl mx-auto">
          <div className="px-6 py-6 flex justify-between items-center">
            <div className="flex-1">
              {currentStep > 1 && <PrevButton onPrev={onPrev} />}
            </div>
            <div className="flex-1 flex justify-end">
              {currentStep < totalSteps && (
                <NextButton isStepComplete={isStepComplete} onNext={onNext} />
              )}
              {currentStep === totalSteps && (
                <button
                  onClick={() => {
                    onSubmit().catch(error => {
                      console.error('Submit failed:', error);
                    });
                  }}
                  disabled={!isStepComplete}
                  className={`
                    px-8 py-3 rounded-xl text-sm font-medium
                    transition-all duration-200
                    ${
                      isStepComplete
                        ? "bg-gradient-to-r from-[#EAFD66] to-[#EAFD66]/80 text-black hover:opacity-90"
                        : "bg-gray-900/50 text-gray-600 cursor-not-allowed"
                    }
                  `}
                >
                  완료
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 