import { ChannelResponse } from '../../../api/generated/models/ChannelResponse';
import { Item } from '../components/masonry/types';

/**
 * API 채널 응답을 Masonry Item 타입으로 변환
 */
export const mapChannelToItem = (channel: ChannelResponse): Item => {
  // 썸네일이 없는 경우 기본 이미지 사용
  const defaultImage = '/images/image-proxy.webp';
  
  return {
    id: channel.id,
    img: channel.thumbnail_url || defaultImage,
    url: `/channels/${channel.id}`,
    title: channel.name,
    category: 'Channel', // 기본 카테고리
    editors: [], // 채널에는 editors 정보가 없으므로 빈 배열
    width: 300, // 기본 너비
    height: 200, // 기본 높이
    aspectRatio: 0.67, // 기본 종횡비
  };
};

/**
 * 채널 리스트를 Item 배열로 변환
 */
export const mapChannelsToItems = (channels: ChannelResponse[]): Item[] => {
  return channels.map(mapChannelToItem);
};
