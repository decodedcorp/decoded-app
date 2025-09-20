import { useCommonTranslation } from '@/lib/i18n/centralizedHooks';
import { PostButton } from '@/components/PostButton';

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
  const t = useCommonTranslation();

  return (
    <div className="flex items-center justify-between px-4 py-4 border-t border-zinc-700/50 bg-zinc-900/30">
      <div className="flex items-center space-x-3">
        {(currentStep === 2 || currentStep === 3) && onBack && (
          <button
            onClick={onBack}
            disabled={isLoading}
            className="px-6 py-2.5 text-zinc-300 border border-zinc-600 rounded-lg hover:bg-zinc-800 hover:border-[#eafd66] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t.globalContentUpload.addChannel.navigation.back()}
          </button>
        )}
      </div>

      <div className="flex items-center space-x-3">
        <button
          onClick={onCancel}
          disabled={isLoading}
          className="px-6 py-2.5 text-zinc-300 border border-zinc-600 rounded-lg hover:bg-zinc-800 hover:border-[#eafd66] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t.globalContentUpload.addChannel.navigation.cancel()}
        </button>

        {(currentStep === 1 || currentStep === 2) && onNext && (
          <PostButton
            onClick={onNext}
            disabled={!canProceed}
            isLoading={isLoading}
            variant="primary"
            size="md"
          >
            {currentStep === 2
              ? t.globalContentUpload.addChannel.navigation.next()
              : t.globalContentUpload.addChannel.navigation.nextStep()}
          </PostButton>
        )}

        {currentStep === 3 && onSubmit && (
          <PostButton
            onClick={onSubmit}
            disabled={!canSubmit}
            isLoading={isLoading}
            variant="primary"
            size="md"
          >
            {t.globalContentUpload.addChannel.navigation.createChannel()}
          </PostButton>
        )}
      </div>
    </div>
  );
}
