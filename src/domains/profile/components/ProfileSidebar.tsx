import React from 'react';
import { useRouter } from 'next/navigation';
import { GetUserProfile } from '@/api/generated/models/GetUserProfile';
import { useMyChannels } from '../hooks/useProfileActivity';
import { useBookmarks } from '@/domains/bookmarks/hooks/useBookmarks';
import { useProfileTranslation } from '@/lib/i18n/hooks';

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
  const { data: bookmarks } = useBookmarks({
    limit: 5,
    enabled: isMyProfile,
  });

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Recent Activity - Only for own profile */}
      {isMyProfile && (
        <>
          {/* Recent Channels */}
          {channels && channels.channels && channels.channels.length > 0 && (
            <div className="bg-zinc-900/50 rounded-xl p-3 sm:p-4 border border-zinc-800">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <h3 className="text-sm sm:text-base font-semibold text-white">
                  {t.sidebar.recentChannels()}
                </h3>
                <button
                  onClick={() => router.push(`/profile/${userId}?tab=channels`)}
                  className="text-xs text-[#EAFD66] hover:text-[#d9ec55] transition-colors"
                >
                  {t.sidebar.viewAll()} →
                </button>
              </div>
              <div className="space-y-2">
                {channels.channels.slice(0, 2).map((channel) => (
                  <div
                    key={channel.id}
                    onClick={() => router.push(`/channels/${channel.id}`)}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-zinc-800/50 cursor-pointer transition-colors"
                  >
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
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
                      <p className="font-medium text-white text-xs truncate">{channel.name}</p>
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
            <div className="bg-zinc-900/50 rounded-xl p-3 sm:p-4 border border-zinc-800">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <h3 className="text-sm sm:text-base font-semibold text-white">
                  {t.sidebar.recentBookmarks()}
                </h3>
                <button
                  onClick={() => router.push(`/profile/${userId}?tab=bookmarks`)}
                  className="text-xs text-[#EAFD66] hover:text-[#d9ec55] transition-colors"
                >
                  {t.sidebar.viewAll()} →
                </button>
              </div>
              <div className="space-y-2">
                {bookmarks.bookmarks.slice(0, 2).map((bookmark) => (
                  <div
                    key={bookmark.content_id}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-zinc-800/50 cursor-pointer transition-colors"
                  >
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-zinc-700 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white"
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
                      <p className="font-medium text-white text-xs line-clamp-1">
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
        <div className="bg-zinc-900/50 rounded-xl p-3 sm:p-4 border border-zinc-800">
          <h3 className="text-sm sm:text-base font-semibold text-white mb-2 sm:mb-3">
            {t.sidebar.about()}
          </h3>
          <p className="text-xs text-zinc-400">{t.sidebar.aboutDescription()}</p>

          {/* Future: Follow/Unfollow button */}
          {/* <div className="mt-2 sm:mt-3">
            <button className="w-full px-3 py-2 bg-[#EAFD66] text-black rounded-lg font-medium hover:bg-[#d9ec55] transition-colors text-sm">
              {t.sidebar.followUser()}
            </button>
          </div> */}
        </div>
      )}
    </div>
  );
}
