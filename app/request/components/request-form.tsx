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

  const imageContainerProps = {
    step: currentStep,
    selectedImage: selectedImage,
    imageFile: imageFile,
    points: points,
    onImageSelect: handleImageSelect,
    onPointsChange: setPoints,
    onPointContextChange: handleUpdateContext,
    onPointSelect: setSelectedPoint,
  };

  const markerStepProps = {
    points: points,
    selectedPoint: selectedPoint,
    onSelect: (point: Point | null) => setSelectedPoint(point ? points.indexOf(point) : null),
    onUpdateContext: (point: Point, context: string) => handleUpdateContext(points.indexOf(point), context),
  };

  return (
    <>
      <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />

      <div
        className={cn(
          'grid',
          'transition-all duration-200 ease-in-out',
          'gap-4 sm:gap-6',
          'px-4 sm:px-6',
          'min-h-[30rem] max-h-[45rem]',
          'w-full max-w-[56rem]',
          'mx-auto',
          currentStep === 1
            ? 'grid-cols-1 place-items-center'
            : 'grid-cols-1 sm:grid-cols-[minmax(0,24rem)_minmax(0,28rem)] items-start justify-center'
        )}
      >
        <div
          className={cn(
            'transition-all duration-300 ease-in-out w-full h-full',
            currentStep === 1
              ? 'flex items-center justify-center'
              : 'flex items-start justify-center'
          )}
        >
          <div
            className={cn(
              'w-full h-full',
              currentStep === 1 ? 'max-w-[32rem]' : ''
            )}
          >
            <ImageContainer {...imageContainerProps} />
          </div>
        </div>

        {currentStep === 2 && (
          <div className="w-full h-full overflow-y-auto">
            <MarkerStepSidebar {...markerStepProps} />
          </div>
        )}

        {currentStep === 3 && (
          <div className="w-full h-full overflow-y-auto">
            <ContextStepSidebar />
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
