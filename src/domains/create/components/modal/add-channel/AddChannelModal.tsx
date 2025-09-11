'use client';

import React, { useState, useEffect } from 'react';

import {
  useAddChannelStore,
  selectIsAddChannelModalOpen,
  selectAddChannelLoading,
  selectAddChannelFormData,
} from '@/domains/create/store/addChannelStore';
import { useCreateChannel } from '@/domains/channels/hooks/useChannels';
import { useChannelModalStore } from '@/store/channelModalStore';
import { useGlobalContentUploadStore } from '@/store/globalContentUploadStore';

import { BaseModal } from '../base/BaseModal';

import { AddChannelHeader } from './AddChannelHeader';
import { Step1BasicInfo } from './Step1BasicInfo';
import { Step2MediaUpload } from './Step2MediaUpload';
import { Step3CategorySelection } from './Step3CategorySelection';
import { NavigationButtons } from './NavigationButtons';

interface Step1Data {
  name: string;
  description: string;
}

interface Step2Data {
  thumbnail_base64: string | null;
  banner_base64: string | null;
}

interface Step3Data {
  selectedCategory: string;
  selectedSubcategory: string;
}

export function AddChannelModal() {
  const isOpen = useAddChannelStore(selectIsAddChannelModalOpen);
  const isLoading = useAddChannelStore(selectAddChannelLoading);
  const closeModal = useAddChannelStore((state) => state.closeModal);
  const setLoading = useAddChannelStore((state) => state.setLoading);
  const setError = useAddChannelStore((state) => state.setError);

  const createChannelMutation = useCreateChannel();
  const openChannelModal = useChannelModalStore((state) => state.openModal);
  const selectChannel = useGlobalContentUploadStore((state) => state.selectChannel);

  // Step management
  const [currentStep, setCurrentStep] = useState(1);
  const [step1Data, setStep1Data] = useState<Step1Data>({
    name: '',
    description: '',
  });
  const [step2Data, setStep2Data] = useState<Step2Data>({
    thumbnail_base64: null,
    banner_base64: null,
  });
  const [step3Data, setStep3Data] = useState<Step3Data>({
    selectedCategory: '',
    selectedSubcategory: '',
  });

  // Sync step1Data with form data
  useEffect(() => {
    // This will be updated when the form data changes
  }, [step1Data]);

  // Get mutation status for better UX
  const isCreating = createChannelMutation.isPending;
  const createError = createChannelMutation.error;
  const isSuccess = createChannelMutation.isSuccess;

  const canProceedToStep2 = step1Data.name.trim().length >= 2 && step1Data.name.trim().length <= 50;
  const canProceedToStep3 = canProceedToStep2 && currentStep === 2;
  const canSubmit = canProceedToStep2 && currentStep === 3;

  const handleStep1Submit = (data: Step1Data) => {
    setStep1Data(data);
    setCurrentStep(2);
  };

  const handleStep2Submit = (data: Step2Data) => {
    setStep2Data(data);
    setCurrentStep(3);
  };

  const handleStep3Submit = (data: Step3Data) => {
    setStep3Data(data);
    handleFinalSubmit();
  };

  const handleBackToStep1 = () => {
    setCurrentStep(1);
  };

  const handleBackToStep2 = () => {
    setCurrentStep(2);
  };

  const handleFinalSubmit = async () => {
    const requestData = {
      name: step1Data.name.trim(),
      description: step1Data.description.trim() || null,
      thumbnail_base64: step2Data.thumbnail_base64,
      banner_base64: step2Data.banner_base64,
      category: step3Data.selectedCategory,
      subcategory: step3Data.selectedSubcategory,
    };

    try {
      const response = await createChannelMutation.mutateAsync(requestData);

      // Close the add channel modal
      closeModal();

      // Create channel data for global content upload
      const channelData = {
        id: response.id,
        name: response.name,
        description: response.description || `This is the ${response.name} channel.`,
        thumbnail_url: response.thumbnail_url || null,
        subscriber_count: 0,
      };

      // If opened from global content upload modal, select the channel
      // Otherwise, open the channel modal
      if (useGlobalContentUploadStore.getState().isOpen) {
        selectChannel(channelData);
      } else {
        // For channel modal, we need to include additional fields
        const fullChannelData = {
          ...channelData,
          owner_id: response.owner_id || 'current-user',
          content_count: 0,
          created_at: response.created_at || new Date().toISOString(),
          is_subscribed: false,
        };
        openChannelModal(fullChannelData);
      }
    } catch (error: any) {
      // Handle different types of errors
      let errorMessage = 'Failed to create channel. Please try again.';

      if (error?.response?.status === 500) {
        errorMessage = 'Internal server error occurred. Please try again later.';
      } else if (error?.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);
    }
  };

  const handleCancel = () => {
    if (!isCreating) {
      closeModal();
    }
  };

  const resetForm = () => {
    setCurrentStep(1);
    setStep1Data({ name: '', description: '' });
    setStep2Data({ thumbnail_base64: null, banner_base64: null });
    setStep3Data({ selectedCategory: '', selectedSubcategory: '' });
  };

  // ESC 키로 모달 닫기
  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCancel();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleCancel]);

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={closeModal}
      overlayClassName="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
      contentClassName="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
    >
      <div className="bg-zinc-900/95 backdrop-blur-xl border border-zinc-700/50 rounded-2xl w-full max-w-[1200px] max-h-[90vh] overflow-hidden animate-scale-in shadow-2xl flex flex-col">
        <AddChannelHeader onClose={closeModal} currentStep={currentStep} />

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {currentStep === 1 ? (
            <Step1BasicInfo data={step1Data} onDataChange={(data) => setStep1Data(data)} />
          ) : currentStep === 2 ? (
            <Step2MediaUpload
              step1Data={step1Data}
              data={step2Data}
              onDataChange={(data) => setStep2Data(data)}
              onBack={handleBackToStep1}
              isLoading={isCreating}
              error={
                createError
                  ? (createError as any)?.response?.data?.detail || createError.message
                  : null
              }
            />
          ) : currentStep === 3 ? (
            <Step3CategorySelection
              data={step3Data}
              onDataChange={(data) => setStep3Data(data)}
            />
          ) : null}
        </div>

        <NavigationButtons
          currentStep={currentStep}
          onCancel={handleCancel}
          onBack={
            currentStep === 2 
              ? handleBackToStep1 
              : currentStep === 3 
              ? handleBackToStep2 
              : undefined
          }
          onNext={
            currentStep === 1 && canProceedToStep2
              ? () => {
                  // Validate step 1 data before proceeding
                  if (step1Data.name.trim().length >= 2 && step1Data.name.trim().length <= 50) {
                    setCurrentStep(2);
                  }
                }
              : currentStep === 2
              ? () => setCurrentStep(3)
              : undefined
          }
          onSubmit={currentStep === 3 ? handleFinalSubmit : undefined}
          isLoading={isCreating}
          canProceed={currentStep === 1 ? canProceedToStep2 : currentStep === 2 ? canProceedToStep3 : false}
          canSubmit={canSubmit}
        />
      </div>
    </BaseModal>
  );
}
