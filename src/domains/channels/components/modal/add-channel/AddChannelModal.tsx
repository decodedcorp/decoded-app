'use client';

import React from 'react';

import {
  useAddChannelStore,
  selectIsAddChannelModalOpen,
  selectAddChannelLoading,
  selectAddChannelFormData,
} from '@/store/addChannelStore';
import { useCreateChannel } from '@/domains/channels/hooks/useChannels';
import { useChannelModalStore } from '@/store/channelModalStore';

import { BaseModal } from '../base/BaseModal';

import { AddChannelHeader } from './AddChannelHeader';
import { AddChannelForm } from './AddChannelForm';
import { AddChannelFooter } from './AddChannelFooter';

export function AddChannelModal() {
  const isOpen = useAddChannelStore(selectIsAddChannelModalOpen);
  const isLoading = useAddChannelStore(selectAddChannelLoading);
  const formData = useAddChannelStore(selectAddChannelFormData);
  const closeModal = useAddChannelStore((state) => state.closeModal);
  const setLoading = useAddChannelStore((state) => state.setLoading);
  const setError = useAddChannelStore((state) => state.setError);

  const createChannelMutation = useCreateChannel();
  const openChannelModal = useChannelModalStore((state) => state.openModal);

  // Get mutation status for better UX
  const isCreating = createChannelMutation.isPending;
  const createError = createChannelMutation.error;
  const isSuccess = createChannelMutation.isSuccess;

  const canSubmit = formData.name.trim().length >= 2 && formData.name.trim().length <= 50;

  const handleSubmit = async (data?: {
    name: string;
    description: string | null;
    thumbnail_base64?: string;
  }) => {
    // data가 제공되지 않으면 formData에서 가져오기
    const inputData = data || {
      name: formData.name.trim(),
      description: formData.description.trim() || null,
      thumbnail_base64: formData.thumbnail_base64,
    };

    const requestData = {
      name: inputData.name,
      description: inputData.description || null,
      thumbnail_base64: inputData.thumbnail_base64 || null,
    };

    try {
      const response = await createChannelMutation.mutateAsync(requestData);

      // Close the add channel modal
      closeModal();

      // Open the newly created channel modal
      const channelData = {
        id: response.id,
        name: response.name,
        description: response.description || `${response.name} 채널입니다.`,
        owner_id: response.owner_id || 'current-user',
        thumbnail_url: response.thumbnail_url || null,
        subscriber_count: 0,
        content_count: 0,
        created_at: response.created_at || new Date().toISOString(),
        is_subscribed: false,
      };

      openChannelModal(channelData);
    } catch (error: any) {
      // Handle different types of errors
      let errorMessage = 'Failed to create channel. Please try again.';

      if (error?.response?.status === 500) {
        errorMessage = '서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
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

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={closeModal}
      overlayClassName="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
      contentClassName="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
    >
      <div className="bg-zinc-900/95 backdrop-blur-xl border border-zinc-700/50 rounded-2xl w-[1200px] max-h-[90vh] overflow-hidden animate-scale-in shadow-2xl flex flex-col">
        <AddChannelHeader onClose={closeModal} />

        <div className="flex-1 overflow-y-auto">
          <AddChannelForm
            onSubmit={handleSubmit}
            isLoading={isCreating}
            error={
              createError
                ? (createError as any)?.response?.data?.detail || createError.message
                : null
            }
          />
        </div>

        <AddChannelFooter
          onCancel={handleCancel}
          onCreate={() => handleSubmit()}
          isLoading={isCreating}
          canSubmit={canSubmit}
        />
      </div>
    </BaseModal>
  );
}
