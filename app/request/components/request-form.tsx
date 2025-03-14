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
import { useStatusMessage } from '@/components/ui/modal/status-modal/utils/use-status-message';

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
  const [contextAnswers, setContextAnswers] = useState<ContextAnswer | null>(
    null
  );
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
  const { showLoadingStatus } = useStatusMessage();

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

    try {
      await createRequest(requestData, userId);
      router.push('/'); // 성공 후 마이페이지로 이동
    } catch (error) {
      console.error('=== Submit Error ===');
      console.error('Error:', error);
    }
  });

  const onNext = () => {
    if (currentStep === 2) {
      setSelectedPoint(null);
    }
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  };
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
    <div className="pt-safe-top pb-safe-bottom px-safe-left px-safe-right">
      <div
        className={cn(
          'relative',
          'w-full max-w-[42rem]',
          'mx-auto px-4 sm:px-6',
          'min-h-[20rem]',
          'max-h-[calc(100vh-12rem)] sm:max-h-[50rem]',
          'flex items-center justify-center',
          'py-2 sm:py-3'
        )}
      >
        <div
          className={cn(
            'relative w-full',
            'max-w-[100%] xs:max-w-[90%] sm:max-w-[28rem] md:max-w-[32rem]',
            'my-2 sm:my-3'
          )}
        >
          <ImageContainer {...imageContainerProps} />
          {currentStep === 3 && (
            <div className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2">
              <ContextStepSidebar
                onAnswerChange={(answer) => setContextAnswers(answer)}
              />
            </div>
          )}
        </div>
      </div>

      <NavigationFooter
        currentStep={currentStep}
        totalSteps={totalSteps}
        isStepComplete={isStepComplete}
        onNext={onNext}
        onPrev={onPrev}
        onSubmit={handleSubmit}
        className="mt-4 sm:mt-5"
      />

      <StatusModal
        isOpen={modalConfig.isOpen}
        onClose={modalConfig.onClose}
        type={modalConfig.type}
        messageKey={modalConfig.messageKey}
      />
    </div>
  );
}
