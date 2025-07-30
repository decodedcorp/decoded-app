import { create } from 'zustand';
import { ChannelResponse } from '@/api/generated';

export interface ChannelData {
  id?: string;
  name: string;
  img?: string;
  description: string;
  category: string;
  followers: string;
  contentCount?: number;
  ownerId?: string;
  createdAt?: string;
  updatedAt?: string;
  isSubscribed?: boolean;
}

interface ChannelModalState {
  isOpen: boolean;
  selectedChannel: ChannelData | null;
  selectedChannelId: string | null;
  openModal: (channel: ChannelData) => void;
  openModalById: (channelId: string) => void;
  closeModal: () => void;
}

export const useChannelModalStore = create<ChannelModalState>((set) => ({
  isOpen: false,
  selectedChannel: null,
  selectedChannelId: null,
  openModal: (channel: ChannelData) => {
    set({ isOpen: true, selectedChannel: channel, selectedChannelId: null });
  },
  openModalById: (channelId: string) => {
    set({ isOpen: true, selectedChannel: null, selectedChannelId: channelId });
  },
  closeModal: () => {
    set({ isOpen: false, selectedChannel: null, selectedChannelId: null });
  },
}));

// Selectors for better performance
export const selectIsModalOpen = (state: ChannelModalState) => state.isOpen;
export const selectSelectedChannel = (state: ChannelModalState) => state.selectedChannel;
export const selectSelectedChannelId = (state: ChannelModalState) => state.selectedChannelId;
