"use client";

import { type RequestStep } from "@/lib/stores/requestStore";

const STEPS = [
  { step: 1, label: "Upload" },
  { step: 2, label: "Detect" },
  { step: 3, label: "Details" },
  { step: 4, label: "Submit" },
] as const;

interface StepIndicatorProps {
  currentStep: RequestStep;
  className?: string;
}

export function StepIndicator({
  currentStep,
  className = "",
}: StepIndicatorProps) {
  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      {STEPS.map(({ step }, index) => {
        const isActive = step === currentStep;
        const isCompleted = step < currentStep;

        return (
          <div key={step} className="flex items-center">
            <div
              className={`
                h-2 w-2 rounded-full transition-all duration-200
                ${isActive ? "bg-foreground scale-125" : ""}
                ${isCompleted ? "bg-foreground/60" : ""}
                ${!isActive && !isCompleted ? "bg-foreground/20" : ""}
              `}
              aria-label={`Step ${step}: ${STEPS[index].label}`}
              aria-current={isActive ? "step" : undefined}
            />
            {index < STEPS.length - 1 && (
              <div
                className={`
                  h-0.5 w-4 mx-1 transition-colors duration-200
                  ${isCompleted ? "bg-foreground/40" : "bg-foreground/10"}
                `}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export function StepLabel({ currentStep }: { currentStep: RequestStep }) {
  const stepInfo = STEPS.find((s) => s.step === currentStep);
  return (
    <span className="text-sm text-foreground/60">
      Step {currentStep} of {STEPS.length}
      {stepInfo && ` - ${stepInfo.label}`}
    </span>
  );
}
