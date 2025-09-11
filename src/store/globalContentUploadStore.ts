import { create } from 'zustand';
import type { ChannelResponse } from '@/api/generated';

export interface ChannelData {
  id: string;
  name: string;
  description?: string;
  thumbnail_url?: string;
  subscriber_count?: number;
}

export interface AddChannelFormData {
  name: string;
  description: string;
  thumbnail_base64?: string;
  banner_base64?: string;
  selectedCategory: string;
  selectedSubcategory: string;
}

interface GlobalContentUploadState {
  isOpen: boolean;
  selectedChannel: ChannelData | null;
  currentStep: 'channel-selection' | 'channel-creation' | 'content-upload';
  
  // Channel creation state
  channelCreationStep: number;
  channelFormData: AddChannelFormData;
  isCreatingChannel: boolean;
  channelCreationError: string | null;
  
  // Actions
  openModal: () => void;
  closeModal: () => void;
  selectChannel: (channel: ChannelData) => void;
  resetSelection: () => void;
  setCurrentStep: (step: 'channel-selection' | 'channel-creation' | 'content-upload') => void;
  
  // Channel creation actions
  startChannelCreation: () => void;
  setChannelCreationStep: (step: number) => void;
  updateChannelFormData: (data: Partial<AddChannelFormData>) => void;
  setChannelCreationLoading: (loading: boolean) => void;
  setChannelCreationError: (error: string | null) => void;
  resetChannelCreation: () => void;
}

const initialChannelFormData: AddChannelFormData = {
  name: '',
  description: '',
  thumbnail_base64: undefined,
  banner_base64: undefined,
  selectedCategory: '',
  selectedSubcategory: '',
};

export const useGlobalContentUploadStore = create<GlobalContentUploadState>((set) => ({
  isOpen: false,
  selectedChannel: null,
  currentStep: 'channel-selection',
  
  // Channel creation state
  channelCreationStep: 1,
  channelFormData: initialChannelFormData,
  isCreatingChannel: false,
  channelCreationError: null,

  openModal: () => {
    set({
      isOpen: true,
      selectedChannel: null,
      currentStep: 'channel-selection',
      // Reset channel creation state
      channelCreationStep: 1,
      channelFormData: initialChannelFormData,
      isCreatingChannel: false,
      channelCreationError: null,
    });
  },

  closeModal: () => {
    set({
      isOpen: false,
      selectedChannel: null,
      currentStep: 'channel-selection',
      // Reset channel creation state
      channelCreationStep: 1,
      channelFormData: initialChannelFormData,
      isCreatingChannel: false,
      channelCreationError: null,
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
      // Reset channel creation state when going back
      channelCreationStep: 1,
      channelFormData: initialChannelFormData,
      isCreatingChannel: false,
      channelCreationError: null,
    });
  },

  setCurrentStep: (step) => {
    set({ currentStep: step });
  },
  
  // Channel creation actions
  startChannelCreation: () => {
    set({
      currentStep: 'channel-creation',
      channelCreationStep: 1,
      channelFormData: initialChannelFormData,
      isCreatingChannel: false,
      channelCreationError: null,
    });
  },
  
  setChannelCreationStep: (step) => {
    set({ channelCreationStep: step });
  },
  
  updateChannelFormData: (data) => {
    set((state) => ({
      channelFormData: { ...state.channelFormData, ...data },
      channelCreationError: null,
    }));
  },
  
  setChannelCreationLoading: (loading) => {
    set({ isCreatingChannel: loading });
  },
  
  setChannelCreationError: (error) => {
    set({ channelCreationError: error, isCreatingChannel: false });
  },
  
  resetChannelCreation: () => {
    set({
      channelCreationStep: 1,
      channelFormData: initialChannelFormData,
      isCreatingChannel: false,
      channelCreationError: null,
    });
  },
}));

// Selectors for better performance
export const selectIsGlobalContentUploadModalOpen = (state: GlobalContentUploadState) => state.isOpen;
export const selectGlobalContentUploadSelectedChannel = (state: GlobalContentUploadState) => state.selectedChannel;
export const selectGlobalContentUploadCurrentStep = (state: GlobalContentUploadState) => state.currentStep;

// Channel creation selectors
export const selectChannelCreationStep = (state: GlobalContentUploadState) => state.channelCreationStep;
export const selectChannelFormData = (state: GlobalContentUploadState) => state.channelFormData;
export const selectIsCreatingChannel = (state: GlobalContentUploadState) => state.isCreatingChannel;
export const selectChannelCreationError = (state: GlobalContentUploadState) => state.channelCreationError;
