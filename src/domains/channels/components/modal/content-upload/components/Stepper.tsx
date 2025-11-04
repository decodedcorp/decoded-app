'use client';

import React, { useState, Children, useRef, useLayoutEffect, useEffect, HTMLAttributes, ReactNode, createContext, useContext } from 'react';
import { motion, AnimatePresence, Variants } from 'motion/react';

// Stepper Context for sharing state
interface StepperContextType {
  currentStep: number;
  totalSteps: number;
  updateStep: (step: number) => void;
  setDirection: (dir: number) => void;
  direction: number;
  isCompleted: boolean;
  isLastStep: boolean;
  canProceed?: (step: number) => boolean;
}

const StepperContext = createContext<StepperContextType | null>(null);

export const useStepperContext = () => {
  const context = useContext(StepperContext);
  if (!context) {
    throw new Error('useStepperContext must be used within Stepper');
  }
  return context;
};

interface StepperProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  initialStep?: number;
  onStepChange?: (step: number) => void;
  onFinalStepCompleted?: () => void;
  stepCircleContainerClassName?: string;
  stepContainerClassName?: string;
  contentClassName?: string;
  footerClassName?: string;
  backButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  nextButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  backButtonText?: string;
  nextButtonText?: string;
  disableStepIndicators?: boolean;
  renderStepIndicator?: (props: {
    step: number;
    currentStep: number;
    onStepClick: (clicked: number) => void;
  }) => ReactNode;
  canProceed?: (step: number) => boolean;
  renderIndicator?: (props: {
    currentStep: number;
    totalSteps: number;
    onStepClick: (step: number) => void;
  }) => ReactNode;
  showIndicatorOnly?: boolean;
  hideBuiltInIndicator?: boolean;
  onIndicatorReady?: (indicator: ReactNode) => void;
}

