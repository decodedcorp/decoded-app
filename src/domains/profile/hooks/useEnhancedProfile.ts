import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRef, useEffect } from 'react';
import { UsersService } from '@/api/generated/services/UsersService';
import { queryKeys } from '@/lib/api/queryKeys';
import { useAuthStore } from '@/store/authStore';
// import { useSyncProfileToStore } from './useSyncProfileToStore'; // Removed to prevent overriding optimistic updates
import { useDualKeyCacheManager } from '@/lib/utils/cacheHelpers';
import { generateRequestId } from '@/lib/utils/profileSync';
import type { GetUserProfile } from '@/api/generated/models/GetUserProfile';

/**
 * Enhanced profile hook with timing competition prevention and dual-key sync
 */
export const useMyProfileQuery = () => {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  // const { syncToStore, trackRequest } = useSyncProfileToStore(); // Removed to prevent overriding optimistic updates
  const { syncProfileKeys } = useDualKeyCacheManager(queryClient);
  const requestIdRef = useRef<string>('');

  if (process.env.NODE_ENV === 'development') {
    console.log('[useMyProfileQuery] Debug:', {
      user: user ? { doc_id: user.doc_id, nickname: user.nickname } : null,
      enabled: !!user?.doc_id,
    });
  }

  const query = useQuery({
    queryKey: queryKeys.users.myProfile(),
    queryFn: async (): Promise<GetUserProfile & { __requestId: string }> => {
      const requestId = generateRequestId();
      requestIdRef.current = requestId;
      // trackRequest(requestId); // Commented out since trackRequest is not defined

      if (process.env.NODE_ENV === 'development') {
        console.log('[useMyProfileQuery] Making API call with userId:', user?.doc_id);
      }

      const data = await UsersService.getProfileUsersUserIdProfileGet(user?.doc_id || '');
      return { ...data, __requestId: requestId };
    },
    enabled: !!user?.doc_id,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: (query) => {
      // Throttle focus refetch - only if last fetch was > 30 seconds ago
      const lastFetch = query.state.dataUpdatedAt;
      const now = Date.now();
      return now - lastFetch > 30 * 1000;
    },
    refetchOnReconnect: true,
  });

  // Replace onSuccess with useEffect
  useEffect(() => {
    if (query.data && query.isSuccess && !query.isError) {
      // Only sync if this is the latest request
      if (query.data.__requestId === requestIdRef.current && user?.doc_id) {
        // Only sync to dual keys, not to store (store is handled by optimistic updates)
        syncProfileKeys(user.doc_id, query.data);
      }
    }
  }, [query.data, query.isSuccess, query.isError, user?.doc_id, syncProfileKeys]);

  return query;
};

/**
 * Enhanced hook for any user's profile with dual-key support
 */
export const useUserProfile = (userId: string) => {
  const queryClient = useQueryClient();
  const currentUser = useAuthStore((state) => state.user);
  // const { syncToStore } = useSyncProfileToStore(); // Removed to prevent overriding optimistic updates
  const { syncProfileKeys } = useDualKeyCacheManager(queryClient);
  const isCurrentUser = currentUser?.doc_id === userId;

  const query = useQuery({
    queryKey: queryKeys.users.profile(userId),
    queryFn: () => UsersService.getProfileUsersUserIdProfileGet(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes for other users
    gcTime: 10 * 60 * 1000,
  });

  // Replace onSuccess with useEffect
  useEffect(() => {
    if (query.data && query.isSuccess && !query.isError) {
      // If this is current user's profile, sync to store and dual keys
      if (isCurrentUser) {
        // Only sync to dual keys, not to store (store is handled by optimistic updates)
        syncProfileKeys(userId, query.data);
      }
    }
  }, [query.data, query.isSuccess, query.isError, isCurrentUser, syncProfileKeys, userId]);

  return query;
};

/**
 * Smart hook that chooses between myProfile and userProfile based on context
 */
export const useSmartUserProfile = (userId: string) => {
  const currentUser = useAuthStore((state) => state.user);
  const isCurrentUser = userId === currentUser?.doc_id;

  if (process.env.NODE_ENV === 'development') {
    console.log('[useSmartUserProfile] Debug:', {
      userId,
      currentUserId: currentUser?.doc_id,
      isCurrentUser,
    });
  }

  const myProfileQuery = useMyProfileQuery();
  const userProfileQuery = useUserProfile(userId);

  if (isCurrentUser) {
    return {
      ...myProfileQuery,
      isCurrentUser: true,
    };
  } else {
    return {
      ...userProfileQuery,
      isCurrentUser: false,
    };
  }
};
