import React from 'react';
import { GetUserProfile } from '@/api/generated/models/GetUserProfile';
import { useProfileTranslation } from '@/lib/i18n/hooks';
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
  const t = useProfileTranslation();

  if (!profileData && !userId) return null;

  // Get user initials for avatar
  const getInitials = () => {
    if (profileData?.aka) {
      return profileData.aka.substring(0, 2).toUpperCase();
    }
    if (userId) {
      return userId.substring(0, 2).toUpperCase();
    }
    return '?';
  };

  return (
    <div className="flex items-center gap-4 p-6 bg-zinc-900/30 rounded-xl border border-zinc-800">
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
          <h1 className="text-2xl font-bold text-white">
            {profileData?.aka || `User ${userId?.slice(0, 6)}`}
          </h1>
        </div>

        <div className="flex items-center gap-4 text-sm text-zinc-400">
          <span>u/{userId?.slice(0, 8)}</span>
          <span>•</span>
          <span>{t.header.activeMember()}</span>
        </div>
      </div>

      {/* Action Button */}
      {isMyProfile ? (
        <button
          onClick={onEditClick}
          className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
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
      ) : (
        <button className="px-4 py-2 bg-[#EAFD66] text-black rounded-lg font-medium hover:bg-[#d9ec55] transition-colors">
          {t.header.follow()}
        </button>
      )}
    </div>
  );
}
