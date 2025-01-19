'use client';

import { useState, useEffect } from 'react';
import { Point, RequestedItem } from '@/types/model.d';
import { StepIndicator } from './indicator/step-indicator';
import { NavigationFooter } from './navigation/navigation-footer';
import { ImageContainer } from './common/image-container';
import { cn } from '@/lib/utils/style';
import { MarkerStepSidebar } from './steps/marker-step/marker-step-sidebar';
import { ContextStepSidebar } from './steps/context-step/context-step-sidebar';

export function RequestForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  const [isStepComplete, setIsStepComplete] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [points, setPoints] = useState<Point[]>([]);
  const [selectedPoint, setSelectedPoint] = useState<number | null>(null);

  useEffect(() => {
    switch (currentStep) {
      case 1:
        setIsStepComplete(!!selectedImage);
        break;
      case 2:
        setIsStepComplete(points.length > 0);
        break;
      case 3:
        setIsStepComplete(points.length > 0);
        break;
      default:
        setIsStepComplete(false);
    }
  }, [currentStep, selectedImage, points]);

  const handleSubmit = async () => {
    if (!imageFile) {
      alert('Please select a celebrity and upload an image');
      return;
    }
    const items: RequestedItem[] = [];
    for (const point of points) {
      items.push({
        imageId: 'temp-id',
        position: {
          top: point.y.toString(),
          left: point.x.toString(),
        },
        originalPosition: {
          top: point.y.toString(),
          left: point.x.toString(),
        },
        context: point.context,
      });
    }
  };

  const onNext = () => setCurrentStep((prev) => prev + 1);
  const onPrev = () => setCurrentStep((prev) => prev - 1);

  const handleImageSelect = (image: string, file: File) => {
    setSelectedImage(image);
    setImageFile(file);
  };

  const handleUpdateContext = (pointIndex: number, context: string) => {
    const newPoints = [...points];
    newPoints[pointIndex].context = context;
    setPoints(newPoints);
  };

  return (
    <>
      <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />

      <div
        className={cn(
          'flex',
          'transition-all duration-200 ease-in-out',
          currentStep === 1
            ? 'items-center justify-center h-[calc(100vh-20rem)]'
            : 'gap-6 px-6 h-[calc(100vh-20rem)]'
        )}
      >
        <div
          className={cn(
            'h-full flex items-center transition-all duration-300 ease-in-out',
            currentStep === 1 ? 'w-full justify-center' : 'w-2/3 justify-center'
          )}
        >
          <ImageContainer
            step={currentStep}
            selectedImage={selectedImage}
            imageFile={imageFile}
            points={points}
            onImageSelect={handleImageSelect}
            onPointsChange={setPoints}
            onPointContextChange={(pointIndex, context) => {
              const newPoints = [...points];
              newPoints[pointIndex].context = context;
              setPoints(newPoints);
            }}
            onPointSelect={(pointIndex) => {
              setSelectedPoint(pointIndex);
            }}
          />
        </div>

        {currentStep === 2 && (
          // TODO: fix this animation
          <div className="w-full h-full py-7 transition-all duration-200 ease-linear animate-in slide-in-from-left">
            <div className="h-full">
              <MarkerStepSidebar
                points={points}
                selectedPoint={selectedPoint}
                onSelect={(point) =>
                  setSelectedPoint(point ? points.indexOf(point) : null)
                }
                onUpdateContext={(point, context) =>
                  handleUpdateContext(points.indexOf(point), context)
                }
              />
            </div>
          </div>
        )}

        {currentStep === 3 && (
          // TODO: fix this animation
          <div className="w-full h-full py-7 transition-all duration-200 ease-linear animate-in slide-in-from-left">
            <div className="h-full">
              <ContextStepSidebar
                onAnswerChange={(answer) => {
                  console.log(answer);
                }}
              />
            </div>
          </div>
        )}
      </div>

      <NavigationFooter
        currentStep={currentStep}
        totalSteps={totalSteps}
        isStepComplete={isStepComplete}
        onNext={onNext}
        onPrev={onPrev}
        onSubmit={handleSubmit}
      />
    </>
  );
}
