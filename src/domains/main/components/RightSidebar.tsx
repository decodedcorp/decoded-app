'use client';

import React, { useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';

import { Heart, Mail, Github, Twitter, Clock, X, RefreshCw } from 'lucide-react';
import { useCommonTranslation } from '@/lib/i18n/centralizedHooks';
import { useTranslation } from 'react-i18next';
import ShinyText from '@/components/ShinyText';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { RecommendationsService } from '@/api/generated/services/RecommendationsService';
import { useAuthStore } from '@/store/authStore';
import { useRecentContentStore } from '@/store/recentContentStore';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { useRecentContentDetails } from '@/hooks/useRecentContentDetails';
import { useCacheInvalidation } from '@/hooks/useCacheInvalidation';
import { formatRelativeTime, formatRelativeTimeEn } from '@/lib/utils/timeFormat';
import { getThumbnailImageUrl } from '@/lib/utils/imageProxy';
import type { ChannelResponse } from '@/api/generated/models/ChannelResponse';

export function RightSidebar() {
  const t = useCommonTranslation();
  const { t: contentT } = useTranslation('content');
  const userDocId = useAuthStore((s) => s.user?.doc_id || null);
  const queryClient = useQueryClient();
  const { invalidateRecommendations } = useCacheInvalidation();

  // Recent content management
  const { loadRecentContent, clearAll } = useRecentContentStore();
  const {
    contentDetails,
    isLoading: recentLoading,
    error: recentError,
    hasContent,
  } = useRecentContentDetails();

  // Load recent content on mount
  useEffect(() => {
    loadRecentContent();
  }, [loadRecentContent]);

  // 구독 상태 변경 감지 및 캐시 무효화
  const subscribedChannels = useSubscriptionStore((state) => state.subscribedChannels);
  const prevSubscribedChannelsRef = React.useRef<Set<string>>(new Set());

  useEffect(() => {
    if (prevSubscribedChannelsRef.current !== subscribedChannels) {
      // 구독 상태가 변경되면 추천 채널 캐시 무효화
      console.log('[RightSidebar] Subscription state changed, invalidating recommendations cache');
      invalidateRecommendations();
      prevSubscribedChannelsRef.current = subscribedChannels;
    }
  }, [subscribedChannels, invalidateRecommendations]);

  // 캐시 키 생성 함수
  const getRecommendationsQueryKey = useCallback(
    (userId: string | null, limit: number) => [
      'recommendations',
      'channels',
      'sidebar',
      { userId, limit },
    ],
    [],
  );

  // Recommended (logged-in) - /recommendations/channels API 사용
  const {
    data: recData,
    isLoading: recLoading,
    error: recError,
    status,
    fetchStatus,
  } = useQuery({
    queryKey: getRecommendationsQueryKey(userDocId, 4),
    queryFn: async () => {
      // OpenAPI 토큰 업데이트
      const { refreshOpenAPIToken } = await import('@/api/hooks/useApi');
      refreshOpenAPIToken();

      console.log('[RightSidebar] Making recommendations API call with params:', {
        limit: 4,
        userId: userDocId,
      });

      try {
        const result = await RecommendationsService.recommendChannelsRecommendationsChannelsGet(
          4,
          undefined,
          userDocId,
        );

        console.log('[RightSidebar] Recommendations API call successful:', {
          result,
          channelsCount: result?.channels?.length || 0,
        });

        return result;
      } catch (error) {
        console.error('[RightSidebar] Recommendations API call failed:', {
          error,
          message: error instanceof Error ? error.message : 'Unknown error',
          userId: userDocId,
        });
        throw error;
      }
    },
    enabled: !!userDocId,
    staleTime: 5 * 60 * 1000, // 5분으로 증가
    gcTime: 15 * 60 * 1000, // 15분으로 증가
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Fallback 쿼리 키 생성 함수
  const getFallbackQueryKey = useCallback(
    (page: number, limit: number, sortBy: string, sortOrder: string) => [
      'channels',
      'sidebar',
      'fallback',
      { page, limit, sortBy, sortOrder },
    ],
    [],
  );

  // 일반 채널 데이터 (fallback용)
  const {
    data: fallbackData,
    isLoading: fallbackLoading,
    error: fallbackError,
  } = useQuery({
    queryKey: getFallbackQueryKey(1, 4, 'created_at', 'desc'),
    queryFn: async () => {
      // OpenAPI 토큰 업데이트
      const { refreshOpenAPIToken } = await import('@/api/hooks/useApi');
      refreshOpenAPIToken();

      console.log('[RightSidebar] Making fallback channels API call with params:', {
        page: 1,
        limit: 4,
        sortBy: 'created_at',
        sortOrder: 'desc',
      });

      const { ChannelsService } = await import('@/api/generated/services/ChannelsService');

      try {
        const result = await ChannelsService.listChannelsChannelsGet(
          1,
          4,
          undefined,
          undefined,
          undefined,
          'created_at',
          'desc',
        );

        console.log('[RightSidebar] Fallback channels API call successful:', {
          result,
          channelsCount: result?.channels?.length || 0,
        });

        return result;
      } catch (error) {
        console.error('[RightSidebar] Fallback channels API call failed:', {
          error,
          message: error instanceof Error ? error.message : 'Unknown error',
        });
        throw error;
      }
    },
    staleTime: 10 * 60 * 1000, // 10분으로 증가
    gcTime: 20 * 60 * 1000, // 20분으로 증가
    refetchOnWindowFocus: false,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // 메모이제이션된 데이터 처리
  const recommended: ChannelResponse[] = useMemo(() => recData?.channels || [], [recData]);
  const fallbackChannels: ChannelResponse[] = useMemo(
    () => fallbackData?.channels || [],
    [fallbackData],
  );

  // 에러 상태 확인
  const getErrorState = useCallback(() => {
    if (recError && fallbackError) return 'both_failed';
    if (recError && !fallbackError) return 'recommendations_failed';
    if (!recError && fallbackError) return 'fallback_failed';
    return 'none';
  }, [recError, fallbackError]);

  // 데이터 우선순위: 추천 채널 > 일반 채널 > 빈 배열
  const list: ChannelResponse[] = useMemo(() => {
    const shouldUseRecommendations = userDocId && recData && !recError;
    const shouldUseFallback = !userDocId || recError;

    if (shouldUseRecommendations) {
      return recommended;
    } else if (shouldUseFallback && fallbackData && !fallbackError) {
      return fallbackChannels;
    } else {
      return [];
    }
  }, [userDocId, recData, recError, recommended, fallbackData, fallbackError, fallbackChannels]);

  const title = t.globalContentUpload.sidebar.recommendedChannels();
  const errorState = getErrorState();

  // 새로고침 핸들러
  const handleRefresh = useCallback(async () => {
    if (recLoading || fallbackLoading) return; // 이미 로딩 중이면 무시

    console.log('[RightSidebar] Manual refresh triggered');

    try {
      // 추천 채널 쿼리 새로고침 (refetch 사용)
      await queryClient.refetchQueries({
        queryKey: getRecommendationsQueryKey(userDocId, 4),
      });

      // Fallback 쿼리도 새로고침 (refetch 사용)
      await queryClient.refetchQueries({
        queryKey: getFallbackQueryKey(1, 4, 'created_at', 'desc'),
      });

      console.log('[RightSidebar] Manual refresh completed');
    } catch (error) {
      console.error('[RightSidebar] Manual refresh failed:', error);
    }
  }, [
    queryClient,
    getRecommendationsQueryKey,
    getFallbackQueryKey,
    userDocId,
    recLoading,
    fallbackLoading,
  ]);

  // Debug logging (메모이제이션)
  const debugInfo = useMemo(
    () => ({
      userDocId,
      recLoading,
      recError: recError?.message,
      recDataChannels: recData?.channels?.length,
      fallbackLoading,
      fallbackError: fallbackError?.message,
      fallbackDataChannels: fallbackData?.channels?.length,
      status,
      fetchStatus,
      listLength: list.length,
      errorState,
    }),
    [
      userDocId,
      recLoading,
      recError,
      recData,
      fallbackLoading,
      fallbackError,
      fallbackData,
      status,
      fetchStatus,
      list.length,
      errorState,
    ],
  );

  // Debug logging
  if (process.env.NODE_ENV === 'development') {
    console.log('RightSidebar Debug:', debugInfo);
  }

  return (
    <div className="px-1 py-1 bg-black min-h-full flex flex-col mr-4" data-testid="right-sidebar">
      {/* 추천 채널 */}
      <div className="mb-3 flex-shrink-0 border border-zinc-800 rounded-lg p-2 bg-zinc-900">
        <div className="px-1 text-white text-sm lg:text-base font-medium mb-2 flex items-center justify-between">
          <span>{title}</span>
          <button
            onClick={handleRefresh}
            disabled={recLoading || fallbackLoading}
            className="text-zinc-400 hover:text-zinc-300 transition-colors p-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            title="새로고침"
          >
            <RefreshCw
              className={`w-3 h-3 lg:w-4 lg:h-4 ${
                recLoading || fallbackLoading ? 'animate-spin' : ''
              }`}
            />
          </button>
        </div>
        <div className="space-y-3">
          {/* 로딩 상태 */}
          {recLoading || fallbackLoading ? (
            <div className="space-y-1.5">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="p-1 border-b border-zinc-800 animate-pulse">
                  <div className="flex items-center gap-2 lg:gap-3">
                    <div className="w-8 h-8 lg:w-10 lg:h-10 bg-zinc-700 rounded-lg flex-shrink-0"></div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <div className="h-2.5 lg:h-3 bg-zinc-700 rounded mb-0.5"></div>
                      <div className="h-1.5 lg:h-2 bg-zinc-700 rounded w-3/4"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : /* 에러 상태 */
          errorState === 'both_failed' ? (
            <div className="text-[10px] lg:text-xs text-red-400 p-1 border border-red-800 rounded">
              {t.globalContentUpload.sidebar.loadChannelsFailed()}
            </div>
          ) : errorState === 'recommendations_failed' ? (
            <div className="text-[10px] lg:text-xs text-yellow-400 p-1 border border-yellow-800 rounded">
              추천 채널을 불러올 수 없어 일반 채널을 표시합니다
            </div>
          ) : /* 데이터 없음 */
          list.length === 0 ? (
            <div className="text-[10px] lg:text-xs text-gray-500">
              {t.globalContentUpload.sidebar.noRecommendedChannels()}
            </div>
          ) : (
            /* 데이터 표시 */
            list.slice(0, 4).map((channel) => {
              const thumbnailUrl = channel.thumbnail_url
                ? getThumbnailImageUrl(channel.thumbnail_url)
                : null;

              return (
                <Link
                  key={channel.id}
                  href={`/channels/${channel.id}`}
                  className="group block p-1.5 rounded-md cursor-pointer transition-all duration-200 last:border-b-0 hover:bg-zinc-800/50 hover:scale-[1.02] active:scale-[0.98] active:bg-zinc-800/70"
                >
                  <div className="flex items-center gap-2 lg:gap-3">
                    {/* 썸네일 */}
                    <div className="flex-shrink-0 w-8 h-8 lg:w-10 lg:h-10 rounded-lg overflow-hidden bg-zinc-700 transition-all duration-200 group-hover:ring-2 group-hover:ring-zinc-600 group-hover:shadow-md">
                      {thumbnailUrl ? (
                        <img
                          src={thumbnailUrl}
                          alt={channel.name}
                          className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-400 text-[10px] lg:text-xs font-medium transition-colors duration-200 group-hover:text-zinc-300">
                          {channel.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>

                    {/* 채널 정보 */}
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <h3 className="text-white text-[10px] lg:text-xs font-medium truncate transition-colors duration-200 group-hover:text-zinc-100">
                        {channel.name}
                      </h3>

                      {/* 설명과 카테고리를 한 줄에 배치 */}
                      <div className="flex items-center gap-1 mt-0.5">
                        {channel.description && (
                          <p className="text-[9px] lg:text-[10px] text-gray-400 line-clamp-1 transition-colors duration-200 group-hover:text-gray-300 flex-1">
                            {channel.description}
                          </p>
                        )}
                        {'category' in channel && channel.category && (
                          <span className="text-[9px] lg:text-[10px] text-zinc-500 transition-colors duration-200 group-hover:text-zinc-400 flex-shrink-0">
                            {channel.category}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* 호버 시 나타나는 화살표 아이콘 */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0">
                      <svg
                        className="w-3 h-3 lg:w-4 lg:h-4 text-zinc-400 group-hover:text-zinc-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>

      {/* 최근 본 콘텐츠 섹션 */}
      {hasContent && (
        <div className="mb-3 flex-shrink-0 border border-zinc-800 rounded-lg p-2 bg-zinc-900">
          <div className="px-1 text-white text-sm lg:text-base font-medium mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {contentT('sidebar.recentContent')}
            </div>
            <button
              onClick={clearAll}
              className="text-zinc-400 hover:text-zinc-300 transition-colors p-1"
              title={contentT('sidebar.clearRecent')}
            >
              <X className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3">
            {/* 로딩 상태 */}
            {recentLoading ? (
              <div className="space-y-1.5">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="p-1 border-b border-zinc-800 animate-pulse">
                    <div className="flex items-center gap-2 lg:gap-3">
                      <div className="w-8 h-8 lg:w-10 lg:h-10 bg-zinc-700 rounded-lg flex-shrink-0"></div>
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <div className="h-2.5 lg:h-3 bg-zinc-700 rounded mb-0.5"></div>
                        <div className="h-1.5 lg:h-2 bg-zinc-700 rounded w-3/4"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : /* 에러 상태 */
            recentError ? (
              <div className="text-[10px] lg:text-xs text-red-400 p-1 border border-red-800 rounded">
                {contentT('sidebar.recentContentError')}
              </div>
            ) : /* 데이터 없음 */
            contentDetails.length === 0 ? (
              <div className="text-[10px] lg:text-xs text-gray-500">
                {contentT('sidebar.recentContentEmpty')}
              </div>
            ) : (
              /* 데이터 표시 */
              contentDetails.map((content) => {
                const thumbnailUrl = content.thumbnailUrl
                  ? getThumbnailImageUrl(content.thumbnailUrl)
                  : null;
                const title = content.title;
                const timeAgo = contentT('sidebar.viewedAt', {
                  time: formatRelativeTime(content.viewedAt),
                });

                return (
                  <Link
                    key={content.id}
                    href={`/channels/${content.channelId}?content=${content.id}`}
                    className="group block p-1.5 rounded-md cursor-pointer transition-all duration-200 last:border-b-0 hover:bg-zinc-800/50 hover:scale-[1.02] active:scale-[0.98] active:bg-zinc-800/70"
                  >
                    <div className="flex items-center gap-2 lg:gap-3">
                      {/* 썸네일 */}
                      <div className="flex-shrink-0 w-8 h-8 lg:w-10 lg:h-10 rounded-lg overflow-hidden bg-zinc-700 transition-all duration-200 group-hover:ring-2 group-hover:ring-zinc-600 group-hover:shadow-md">
                        {thumbnailUrl ? (
                          <img
                            src={thumbnailUrl}
                            alt={title}
                            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-zinc-400 text-[10px] lg:text-xs font-medium transition-colors duration-200 group-hover:text-zinc-300">
                            {title.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>

                      {/* 콘텐츠 정보 */}
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <h3 className="text-white text-[10px] lg:text-xs font-medium truncate transition-colors duration-200 group-hover:text-zinc-100">
                          {title}
                        </h3>

                        {/* 시간 정보 */}
                        <div className="mt-0.5">
                          <span className="text-[9px] lg:text-[10px] text-zinc-500 transition-colors duration-200 group-hover:text-zinc-400">
                            {timeAgo}
                          </span>
                        </div>
                      </div>

                      {/* 호버 시 나타나는 화살표 아이콘 */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0">
                        <svg
                          className="w-3 h-3 lg:w-4 lg:h-4 text-zinc-400 group-hover:text-zinc-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Footer 섹션 - 하단에 고정 */}
      <div className="mt-auto flex-shrink-0">
        {/* 구분선 */}
        <div className="h-px bg-zinc-700 mb-2 lg:mb-4"></div>

        {/* 앱 다운로드 - 간소화 */}
        {/* <div className="mb-4">
          <div className="text-white text-xs font-medium mb-2 flex items-center gap-2">
            <Smartphone className="w-3 h-3" />
            Get the App
          </div>
          <div className="flex gap-2">
            <div className="px-3 py-1 bg-zinc-800 rounded cursor-pointer hover:bg-zinc-750 transition-colors flex-1 text-center">
              <div className="text-xs text-gray-300">iOS</div>
            </div>
            <div className="px-3 py-1 bg-zinc-800 rounded cursor-pointer hover:bg-zinc-750 transition-colors flex-1 text-center">
              <div className="text-xs text-gray-300">Android</div>
            </div>
          </div>
        </div> */}

        {/* 소셜 미디어 - 간소화 */}
        {/* <div className="mb-4">
          <div className="flex justify-center gap-4">
            <div className="cursor-pointer hover:text-gray-300 transition-colors">
              <Twitter className="w-4 h-4 text-gray-400" />
            </div>
            <div className="cursor-pointer hover:text-gray-300 transition-colors">
              <Github className="w-4 h-4 text-gray-400" />
            </div>
            <div className="cursor-pointer hover:text-gray-300 transition-colors">
              <Mail className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div> */}

        {/* 하단 링크들 - Reddit 스타일로 간소화 */}
        <div className="text-[10px] lg:text-xs text-gray-500 space-y-1 lg:space-y-2">
          {/* <div className="grid grid-cols-2 gap-x-2 gap-y-1">
            <div className="cursor-pointer hover:text-gray-400">
              {t.globalContentUpload.sidebar.help()}
            </div>
            <div className="cursor-pointer hover:text-gray-400">
              {t.globalContentUpload.sidebar.about()}
            </div>
            <div className="cursor-pointer hover:text-gray-400">
              {t.globalContentUpload.sidebar.careers()}
            </div>
            <div className="cursor-pointer hover:text-gray-400">
              {t.globalContentUpload.sidebar.press()}
            </div>
            <div className="cursor-pointer hover:text-gray-400">
              {t.globalContentUpload.sidebar.termsOfService()}
            </div>
            <div className="cursor-pointer hover:text-gray-400">
              {t.globalContentUpload.sidebar.privacyPolicy()}
            </div>
           </div> */}

          <div className="pt-1 lg:pt-2 text-center">
            <ShinyText
              text={t.globalContentUpload.sidebar.brandSlogan()}
              disabled={false}
              speed={3}
              className="text-[9px] lg:text-[11px] font-medium"
            />
          </div>
          <div className="pt-0.5 lg:pt-1 text-gray-600 text-[9px] lg:text-[10px] text-center">
            {t.globalContentUpload.sidebar.copyright()}
          </div>
        </div>
      </div>
    </div>
  );
}
