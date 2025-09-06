interface NavigationButtonsProps {
  currentStep: number;
  onCancel: () => void;
  onBack?: () => void;
  onNext?: () => void;
  onSubmit?: () => void;
  isLoading: boolean;
  canProceed: boolean;
  canSubmit: boolean;
}

export function NavigationButtons({
  currentStep,
  onCancel,
  onBack,
  onNext,
  onSubmit,
  isLoading,
  canProceed,
  canSubmit,
}: NavigationButtonsProps) {
  return (
    <div className="flex items-center justify-between px-4 py-4 border-t border-zinc-700/50 bg-zinc-900/30">
      <div className="flex items-center space-x-3">
        {(currentStep === 2 || currentStep === 3) && onBack && (
          <button
            onClick={onBack}
            disabled={isLoading}
            className="px-6 py-2.5 text-zinc-300 border border-zinc-600 rounded-lg hover:bg-zinc-800 hover:border-[#eafd66] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Back
          </button>
        )}
      </div>

      <div className="flex items-center space-x-3">
        <button
          onClick={onCancel}
          disabled={isLoading}
          className="px-6 py-2.5 text-zinc-300 border border-zinc-600 rounded-lg hover:bg-zinc-800 hover:border-[#eafd66] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>

        {(currentStep === 1 || currentStep === 2) && onNext && (
          <button
            onClick={onNext}
            disabled={!canProceed || isLoading}
            className="px-6 py-2.5 bg-gradient-to-r from-[#eafd66] to-[#d4e85c] text-black font-medium rounded-lg hover:from-[#d4e85c] hover:to-[#eafd66] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-zinc-600"
          >
            {currentStep === 2 ? 'Next' : 'Next Step'}
          </button>
        )}

        {currentStep === 3 && onSubmit && (
          <button
            onClick={onSubmit}
            disabled={!canSubmit || isLoading}
            className="px-6 py-2.5 bg-gradient-to-r from-[#eafd66] to-[#d4e85c] text-black font-medium rounded-lg hover:from-[#d4e85c] hover:to-[#eafd66] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-zinc-600"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Creating...</span>
              </div>
            ) : (
              'Create Channel'
            )}
          </button>
        )}
      </div>
    </div>
  );
}
