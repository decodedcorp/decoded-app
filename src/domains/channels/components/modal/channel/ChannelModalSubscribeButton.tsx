import React from 'react';

import { ChannelData } from '@/store/channelModalStore';

interface ChannelModalSubscribeButtonProps {
  channel: ChannelData;
  onSubscribe: (channelId: string) => void;
  onUnsubscribe: (channelId: string) => void;
  isLoading?: boolean;
}

export function ChannelModalSubscribeButton({
  channel,
  onSubscribe,
  onUnsubscribe,
  isLoading = false,
}: ChannelModalSubscribeButtonProps) {
  const isSubscribed = channel.is_subscribed || false;

  const handleClick = () => {
    if (isLoading) return;
    
    if (isSubscribed) {
      onUnsubscribe(channel.id);
    } else {
      onSubscribe(channel.id);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`
        px-6 py-3 rounded-lg font-medium transition-all duration-200 border shadow-lg hover:shadow-xl
        ${isSubscribed
          ? 'bg-zinc-800 hover:bg-zinc-700 text-white border-zinc-700 hover:border-zinc-600'
          : 'bg-zinc-700 hover:bg-zinc-600 text-white border-zinc-600 hover:border-zinc-500'
        }
        ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-[1.02]'}
      `}
    >
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span>Loading...</span>
        </div>
      ) : (
        <span>{isSubscribed ? 'Unsubscribe' : 'Subscribe'}</span>
      )}
    </button>
  );
} 