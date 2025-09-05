'use client';

import React from 'react';
import { Flame, TrendingUp } from 'lucide-react';

export function RightSidebar() {
  return (
    <div className="w-full h-screen p-4 sticky top-0 overflow-y-auto">
      {/* 트렌딩 커뮤니티 */}
      <div className="mb-6">
        <div className="text-white text-sm font-medium mb-4 flex items-center gap-2">
          <Flame className="w-4 h-4" />
          Trending Channels
        </div>
        <div className="space-y-3">
          {[
            {
              name: 'technology',
              members: '12.5M',
              description: 'Latest tech news and discussions',
            },
            { name: 'programming', members: '8.2M', description: 'Programming discussions' },
            { name: 'webdev', members: '2.1M', description: 'Web development channel' },
            { name: 'reactjs', members: '891K', description: 'React.js discussions' },
          ].map((channel, index) => (
            <div
              key={channel.name}
              className="p-3 bg-zinc-800 rounded-lg hover:bg-zinc-750 cursor-pointer transition-colors"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-white text-sm font-medium">{channel.name}</span>
                <span className="text-xs text-gray-400">#{index + 1}</span>
              </div>
              <div className="text-xs text-gray-400 mb-1">{channel.members} members</div>
              <div className="text-xs text-gray-500">{channel.description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 구분선 */}
      <div className="h-px bg-zinc-700 my-6"></div>

      {/* 인기 포스트 */}
      <div className="mb-6">
        <div className="text-white text-sm font-medium mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          Popular Today
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
        <div className="text-white text-sm font-medium mb-4">Sponsored</div>
        <div className="p-4 bg-zinc-800 rounded-lg border border-zinc-600">
          <div className="w-full h-20 bg-zinc-700 rounded mb-3"></div>
          <div className="text-xs text-gray-400">Advertisement placeholder</div>
        </div>
      </div>

      {/* 하단 링크들 */}
      <div className="text-xs text-gray-500 space-y-1">
        <div className="cursor-pointer hover:text-gray-400">About</div>
        <div className="cursor-pointer hover:text-gray-400">Help</div>
        <div className="cursor-pointer hover:text-gray-400">Privacy Policy</div>
        <div className="cursor-pointer hover:text-gray-400">Terms of Service</div>
        <div className="mt-3 text-gray-600">© 2024 Decoded</div>
      </div>
    </div>
  );
}
