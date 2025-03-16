"use client";

import { useLocaleContext } from "@/lib/contexts/locale-context";
import { cn } from "@/lib/utils/style";

interface NavigationFooterProps {
  currentStep: number;
  totalSteps: number;
  isStepComplete: boolean;
  onNext: () => void;
  onPrev: () => void;
  onSubmit: () => Promise<void>;
  className?: string;
}

export function NavigationFooter({
  currentStep,
  totalSteps,
  isStepComplete,
  onNext,
  onPrev,
  onSubmit,
  className,
}: NavigationFooterProps) {
  const { t } = useLocaleContext();
  return (
    <div className={cn(
      'sticky bottom-0 z-10',
      'pt-5 sm:pt-6',
      'mt-4',
      className
    )}>
      <div className={cn(
        'w-full max-w-[42rem] mx-auto',
        'px-4 sm:px-5',
        'py-2 sm:py-3',
        'flex justify-between items-center',
      )}>
        <div className="flex-1">
          <button
            onClick={onPrev}
            disabled={currentStep === 1}
            className={cn(
              'py-2 px-3 sm:py-2.5 sm:px-4',
              'rounded-lg text-xs sm:text-sm font-medium',
              'bg-white/5 text-white',
              'hover:bg-white/10 transition-colors',
              'disabled:opacity-40 disabled:cursor-not-allowed'
            )}
          >
            prev
          </button>
        </div>
        <div className="flex-1 flex justify-end">
          <button
            onClick={currentStep === totalSteps ? onSubmit : onNext}
            disabled={!isStepComplete}
            className={cn(
              'py-2 px-4 sm:py-2.5 sm:px-5',
              'rounded-lg text-xs sm:text-sm font-medium',
              'bg-[#EAFD66] text-black',
              'hover:bg-[#EAFD66]/90 transition-colors',
              'disabled:opacity-40 disabled:cursor-not-allowed'
            )}
          >
            {currentStep === totalSteps ? "submit" : "next"}
          </button>
        </div>
      </div>
      
      <div className="h-safe-bottom sm:hidden"></div>
    </div>
  );
}
