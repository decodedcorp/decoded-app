import { cn } from "@/lib/utils/style";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  selectedImage: string | null;
}

export function ProgressBar({ currentStep, totalSteps, selectedImage }: ProgressBarProps) {
  return (
    <div className={cn(
      "w-full h-0.5 bg-gray-800 overflow-hidden",
      "opacity-100 flex-shrink-0",
      "transition-all duration-300"
    )}>
      <div
        className="h-full bg-[#EAFD66] transition-all duration-300"
        style={{
          width: selectedImage
            ? `${(currentStep / totalSteps) * 100}%`
            : "0%",
        }}
      />
    </div>
  );
} 