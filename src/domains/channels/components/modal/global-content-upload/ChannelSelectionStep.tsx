'use client';

import React, { useState, useCallback } from 'react';

import { useSearchChannels } from '@/domains/search/hooks/useSearch';
import { useGlobalContentUploadStore } from '@/store/globalContentUploadStore';
import { useCommonTranslation } from '@/lib/i18n/centralizedHooks';

import { ChannelSearchComponent } from './ChannelSearchComponent';
import { RecentChannelsList } from './RecentChannelsList';

export function ChannelSelectionStep() {
  const t = useCommonTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const selectChannel = useGlobalContentUploadStore((state) => state.selectChannel);
  const startChannelCreation = useGlobalContentUploadStore((state) => state.startChannelCreation);

  // 채널 검색 결과
  const {
    data: searchData,
    isLoading: isSearchLoading,
    error: searchError,
  } = useSearchChannels({
    query: searchQuery,
    limit: 10,
    enabled: searchQuery.trim().length >= 2,
    debounceMs: 300,
  });

  const channels = searchData?.channels || [];

  // 채널 선택 핸들러
  const handleChannelSelect = useCallback(
    (channel: any) => {
      console.log('Channel selected:', channel);
      selectChannel(channel);
    },
    [selectChannel],
  );

  // 새 채널 생성 핸들러
  const handleCreateNewChannel = useCallback(() => {
    startChannelCreation();
  }, [startChannelCreation]);

  // 검색 컴포넌트에서 새 채널 생성 이벤트 감지
  React.useEffect(() => {
    const handleCreateNewChannelEvent = () => {
      startChannelCreation();
    };

    window.addEventListener('create-new-channel', handleCreateNewChannelEvent);
    return () => {
      window.removeEventListener('create-new-channel', handleCreateNewChannelEvent);
    };
  }, [startChannelCreation]);

  // 검색 핸들러
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  return (
    <div className="h-full flex flex-col">
      {/* 스크롤 가능한 콘텐츠 영역 */}
      <div className="flex-1 overflow-y-auto space-y-6 min-h-0">
        {/* 헤더 */}
        <div className="text-center">
          <h3 className="text-xl font-semibold text-white mb-2">
            {t.globalContentUpload.channelSelection.title()}
          </h3>
          <p className="text-gray-400 text-sm">
            {t.globalContentUpload.channelSelection.subtitle()}
          </p>
        </div>

        {/* 채널 검색 */}
        <ChannelSearchComponent
          onSearch={handleSearch}
          channels={channels}
          isLoading={isSearchLoading}
          error={searchError}
          onChannelSelect={handleChannelSelect}
        />

        {/* 최근 사용 채널 목록 */}
        <RecentChannelsList onChannelSelect={handleChannelSelect} />
      </div>

      {/* 하단 고정 새 채널 생성 버튼 */}
      <div className="flex-shrink-0 pt-4 border-t border-zinc-700">
        <button
          onClick={handleCreateNewChannel}
          className="w-full p-4 bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 rounded-lg transition-colors flex items-center justify-center gap-3 text-white"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          {t.globalContentUpload.channelSelection.createNewChannel()}
        </button>
      </div>
    </div>
  );
}
