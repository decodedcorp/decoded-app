'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from '@/lib/hooks/useLocale';
import { ChannelCard } from '@/domains/channels/components/explore/ChannelCard';
import { useSearchChannels } from '@/domains/search/hooks/useSearch';

interface ChannelSearchResultsProps {
  query: string;
}

export function ChannelSearchResults({ query }: ChannelSearchResultsProps) {
  const router = useRouter();
  const { t } = useLocale();

  // 실제 검색 API 사용
  const {
    data: searchData,
    isLoading,
    error,
    isFetching,
  } = useSearchChannels({
    query,
    limit: 20,
    enabled: query.trim().length >= 2,
    debounceMs: 300,
  });

  // 디버깅: API 응답 확인
  React.useEffect(() => {
    console.log('🔍 [ChannelSearchResults] Search API response:', {
      query,
      searchData,
      isLoading,
      error,
      hasChannels: searchData?.channels?.length || 0,
      // 전체 응답 구조 확인
      fullResponse: searchData,
      channelsData: searchData?.channels,
      channelsType: typeof searchData?.channels,
      channelsLength: searchData?.channels?.length,
    });
  }, [query, searchData, isLoading, error]);

  const channels = searchData?.channels || [];

  // 디버깅: 채널 데이터 확인
  React.useEffect(() => {
    console.log('🔍 [ChannelSearchResults] Channels data:', {
      totalCount: channels.length,
      channels,
      apiDataCount: channels.length,
    });
  }, [channels]);

  const handleChannelClick = (channelId: string) => {
    router.push(`/channels/${channelId}`);
  };

  if (isLoading && !channels.length) {
    return (
      <div className="text-center py-16">
        <div className="text-zinc-400">
          <div className="animate-spin w-16 h-16 border-4 border-zinc-600 border-t-blue-500 rounded-full mx-auto mb-6" />
          <h3 className="text-xl font-semibold text-white mb-3">{t('search.searchingChannels')}</h3>
          <p className="text-zinc-500 text-lg">{t('search.lookingForChannels', { query })}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="text-red-400">
          <div className="w-20 h-20 mx-auto mb-6 bg-red-900/20 rounded-full flex items-center justify-center border border-red-700/30">
            <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-3">{t('search.searchError')}</h3>
          <p className="text-zinc-500 text-lg">{t('search.failedToSearch')}</p>
        </div>
      </div>
    );
  }

  if (channels.length === 0 && !isLoading) {
    // 개별 No Results 메시지는 제거 - SearchResults에서 통합 처리
    return null;
  }

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">{t('search.channels')}</h2>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-zinc-800 text-zinc-300 text-sm rounded-full">
              {t('search.found', { count: channels.length })}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6">
        {channels.map((channel) => (
          <div
            key={channel.id}
            onClick={() => handleChannelClick(channel.id)}
            className="w-full h-full min-h-[360px] flex items-center justify-center" // 부모 컨테이너 크기 보장
          >
            <ChannelCard
              channel={channel}
              onCardClick={() => handleChannelClick(channel.id)}
              size="medium" // 검색 결과에 적합한 중간 크기
            />
          </div>
        ))}
      </div>

      {/* Loading indicator for additional results */}
      {isFetching && channels.length > 0 && (
        <div className="mt-6 text-center">
          <div className="flex items-center justify-center gap-2 text-zinc-400 text-sm">
            <div className="w-4 h-4 border border-zinc-400 border-t-transparent rounded-full animate-spin" />
            <span>{t('search.updatingResults')}</span>
          </div>
        </div>
      )}
    </div>
  );
}
