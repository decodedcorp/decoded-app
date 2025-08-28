'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

import { ChannelData } from '@/store/channelModalStore';
import { ProxiedImage } from '@/components/ProxiedImage';
import { useChannelModalStore } from '@/store/channelModalStore';

interface DiscoverSectionProps {
  channels: ChannelData[];
  className?: string;
  onChannelClick?: (channel: ChannelData) => void;
}

export function DiscoverSection({ channels, className = '', onChannelClick }: DiscoverSectionProps) {
  const router = useRouter();
  const openChannelModal = useChannelModalStore((state) => state.openModal);

  const handleChannelClick = (channel: ChannelData) => {
    if (onChannelClick) {
      onChannelClick(channel);
    } else {
      openChannelModal(channel);
    }
  };

  if (!channels.length) {
    return null;
  }

  return (
    <section className={`${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-400 mb-2">Discover Channels</h2>
          <p className="text-zinc-500 text-sm mt-1">Popular channels you might like</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {channels.slice(0, 8).map((channel: ChannelData) => (
          <div
            key={channel.id}
            onClick={() => handleChannelClick(channel)}
            className="group bg-zinc-900/50 rounded-xl p-6 hover:bg-zinc-800/50 transition-all duration-200 cursor-pointer border border-zinc-800 hover:border-zinc-600 flex flex-col h-full"
          >
            {/* Channel Thumbnail */}
            <div className="flex items-center mb-4">
              {channel.thumbnail_url ? (
                <ProxiedImage
                  src={channel.thumbnail_url}
                  alt={`${channel.name} thumbnail`}
                  width={56}
                  height={56}
                  className="w-14 h-14 rounded-full object-cover flex-shrink-0 group-hover:scale-105 transition-transform duration-200"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-semibold text-xl">
                    {channel.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div className="ml-4 flex-1 min-w-0">
                <h3 className="font-semibold text-white group-hover:text-blue-300 transition-colors duration-200 truncate">
                  {channel.name}
                </h3>
              </div>
            </div>

            {/* Channel Metadata - separate row for consistency */}
            <div className="flex items-center space-x-3 text-sm text-zinc-400 mb-4">
              <span>{channel.subscriber_count || 0} followers</span>
              <span>•</span>
              <span>{channel.managers?.length || 0} editors</span>
            </div>

            {/* Channel Description - flexible height */}
            <div className="flex-grow mb-4">
              {channel.description && (
                <p className="text-sm text-zinc-500 group-hover:text-zinc-400 transition-colors duration-200 line-clamp-2">
                  {channel.description}
                </p>
              )}
            </div>

            {/* Channel Stats - always at bottom */}
            <div className="flex items-center justify-between text-xs text-zinc-500 mt-auto">
              <span className="flex items-center">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                {channel.content_count || 0} contents
              </span>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Show More Button */}
      <div className="text-center mt-8">
        <button
          onClick={() => router.push('/channels')}
          className="px-8 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-medium transition-colors duration-200 inline-flex items-center space-x-2"
        >
          <span>View All Channels</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </section>
  );
}