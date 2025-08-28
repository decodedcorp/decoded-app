'use client';

import React, { useEffect } from 'react';

import {
  useGlobalContentUploadStore,
  selectIsGlobalContentUploadModalOpen,
} from '@/store/globalContentUploadStore';
import { useContentUploadStore } from '@/store/contentUploadStore';

import { BaseModal } from '../base/BaseModal';
import { ContentUploadModal } from '../content-upload/ContentUploadModal';

import { GlobalContentUploadHeader } from './GlobalContentUploadHeader';
import { ChannelSelectionStep } from './ChannelSelectionStep';

export function GlobalContentUploadModal() {
  const isOpen = useGlobalContentUploadStore(selectIsGlobalContentUploadModalOpen);
  const closeModal = useGlobalContentUploadStore((state) => state.closeModal);
  const currentStep = useGlobalContentUploadStore((state) => state.currentStep);
  const selectedChannel = useGlobalContentUploadStore((state) => state.selectedChannel);
  const resetSelection = useGlobalContentUploadStore((state) => state.resetSelection);

  // 기존 ContentUploadModal 스토어 액션들
  const openContentUploadModal = useContentUploadStore((state) => state.openModal);
  const isContentUploadModalOpen = useContentUploadStore((state) => state.isOpen);

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
    } else {
      // 콘텐츠 업로드 단계에서는 뒤로가기
      resetSelection();
    }
  };

  const handleBack = () => {
    resetSelection();
  };

  return (
    <>
      {/* 채널 선택 단계 모달 */}
      <BaseModal isOpen={isOpen && currentStep === 'channel-selection'} onClose={handleClose}>
        <div className="bg-zinc-900/95 backdrop-blur-xl border border-zinc-700/50 rounded-2xl w-[600px] max-h-[90vh] overflow-hidden animate-scale-in shadow-2xl flex flex-col">
          <GlobalContentUploadHeader onClose={handleClose} />

          <div className="flex-1 overflow-y-auto p-6">
            <ChannelSelectionStep />
          </div>
        </div>
      </BaseModal>

      {/* 기존 ContentUploadModal (채널 선택 후 열림) */}
      <ContentUploadModal />
    </>
  );
}
