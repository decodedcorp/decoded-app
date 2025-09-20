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
  const title = t.globalContentUpload.sidebar.recommendedChannels();

  return (
    <div className="w-full h-full py-4 px-2 overflow-hidden flex flex-col bg-black">
      {/* 추천 채널 */}
      <div className="mb-4 flex-shrink-0">
        <div className="text-white text-sm font-medium mb-3 flex items-center gap-2">
          <Heart className="w-4 h-4" />
          {title}
        </div>
        <div className="space-y-2">
          {list.length === 0 ? (
            <div className="text-xs text-gray-500">
              {t.globalContentUpload.sidebar.noRecommendedChannels()}
            </div>
          ) : (
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
