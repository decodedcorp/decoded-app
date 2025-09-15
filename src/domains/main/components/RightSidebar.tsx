'use client';

import React from 'react';

import {
  Flame,
  TrendingUp,
  Users,
  BookOpen,
  Shield,
  Mail,
  ExternalLink,
  Smartphone,
  Github,
  Twitter,
} from 'lucide-react';
import { useCommonTranslation } from '@/lib/i18n/centralizedHooks';

export function RightSidebar() {
  const t = useCommonTranslation();

  return (
    <div className="w-full h-[calc(100vh-72px)] py-4 px-3 sticky top-[72px] overflow-hidden flex flex-col">
      {/* 트렌딩 커뮤니티 - 축약 */}
      <div className="mb-4 flex-shrink-0">
        <div className="text-white text-sm font-medium mb-3 flex items-center gap-2">
          <Flame className="w-4 h-4" />
          {t.globalContentUpload.sidebar.trendingChannels()}
        </div>
        <div className="space-y-2">
          {[
            { name: 'technology', members: '12.5M' },
            { name: 'programming', members: '8.2M' },
            { name: 'webdev', members: '2.1M' },
          ].map((channel, index) => (
            <div
              key={channel.name}
              className="p-2 bg-zinc-800 rounded-lg hover:bg-zinc-750 cursor-pointer transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-white text-xs font-medium">{channel.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">{channel.members}</span>
                  <span className="text-xs text-gray-500">#{index + 1}</span>
                </div>
              </div>
            </div>
          ))}
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
        <div className="mb-4">
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
        </div>

        {/* 하단 링크들 - Reddit 스타일로 간소화 */}
        <div className="text-xs text-gray-500 space-y-2">
          <div className="grid grid-cols-2 gap-x-2 gap-y-1">
            <div className="cursor-pointer hover:text-gray-400">
              {t.globalContentUpload.sidebar.help()}
            </div>
            <div className="cursor-pointer hover:text-gray-400">
              {t.globalContentUpload.sidebar.about()}
            </div>
            <div className="cursor-pointer hover:text-gray-400">Careers</div>
            <div className="cursor-pointer hover:text-gray-400">Press</div>
            <div className="cursor-pointer hover:text-gray-400">
              {t.globalContentUpload.sidebar.termsOfService()}
            </div>
            <div className="cursor-pointer hover:text-gray-400">
              {t.globalContentUpload.sidebar.privacyPolicy()}
            </div>
          </div>
          <div className="pt-2 text-gray-600 text-[10px] text-center">
            {t.globalContentUpload.sidebar.copyright()}
          </div>
        </div>
      </div>
    </div>
  );
}
