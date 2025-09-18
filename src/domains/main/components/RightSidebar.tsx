'use client';

import React from 'react';

import { Flame, TrendingUp } from 'lucide-react';
import { useCommonTranslation } from '@/lib/i18n/centralizedHooks';
import { useQuery } from '@tanstack/react-query';
import { RecommendationsService } from '@/api/generated/services/RecommendationsService';
import { useAuthStore } from '@/store/authStore';
import type { ChannelResponse } from '@/api/generated/models/ChannelResponse';
import { useTrendingChannels } from '@/domains/channels/hooks/useTrending';

export function RightSidebar() {
  const t = useCommonTranslation();
  const userDocId = useAuthStore((s) => s.user?.doc_id || null);

  // Recommended (logged-in)
  const { data: recData } = useQuery({
    queryKey: ['recommendations', 'channels', { limit: 4, userId: userDocId }],
    queryFn: () =>
      RecommendationsService.recommendChannelsRecommendationsChannelsGet(4, undefined, userDocId),
    enabled: !!userDocId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // Trending fallback (logged-out)
  const { data: trendingData } = useTrendingChannels('popular', 4);

  const recommended: ChannelResponse[] = recData?.channels || [];
  const trending: ChannelResponse[] = trendingData?.channels || [];
  const list: ChannelResponse[] = userDocId ? recommended : trending;
  const title = userDocId ? '추천 채널' : t.globalContentUpload.sidebar.trendingChannels();

  return (
    <div className="w-full h-screen p-4 sticky top-0 overflow-y-auto">
      {/* 추천/트렌딩 채널 */}
      <div className="mb-6">
        <div className="text-white text-sm font-medium mb-4 flex items-center gap-2">
          <Flame className="w-4 h-4" />
          {title}
        </div>
        <div className="space-y-3">
          {list.length === 0 ? (
            <div className="text-xs text-gray-500">
              {userDocId ? '추천 채널이 없어요' : t.globalContentUpload.sidebar.trendingEmpty()}
            </div>
          ) : (
            list.slice(0, 4).map((channel, index) => (
              <div
                key={channel.id}
                className="p-3 bg-zinc-800 rounded-lg hover:bg-zinc-750 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white text-sm font-medium">{channel.name}</span>
                  <span className="text-xs text-gray-400">#{index + 1}</span>
                </div>
                <div className="text-xs text-gray-500 line-clamp-2">{channel.description || ''}</div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 구분선 */}
      <div className="h-px bg-zinc-700 my-6"></div>

      {/* 인기 포스트 */}
      <div className="mb-6">
        <div className="text-white text-sm font-medium mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          {t.globalContentUpload.sidebar.popularToday()}
        </div>
        <div className="space-y-3">
          {[
            { title: 'New React 19 features announced', channel: 'reactjs', upvotes: 1234 },
            { title: 'AI breakthrough in coding assistants', channel: 'technology', upvotes: 892 },
            { title: 'Best practices for modern CSS', channel: 'webdev', upvotes: 567 },
          ].map((post, index) => (
            <div
              key={index}
              className="p-3 bg-zinc-800 rounded-lg hover:bg-zinc-750 cursor-pointer transition-colors"
            >
              <div className="text-white text-xs font-medium mb-1 line-clamp-2">{post.title}</div>
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>{post.channel}</span>
                <span>↑ {post.upvotes}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 구분선 */}
      <div className="h-px bg-zinc-700 my-6"></div>

      {/* 광고 영역 (플레이스홀더) */}
      <div className="mb-6">
        <div className="text-white text-sm font-medium mb-4">
          {t.globalContentUpload.sidebar.sponsored()}
        </div>
        <div className="p-4 bg-zinc-800 rounded-lg border border-zinc-600">
          <div className="w-full h-20 bg-zinc-700 rounded mb-3"></div>
          <div className="text-xs text-gray-400">
            {t.globalContentUpload.sidebar.advertisementPlaceholder()}
          </div>
        </div>
      </div>

      {/* 하단 링크들 */}
      <div className="text-xs text-gray-500 space-y-1">
        <div className="cursor-pointer hover:text-gray-400">
          {t.globalContentUpload.sidebar.about()}
        </div>
        <div className="cursor-pointer hover:text-gray-400">
          {t.globalContentUpload.sidebar.help()}
        </div>
        <div className="cursor-pointer hover:text-gray-400">
          {t.globalContentUpload.sidebar.privacyPolicy()}
        </div>
        <div className="cursor-pointer hover:text-gray-400">
          {t.globalContentUpload.sidebar.termsOfService()}
        </div>
        <div className="mt-3 text-gray-600">{t.globalContentUpload.sidebar.copyright()}</div>
      </div>
    </div>
  );
}
