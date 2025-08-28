import { create } from 'zustand';

import type { ChannelResponse } from '@/api/generated';

export interface ChannelData {
  id: string;
  name: string;
  description?: string;
  thumbnail_url?: string;
  subscriber_count?: number;
}

interface GlobalContentUploadState {
  isOpen: boolean;
  selectedChannel: ChannelData | null;
  currentStep: 'channel-selection' | 'content-upload';
  
  // Actions
  openModal: () => void;
  closeModal: () => void;
  selectChannel: (channel: ChannelData) => void;
  resetSelection: () => void;
  setCurrentStep: (step: 'channel-selection' | 'content-upload') => void;
}

export const useGlobalContentUploadStore = create<GlobalContentUploadState>((set) => ({
  isOpen: false,
  selectedChannel: null,
  currentStep: 'channel-selection',

  openModal: () => {
    set({
      isOpen: true,
      selectedChannel: null,
      currentStep: 'channel-selection',
    });
  },

  closeModal: () => {
    set({
      isOpen: false,
      selectedChannel: null,
      currentStep: 'channel-selection',
    });
  },

  selectChannel: (channel: ChannelData) => {
    set({
      selectedChannel: channel,
      currentStep: 'content-upload',
    });
  },

  resetSelection: () => {
    set({
      selectedChannel: null,
      currentStep: 'channel-selection',
    });
  },

  setCurrentStep: (step) => {
    set({ currentStep: step });
  },
}));

// Selectors for better performance
export const selectIsGlobalContentUploadModalOpen = (state: GlobalContentUploadState) => state.isOpen;
export const selectGlobalContentUploadSelectedChannel = (state: GlobalContentUploadState) => state.selectedChannel;
export const selectGlobalContentUploadCurrentStep = (state: GlobalContentUploadState) => state.currentStep;
