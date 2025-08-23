'use client';

import React, { useState } from 'react';

import { ChannelData } from '@/store/channelModalStore';
import { useContentUploadStore } from '@/store/contentUploadStore';
import { toast } from 'react-hot-toast';

import { useChannelBanner } from '@/domains/channels/hooks/useChannelBanner';
import { useUpdateChannelThumbnail } from '@/domains/channels/hooks/useChannels';
import { EditableImage } from '@/domains/channels/components/modal/channel/EditableImage';
import { useUser } from '@/domains/auth/hooks/useAuth';

interface ChannelPageHeaderProps {
  channel: ChannelData;
  onGoBack: () => void;
  onSubscribe?: (channelId: string) => void;
  onUnsubscribe?: (channelId: string) => void;
  isSubscribeLoading?: boolean;
  onMobileFiltersToggle?: () => void;
}

export function ChannelPageHeader({
  channel,
  onGoBack,
  onSubscribe,
  onUnsubscribe,
  isSubscribeLoading = false,
  onMobileFiltersToggle,
}: ChannelPageHeaderProps) {
  const openContentUploadModal = useContentUploadStore((state) => state.openModal);
  const [isBannerHovered, setIsBannerHovered] = useState(false);

  // 현재 사용자 정보
  const { user } = useUser();

  // 배너 업데이트 hook
  const { updateBanner, isUpdating } = useChannelBanner({
    channelId: channel.id,
    onSuccess: () => {
      console.log('Banner update successful');
      // 배너 업데이트 성공 시 처리
    },
    onError: (error) => {
      console.error('Banner update failed:', error);
    },
  });

  // 썸네일 업데이트 hook
  const updateThumbnailMutation = useUpdateChannelThumbnail();

  const handleAddContent = () => {
    if (channel.id) {
      openContentUploadModal(channel.id);
    }
  };

  const handleFollow = () => {
    toast('Follow feature coming soon!', {
      icon: 'ℹ️',
      duration: 2000,
    });
  };

  const handleBannerChange = (base64: string) => {
    console.log('handleBannerChange called with base64 length:', base64.length);
    updateBanner(base64);
  };

  const handleThumbnailUpdate = async (base64: string) => {
    if (!channel.id || !isOwner) return;

    try {
      await updateThumbnailMutation.mutateAsync({
        channelId: channel.id,
        data: { thumbnail_base64: base64 },
      });
    } catch (error) {
      console.error('Failed to update thumbnail:', error);
    }
  };

  // 소유자 권한 확인
  const isOwner = user?.doc_id && channel.owner_id && user.doc_id === channel.owner_id;
  const canEditBanner = isOwner; // 소유자만 배너 편집 가능
  const canEditThumbnail = isOwner;

  // 디버깅용 로그 (개발 완료 후 제거 가능)
  // console.log('ChannelPageHeader Debug:', {
  //   userId: user?.doc_id,
  //   channelOwnerId: channel.owner_id,
  //   isOwner,
  //   canEditBanner,
  //   canEditThumbnail,
  //   channel: channel,
  // });
  return (
    <div>
      {/* 상단 배너 섹션 */}
      <div className="h-48 bg-zinc-800 relative overflow-hidden">
        {/* Banner Image - EditableImage 사용 */}
        <EditableImage
          src={channel.banner_url || channel.thumbnail_url}
          alt={`${channel.name} banner`}
          width={1200}
          height={192}
          className="w-full h-full"
          type="banner"
          isOwner={!!canEditBanner}
          onImageUpdate={handleBannerChange}
          isUploading={isUpdating}
          onHoverChange={setIsBannerHovered}
        />

        {/* 디버깅용 배너 상태 표시 */}
        <div className="absolute top-2 right-2 bg-black/70 text-white text-xs p-2 rounded">
          canEdit: {canEditBanner ? 'true' : 'false'}, hover: {isBannerHovered ? 'true' : 'false'}
        </div>

        {/* 그라디언트 오버레이 - hover 상태일 때는 숨김 */}
        {!isBannerHovered && (
          <>
            {/* 위쪽 그라디언트 (텍스트 가독성용) */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent pointer-events-none" />
            {/* 아래쪽 그라디언트 (기존) */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
          </>
        )}

        {/* Banner Edit Button - EditableImage에서 처리하므로 제거 */}
      </div>

      {/* 하단 정보 섹션 */}
      <div className="bg-black px-4 py-4">
        <div className="flex items-center justify-between">
          {/* 왼쪽: 아바타 + 채널 정보 */}
          <div className="flex items-center">
            {/* Mobile filters button */}
            {onMobileFiltersToggle && (
              <button
                onClick={onMobileFiltersToggle}
                className="md:hidden p-2 rounded-lg bg-zinc-800/50 hover:bg-zinc-700/50 transition-colors"
                aria-label="Toggle filters"
              >
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                  <path
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}

            {/* 편집 가능한 큰 아바타 - 배너에서 튀어나오게 */}
            <div className="relative -mt-16">
              <EditableImage
                src={channel.thumbnail_url}
                alt={`${channel.name} avatar`}
                width={80}
                height={80}
                className="w-20 h-20 rounded-full border-4 border-black bg-black"
                type="thumbnail"
                isOwner={canEditThumbnail || false}
                onImageUpdate={handleThumbnailUpdate}
                isUploading={updateThumbnailMutation.isPending}
              />
            </div>

            {/* 채널 정보 */}
            <div>
              <h2 className="text-xl font-semibold text-zinc-300">{channel.name}</h2>
              <div className="flex items-center space-x-4 text-sm text-zinc-400 mt-1">
                <span>{channel.subscriber_count || 0} followers</span>
                <span>•</span>
                <span>{channel.content_count || 0} editors</span>
              </div>
            </div>
          </div>

          {/* 오른쪽: 액션 버튼들 */}
          <div className="flex items-center space-x-3">
            <button
              onClick={handleAddContent}
              className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-full text-white font-medium transition-colors"
            >
              + Add Content
            </button>
            <button
              onClick={handleFollow}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-full text-white transition-colors"
            >
              Follow
            </button>
            <button className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-full text-white transition-colors">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                <path
                  d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zM12 13a1 1 0 110-2 1 1 0 010 2zM12 20a1 1 0 110-2 1 1 0 010 2z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Banner Edit Modal - EditableImage에서 처리하므로 제거 */}
    </div>
  );
}
