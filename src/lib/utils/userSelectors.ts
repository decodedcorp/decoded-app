import type { GetUserProfile } from '@/api/generated/models/GetUserProfile';
import type { User } from '@/domains/auth/types/auth';

/**
 * Display user data interface
 */
export interface DisplayUserData {
  displayName: string;
  avatarUrl: string | null;
  userId: string | null;
  isOnline: boolean;
  // Keep raw URL for debugging/comparison
  _rawAvatarUrl?: string | null;
}

/**
 * Select display user data with priority logic and cache-buster support
 */
export const selectDisplayUser = (
  profile?: GetUserProfile | null,
  storeUser?: User | null,
  isOptimistic = false
): DisplayUserData => {
  // Priority hierarchy:
  // 1. Profile aka > AuthStore nickname > 'User'
  // 2. Profile image > null
  // 3. Profile userId > AuthStore doc_id

  const displayName = profile?.aka || storeUser?.nickname || 'User';
  const baseAvatarUrl = profile?.profile_image_url || null;
  const userId = storeUser?.doc_id || null; // Profile API doesn't return user_id, use from AuthStore

  // Cache-buster only for optimistic updates (view layer only)
  const avatarUrl = baseAvatarUrl && isOptimistic
    ? `${baseAvatarUrl}?v=${Date.now()}`
    : baseAvatarUrl;

  return {
    displayName,
    avatarUrl,
    userId,
    isOnline: !!storeUser, // If in AuthStore, consider online
    _rawAvatarUrl: baseAvatarUrl,
  };
};

/**
 * Get user initials for avatar fallback
 */
export const getUserInitials = (displayData: DisplayUserData): string => {
  if (displayData.displayName && displayData.displayName.trim() && displayData.displayName !== 'User') {
    return displayData.displayName.substring(0, 2).toUpperCase();
  }

  if (displayData.userId) {
    return displayData.userId.substring(0, 2).toUpperCase();
  }

  return '?';
};

/**
 * Check if user data represents the current authenticated user
 */
export const isCurrentUser = (displayData: DisplayUserData, authUser?: User | null): boolean => {
  return !!(authUser && displayData.userId === authUser.doc_id);
};

/**
 * Debug helper to compare data sources
 */
export const compareDataSources = (profile?: GetUserProfile | null, storeUser?: User | null) => {
  if (process.env.NODE_ENV !== 'development') return;

  console.group('[UserData Comparison]');
  console.log('Profile data:', {
    aka: profile?.aka,
    profile_image_url: profile?.profile_image_url,
    sui_address: profile?.sui_address,
  });
  console.log('Store data:', {
    nickname: storeUser?.nickname,
    doc_id: storeUser?.doc_id,
    email: storeUser?.email,
  });
  console.log('Selected display:', selectDisplayUser(profile, storeUser));
  console.groupEnd();
};