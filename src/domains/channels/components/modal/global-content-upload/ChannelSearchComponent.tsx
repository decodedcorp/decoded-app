'use client';

import React, { useState, useCallback } from 'react';

interface ChannelSearchComponentProps {
  onSearch: (query: string) => void;
  channels: any[];
  isLoading: boolean;
  error: any;
  onChannelSelect: (channel: any) => void;
}

export function ChannelSearchComponent({
  onSearch,
  channels,
  isLoading,
  error,
  onChannelSelect,
}: ChannelSearchComponentProps) {
  const [query, setQuery] = useState('');

  // 검색 입력 핸들러
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setQuery(value);
      onSearch(value);
    },
    [onSearch],
  );

  return (
    <div className="space-y-4">
      {/* 검색 입력 */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search channels..."
          value={query}
          onChange={handleInputChange}
          className="w-full px-4 py-3 bg-zinc-800 border border-zinc-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#eafd66] transition-colors"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-[#eafd66] border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {/* 검색 결과 */}
      {query.trim().length >= 2 && (
        <div className="space-y-2">
          {isLoading ? (
            <div className="text-center py-4">
              <div className="text-gray-400">Searching channels...</div>
            </div>
          ) : error ? (
            <div className="text-center py-4">
              <div className="text-red-400">Failed to search channels</div>
            </div>
          ) : channels.length > 0 ? (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {channels.map((channel) => (
                <div
                  key={channel.id}
                  onClick={() => onChannelSelect(channel)}
                  className="p-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg cursor-pointer transition-colors flex items-center gap-3"
                >
                  {channel.thumbnail_url ? (
                    <img
                      src={channel.thumbnail_url}
                      alt={channel.name}
                      className="w-8 h-8 rounded-full flex-shrink-0"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-zinc-600 rounded-full flex-shrink-0"></div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-medium truncate">{channel.name}</div>
                    {channel.description && (
                      <div className="text-gray-400 text-sm truncate">{channel.description}</div>
                    )}
                  </div>
                  {channel.subscriber_count && (
                    <div className="text-gray-500 text-sm">
                      {channel.subscriber_count > 1000
                        ? `${(channel.subscriber_count / 1000).toFixed(1)}k`
                        : channel.subscriber_count}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="text-gray-400 mb-3">No channels found</div>
              <button
                onClick={() => {
                  // 부모 컴포넌트에서 새 채널 생성 모달 열기
                  const event = new CustomEvent('create-new-channel');
                  window.dispatchEvent(event);
                }}
                className="px-4 py-2 bg-[#eafd66] text-black font-medium rounded-lg hover:bg-[#d4e755] transition-colors"
              >
                Create New Channel
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
