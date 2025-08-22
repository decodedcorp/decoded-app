'use client';

import React from 'react';
import { ChannelSearchResults } from './ChannelSearchResults';
import { ContentSearchResults } from './ContentSearchResults';
import { useCombinedSearch } from '@/domains/search/hooks/useSearch';

interface SearchResultsProps {
  query: string;
}

export function SearchResults({ query }: SearchResultsProps) {
  // 전체 검색 상태 확인
  const {
    data: searchData,
    isLoading,
    error,
  } = useCombinedSearch({
    query,
    channelLimit: 20,
    contentLimit: 20,
    enabled: query.trim().length >= 2,
    debounceMs: 300,
  });

  const hasChannels = (searchData?.channels?.length || 0) > 0;
  const hasContents =
    (searchData?.contents?.image?.length || 0) +
      (searchData?.contents?.video?.length || 0) +
      (searchData?.contents?.link?.length || 0) >
    0;
  const hasAnyResults = hasChannels || hasContents;

  // searchData가 undefined이거나 결과가 없을 때 통합 메시지 표시
  const shouldShowNoResults = !isLoading && !error && (!searchData || !hasAnyResults);

  // 디버깅: 전체 검색 상태 확인
  React.useEffect(() => {
    console.log('🔍 [SearchResults] Combined search state:', {
      query,
      hasChannels,
      hasContents,
      hasAnyResults,
      shouldShowNoResults,
      searchData: !!searchData,
      isLoading,
      error: !!error,
      channelCount: searchData?.channels?.length || 0,
      imageCount: searchData?.contents?.image?.length || 0,
      videoCount: searchData?.contents?.video?.length || 0,
      linkCount: searchData?.contents?.link?.length || 0,
    });
  }, [
    query,
    hasChannels,
    hasContents,
    hasAnyResults,
    shouldShowNoResults,
    searchData,
    isLoading,
    error,
  ]);

  return (
    <div className="space-y-12">
      {/* Channels section - 채널이 있을 때만 표시 */}
      {hasChannels && (
        <div>
          <ChannelSearchResults query={query} />
        </div>
      )}

      {/* Contents section - 콘텐츠가 있을 때만 표시 */}
      {hasContents && (
        <div>
          <ContentSearchResults query={query} />
        </div>
      )}

      {/* No results message - 모든 결과가 없고 로딩이 완료되었을 때만 표시 */}
      {shouldShowNoResults && (
        <div className="text-center py-16">
          <div className="text-zinc-400">
            <svg
              className="mx-auto h-20 w-20 mb-6 opacity-50"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-white mb-3">No results found</h3>
            <p className="text-zinc-500 text-lg">
              No channels or content found for "{query}".
              {query.trim().length < 3 &&
                ' Try using more specific search terms for better results.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
