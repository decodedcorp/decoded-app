import { useRef } from 'react';
import type { QueryClient } from '@tanstack/react-query';
import type { GetUserProfile } from '@/api/generated/models/GetUserProfile';
import type { User } from '@/domains/auth/types/auth';
import { queryKeys } from '@/lib/api/queryKeys';
import { useAuthStore } from '@/store/authStore';

/**
 * Snapshot for rollback functionality
 */
export interface ProfileSnapshot {
  id: string;
  userId: string;
  userProfile: GetUserProfile | null;
  meProfile: GetUserProfile | null;
  storeUser: User | null;
  timestamp: number;
}

/**
 * Create dual-key cache manager for profile data consistency
 */
export const createDualKeyCacheManager = (queryClient: QueryClient) => {
  const snapshotStack = useRef<ProfileSnapshot[]>([]);

  /**
   * Sync profile data to both cache keys atomically
   */
  const syncProfileKeys = (userId: string, data: GetUserProfile): void => {
    // Check if data is actually different to prevent unnecessary updates
    const currentUserData = queryClient.getQueryData(queryKeys.users.profile(userId));
    const currentMeData = queryClient.getQueryData(queryKeys.users.profile('me'));

    const isUserDataDifferent =
      !currentUserData || JSON.stringify(currentUserData) !== JSON.stringify(data);
    const isMeDataDifferent =
      !currentMeData || JSON.stringify(currentMeData) !== JSON.stringify(data);

    if (!isUserDataDifferent && !isMeDataDifferent) {
      if (process.env.NODE_ENV === 'development') {
        console.debug('[CacheSync] Skipping identical data update', {
          userId,
          aka: data.aka,
          hasImage: !!data.profile_image_url,
        });
      }
      return;
    }

    // Atomic update to both keys
    queryClient.setQueryData(queryKeys.users.profile(userId), data);
    queryClient.setQueryData(queryKeys.users.profile('me'), data);

    if (process.env.NODE_ENV === 'development') {
      console.log('[CacheSync] Updated both profile keys', {
        userId,
        aka: data.aka,
        hasImage: !!data.profile_image_url,
        userDataChanged: isUserDataDifferent,
        meDataChanged: isMeDataDifferent,
      });
    }
  };

  /**
   * Invalidate both profile keys
   */
  const invalidateProfileKeys = (userId: string): Promise<void> => {
    return Promise.all([
      queryClient.invalidateQueries({
        queryKey: queryKeys.users.profile(userId),
      }),
      queryClient.invalidateQueries({
        queryKey: queryKeys.users.profile('me'),
      }),
    ]).then(() => {});
  };

  /**
   * Create snapshot for rollback functionality
   */
  const createSnapshot = (userId: string, updateId: string): string => {
    const snapshot: ProfileSnapshot = {
      id: updateId,
      userId,
      userProfile: queryClient.getQueryData(queryKeys.users.profile(userId)) || null,
      meProfile: queryClient.getQueryData(queryKeys.users.profile('me')) || null,
      storeUser: useAuthStore.getState().user,
      timestamp: Date.now(),
    };

    snapshotStack.current.push(snapshot);

    // Keep only recent 3 snapshots (handle consecutive optimistic updates)
    if (snapshotStack.current.length > 3) {
      snapshotStack.current.shift();
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('[CacheSnapshot] Created snapshot', {
        updateId,
        userId,
        stackSize: snapshotStack.current.length,
      });
    }

    return updateId;
  };

  /**
   * Rollback to specific snapshot (LIFO order)
   */
  const rollbackToSnapshot = (updateId: string): boolean => {
    const snapshotIndex = snapshotStack.current.findIndex((s) => s.id === updateId);
    if (snapshotIndex === -1) {
      console.warn('[CacheSnapshot] Snapshot not found for rollback:', updateId);
      return false;
    }

    const snapshot = snapshotStack.current[snapshotIndex];

    try {
      // Rollback cache
      if (snapshot.userProfile) {
        queryClient.setQueryData(queryKeys.users.profile(snapshot.userId), snapshot.userProfile);
      }
      if (snapshot.meProfile) {
        queryClient.setQueryData(queryKeys.users.profile('me'), snapshot.meProfile);
      }

      // Rollback AuthStore
      if (snapshot.storeUser) {
        useAuthStore.getState().setUser(snapshot.storeUser);
      }

      // Remove used snapshot and everything after it (LIFO)
      snapshotStack.current = snapshotStack.current.slice(0, snapshotIndex);

      if (process.env.NODE_ENV === 'development') {
        console.log('[CacheSnapshot] Successfully rolled back', {
          updateId,
          remainingSnapshots: snapshotStack.current.length,
        });
      }

      return true;
    } catch (error) {
      console.error('[CacheSnapshot] Failed to rollback:', error);
      return false;
    }
  };

  /**
   * Clear snapshots (on account switch or cleanup)
   */
  const clearSnapshots = (userId?: string): void => {
    if (userId) {
      const beforeCount = snapshotStack.current.length;
      snapshotStack.current = snapshotStack.current.filter((s) => s.userId !== userId);

      if (process.env.NODE_ENV === 'development') {
        console.log('[CacheSnapshot] Cleared snapshots for user', {
          userId,
          cleared: beforeCount - snapshotStack.current.length,
          remaining: snapshotStack.current.length,
        });
      }
    } else {
      snapshotStack.current = [];
      if (process.env.NODE_ENV === 'development') {
        console.log('[CacheSnapshot] Cleared all snapshots');
      }
    }
  };

  /**
   * Get current snapshot stack info (for debugging)
   */
  const getSnapshotInfo = () => {
    return {
      count: snapshotStack.current.length,
      snapshots: snapshotStack.current.map((s) => ({
        id: s.id,
        userId: s.userId,
        timestamp: s.timestamp,
      })),
    };
  };

  return {
    syncProfileKeys,
    invalidateProfileKeys,
    createSnapshot,
    rollbackToSnapshot,
    clearSnapshots,
    getSnapshotInfo,
  };
};

/**
 * Hook wrapper for easier usage in components
 */
export const useDualKeyCacheManager = (queryClient: QueryClient) => {
  return createDualKeyCacheManager(queryClient);
};
