import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { GetUserProfile } from '@/api/generated/models/GetUserProfile';
import { useProfileTranslation } from '@/lib/i18n/hooks';
import {
  useMyChannels,
  useMySubscriptions,
  useUserActivityStats,
} from '../hooks/useProfileActivity';
import { useBookmarks } from '@/domains/bookmarks/hooks/useBookmarks';
import { formatDistanceToNow } from 'date-fns';

interface ProfileHeaderProps {
  userId: string;
  profileData?: GetUserProfile;
  isMyProfile: boolean;
  onEditClick: () => void;
}

export function ProfileHeader({
  userId,
  profileData,
  isMyProfile,
  onEditClick,
}: ProfileHeaderProps) {
  const router = useRouter();
  const t = useProfileTranslation();
  const storeUser = useAuthStore((state) => state.user);

  // Fetch activity data for own profile
  const { data: channels } = useMyChannels(isMyProfile);
  const { data: subscriptions } = useMySubscriptions(5, 0, isMyProfile);
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

  if (!profileData && !userId) return null;

  // Get user initials for avatar
  const getInitials = () => {
    const displayName = profileData?.aka || storeUser?.nickname || '';
    if (displayName) {
      return displayName.substring(0, 2).toUpperCase();
    }
    if (userId) {
      return userId.substring(0, 2).toUpperCase();
    }
    return '?';
  };

  const displayName = profileData?.aka || storeUser?.nickname || `User ${userId?.slice(0, 6)}`;

  return (
    <div className="bg-zinc-900/30 rounded-xl border border-zinc-800">
      {/* Mobile Layout */}
      <div className="block sm:hidden p-4">
        <div className="flex flex-col items-center text-center space-y-4">
          {/* Avatar */}
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 border-2 border-zinc-600 flex items-center justify-center">
              {profileData?.profile_image_url ? (
                <img
                  src={profileData.profile_image_url}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-2xl font-bold text-zinc-300 select-none">
                  {getInitials()}
                </span>
              )}
            </div>
            {/* Online indicator - only for own profile */}
            {isMyProfile && (
              <span className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 border-2 border-black rounded-full" />
            )}
          </div>

          {/* User Info */}
          <div className="space-y-2">
            <h1 className="text-xl font-bold text-white">{displayName}</h1>
            <div className="flex items-center justify-center gap-3 text-sm text-zinc-400">
              <span>{userId?.slice(0, 8)}</span>
              <span>•</span>
              <span>{t.header.activeMember()}</span>
            </div>
          </div>

          {/* Action Button */}
          {isMyProfile ? (
            <button
              onClick={onEditClick}
              className="w-full px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              {t.header.edit()}
            </button>
          ) : null}
          {/* Follow button - hidden for now, will be implemented later
          {!isMyProfile && (
            <button className="w-full px-4 py-2 bg-[#EAFD66] text-black rounded-lg font-medium hover:bg-[#d9ec55] transition-colors">
              {t.header.follow()}
            </button>
          )}
          */}
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden sm:block p-6">
        {/* Top Section: Avatar, User Info, Action Button */}
        <div className="flex items-center gap-4 mb-6">
          {/* Avatar */}
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 border-2 border-zinc-600 flex items-center justify-center">
              {profileData?.profile_image_url ? (
                <img
                  src={profileData.profile_image_url}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-xl font-bold text-zinc-300 select-none">{getInitials()}</span>
              )}
            </div>
            {/* Online indicator - only for own profile */}
            {isMyProfile && (
              <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-black rounded-full" />
            )}
          </div>

          {/* User Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-white">{displayName}</h1>
            </div>

            {/* SUI Address and Member Since */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-zinc-400">
              {/* SUI Address */}
              {profileData?.sui_address && (
                <>
                  <span className="text-zinc-500 uppercase tracking-wide text-xs">
                    {t.sidebar.suiAddress()}:
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-zinc-300">
                      {profileData.sui_address.slice(0, 6)}...{profileData.sui_address.slice(-4)}
                    </span>
                    <button
                      onClick={() => navigator.clipboard.writeText(profileData.sui_address!)}
                      className="p-0.5 text-zinc-500 hover:text-zinc-300 transition-colors flex-shrink-0"
                      title="Copy address"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    </button>
                  </div>
                  <span className="text-zinc-600">·</span>
                </>
              )}

              {/* Member Since */}
              <span className="text-zinc-500 uppercase tracking-wide text-xs">
                {t.sidebar.memberSince()}
              </span>
            </div>
          </div>

          {/* Action Button */}
          {isMyProfile ? (
            <button
              onClick={onEditClick}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              {t.header.edit()}
            </button>
          ) : null}
        </div>

        {/* Bottom Section: Activity Overview */}
        {isMyProfile && (
          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-zinc-800">
            {statsData.map((stat) => (
              <button
                key={stat.label}
                onClick={stat.onClick}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900 transition-all duration-200 cursor-pointer group"
              >
                <span className="text-base font-bold text-white group-hover:text-[#EAFD66] transition-colors">
                  {stat.value}
                </span>
                <span className="text-xs text-zinc-400 group-hover:text-zinc-300 transition-colors">
                  {stat.label}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
