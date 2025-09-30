import { useCallback, useEffect, useRef } from 'react';
import { useAuthStore } from '@/store/authStore';
import type { GetUserProfile } from '@/api/generated/models/GetUserProfile';
import {
  shouldSyncProfile,
  hashUserFields,
  createInitialSyncState,
  type SyncState,
} from '@/lib/utils/profileSync';

/**
 * Hook for syncing profile data to AuthStore with loop prevention guards
 *
 * Features:
 * - Account switching detection and cleanup
 * - Request timing competition prevention
 * - Hash-based duplicate prevention
 * - Timestamp freshness validation
 */
export const useSyncProfileToStore = () => {
  const updateUserFromProfile = useAuthStore((state) => state.updateUserFromProfile);
  const currentUser = useAuthStore((state) => state.user);

  const lastSyncRef = useRef<SyncState>(createInitialSyncState());
  const requestTracker = useRef<Map<string, number>>(new Map());

  // Account switching detection and cleanup
  useEffect(() => {
    const newUserId = currentUser?.doc_id || '';

    if (newUserId !== lastSyncRef.current.userId) {
      if (process.env.NODE_ENV === 'development') {
        console.log('[ProfileSync] Account switch detected, cleaning up', {
          prevUser: lastSyncRef.current.userId,
          newUser: newUserId,
        });
      }

      // Reset all tracking state
      lastSyncRef.current = {
        userId: newUserId,
        timestamp: '',
        hash: '',
      };
      requestTracker.current.clear();
    }
  }, [currentUser?.doc_id]);

  /**
   * Track request for timing competition prevention
   */
  const trackRequest = useCallback((requestId: string): void => {
    requestTracker.current.set(requestId, Date.now());

    // Cleanup old requests (keep only last 10)
    if (requestTracker.current.size > 10) {
      const entries = Array.from(requestTracker.current.entries());
      entries.sort((a, b) => b[1] - a[1]); // Sort by timestamp desc

      requestTracker.current.clear();
      entries.slice(0, 10).forEach(([id, time]) => {
        requestTracker.current.set(id, time);
      });
    }
  }, []);

  /**
   * Sync profile data to AuthStore with comprehensive guards
   */
  const syncToStore = useCallback(
    (profileData: GetUserProfile, requestId?: string): boolean => {
      const shouldSync = shouldSyncProfile(
        profileData,
        currentUser,
        lastSyncRef.current,
        requestId,
        requestTracker.current
      );

      if (!shouldSync) {
        return false;
      }

      try {
        // Execute synchronization
        updateUserFromProfile(profileData);

        // Update sync state
        lastSyncRef.current = {
          userId: currentUser!.doc_id,
          timestamp: new Date().toISOString(), // Use current time since API doesn't provide updated_at
          hash: hashUserFields(profileData),
        };

        if (process.env.NODE_ENV === 'development') {
          console.log('[ProfileSync] Successfully synced profile to store', {
            userId: currentUser!.doc_id,
            aka: profileData.aka,
            hasImage: !!profileData.profile_image_url,
            requestId,
          });
        }

        return true;
      } catch (error) {
        console.error('[ProfileSync] Failed to sync profile to store:', error);
        return false;
      }
    },
    [currentUser, updateUserFromProfile]
  );

  /**
   * Get current sync state (for debugging/monitoring)
   */
  const getSyncState = useCallback((): SyncState & { requestCount: number } => {
    return {
      ...lastSyncRef.current,
      requestCount: requestTracker.current.size,
    };
  }, []);

  return {
    syncToStore,
    trackRequest,
    getSyncState,
  };
};