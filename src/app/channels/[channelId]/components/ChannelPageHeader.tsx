'use client';

import React from 'react';

import { ChannelData } from '@/store/channelModalStore';
import { ProxiedImage } from '@/components/ProxiedImage';

interface ChannelPageHeaderProps {
  channel: ChannelData;
  onGoBack: () => void;
  onSearch?: (query: string) => void;
  onSubscribe?: (channelId: string) => void;
  onUnsubscribe?: (channelId: string) => void;
  isSubscribeLoading?: boolean;
  onMobileFiltersToggle?: () => void;
}

export function ChannelPageHeader({
  channel,
  onGoBack,
  onSearch,
  onSubscribe,
  onUnsubscribe,
  isSubscribeLoading = false,
  onMobileFiltersToggle,
}: ChannelPageHeaderProps) {
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('search') as string;
    if (query.trim() && onSearch) {
      onSearch(query.trim());
    }
  };

  return (
    <div className="bg-black border-b border-zinc-700/30">
      <div className="flex items-center justify-between p-6 pl-4">
        {/* Left section */}
        <div className="flex items-center space-x-4">
          {/* Mobile filters button (only visible on mobile) */}
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

          {/* Channel info */}
          <div className="flex items-center space-x-4">
            {channel.thumbnail_url && (
              <ProxiedImage
                src={channel.thumbnail_url}
                alt={`${channel.name} avatar`}
                width={48}
                height={48}
                className="w-12 h-12 rounded-full object-cover border-2 border-zinc-600 flex-shrink-0"
              />
            )}
            <div>
              <h1 className="text-xl font-bold text-gray-400">{channel.name}</h1>
              {channel.description && (
                <p className="text-sm text-gray-500 line-clamp-1">{channel.description}</p>
              )}
            </div>
          </div>
        </div>

        {/* Center section - Search */}
        <div className="flex-1 max-w-md mx-8">
          <form onSubmit={handleSearch} className="w-full">
            <div className="relative">
              <input
                type="text"
                name="search"
                placeholder="Search in this channel..."
                className="w-full px-4 py-2 bg-zinc-800/50 border border-zinc-700/50 rounded-lg text-gray-400 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#eafd66] focus:border-transparent focus:text-white"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 hover:text-[#eafd66] transition-colors"
                aria-label="Search"
              >
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
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

        {/* Right section - Actions */}
        <div className="flex items-center space-x-3">

        </div>
      </div>
    </div>
  );
}