import type { GetUserProfile } from '@/api/generated/models/GetUserProfile';
import type { User } from '@/domains/auth/types/auth';

/**
 * Profile sync utilities for handling data consistency and loop prevention
 */

/**
 * Hash user-relevant fields for change detection
 * Uses a simple hash algorithm that works with Unicode characters
 */
export const hashUserFields = (profile: GetUserProfile): string => {
  const fields = {
    aka: profile.aka || '',
    profile_image_url: profile.profile_image_url || '',
    sui_address: profile.sui_address || '',
  };

  const str = JSON.stringify(fields);

  // Simple hash function that works with Unicode characters
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  // Convert to positive hex string
  return Math.abs(hash).toString(16);
};

/**
 * Check if profile has higher field priority (for same timestamp scenarios)
 */
export const hasFieldPriority = (newProfile: GetUserProfile, currentUser: User): boolean => {
  // Priority: has aka AND has profile image
  const newScore = (newProfile.aka ? 1 : 0) + (newProfile.profile_image_url ? 1 : 0);
  const currentScore = currentUser.nickname ? 1 : 0; // AuthStore user doesn't have profile_image_url

  return newScore > currentScore;
};

/**
 * Generate unique request ID for tracking latest responses
 */
export const generateRequestId = (): string => {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Sync state interface for tracking user synchronization
 */
export interface SyncState {
  userId: string;
  timestamp: string;
  hash: string;
}

/**
 * Create initial sync state
 */
export const createInitialSyncState = (): SyncState => ({
  userId: '',
  timestamp: '',
  hash: '',
});

/**
 * Check if sync should proceed based on multiple guards
 */
export const shouldSyncProfile = (
  profileData: GetUserProfile,
  currentUser: User | null,
  lastSync: SyncState,
  requestId?: string,
  requestTracker?: Map<string, number>,
): boolean => {
  // Guard 1: Current user only - Profile API doesn't return user_id, so we trust that useMyProfile()
  // is called for the current user. This guard prevents syncing when user is null.
  if (!currentUser) {
    return false;
  }

  // Guard 2: Latest request only (timing competition)
  if (requestId && requestTracker) {
    const requestTime = requestTracker.get(requestId) || 0;
    const latestTime = Math.max(...Array.from(requestTracker.values()));
    if (requestTime < latestTime) {
      if (process.env.NODE_ENV === 'development') {
        console.debug('[ProfileSync] Ignoring outdated response', {
          requestId,
          requestTime,
          latestTime,
        });
      }
      return false;
    }
  }

  // Guard 3: Hash-based duplicate prevention
  const newHash = hashUserFields(profileData);
  if (newHash === lastSync.hash) {
    if (process.env.NODE_ENV === 'development') {
      console.debug('[ProfileSync] Ignoring duplicate data (same hash)', {
        hash: newHash,
        aka: profileData.aka,
        currentNickname: currentUser.nickname,
      });
    }
    return false;
  }

  // Guard 4: Field priority check - since API doesn't provide timestamp,
  // we use field completeness as a heuristic
  if (lastSync.hash) {
    const hasPriority = hasFieldPriority(profileData, currentUser);
    if (!hasPriority) {
      if (process.env.NODE_ENV === 'development') {
        console.debug('[ProfileSync] Ignoring lower priority data', {
          profileAka: profileData.aka,
          currentNickname: currentUser.nickname,
          hasProfileImage: !!profileData.profile_image_url,
        });
      }
      return false;
    }
  }

  // Guard 5: Check if the data is actually different from current user data
  const isDataDifferent =
    (profileData.aka || '') !== (currentUser.nickname || '') ||
    (profileData.profile_image_url || '') !== ''; // Profile image is new data

  if (!isDataDifferent) {
    if (process.env.NODE_ENV === 'development') {
      console.debug('[ProfileSync] Ignoring identical data', {
        profileAka: profileData.aka,
        currentNickname: currentUser.nickname,
      });
    }
    return false;
  }

  return true;
};
