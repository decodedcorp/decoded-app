import { create } from 'zustand';

export interface ChannelData {
  name: string;
  img?: string;
  description: string;
  category: string;
  followers: string;
}

interface ChannelModalState {
  isOpen: boolean;
  selectedChannel: ChannelData | null;
  openModal: (channel: ChannelData) => void;
  closeModal: () => void;
}

export const useChannelModalStore = create<ChannelModalState>((set) => ({
  isOpen: false,
  selectedChannel: null,
  openModal: (channel: ChannelData) => {
    set({ isOpen: true, selectedChannel: channel });
  },
  closeModal: () => {
    set({ isOpen: false, selectedChannel: null });
  },
}));

// Selectors for better performance
export const selectIsModalOpen = (state: ChannelModalState) => state.isOpen;
export const selectSelectedChannel = (state: ChannelModalState) => state.selectedChannel;
