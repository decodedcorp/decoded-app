import React from 'react';
import { useRouter } from 'next/navigation';

import { ChannelData } from '@/store/channelModalStore';
import { ProxiedImage } from '@/components/ProxiedImage';

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

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('search') as string;
    if (query.trim() && onSearch) {
      onSearch(query.trim());
    }
  };

  const handleFullscreen = () => {
    router.push(`/channels/${channel.id}`);
  };

  return (
    <div className="flex items-start justify-between p-6 border-b border-zinc-700/50">
      <div className="flex items-start space-x-6 flex-1">
        {channel.thumbnail_url && (
          <ProxiedImage
            src={channel.thumbnail_url}
            alt={`${channel.name} avatar`}
            width={80}
            height={80}
            className="w-20 h-20 rounded-full object-cover border-2 border-zinc-600 flex-shrink-0"
          />
        )}

        {/* 검색바만 남김 */}
        <div className="flex-1 min-w-0">
          <form onSubmit={handleSearch} className="max-w-md">
            <div className="relative">
              <input
                type="text"
                name="search"
                placeholder="Search in this channel..."
                className="w-full px-4 py-2 bg-zinc-800/50 border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-zinc-400 hover:text-white transition-colors"
                aria-label="Search"
              >
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                  <path
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="flex items-center space-x-4 flex-shrink-0 ml-4">
        {/* Fullscreen button */}
        <button
          onClick={handleFullscreen}
          className="p-3 rounded-full bg-zinc-800/50 hover:bg-zinc-700/50 transition-colors"
          aria-label="Open in fullscreen"
          title="전체화면으로 보기"
        >
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
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
          className="p-3 rounded-full bg-zinc-800/50 hover:bg-zinc-700/50 transition-colors"
          aria-label="Close modal"
        >
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
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
  );
}
