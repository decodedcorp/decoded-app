'use client';

import React, { useEffect } from 'react';

import {
  useGlobalContentUploadStore,
  selectIsGlobalContentUploadModalOpen,
  selectGlobalContentUploadCurrentStep,
  selectChannelCreationStep,
} from '@/store/globalContentUploadStore';
import { useContentUploadStore } from '@/store/contentUploadStore';
import { useCommonTranslation } from '@/lib/i18n/centralizedHooks';
import { MODAL_SIZES } from '@/lib/constants/modalSizes';

import { BaseModalAdapter } from '@/lib/components/ui/modal/BaseModalAdapter';
import { ContentUploadModal } from '../content-upload/ContentUploadModal';

// Import AddChannel components
import { AddChannelHeader } from '../../../../create/components/modal/add-channel/AddChannelHeader';
import { Step1BasicInfo } from '../../../../create/components/modal/add-channel/Step1BasicInfo';
import { Step2MediaUpload } from '../../../../create/components/modal/add-channel/Step2MediaUpload';
import { Step3CategorySelection } from '../../../../create/components/modal/add-channel/Step3CategorySelection';
import { NavigationButtons } from '../../../../create/components/modal/add-channel/NavigationButtons';
import { useCreateChannel } from '../../../../channels/hooks/useChannels';

import { ChannelSelectionStep } from './ChannelSelectionStep';
import { GlobalContentUploadHeader } from './GlobalContentUploadHeader';

