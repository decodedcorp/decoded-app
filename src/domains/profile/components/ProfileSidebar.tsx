import React from 'react';
import { useRouter } from 'next/navigation';
import { GetUserProfile } from '@/api/generated/models/GetUserProfile';
import {
  useMyChannels,
  useMySubscriptions,
  useMyStats,
  useUserActivityStats,
} from '../hooks/useProfileActivity';
import { useBookmarks } from '@/domains/bookmarks/hooks/useBookmarks';
import { useProfileTranslation } from '@/lib/i18n/hooks';
import { formatDistanceToNow } from 'date-fns';

interface ProfileSidebarProps {
  userId: string;
  profileData?: GetUserProfile;
  isMyProfile: boolean;
}

export function ProfileSidebar({ userId, profileData, isMyProfile }: ProfileSidebarProps) {
  const router = useRouter();
  const t = useProfileTranslation();

  // Only fetch data for own profile to respect privacy
  // Note: hooks must be called unconditionally, using enabled to control fetching
  const { data: channels } = useMyChannels(isMyProfile);
  const { data: subscriptions } = useMySubscriptions(5, 0, isMyProfile);
  const { data: stats } = useMyStats(isMyProfile);
  const { data: activityStats } = useUserActivityStats(isMyProfile);
  const { data: bookmarks } = useBookmarks({
    limit: 5,
    enabled: isMyProfile,
  });

  const statsData = isMyProfile
    ? [
        {
          label: t.stats.myChannels(),
          value: activityStats?.owned_channels ?? channels?.total_count ?? 0,
          onClick: () => router.push(`/profile/${userId}?tab=channels`),
        },
        {
          label: t.stats.subscriptions(),
          value: activityStats?.subscriptions ?? subscriptions?.total_count ?? 0,
          onClick: () => router.push(`/profile/${userId}?tab=subscriptions`),
        },
        {
          label: t.stats.bookmarks(),
          value: activityStats?.bookmarks ?? bookmarks?.total_count ?? 0,
          onClick: () => router.push(`/profile/${userId}?tab=bookmarks`),
        },
        {
          label: t.stats.comments(),
          value: activityStats?.comments ?? 0,
          onClick: () => router.push(`/profile/${userId}?tab=comments`),
        },
      ]
    : [];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* User Stats Card */}
      {isMyProfile && (
        <div className="bg-zinc-900/50 rounded-xl p-4 sm:p-6 border border-zinc-800">
          <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">
            {t.sidebar.activityOverview()}
          </h3>
          <div className="grid grid-cols-2 gap-2 sm:gap-4">
            {statsData.map((stat) => (
              <div
                key={stat.label}
                onClick={stat.onClick}
                className="p-2 sm:p-3 rounded-lg border border-zinc-700 transition-all duration-200 hover:border-zinc-600 cursor-pointer hover:bg-zinc-800/50"
              >
                <p className="text-xs text-zinc-400 mb-1">{stat.label}</p>
                <p className="text-lg sm:text-xl font-bold text-white">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Profile Info Card */}
      <div className="bg-zinc-900/50 rounded-xl p-4 sm:p-6 border border-zinc-800">
        <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">
          {t.sidebar.profileInfo()}
        </h3>

        {/* SUI Address */}
        {profileData?.sui_address && (
          <div className="mb-3 sm:mb-4">
            <label className="text-xs text-zinc-400 uppercase tracking-wide">
              {t.sidebar.suiAddress()}
            </label>
            <div className="flex items-center gap-2 mt-1">
              <span className="font-mono text-xs sm:text-sm text-zinc-300 break-all">
                {profileData.sui_address.slice(0, 6)}...{profileData.sui_address.slice(-4)}
              </span>
              <button
                onClick={() => navigator.clipboard.writeText(profileData.sui_address!)}
                className="p-1 text-zinc-400 hover:text-white transition-colors flex-shrink-0"
                title="Copy address"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Member Since */}
        <div>
          <label className="text-xs text-zinc-400 uppercase tracking-wide">
            {t.sidebar.memberSince()}
          </label>
          <p className="text-sm text-zinc-300 mt-1">{t.sidebar.memberSince()}</p>
        </div>
      </div>

      {/* Recent Activity - Only for own profile */}
      {isMyProfile && (
        <>
          {/* Recent Channels */}
          {channels && channels.channels && channels.channels.length > 0 && (
            <div className="bg-zinc-900/50 rounded-xl p-4 sm:p-6 border border-zinc-800">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="text-base sm:text-lg font-semibold text-white">
                  {t.sidebar.recentChannels()}
                </h3>
                <button
                  onClick={() => router.push(`/profile/${userId}?tab=channels`)}
                  className="text-xs sm:text-sm text-[#EAFD66] hover:text-[#d9ec55] transition-colors"
                >
                  {t.sidebar.viewAll()} →
                </button>
              </div>
              <div className="space-y-2 sm:space-y-3">
                {channels.channels.slice(0, 2).map((channel) => (
                  <div
                    key={channel.id}
                    onClick={() => router.push(`/channels/${channel.id}`)}
                    className="flex items-center gap-2 sm:gap-3 p-2 rounded-lg hover:bg-zinc-800/50 cursor-pointer transition-colors"
                  >
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      {channel.thumbnail_url ? (
                        <img
                          src={channel.thumbnail_url}
                          alt={channel.name}
                          className="w-full h-full rounded-lg object-cover"
                        />
                      ) : (
                        <span className="text-xs font-bold text-white">
                          {channel.name.substring(0, 2).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white text-xs sm:text-sm truncate">
                        {channel.name}
                      </p>
                      <p className="text-xs text-zinc-400">
                        {channel.subscriber_count || 0} {t.channels.subscribers()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Bookmarks */}
          {bookmarks && bookmarks.bookmarks && bookmarks.bookmarks.length > 0 && (
            <div className="bg-zinc-900/50 rounded-xl p-4 sm:p-6 border border-zinc-800">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="text-base sm:text-lg font-semibold text-white">
                  {t.sidebar.recentBookmarks()}
                </h3>
                <button
                  onClick={() => router.push(`/profile/${userId}?tab=bookmarks`)}
                  className="text-xs sm:text-sm text-[#EAFD66] hover:text-[#d9ec55] transition-colors"
                >
                  {t.sidebar.viewAll()} →
                </button>
              </div>
              <div className="space-y-2 sm:space-y-3">
                {bookmarks.bookmarks.slice(0, 2).map((bookmark) => (
                  <div
                    key={bookmark.content_id}
                    className="flex items-center gap-2 sm:gap-3 p-2 rounded-lg hover:bg-zinc-800/50 cursor-pointer transition-colors"
                  >
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white text-xs sm:text-sm line-clamp-1">
                        {bookmark.content?.link_preview_title ||
                          bookmark.content?.video_title ||
                          'Untitled Content'}
                      </p>
                      <p className="text-xs text-zinc-400">
                        {t.bookmarks.from()} {bookmark.content?.channel_name || 'Unknown Channel'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Other User Info */}
      {!isMyProfile && (
        <div className="bg-zinc-900/50 rounded-xl p-4 sm:p-6 border border-zinc-800">
          <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">
            {t.sidebar.about()}
          </h3>
          <p className="text-sm text-zinc-400">{t.sidebar.aboutDescription()}</p>

          {/* Future: Follow/Unfollow button */}
          {/* <div className="mt-3 sm:mt-4">
            <button className="w-full px-4 py-2 bg-[#EAFD66] text-black rounded-lg font-medium hover:bg-[#d9ec55] transition-colors">
              {t.sidebar.followUser()}
            </button>
          </div> */}
        </div>
      )}
    </div>
  );
}
