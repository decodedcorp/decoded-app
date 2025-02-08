'use client';

import { useState, useEffect } from 'react';
import { Point, RequestedItem, RequestImage } from '@/types/model.d';
import { StepIndicator } from './indicator/step-indicator';
import { NavigationFooter } from './navigation/navigation-footer';
import { ImageContainer } from './common/image-container';
import { cn } from '@/lib/utils/style';
import { MarkerStepSidebar } from './steps/marker-step/marker-step-sidebar';
import { ContextStepSidebar } from './steps/context-step/context-step-sidebar';
import { useRequestData } from '@/lib/hooks/features/images/useRequestData';
import { useRouter } from 'next/navigation';
import { arrayBufferToBase64 } from '@/lib/utils/string/format';
import { useLocaleContext } from '@/lib/contexts/locale-context';
import {
  StatusModal,
  StatusType,
  StatusMessageKey,
} from '@/components/ui/modal/status-modal';
import { useProtectedAction } from '@/lib/hooks/auth/use-protected-action';

interface ContextAnswer {
  location: string;
  source?: string;
}

export function RequestForm() {
  const { t } = useLocaleContext();
  const router = useRouter();
  const { createRequest } = useRequestData('');
  const { withAuth } = useProtectedAction();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  const [isStepComplete, setIsStepComplete] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [points, setPoints] = useState<Point[]>([]);
  const [selectedPoint, setSelectedPoint] = useState<number | null>(null);
  const [contextAnswers, setContextAnswers] = useState<ContextAnswer | null>(null);
  const [modalConfig, setModalConfig] = useState<{
    type: StatusType;
    isOpen: boolean;
    messageKey?: StatusMessageKey;
    onClose: () => void;
  }>({
    type: 'warning',
    isOpen: false,
    onClose: () => setModalConfig((prev) => ({ ...prev, isOpen: false })),
  });

  useEffect(() => {
    switch (currentStep) {
      case 1:
        setIsStepComplete(!!selectedImage);
        break;
      case 2:
        setIsStepComplete(points.length > 0);
        break;
      case 3:
        setIsStepComplete(!!contextAnswers?.location);
        break;
      default:
        setIsStepComplete(false);
    }
  }, [currentStep, selectedImage, points, contextAnswers?.location]);

  const handleSubmit = withAuth(async (userId) => {
    try {
      if (!imageFile || points.length === 0 || !contextAnswers) {
        setModalConfig({
          type: 'error',
          isOpen: true,
          onClose: () => setModalConfig((prev) => ({ ...prev, isOpen: false })),
        });
        return;
      }

      const buffer = await imageFile?.arrayBuffer();
      const base64Image = arrayBufferToBase64(buffer);

      const requestData: RequestImage = {
        imageFile: base64Image,
        requestedItems: points.map((point) => ({
          item_class: null,
          item_sub_class: null,
          category: null,
          sub_category: null,
          product_type: null,
          context: point.context || null,
          position: {
            left: `${point.x}`,
            top: `${point.y}`,
          },
        })),
        requestBy: userId,
        context: contextAnswers.location,
        source: contextAnswers?.source || null,
        metadata: {},
      };

      const response = await createRequest(requestData, userId);
      console.log('=== Request Created ===');
      console.log('Response:', response);
      setModalConfig({
        type: 'success',
        isOpen: true,
        onClose: () => setModalConfig((prev) => ({ ...prev, isOpen: false })),
      });
      router.push(`/`);
    } catch (error) {
      console.error('=== Submit Error ===');
      console.error('Error:', error);
      setModalConfig({
        type: 'error',
        isOpen: true,
        onClose: () => setModalConfig((prev) => ({ ...prev, isOpen: false })),
      });
    }
  });

  const onNext = () => setCurrentStep((prev) => prev + 1);
  const onPrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      if (currentStep === 3) {
        setContextAnswers(null);
      }
    }
  };

  const handleImageSelect = (image: string, file: File) => {
    setSelectedImage(image);
    setImageFile(file);
  };

  const handleUpdateContext = (point: Point, context: string | null) => {
    const newPoints = [...points];
    const index = points.findIndex((p) => p.x === point.x && p.y === point.y);
    if (index !== -1) {
      newPoints[index] = { ...point, context: context || '' };
      setPoints(newPoints);
    }
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
    contextAnswers,
  };

  const markerStepProps = {
    points,
    selectedPoint,
    onSelect: (point: Point | null) =>
      setSelectedPoint(point ? points.indexOf(point) : null),
    onUpdateContext: handleUpdateContext,
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
          <div className="w-full h-full">
            <MarkerStepSidebar {...markerStepProps} />
          </div>
        )}

        {currentStep === 3 && (
          <div className="w-full h-full">
            <ContextStepSidebar
              onAnswerChange={(answer) => setContextAnswers(answer)}
              onSubmit={() => handleSubmit()}
            />
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

      <StatusModal
        isOpen={modalConfig.isOpen}
        onClose={modalConfig.onClose}
        type={modalConfig.type}
        messageKey={modalConfig.messageKey}
      />
    </>
  );
}
