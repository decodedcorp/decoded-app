"use client";

import { type RequestStep } from "@/lib/stores/requestStore";

const STEPS = [
  { step: 1, label: "Upload" },
  { step: 2, label: "Detect" },
  { step: 3, label: "Details" },
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
          <div
            key={step}
            className={`
              h-2 w-2 rounded-full transition-colors duration-200
              ${isActive || isCompleted ? "bg-primary" : "bg-[#3D3D3D]"}
            `}
            aria-label={`Step ${step}: ${STEPS[index].label}`}
            aria-current={isActive ? "step" : undefined}
          />
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
