import React from 'react';
import { ChannelData } from '../../hero/heroData';

interface ChannelModalHeaderProps {
  channel: ChannelData;
  onClose: () => void;
}

export function ChannelModalHeader({ channel, onClose }: ChannelModalHeaderProps) {
  return (
    <div className="flex items-center justify-between p-6 border-b border-zinc-700/50">
      <div className="flex items-center space-x-6">
        {channel.img && (
          <img
            src={channel.img}
            alt={`${channel.name} avatar`}
            className="w-20 h-20 rounded-full object-cover border-2 border-zinc-600"
          />
        )}
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-white mb-2">{channel.name}</h2>
          <p className="text-zinc-400 text-lg leading-relaxed max-w-4xl">{channel.description}</p>
        </div>
      </div>

      <button
        onClick={onClose}
        className="p-3 rounded-full bg-zinc-800/50 hover:bg-zinc-700/50 transition-colors"
        aria-label="Close modal"
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
