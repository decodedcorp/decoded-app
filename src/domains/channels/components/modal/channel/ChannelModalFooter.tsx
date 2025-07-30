import React from 'react';
import { ChannelData } from '@/store/channelModalStore';

interface ChannelModalFooterProps {
  channel: ChannelData;
}

export function ChannelModalFooter({ channel }: ChannelModalFooterProps) {
  const isSubscribed = channel.isSubscribed;

  return (
    <div className="flex items-center justify-between p-4 border-t border-zinc-700/50 bg-zinc-900/50">
      <div className="flex space-x-4">
        <button
          className={`px-6 py-2 font-semibold rounded-full transition-colors ${
            isSubscribed
              ? 'border border-zinc-600 text-white hover:bg-zinc-800'
              : 'bg-white text-black hover:bg-zinc-200'
          }`}
        >
          {isSubscribed ? 'Unfollow' : 'Follow Channel'}
        </button>
        <button className="px-6 py-2 border border-zinc-600 text-white font-semibold rounded-full hover:bg-zinc-800 transition-colors">
          Share Channel
        </button>
      </div>

      <div className="flex space-x-3">
        <button className="p-2 rounded-full bg-zinc-800/50 hover:bg-zinc-700/50 transition-colors">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
            <path
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button className="p-2 rounded-full bg-zinc-800/50 hover:bg-zinc-700/50 transition-colors">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
            <path
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
