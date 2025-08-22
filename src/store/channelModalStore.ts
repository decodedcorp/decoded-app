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
  selectedContentId: string | null; // 클릭한 콘텐츠 ID
  openModal: (channel: ChannelData) => void;
  openModalById: (channelId: string, contentId?: string) => void;
  closeModal: () => void;
}

export const useChannelModalStore = create<ChannelModalState>((set) => ({
  isOpen: false,
  selectedChannel: null,
  selectedChannelId: null,
  selectedContentId: null,
  openModal: (channel: ChannelData) => {
    console.log('🎯 [channelModalStore] openModal called with:', channel);
    set({
      isOpen: true,
      selectedChannel: channel,
      selectedChannelId: channel.id,
      selectedContentId: null,
    });
  },
  openModalById: (channelId: string, contentId?: string) => {
    console.log('🎯 [channelModalStore] openModalById called with:', { channelId, contentId });
    set({
      isOpen: true,
      selectedChannel: null,
      selectedChannelId: channelId,
      selectedContentId: contentId || null,
    });
  },
  closeModal: () => {
    console.log('🎯 [channelModalStore] closeModal called');
    set({ isOpen: false, selectedChannel: null, selectedChannelId: null, selectedContentId: null });

    // URL에서 channel 파라미터 제거
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.delete('channel');
      url.searchParams.delete('content');
      window.history.replaceState({}, '', url.pathname + url.search);
    }
  },
}));

// Selectors for better performance
export const selectIsModalOpen = (state: ChannelModalState) => state.isOpen;
export const selectSelectedChannel = (state: ChannelModalState) => state.selectedChannel;
export const selectSelectedChannelId = (state: ChannelModalState) => state.selectedChannelId;
export const selectSelectedContentId = (state: ChannelModalState) => state.selectedContentId;