export function GlobalContentUploadModal() {
  const t = useCommonTranslation();

  const isOpen = useGlobalContentUploadStore(selectIsGlobalContentUploadModalOpen);
  const closeModal = useGlobalContentUploadStore((state) => state.closeModal);
  const currentStep = useGlobalContentUploadStore(selectGlobalContentUploadCurrentStep);
  const selectedChannel = useGlobalContentUploadStore((state) => state.selectedChannel);
  const resetSelection = useGlobalContentUploadStore((state) => state.resetSelection);

  // Channel creation state
  const channelCreationStep = useGlobalContentUploadStore(selectChannelCreationStep);
  const channelFormData = useGlobalContentUploadStore((state) => state.channelFormData);
  const isCreatingChannel = useGlobalContentUploadStore((state) => state.isCreatingChannel);
  const channelCreationError = useGlobalContentUploadStore((state) => state.channelCreationError);

  // Channel creation actions
  const setChannelCreationStep = useGlobalContentUploadStore(
    (state) => state.setChannelCreationStep,
  );
  const updateChannelFormData = useGlobalContentUploadStore((state) => state.updateChannelFormData);
  const setChannelCreationLoading = useGlobalContentUploadStore(
    (state) => state.setChannelCreationLoading,
  );
  const setChannelCreationError = useGlobalContentUploadStore(
    (state) => state.setChannelCreationError,
  );
  const selectChannel = useGlobalContentUploadStore((state) => state.selectChannel);

  // 기존 ContentUploadModal 스토어 액션들
  const openContentUploadModal = useContentUploadStore((state) => state.openModal);
  const isContentUploadModalOpen = useContentUploadStore((state) => state.isOpen);

  // Channel creation mutation
  const createChannelMutation = useCreateChannel();

  // 채널이 선택되면 기존 ContentUploadModal 열기
  useEffect(() => {
    if (currentStep === 'content-upload' && selectedChannel) {
      openContentUploadModal(selectedChannel.id);
    }
  }, [currentStep, selectedChannel, openContentUploadModal]);

  // 기존 ContentUploadModal이 닫히면 전역 모달도 닫기
  useEffect(() => {
    if (!isContentUploadModalOpen && currentStep === 'content-upload') {
      closeModal();
    }
  }, [isContentUploadModalOpen, currentStep, closeModal]);

  const handleClose = () => {
    if (currentStep === 'channel-selection') {
      closeModal();
    } else if (currentStep === 'channel-creation') {
      // 채널 생성 단계에서는 채널 선택으로 돌아가기
      resetSelection();
    } else {
      // 콘텐츠 업로드 단계에서는 뒤로가기
      resetSelection();
    }
  };

  const handleBack = () => {
    if (currentStep === 'channel-creation') {
      // 채널 생성에서 뒤로가면 채널 선택으로
      resetSelection();
    } else {
      resetSelection();
    }
  };

  // Channel creation handlers
  const handleChannelCreationBack = () => {
    if (channelCreationStep === 1) {
      // Step 1에서 뒤로가면 채널 선택으로
      resetSelection();
    } else {
      // 다른 스텝에서는 이전 스텝으로
      setChannelCreationStep(channelCreationStep - 1);
    }
  };

  const handleChannelCreationNext = () => {
    if (channelCreationStep < 3) {
      setChannelCreationStep(channelCreationStep + 1);
    }
  };

  // Channel creation submission
  const handleChannelCreationSubmit = async () => {
    const requestData = {
      name: channelFormData.name.trim(),
      description: channelFormData.description.trim() || null,
      thumbnail_base64: channelFormData.thumbnail_base64,
      banner_base64: channelFormData.banner_base64,
      category: channelFormData.selectedCategory,
      subcategory: channelFormData.selectedSubcategory,
    };

    try {
      setChannelCreationLoading(true);
      setChannelCreationError(null);

      const response = await createChannelMutation.mutateAsync(requestData);

      // Create channel data for selection
      const channelData = {
        id: response.id,
        name: response.name,
        description: response.description || `This is the ${response.name} channel.`,
        thumbnail_url: response.thumbnail_url || null,
        subscriber_count: 0,
      };

      // Automatically select the newly created channel and move to content upload
      selectChannel(channelData);
    } catch (error: any) {
      let errorMessage = t.globalContentUpload.errors.channelCreationFailed();

      if (error?.response?.status === 500) {
        errorMessage = t.globalContentUpload.errors.internalServerError();
      } else if (error?.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      setChannelCreationError(errorMessage);
    } finally {
      setChannelCreationLoading(false);
    }
  };

  return (
    <>
      {/* 채널 선택 단계 모달 */}
      <BaseModalAdapter
        isOpen={isOpen && currentStep === 'channel-selection'}
        onClose={handleClose}
        contentClassName={MODAL_SIZES.WIDE}
      >
        <div className="bg-zinc-900/95 backdrop-blur-xl border border-zinc-700/50 rounded-2xl w-full h-full overflow-hidden animate-scale-in shadow-2xl flex flex-col">
          <GlobalContentUploadHeader onClose={handleClose} />

          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            <ChannelSelectionStep />
          </div>
        </div>
      </BaseModalAdapter>

      {/* 채널 생성 단계 모달 */}
      <BaseModalAdapter
        isOpen={isOpen && currentStep === 'channel-creation'}
        onClose={handleClose}
        contentClassName={MODAL_SIZES.WIDE}
      >
        <div className="bg-zinc-900/95 backdrop-blur-xl border border-zinc-700/50 rounded-2xl w-full h-full overflow-hidden animate-scale-in shadow-2xl flex flex-col">
          <AddChannelHeader onClose={handleClose} currentStep={channelCreationStep} />

          <div className="flex-1 overflow-y-auto p-4">
            {channelCreationStep === 1 && (
              <Step1BasicInfo
                data={{
                  name: channelFormData.name,
                  description: channelFormData.description,
                }}
                onDataChange={(data) => updateChannelFormData(data)}
              />
            )}
            {channelCreationStep === 2 && (
              <Step2MediaUpload
                step1Data={{
                  name: channelFormData.name,
                  description: channelFormData.description,
                }}
                data={{
                  thumbnail_base64: channelFormData.thumbnail_base64 || null,
                  banner_base64: channelFormData.banner_base64 || null,
                }}
                onDataChange={(data) =>
                  updateChannelFormData({
                    thumbnail_base64: data.thumbnail_base64 ?? undefined,
                    banner_base64: data.banner_base64 ?? undefined,
                  })
                }
                onBack={handleChannelCreationBack}
                isLoading={isCreatingChannel}
                error={channelCreationError}
              />
            )}
            {channelCreationStep === 3 && (
              <Step3CategorySelection
                data={{
                  selectedCategory: channelFormData.selectedCategory,
                  selectedSubcategory: channelFormData.selectedSubcategory,
                }}
                onDataChange={(data) => updateChannelFormData(data)}
              />
            )}
          </div>

          <NavigationButtons
            currentStep={channelCreationStep}
            onCancel={handleClose}
            onBack={channelCreationStep > 1 ? handleChannelCreationBack : undefined}
            onNext={channelCreationStep < 3 ? handleChannelCreationNext : undefined}
            onSubmit={channelCreationStep === 3 ? handleChannelCreationSubmit : undefined}
            isLoading={isCreatingChannel}
            canProceed={
              channelCreationStep === 1
                ? channelFormData.name.trim().length >= 2 &&
                  channelFormData.name.trim().length <= 50
                : channelCreationStep === 2
                ? true
                : false
            }
            canSubmit={channelCreationStep === 3 && channelFormData.selectedCategory !== ''}
          />
        </div>
      </BaseModalAdapter>

      {/* 기존 ContentUploadModal (채널 선택 후 열림) */}
      <ContentUploadModal />
    </>
  );
}
