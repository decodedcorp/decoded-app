'use client';

import React from 'react';
import { ChannelData, capsules } from './heroData';

interface ExpandedChannelProps {
  channel: ChannelData;
  onClose: () => void;
}

export function ExpandedChannel({ channel, onClose }: ExpandedChannelProps) {
  return (
    <div className="animate-expand-in">
      <div className="text-center max-w-6xl w-full mx-auto">
        <CloseButton onClose={onClose} />
        <ChannelHeader channel={channel} />
        <ChannelContentGrid />
        <ChannelActions />
      </div>
    </div>
  );
}

function CloseButton({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex justify-end mb-6">
      <button
        onClick={onClose}
        className="p-3 rounded-full bg-zinc-800/50 hover:bg-zinc-700/50 transition-colors"
        aria-label="Close channel view"
      >
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path
            d="M18 6L6 18M6 6l12 12"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}

function ChannelHeader({ channel }: { channel: ChannelData }) {
  return (
    <div className="mb-12">
      <div className="flex items-center justify-center mb-6">
        {channel.img && (
          <img
            src={channel.img}
            alt={`${channel.name} avatar`}
            className="w-16 h-16 rounded-full object-cover mr-6 border-2 border-zinc-600"
          />
        )}
        <div className="text-left">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-2">{channel.name}</h1>
          <p className="text-lg text-zinc-400 mb-2">{channel.description}</p>
          <div className="flex items-center gap-4 text-sm text-zinc-500">
            <span className="bg-zinc-800 px-3 py-1 rounded-full">{channel.category}</span>
            <span>{channel.followers} followers</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChannelContentGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl w-full mx-auto mb-12">
      {capsules.slice(0, 6).map((item, idx) => (
        <ContentCard key={item.name + idx} item={item} index={idx} />
      ))}
    </div>
  );
}

function ContentCard({ item, index }: { item: ChannelData; index: number }) {
  return (
    <div
      className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-700 hover:border-zinc-500 transition-all duration-300 cursor-pointer hover:bg-zinc-800/50 hover:scale-105"
      tabIndex={0}
      role="button"
      aria-label={`View ${item.name}'s content`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex items-center mb-3">
        {item.img && (
          <img
            src={item.img}
            alt={`${item.name} avatar`}
            className="w-10 h-10 rounded-full object-cover mr-3"
          />
        )}
        <div className="flex-1">
          <h3 className="text-base font-semibold text-white mb-1">{item.name}</h3>
          <p className="text-xs text-zinc-500">{item.category}</p>
        </div>
      </div>
      <p className="text-zinc-400 text-sm mb-3">{item.description}</p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-zinc-500">{item.followers} followers</span>
        <button className="text-xs bg-zinc-700 hover:bg-zinc-600 px-2 py-1 rounded-full transition-colors">
          Follow
        </button>
      </div>
    </div>
  );
}

function ChannelActions() {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <button className="px-6 py-2 bg-white text-black font-semibold rounded-full hover:bg-zinc-200 transition-colors">
        Follow Channel
      </button>
      <button className="px-6 py-2 border border-zinc-600 text-white font-semibold rounded-full hover:bg-zinc-800 transition-colors">
        Share Channel
      </button>
    </div>
  );
}
