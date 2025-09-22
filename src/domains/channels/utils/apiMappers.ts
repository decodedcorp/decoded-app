import { ChannelResponse } from '@/api/generated';
// import { formatDateByContext } from '@/lib/utils/dateUtils'; // 유틸리티 함수에서는 훅 사용 불가

import { MasonryItem, Editor } from '../types/masonry';

/**
 * ChannelResponse를 MasonryItem으로 변환하는 함수
 * 기존 디자인과 레이아웃을 유지하기 위해 필요한 필드들을 매핑
 */
export const mapChannelToMasonryItem = (channel: ChannelResponse): MasonryItem => {
  // 생성일로부터 7일 이내면 isNew로 표시
  const createdAt = channel.created_at ? new Date(channel.created_at) : new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const isNew = createdAt > sevenDaysAgo;

  // 구독자 수가 1000명 이상이면 isHot으로 표시
  const isHot = (channel.subscriber_count || 0) >= 1000;

  return {
    title: channel.name,
    imageUrl: channel.thumbnail_url || undefined,
    category: 'default', // TODO: API에서 카테고리 정보 추가 필요
    editors: [], // TODO: 채널별 기여자 API 추가 필요
    date: channel.created_at || new Date().toISOString(), // 날짜 포맷팅은 컴포넌트에서 처리
    isNew,
    isHot,
    channelId: channel.id, // 실제 채널 ID 추가
    // status: 'approved', // 기본값은 approved, API에서 status 필드가 추가되면 수정 필요
  };
};

/**
 * 여러 ChannelResponse를 MasonryItem 배열로 변환하는 함수
 */
export const mapChannelsToMasonryItems = (channels: ChannelResponse[]): MasonryItem[] => {
  return channels.map(mapChannelToMasonryItem);
};

/**
 * UserListResponse를 Editor로 변환하는 함수 (향후 사용)
 */
export const mapUserToEditor = (user: any): Editor => {
  return {
    name: user.email?.split('@')[0] || user.id,
    avatarUrl: undefined, // TODO: API에서 아바타 정보 추가 필요
  };
};

/**
 * 여러 사용자를 Editor 배열로 변환하는 함수 (향후 사용)
 */
export const mapUsersToEditors = (users: any[]): Editor[] => {
  return users.map(mapUserToEditor);
};
