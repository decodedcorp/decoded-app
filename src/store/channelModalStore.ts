import { create } from 'zustand';

export interface ChannelData {
  id: string;
  name: string;
  description?: string | null;
  owner_id: string;
  thumbnail_url?: string | null;
  subscriber_count?: number;
  content_count?: number;
  created_at?: string;
  updated_at?: string | null;
  is_subscribed?: boolean;
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
    set({ isOpen: true, selectedChannel: channel, selectedChannelId: channel.id });
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
