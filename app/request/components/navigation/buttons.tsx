interface NavigationButtonProps {
  currentStep: number;
  totalSteps: number;
  isStepComplete: boolean;
  onNext: () => void;
  onPrev: () => void;
  onSubmit: () => void;
}

export function NextButton({
  isStepComplete,
  onNext,
}: {
  isStepComplete: boolean;
  onNext: () => void;
}) {
  return (
    <button
      onClick={onNext}
      disabled={!isStepComplete}
      className={`
        px-6 py-2.5 rounded-lg text-sm font-medium
        transition-all duration-200 
        ${
          isStepComplete
            ? "bg-[#EAFD66]/10 text-[#EAFD66] hover:bg-[#EAFD66]/20 border border-[#EAFD66]/30"
            : "bg-gray-900 text-gray-600 border border-gray-800 cursor-not-allowed"
        }
      `}
    >
      다음
    </button>
  );
}

export function PrevButton({ onPrev }: { onPrev: () => void }) {
  return (
    <button
      onClick={onPrev}
      className="px-6 py-2.5 rounded-lg text-sm font-medium 
        text-gray-400 bg-gray-900 border border-gray-800
        hover:bg-gray-800 transition-all duration-200"
    >
      이전
    </button>
  );
}

export function NavigationButtons({
  currentStep,
  totalSteps,
  isStepComplete,
  onNext,
  onPrev,
  onSubmit,
}: NavigationButtonProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/90">
      <div className="max-w-4xl mx-auto">
        <div className="px-6 py-4 flex justify-between items-center">
          <div className="flex-1">
            {currentStep > 1 && <PrevButton onPrev={onPrev} />}
          </div>
          <div className="flex-1 text-center text-sm text-gray-500">
            {currentStep} / {totalSteps}
          </div>
          <div className="flex-1 flex justify-end">
            {currentStep < totalSteps && (
              <NextButton isStepComplete={isStepComplete} onNext={onNext} />
            )}
            {currentStep === totalSteps && (
              <button
                onClick={onSubmit}
                disabled={!isStepComplete}
                className={`
                  px-6 py-2.5 rounded-lg text-sm font-medium
                  transition-all duration-200
                  ${
                    isStepComplete
                      ? "bg-[#EAFD66] text-black hover:bg-[#EAFD66]/90"
                      : "bg-gray-900 text-gray-600 border border-gray-800 cursor-not-allowed"
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
  );
}
