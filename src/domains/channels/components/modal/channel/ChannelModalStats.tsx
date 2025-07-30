import React from 'react';
import { ChannelData } from '@/store/channelModalStore';

interface ChannelModalStatsProps {
  channel: ChannelData;
}

export function ChannelModalStats({ channel }: ChannelModalStatsProps) {
  return (
    <div className="mb-8">
      {/* Stats */}
      <div className="flex space-x-6 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{channel.followers}</div>
          <div className="text-zinc-400 text-sm">Followers</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{channel.contentCount || 0}</div>
          <div className="text-zinc-400 text-sm">Posts</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white">89</div>
          <div className="text-zinc-400 text-sm">Following</div>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        <span className="text-zinc-400 text-xs">#{channel.category}</span>
        <span className="text-zinc-400 text-xs">#Design</span>
        <span className="text-zinc-400 text-xs">#Art</span> 
        <span className="text-zinc-400 text-xs">#Technology</span>
        <span className="text-zinc-400 text-xs">#Creative</span>
        <span className="text-zinc-400 text-xs">#Innovation</span>
      </div>
    </div>
  );
}
