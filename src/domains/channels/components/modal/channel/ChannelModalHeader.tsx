'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

import { ChannelData } from '@/store/channelModalStore';
import { ProxiedImage } from '@/components/ProxiedImage';
import { useContentUploadStore } from '@/store/contentUploadStore';

interface ChannelModalHeaderProps {
  channel: ChannelData;
  onClose: () => void;
  onSearch?: (query: string) => void;
  onSubscribe?: (channelId: string) => void;
  onUnsubscribe?: (channelId: string) => void;
  isSubscribeLoading?: boolean;
}

export function ChannelModalHeader({
  channel,
  onClose,
  onSearch,
  onSubscribe,
  onUnsubscribe,
  isSubscribeLoading = false,
}: ChannelModalHeaderProps) {
  const router = useRouter();
  const openContentUploadModal = useContentUploadStore((state) => state.openModal);

  const handleFullscreen = () => {
    router.push(`/channels/${channel.id}`);
  };

  const handleAddContent = () => {
    if (channel.id) {
      openContentUploadModal(channel.id);
    }
  };

  return (
    <div>
      {/* 상단 배너 섹션 */}
      <div className="h-32 bg-zinc-800 relative overflow-hidden">
        {/* 채널 썸네일을 배경으로 사용 (있는 경우) */}
        {channel.thumbnail_url && (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center opacity-20"
              style={{ backgroundImage: `url(${channel.thumbnail_url})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-800/80 to-zinc-700/80" />
          </>
        )}
        
        {/* 상단 우측 버튼들 */}
        <div className="absolute top-4 right-4 flex items-center space-x-3">
          {/* Fullscreen button */}
          <button
            onClick={handleFullscreen}
            className="p-2 rounded-full bg-zinc-800/70 hover:bg-zinc-700/70 transition-colors backdrop-blur-sm"
            aria-label="Open in fullscreen"
            title="전체화면으로 보기"
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
              <path
                d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Close button */}
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-zinc-800/70 hover:bg-zinc-700/70 transition-colors backdrop-blur-sm"
            aria-label="Close modal"
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* 하단 정보 섹션 */}
      <div className="bg-zinc-900/95 backdrop-blur-sm px-4 py-4">
        <div className="flex items-center justify-between">
          {/* 왼쪽: 아바타 + 채널 정보 */}
          <div className="flex items-center">
            {/* 큰 아바타 - 배너에서 튀어나오게 */}
            <div className="relative">
              {channel.thumbnail_url && (
                <ProxiedImage
                  src={channel.thumbnail_url}
                  alt={`${channel.name} avatar`}
                  width={80}
                  height={80}
                  className="w-20 h-20 rounded-full object-cover border-4 border-black -mt-10 bg-black"
                />
              )}
            </div>

            {/* 채널 정보 */}
            <div>
              <h1 className="text-2xl font-bold text-white">{channel.name}</h1>
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
          </div>
        </div>
      </div>
    </div>
  );
}
