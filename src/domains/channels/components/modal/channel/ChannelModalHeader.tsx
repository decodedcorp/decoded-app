import React from 'react';
import { ChannelData } from '@/store/channelModalStore';

interface ChannelModalHeaderProps {
  channel: ChannelData;
  onClose: () => void;
}

export function ChannelModalHeader({ channel, onClose }: ChannelModalHeaderProps) {
  return (
    <div className="flex items-start justify-between p-6 border-b border-zinc-700/50">
      <div className="flex items-start space-x-6 flex-1">
        {channel.img && (
          <img
            src={channel.img}
            alt={`${channel.name} avatar`}
            className="w-20 h-20 rounded-full object-cover border-2 border-zinc-600 flex-shrink-0"
          />
        )}
        <div className="flex-1 min-w-0">
          <h2 className="text-3xl font-bold text-white mb-3 leading-tight">{channel.name}</h2>
          {channel.description && (
            <p className="text-zinc-300 text-base leading-relaxed max-w-4xl">
              {channel.description}
            </p>
          )}
        </div>
      </div>

      <button
        onClick={onClose}
        className="p-3 rounded-full bg-zinc-800/50 hover:bg-zinc-700/50 transition-colors flex-shrink-0 ml-4"
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
