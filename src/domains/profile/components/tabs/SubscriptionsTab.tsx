import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMySubscriptions } from '../../hooks/useProfileActivity';
import { formatDistanceToNow } from 'date-fns';

export function SubscriptionsTab() {
  const router = useRouter();
  const [offset, setOffset] = useState(0);
  const limit = 12;
  
  const { data, isLoading, error } = useMySubscriptions(limit, offset);
  
  const loadMore = () => {
    if (data?.has_more) {
      setOffset(prev => prev + limit);
    }
  };
  
  if (isLoading && offset === 0) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="bg-zinc-900/50 rounded-xl p-4 animate-pulse">
            <div className="w-full aspect-square bg-zinc-800 rounded-lg mb-3" />
            <div className="h-4 bg-zinc-800 rounded w-3/4 mb-2" />
            <div className="h-3 bg-zinc-800 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-6 bg-zinc-800 rounded-full flex items-center justify-center">
          <svg className="w-12 h-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Failed to load subscriptions</h3>
        <p className="text-zinc-400">Something went wrong. Please try again.</p>
      </div>
    );
  }
  
  const subscriptions = data?.subscriptions || [];
  
  if (subscriptions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-6 bg-zinc-800 rounded-full flex items-center justify-center">
          <svg className="w-12 h-12 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">No subscriptions yet</h3>
        <p className="text-zinc-400 mb-6">Subscribe to channels to get updates on new content.</p>
        <button
          onClick={() => router.push('/channels')}
          className="px-6 py-3 bg-[#EAFD66] text-black rounded-lg font-medium hover:bg-[#d9ec55] transition-colors"
        >
          Explore Channels
        </button>
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">
          Subscribed Channels ({data?.total_count || 0})
        </h2>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {subscriptions.map((subscription) => (
          <div
            key={subscription.channel_id}
            onClick={() => router.push(`/channels/${subscription.channel_id}`)}
            className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800 hover:bg-zinc-800/50 hover:border-zinc-600 cursor-pointer transition-all duration-200 group"
          >
            {/* Channel Thumbnail */}
            <div className="w-full aspect-square bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg mb-3 overflow-hidden">
              {subscription.channel_thumbnail_url ? (
                <img 
                  src={subscription.channel_thumbnail_url} 
                  alt={subscription.channel_name || 'Channel'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">
                    {subscription.channel_name?.substring(0, 2).toUpperCase() || '?'}
                  </span>
                </div>
              )}
            </div>
            
            {/* Channel Info */}
            <h3 className="font-medium text-white line-clamp-1 mb-1">
              {subscription.channel_name || 'Unknown Channel'}
            </h3>
            <p className="text-xs text-zinc-400 mb-2">
              {subscription.channel_subscriber_count || 0} subscribers
            </p>
            {subscription.channel_content_count !== undefined && (
              <p className="text-xs text-zinc-500 mb-1">
                {subscription.channel_content_count} contents
              </p>
            )}
            
            {/* Subscription Date */}
            <p className="text-xs text-zinc-500">
              Subscribed {subscription.created_at 
                ? formatDistanceToNow(new Date(subscription.created_at), { addSuffix: true })
                : 'recently'}
            </p>
            
            {/* New Content Badge - Note: has_new_content not available in new API */}
          </div>
        ))}
      </div>
      
      {/* Load More Button */}
      {data?.has_more && (
        <div className="text-center pt-8">
          <button
            onClick={loadMore}
            disabled={isLoading}
            className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
}