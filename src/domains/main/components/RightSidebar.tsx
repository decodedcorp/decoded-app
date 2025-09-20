'use client';

import React from 'react';

import { Flame, TrendingUp, Mail, Github, Twitter } from 'lucide-react';
import { useCommonTranslation } from '@/lib/i18n/centralizedHooks';
import ShinyText from '@/components/ShinyText';
import { useQuery } from '@tanstack/react-query';
import { RecommendationsService } from '@/api/generated/services/RecommendationsService';
import { useAuthStore } from '@/store/authStore';
import type { ChannelResponse } from '@/api/generated/models/ChannelResponse';
import type { TrendingChannelItem } from '@/api/generated/models/TrendingChannelItem';
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
  const trending: TrendingChannelItem[] = trendingData?.channels || [];
  const list: (ChannelResponse | TrendingChannelItem)[] = userDocId ? recommended : trending;
  const title = userDocId ? '추천 채널' : t.globalContentUpload.sidebar.trendingChannels();

  return (
    <div className="w-full h-full py-4 px-2 overflow-hidden flex flex-col bg-black">
      {/* 추천/트렌딩 채널 */}
      <div className="mb-4 flex-shrink-0">
        <div className="text-white text-sm font-medium mb-3 flex items-center gap-2">
          <Flame className="w-4 h-4" />
          {title}
        </div>
        <div className="space-y-2">
          {list.length === 0 ? (
            <div className="text-xs text-gray-500">
              {userDocId ? '추천 채널이 없어요' : '트렌딩 채널이 없어요'}
            </div>
          ) : (
            list.slice(0, 4).map((channel, index) => (
              <div
                key={channel.id}
                className="p-2 bg-zinc-800 rounded-lg hover:bg-zinc-750 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-white text-xs font-medium">{channel.name}</span>
                  <span className="text-xs text-gray-500">#{index + 1}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 구분선 */}
      <div className="h-px bg-zinc-700 my-4"></div>

      {/* 인기 포스트 - 축약 */}
      <div className="mb-4 flex-shrink-0">
        <div className="text-white text-sm font-medium mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          {t.globalContentUpload.sidebar.popularToday()}
        </div>
        <div className="space-y-2">
          {[
            { title: 'New React 19 features announced', channel: 'reactjs', upvotes: 1234 },
            { title: 'AI breakthrough in coding assistants', channel: 'technology', upvotes: 892 },
          ].map((post, index) => (
            <div
              key={index}
              className="p-2 bg-zinc-800 rounded-lg hover:bg-zinc-750 cursor-pointer transition-colors"
            >
              <div className="text-white text-xs font-medium mb-1 line-clamp-1">{post.title}</div>
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>{post.channel}</span>
                <span>↑ {post.upvotes}</span>
              </div>
            </div>
          ))}
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
              text="Your Taste Your Trend"
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
