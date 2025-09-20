'use client';

import React from 'react';
import Link from 'next/link';

import { Heart, Mail, Github, Twitter } from 'lucide-react';
import { useCommonTranslation } from '@/lib/i18n/centralizedHooks';
import ShinyText from '@/components/ShinyText';
import { useQuery } from '@tanstack/react-query';
import { RecommendationsService } from '@/api/generated/services/RecommendationsService';
import { useAuthStore } from '@/store/authStore';
import type { ChannelResponse } from '@/api/generated/models/ChannelResponse';

export function RightSidebar() {
  const t = useCommonTranslation();
  const userDocId = useAuthStore((s) => s.user?.doc_id || null);

  // Recommended (logged-in) - /recommendations/channels API 사용
  const {
    data: recData,
    isLoading: recLoading,
    error: recError,
    status,
    fetchStatus,
  } = useQuery({
    queryKey: ['recommendations', 'channels', 'sidebar', { limit: 4, userId: userDocId }],
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
    staleTime: 2 * 60 * 1000, // 2분
    gcTime: 10 * 60 * 1000, // 10분
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
    retryDelay: 1000,
  });

  // 일반 채널 데이터 (fallback용)
  const {
    data: fallbackData,
    isLoading: fallbackLoading,
    error: fallbackError,
  } = useQuery({
    queryKey: [
      'channels',
      'sidebar',
      'fallback',
      { page: 1, limit: 4, sortBy: 'created_at', sortOrder: 'desc' },
    ],
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
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
    refetchOnWindowFocus: false,
  });

  const recommended: ChannelResponse[] = recData?.channels || [];
  const fallbackChannels: ChannelResponse[] = fallbackData?.channels || [];

  // 데이터 우선순위: 추천 채널 > 일반 채널 > 빈 배열
  const list: ChannelResponse[] = (() => {
    if (userDocId && recData && !recError) {
      // 로그인했고 추천 데이터가 있으면 추천 채널 사용
      return recommended;
    } else if (fallbackData && !fallbackError) {
      // 추천 데이터가 없거나 에러가 있으면 일반 채널 사용
      return fallbackChannels;
    } else {
      // 모든 데이터가 없으면 빈 배열
      return [];
    }
  })();
  const title = t.globalContentUpload.sidebar.recommendedChannels();

  // Debug logging
  if (process.env.NODE_ENV === 'development') {
    console.log('RightSidebar Debug:', {
      userDocId,
      recLoading,
      recError,
      recData,
      fallbackLoading,
      fallbackError,
      fallbackData,
      status,
      fetchStatus,
      listLength: list.length,
      recommendedLength: recommended.length,
      fallbackChannelsLength: fallbackChannels.length,
      recDataChannels: recData?.channels?.length,
      fallbackDataChannels: fallbackData?.channels?.length,
      recDataStructure: recData ? Object.keys(recData) : null,
      fallbackDataStructure: fallbackData ? Object.keys(fallbackData) : null,
    });

    // 에러 상세 정보 로깅
    if (recError) {
      console.error('RightSidebar Error Details:', {
        error: recError,
        message: recError?.message,
        stack: recError?.stack,
        name: recError?.name,
      });
    }
  }

  return (
    <div className="w-full h-full py-4 px-2 overflow-hidden flex flex-col bg-black">
      {/* 추천 채널 */}
      <div className="mb-4 flex-shrink-0">
        <div className="text-white text-sm font-medium mb-3 flex items-center gap-2">
          <Heart className="w-4 h-4" />
          {title}
        </div>
        <div className="space-y-2">
          {/* 로딩 상태 */}
          {recLoading || fallbackLoading ? (
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="p-3 border-b border-zinc-800 animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-zinc-700 rounded-lg flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <div className="h-3 bg-zinc-700 rounded mb-1"></div>
                      <div className="h-2 bg-zinc-700 rounded w-3/4"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : /* 에러 상태 */
          recError && fallbackError ? (
            <div className="text-xs text-red-400 p-3 border border-red-800 rounded">
              {t.globalContentUpload.sidebar.loadChannelsFailed()}
            </div>
          ) : /* 데이터 없음 */
          list.length === 0 ? (
            <div className="text-xs text-gray-500">
              {t.globalContentUpload.sidebar.noRecommendedChannels()}
            </div>
          ) : (
            /* 데이터 표시 */
            list.slice(0, 4).map((channel, index) => (
              <Link
                key={channel.id}
                href={`/channels/${channel.id}`}
                className="block p-3 border-b border-zinc-800 hover:border-zinc-700 cursor-pointer transition-colors last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  {/* 썸네일 */}
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg overflow-hidden bg-zinc-700">
                    {channel.thumbnail_url ? (
                      <img
                        src={channel.thumbnail_url}
                        alt={channel.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-400 text-xs font-medium">
                        {channel.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* 채널 정보 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-white text-xs font-medium truncate">{channel.name}</h3>
                      <span className="text-xs text-gray-500 ml-2 flex-shrink-0">#{index + 1}</span>
                    </div>

                    {/* 설명 */}
                    {channel.description && (
                      <p className="text-xs text-gray-400 line-clamp-1 mb-1">
                        {channel.description}
                      </p>
                    )}

                    {/* 카테고리 */}
                    {'category' in channel && channel.category && (
                      <div className="mt-1">
                        <span className="text-xs text-zinc-500">{channel.category}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* Footer 섹션 - 하단에 고정 */}
      <div className="mt-auto flex-shrink-0">
        {/* 구분선 */}
        <div className="h-px bg-zinc-700 mb-4"></div>

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
        <div className="text-xs text-gray-500 space-y-2">
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

          <div className="pt-2 text-center">
            <ShinyText
              text={t.globalContentUpload.sidebar.brandSlogan()}
              disabled={false}
              speed={3}
              className="text-[11px] font-medium"
            />
          </div>
          <div className="pt-1 text-gray-600 text-[10px] text-center">
            {t.globalContentUpload.sidebar.copyright()}
          </div>
        </div>
      </div>
    </div>
  );
}
