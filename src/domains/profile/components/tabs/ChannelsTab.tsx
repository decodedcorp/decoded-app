import React from 'react';
import { useRouter } from 'next/navigation';
import { useMyChannels } from '../../hooks/useProfileActivity';
import { useProfileTranslation } from '@/lib/i18n/hooks';
import { formatDistanceToNow } from 'date-fns';

export function ChannelsTab() {
  const router = useRouter();
  const t = useProfileTranslation();
  const { data, isLoading, error } = useMyChannels();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-zinc-900/50 rounded-xl p-6 animate-pulse">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-zinc-800 rounded-lg" />
              <div className="flex-1">
                <div className="h-4 bg-zinc-800 rounded w-3/4 mb-2" />
                <div className="h-3 bg-zinc-800 rounded w-1/2" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-zinc-800 rounded" />
              <div className="h-3 bg-zinc-800 rounded w-4/5" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-6 bg-zinc-800 rounded-full flex items-center justify-center">
          <svg
            className="w-12 h-12 text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">{t.channels.failedToLoad()}</h3>
        <p className="text-zinc-400">{t.channels.failedToLoadDescription()}</p>
      </div>
    );
  }

  const channels = data?.channels || [];

  if (channels.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-6 bg-zinc-800 rounded-full flex items-center justify-center">
          <svg
            className="w-12 h-12 text-zinc-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 4v16M17 4v16M3 8h4m10 0h4M3 16h4m10 0h4"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">{t.channels.noChannels()}</h3>
        <p className="text-zinc-400 mb-6">{t.channels.noChannelsDescription()}</p>
        <button
          onClick={() => router.push('/create')}
          className="px-6 py-3 bg-[#EAFD66] text-black rounded-lg font-medium hover:bg-[#d9ec55] transition-colors"
        >
          {t.channels.createChannel()}
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">{t.channels.count(channels.length)}</h2>
        <button
          onClick={() => router.push('/create')}
          className="px-4 py-2 bg-[#EAFD66] text-black rounded-lg font-medium hover:bg-[#d9ec55] transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {t.channels.createNew()}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {channels.map((channel) => (
          <div
            key={channel.id}
            className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800 hover:bg-zinc-800/50 hover:border-zinc-600 transition-all duration-200"
          >
            {/* Channel Header */}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center overflow-hidden">
                {channel.thumbnail_url ? (
                  <img
                    src={channel.thumbnail_url}
                    alt={channel.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xl font-bold text-white">
                    {channel.name.substring(0, 2).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-white line-clamp-1">{channel.name}</h3>
                <p className="text-sm text-zinc-400">{t.channels.inactive()}</p>
              </div>
            </div>

            {/* Channel Stats */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">{t.channels.subscribers()}</span>
                <span className="text-white font-medium">{channel.subscriber_count || 0}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">{t.channels.contents()}</span>
                <span className="text-white font-medium">{channel.content_count || 0}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">{t.channels.created()}</span>
                <span className="text-white font-medium">
                  {channel.created_at
                    ? formatDistanceToNow(new Date(channel.created_at), { addSuffix: true })
                    : 'Unknown'}
                </span>
              </div>
            </div>

            {/* Channel Description */}
            {channel.description && (
              <p className="text-sm text-zinc-400 line-clamp-2 mb-4">{channel.description}</p>
            )}

            {/* Action Button */}
            <button
              onClick={() => router.push(`/channels/${channel.id}`)}
              className="w-full px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-medium transition-colors text-sm"
            >
              {t.channels.viewChannel()}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