export default function Stepper({
  children,
  initialStep = 1,
  onStepChange = () => {},
  onFinalStepCompleted = () => {},
  stepCircleContainerClassName = '',
  stepContainerClassName = '',
  contentClassName = '',
  footerClassName = '',
  backButtonProps = {},
  nextButtonProps = {},
  backButtonText = 'Back',
  nextButtonText = 'Continue',
  disableStepIndicators = false,
  renderStepIndicator,
  canProceed,
  renderIndicator,
  showIndicatorOnly = false,
  hideBuiltInIndicator = false,
  onIndicatorReady,
  ...rest
}: StepperProps) {
  const [currentStep, setCurrentStep] = useState<number>(initialStep);
  const [direction, setDirection] = useState<number>(0);
  const stepsArray = Children.toArray(children);
  const totalSteps = stepsArray.length;
  const isCompleted = currentStep > totalSteps;
  const isLastStep = currentStep === totalSteps;

  const updateStep = (newStep: number) => {
    setCurrentStep(newStep);
    if (newStep > totalSteps) {
      onFinalStepCompleted();
    } else {
      onStepChange(newStep);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setDirection(-1);
      updateStep(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (!isLastStep) {
      // Check if we can proceed
      if (canProceed && !canProceed(currentStep)) {
        return;
      }
      setDirection(1);
      updateStep(currentStep + 1);
    }
  };

  const handleComplete = () => {
    if (canProceed && !canProceed(currentStep)) {
      return;
    }
    setDirection(1);
    updateStep(totalSteps + 1);
  };

  const contextValue: StepperContextType = {
    currentStep,
    totalSteps,
    updateStep,
    setDirection,
    direction,
    isCompleted,
    isLastStep,
    canProceed,
  };

  // Render indicator element function (inside context)
  const renderIndicatorElement = () => (
    <div className={`${stepContainerClassName} flex w-full items-center gap-3`}>
      {stepsArray.map((_, index) => {
        const stepNumber = index + 1;
        const isNotLastStep = index < totalSteps - 1;

        return (
          <React.Fragment key={stepNumber}>
            {renderStepIndicator ? (
              renderStepIndicator({
                step: stepNumber,
                currentStep,
                onStepClick: (clicked) => {
                  setDirection(clicked > currentStep ? 1 : -1);
                  updateStep(clicked);
                },
              })
            ) : (
              <StepIndicator
                step={stepNumber}
                disableStepIndicators={disableStepIndicators}
                currentStep={currentStep}
                onClickStep={(clicked) => {
                  setDirection(clicked > currentStep ? 1 : -1);
                  updateStep(clicked);
                }}
              />
            )}

            {isNotLastStep && <StepConnector isComplete={currentStep > stepNumber} />}
          </React.Fragment>
        );
      })}
    </div>
  );

  const indicatorElement = renderIndicatorElement();

  // If showIndicatorOnly, just render the indicator
  if (showIndicatorOnly) {
    return <>{indicatorElement}</>;
  }

  // Component to render indicator inside Context Provider for external use
  const IndicatorRenderer = () => {
    useEffect(() => {
      // Render indicator with props (can be used outside context)
      if (onIndicatorReady) {
        const indicator = (
          <StepperIndicator
            stepContainerClassName={stepContainerClassName}
            currentStep={currentStep}
            totalSteps={totalSteps}
            onStepClick={(step) => {
              setDirection(step > currentStep ? 1 : -1);
              updateStep(step);
            }}
          />
        );
        const timeoutId = setTimeout(() => {
          onIndicatorReady(indicator);
        }, 0);
        return () => clearTimeout(timeoutId);
      }
    }, [currentStep, totalSteps, onIndicatorReady, stepContainerClassName, setDirection, updateStep]);
    
    return null;
  };

  return (
    <StepperContext.Provider value={contextValue}>
      {/* Render indicator inside context for external use */}
      {onIndicatorReady && <IndicatorRenderer />}
      <div className="flex min-h-full flex-1 flex-col" {...rest}>
        {!hideBuiltInIndicator && !renderIndicator && (
          <div
            className={`mx-auto w-full rounded-2xl ${stepCircleContainerClassName}`}
            style={{ border: '1px solid rgb(63 63 70)' }}
          >
            {indicatorElement}
          </div>
        )}
        {renderIndicator && (
          <div className="w-full">
            {renderIndicator({
              currentStep,
              totalSteps,
              onStepClick: (step) => {
                setDirection(step > currentStep ? 1 : -1);
                updateStep(step);
              },
            })}
          </div>
        )}
        <div className="flex-1 w-full">
          <StepContentWrapper
            isCompleted={isCompleted}
            currentStep={currentStep}
            direction={direction}
            className={`space-y-2 ${contentClassName}`}
          >
            {stepsArray[currentStep - 1]}
          </StepContentWrapper>
          {!isCompleted && (
            <div className={`${footerClassName}`}>
              <div className={`flex ${currentStep !== 1 ? 'justify-between' : 'justify-end'}`}>
                {currentStep !== 1 && (
                  <button
                    onClick={handleBack}
                    className={`duration-350 rounded-lg px-4 py-2 transition ${
                      currentStep === 1
                        ? 'pointer-events-none opacity-50 text-zinc-400'
                        : 'text-zinc-400 hover:text-zinc-200 bg-zinc-800 hover:bg-zinc-700'
                    }`}
                    {...backButtonProps}
                  >
                    {backButtonText}
                  </button>
                )}
                <button
                  onClick={isLastStep ? handleComplete : handleNext}
                  disabled={canProceed && !canProceed(currentStep)}
                  className="duration-350 flex items-center justify-center rounded-lg bg-primary py-2 px-4 font-medium tracking-tight text-white transition hover:bg-primary-hover active:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed"
                  {...nextButtonProps}
                >
                  {isLastStep ? 'Complete' : nextButtonText}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </StepperContext.Provider>
  );
}

// Export StepperIndicator component for external use
export function StepperIndicator({
  stepContainerClassName = '',
  disableStepIndicators = false,
  renderStepIndicator,
  currentStep: externalCurrentStep,
  totalSteps: externalTotalSteps,
  onStepClick: externalOnStepClick,
}: {
  stepContainerClassName?: string;
  disableStepIndicators?: boolean;
  renderStepIndicator?: (props: {
    step: number;
    currentStep: number;
    onStepClick: (clicked: number) => void;
  }) => ReactNode;
  currentStep?: number;
  totalSteps?: number;
  onStepClick?: (step: number) => void;
}) {
  // Always call useContext (Hook rule), but handle null context
  const context = useContext(StepperContext);
  
  // Use context if available, otherwise use props
  const currentStep = context?.currentStep ?? externalCurrentStep ?? 1;
  const totalSteps = context?.totalSteps ?? externalTotalSteps ?? 1;
  
  if (!context && (!externalCurrentStep || !externalTotalSteps || !externalOnStepClick)) {
    throw new Error('StepperIndicator must be used within Stepper or provided with currentStep, totalSteps, and onStepClick props');
  }

  const handleStepClick = (clicked: number) => {
    if (externalOnStepClick) {
      externalOnStepClick(clicked);
    } else if (context) {
      const direction = clicked > currentStep ? 1 : -1;
      context.setDirection(direction);
      context.updateStep(clicked);
    }
  };

  return (
    <div className={`${stepContainerClassName} flex w-full items-center gap-3`}>
      {Array.from({ length: totalSteps }).map((_, index) => {
        const stepNumber = index + 1;
        const isNotLastStep = index < totalSteps - 1;

        return (
          <React.Fragment key={stepNumber}>
            {renderStepIndicator ? (
              renderStepIndicator({
                step: stepNumber,
                currentStep,
                onStepClick: handleStepClick,
              })
            ) : (
              <StepIndicator
                step={stepNumber}
                disableStepIndicators={disableStepIndicators}
                currentStep={currentStep}
                onClickStep={handleStepClick}
              />
            )}

            {isNotLastStep && <StepConnector isComplete={currentStep > stepNumber} />}
          </React.Fragment>
        );
      })}
    </div>
  );
}

interface StepContentWrapperProps {
  isCompleted: boolean;
  currentStep: number;
  direction: number;
  children: ReactNode;
  className?: string;
}

function StepContentWrapper({
  isCompleted,
  currentStep,
  direction,
  children,
  className = '',
}: StepContentWrapperProps) {
  const [parentHeight, setParentHeight] = useState<number>(0);

  return (
    <motion.div
      style={{ position: 'relative', overflow: 'hidden', minHeight: parentHeight || 'auto' }}
      animate={{ height: isCompleted ? 0 : parentHeight || 'auto' }}
      transition={{ type: 'spring', duration: 0.4 }}
      className={className}
    >
      <AnimatePresence initial={false} mode="sync" custom={direction}>
        {!isCompleted && (
          <SlideTransition key={currentStep} direction={direction} onHeightReady={(h) => setParentHeight(h)}>
            {children}
          </SlideTransition>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

interface SlideTransitionProps {
  children: ReactNode;
  direction: number;
  onHeightReady: (height: number) => void;
}

function SlideTransition({ children, direction, onHeightReady }: SlideTransitionProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (containerRef.current) {
      onHeightReady(containerRef.current.offsetHeight);
    }
  }, [children, onHeightReady]);

  return (
    <motion.div
      ref={containerRef}
      custom={direction}
      variants={stepVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      style={{ position: 'absolute', left: 0, right: 0, top: 0 }}
    >
      {children}
    </motion.div>
  );
}

const stepVariants: Variants = {
  enter: (dir: number) => ({
    x: dir >= 0 ? '-100%' : '100%',
    opacity: 0,
  }),
  center: {
    x: '0%',
    opacity: 1,
  },
  exit: (dir: number) => ({
    x: dir >= 0 ? '50%' : '-50%',
    opacity: 0,
  }),
};

interface StepProps {
  children: ReactNode;
}

export function Step({ children }: StepProps) {
  return <div className="px-0">{children}</div>;
}

interface StepIndicatorProps {
  step: number;
  currentStep: number;
  onClickStep: (clicked: number) => void;
  disableStepIndicators?: boolean;
}

function StepIndicator({
  step,
  currentStep,
  onClickStep,
  disableStepIndicators = false,
}: StepIndicatorProps) {
  const status = currentStep === step ? 'active' : currentStep < step ? 'inactive' : 'complete';

  const handleClick = () => {
    if (step !== currentStep && !disableStepIndicators) {
      onClickStep(step);
    }
  };

  return (
    <motion.div
      onClick={handleClick}
      className="relative cursor-pointer outline-none focus:outline-none"
      animate={status}
      initial={false}
    >
      <motion.div
        variants={{
          inactive: { scale: 1, backgroundColor: 'rgb(63 63 70)', color: '#a3a3a3' },
          active: { scale: 1.1, backgroundColor: 'var(--color-primary)', color: 'var(--color-primary)' },
          complete: { scale: 1, backgroundColor: 'var(--color-primary)', color: 'var(--color-primary)' },
        }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="flex h-10 w-10 items-center justify-center rounded-full font-semibold shadow-sm"
      >
        {status === 'complete' ? (
          <CheckIcon className="h-5 w-5 text-black" />
        ) : status === 'active' ? (
          <div className="h-3.5 w-3.5 rounded-full bg-black" />
        ) : (
          <span className="text-sm font-medium text-black">{step}</span>
        )}
      </motion.div>
    </motion.div>
  );
}

interface StepConnectorProps {
  isComplete: boolean;
}

function StepConnector({ isComplete }: StepConnectorProps) {
  const lineVariants: Variants = {
    incomplete: { width: 0, backgroundColor: 'transparent' },
    complete: { width: '100%', backgroundColor: 'var(--color-primary)' },
  };

  return (
    <div className="relative mx-3 h-0.5 flex-1 overflow-hidden rounded-full bg-zinc-700">
      <motion.div
        className="absolute left-0 top-0 h-full rounded-full"
        variants={lineVariants}
        initial={false}
        animate={isComplete ? 'complete' : 'incomplete'}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
      />
    </div>
  );
}

interface CheckIconProps extends React.SVGProps<SVGSVGElement> {}

function CheckIcon(props: CheckIconProps) {
  return (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{
          delay: 0.1,
          type: 'tween',
          ease: 'easeOut',
          duration: 0.3,
        }}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}

