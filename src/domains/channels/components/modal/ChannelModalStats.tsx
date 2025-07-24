import React from 'react';
import { ChannelData } from '../hero/heroData';

interface ChannelModalStatsProps {
  channel: ChannelData;
}

export function ChannelModalStats({ channel }: ChannelModalStatsProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-8 mb-8">
      {/* Stats */}
      <div className="flex space-x-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{channel.followers}</div>
          <div className="text-zinc-400 text-sm">Followers</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white">247</div>
          <div className="text-zinc-400 text-sm">Posts</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white">89</div>
          <div className="text-zinc-400 text-sm">Following</div>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        <span className="inline-block bg-zinc-800 px-4 py-2 rounded-full text-zinc-300 text-sm">
          {channel.category}
        </span>
        <span className="inline-block bg-zinc-800 px-4 py-2 rounded-full text-zinc-300 text-sm">
          Design
        </span>
        <span className="inline-block bg-zinc-800 px-4 py-2 rounded-full text-zinc-300 text-sm">
          Art
        </span>
        <span className="inline-block bg-zinc-800 px-4 py-2 rounded-full text-zinc-300 text-sm">
          Technology
        </span>
        <span className="inline-block bg-zinc-800 px-4 py-2 rounded-full text-zinc-300 text-sm">
          Creative
        </span>
        <span className="inline-block bg-zinc-800 px-4 py-2 rounded-full text-zinc-300 text-sm">
          Innovation
        </span>
      </div>
    </div>
  );
}
