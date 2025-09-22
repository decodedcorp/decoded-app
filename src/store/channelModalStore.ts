import { create } from 'zustand';
import type { UserProfileResponse } from '@/api/generated/models/UserProfileResponse';
import type { ChannelUserProfile } from '@/api/generated/models/ChannelUserProfile';

export interface ChannelData {
  id: string;
  name: string;
  description?: string | null;
  owner_id: string;
  managers?: UserProfileResponse[] | ChannelUserProfile[];
  manager_ids?: string[];
  thumbnail_url?: string | null;
  banner_url?: string | null;
  subscriber_count?: number;
  content_count?: number;
  created_at?: string;
  updated_at?: string | null;
  is_subscribed?: boolean;
  is_owner?: boolean;
  is_manager?: boolean;
  category?: string | null;
  subcategory?: string | null;
}

interface ChannelModalState {
  isOpen: boolean;
  selectedChannel: ChannelData | null;
  selectedChannelId: string | null;
  selectedContentId: string | null; // 클릭한 콘텐츠 ID
  channelOwnerId: string | null; // 채널 작성자 ID
  channelCreatedAt: string | null; // 채널 작성시간
  openModal: (channel: ChannelData) => void;
  openModalById: (channelId: string, contentId?: string) => void;
  closeModal: () => void;
}

export const useChannelModalStore = create<ChannelModalState>((set) => ({
  isOpen: false,
  selectedChannel: null,
  selectedChannelId: null,
  selectedContentId: null,
  channelOwnerId: null,
  channelCreatedAt: null,
  openModal: (channel: ChannelData) => {
    console.log('🎯 [channelModalStore] openModal called with:', {
      id: channel.id,
      name: channel.name,
      owner_id: channel.owner_id,
      created_at: channel.created_at,
      fullChannel: channel,
    });

    const newState = {
      isOpen: true,
      selectedChannel: channel,
      selectedChannelId: channel.id,
      selectedContentId: null,
      channelOwnerId: channel.owner_id,
      channelCreatedAt: channel.created_at || null,
    };

    console.log('🎯 [channelModalStore] Setting state:', {
      channelOwnerId: newState.channelOwnerId,
      channelCreatedAt: newState.channelCreatedAt,
      fullState: newState,
    });

    set(newState);
  },
  openModalById: (channelId: string, contentId?: string) => {
    console.log('🎯 [channelModalStore] openModalById called with:', { channelId, contentId });
    set({
      isOpen: true,
      selectedChannel: null,
      selectedChannelId: channelId,
      selectedContentId: contentId || null,
      channelOwnerId: null, // ID로 열 때는 나중에 API에서 가져옴
      channelCreatedAt: null,
    });
  },
  closeModal: () => {
    console.log('🎯 [channelModalStore] closeModal called');
    set({
      isOpen: false,
      selectedChannel: null,
      selectedChannelId: null,
      selectedContentId: null,
      channelOwnerId: null,
      channelCreatedAt: null,
    });

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
export const selectChannelOwnerId = (state: ChannelModalState) => state.channelOwnerId;
export const selectChannelCreatedAt = (state: ChannelModalState) => state.channelCreatedAt;
