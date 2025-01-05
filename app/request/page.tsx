'use client';

import { networkManager } from '@/lib/network/network';
import { arrayBufferToBase64 } from '@/lib/utils/format';
import React, { useState, useEffect } from 'react';
import { Point, RequestedItem, RequestImage } from '@/types/model.d';
import { StepIndicator } from './components/indicator/step-indicator';
import { NavigationButtons } from './components/navigation/buttons';
import { Step1 } from './components/steps/step1';
import { Step2 } from './components/steps/step2';

export default function RequestSection() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 2;
  // State of navigation
  const [isStepComplete, setIsStepComplete] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  // State of step2
  const [imageFile, setImageFile] = useState<File | null>(null);
  // State of step3
  const [points, setPoints] = useState<Point[]>([]);

  useEffect(() => {
    switch (currentStep) {
      case 1:
        setIsStepComplete(!!selectedImage);
        break;
      case 2:
        setIsStepComplete(points.length > 0);
        break;
      default:
        setIsStepComplete(false);
    }
  }, [currentStep, selectedImage, points]);

  const defaultState = () => {
    setCurrentStep(1);
    setSelectedImage(null);
    setImageFile(null);
    setPoints([]);
  };

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
    const buffer = await imageFile?.arrayBuffer();
    const base64Image = arrayBufferToBase64(buffer);
    const requestBy = window.sessionStorage.getItem('USER_DOC_ID');
    if (!requestBy) {
      alert('로그인이 필요합니다.');
      return;
    }
    const requestImage: RequestImage = {
      requestedItems: items,
      requestBy: requestBy,
      imageFile: base64Image,
      metadata: {},
    };
    networkManager
      .request('image/request', 'POST', requestImage)
      .then(() => {
        alert('요청이 완료되었습니다.');
        defaultState();
      })
      .catch((error) => {
        const errorMessage =
          error.response?.data?.description || '요청 중 오류가 발생했습니다.';
        console.error('요청 실패:', errorMessage);
        alert(errorMessage);
      });
  };

  return (
    <div className="relative mt-20 min-h-screen">
      <div className="max-w-4xl mx-auto p-6 pb-24">
        <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />
        <div className="mt-8">
          {currentStep === 1 && (
            <Step1
              selectedImage={selectedImage}
              setSelectedImage={setSelectedImage}
              setImageFile={setImageFile}
            />
          )}
          {currentStep === 2 && (
            <Step2
              selectedImage={selectedImage}
              points={points}
              setPoints={setPoints}
            />
          )}
        </div>
      </div>

      <NavigationButtons
        currentStep={currentStep}
        totalSteps={totalSteps}
        isStepComplete={isStepComplete}
        onNext={() => setCurrentStep((prev) => prev + 1)}
        onPrev={() => setCurrentStep((prev) => prev - 1)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
