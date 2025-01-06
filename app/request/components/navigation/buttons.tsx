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
        px-6 py-2 rounded-md text-sm font-medium
        transition-all duration-200
        ${
          isStepComplete
            ? "bg-[#1A1A1A] text-gray-400 hover:bg-black/50"
            : "bg-[#1A1A1A] text-gray-400 cursor-not-allowed"
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
      className="px-6 py-2 rounded-md text-sm font-medium text-gray-400 bg-[#1A1A1A] hover:bg-black/50"
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
    <div className="sticky bottom-0 left-0 right-0 bg-[#1A1A1A] border-t border-gray-700 shadow-lg">
      <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between">
        <div>{currentStep > 1 && <PrevButton onPrev={onPrev} />}</div>
        <div>
          {currentStep < totalSteps && (
            <NextButton isStepComplete={isStepComplete} onNext={onNext} />
          )}
          {currentStep === totalSteps && (
            <button
              onClick={onSubmit}
              disabled={!isStepComplete}
              className={`
                px-6 py-2 rounded-md text-sm font-medium
                transition-all duration-200
                ${
                  isStepComplete
                    ? "bg-[#1A1A1A] text-[#EAFD66] hover:bg-black/50"
                    : "bg-[#1A1A1A] text-gray-400 cursor-not-allowed"
                }
              `}
            >
              완료
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
