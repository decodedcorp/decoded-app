import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UsersService } from '@/api/generated/services/UsersService';
import { UpdateProfileRequest } from '@/api/generated/models/UpdateProfileRequest';
import { queryKeys } from '@/lib/api/queryKeys';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';
import { useCommonTranslation } from '@/lib/i18n/hooks';
import type { GetUserProfile } from '@/api/generated/models/GetUserProfile';
import { createDualKeyCacheManager } from '@/lib/utils/cacheHelpers';

/**
 * Hook to get current user's profile
 */
export const useMyProfile = () => {
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: queryKeys.users.profile(user?.doc_id || ''),
    queryFn: () => {
      if (!user?.doc_id) {
        throw new Error('User ID not available');
      }
      // 실제 사용자 ID를 사용해서 프로필 가져오기 ('me' 대신)
      return UsersService.getProfileUsersUserIdProfileGet(user.doc_id);
    },
    enabled: !!user?.doc_id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to get any user's public profile
 */
export const useUserProfile = (userId: string) => {
  return useQuery({
    queryKey: queryKeys.users.profile(userId),
    queryFn: () => UsersService.getProfileUsersUserIdProfileGet(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to update current user's profile
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const t = useCommonTranslation();
  const { createSnapshot, rollbackToSnapshot, syncProfileKeys, invalidateProfileKeys } =
    createDualKeyCacheManager(queryClient);

  return useMutation({
    mutationFn: (data: UpdateProfileRequest) =>
      UsersService.updateMyProfileUsersMeProfilePatch(data),
    onMutate: async (data: UpdateProfileRequest) => {
      if (!user?.doc_id) return { updateId: undefined };

      const updateId = `upd_${Date.now()}`;

      // Create snapshot for rollback
      createSnapshot(user.doc_id, updateId);

      // Prepare optimistic profile
      const current =
        (queryClient.getQueryData(queryKeys.users.myProfile()) as GetUserProfile | undefined) ||
        (queryClient.getQueryData(queryKeys.users.profile(user.doc_id)) as
          | GetUserProfile
          | undefined);

      const cacheBustedImage = current?.profile_image_url
        ? `${current.profile_image_url}?v=${Date.now()}`
        : null;

      const optimistic: GetUserProfile = {
        aka: (data.aka as string | undefined) ?? current?.aka ?? '',
        profile_image_url: data.base64_profile_image
          ? cacheBustedImage
          : current?.profile_image_url ?? null,
        sui_address: current?.sui_address ?? '',
      };

      // Optimistically sync to both keys
      if (user.doc_id) {
        syncProfileKeys(user.doc_id, optimistic);
      }

      // Also update AuthStore nickname immediately if changed
      try {
        useAuthStore.getState().updateUserFromProfile({
          aka: optimistic.aka,
          profile_image_url: optimistic.profile_image_url,
          sui_address: optimistic.sui_address,
        } as any);
      } catch {
        // ignore store update errors
      }

      return { updateId };
    },
    onSuccess: () => {
      // Don't invalidate cache - keep optimistic update
      // Server data might be stale due to async processing
      toast.success(t.toast.profile.updated());

      // Optional: Schedule a very delayed sync (10+ seconds) for eventual consistency
      if (user?.doc_id) {
        setTimeout(() => {
          invalidateProfileKeys(user.doc_id);
        }, 10000); // Wait 10 seconds for eventual consistency
      }
    },
    onError: (error: any, _variables, context) => {
      console.error('Failed to update profile:', error);
      if (user?.doc_id && context?.updateId) {
        rollbackToSnapshot(context.updateId);
      }
      toast.error(error?.body?.detail || t.toast.profile.updateFailed());
    },
  });
};

/**
 * Process and prepare image for upload
 */
export const processProfileImage = async (file: File): Promise<string> => {
  const { compressImage, fileToBase64 } = await import('@/lib/utils/imageUtils');

  // Validate file type
  if (!file.type.startsWith('image/')) {
    throw new Error('Please select an image file');
  }

  // Validate file size (5MB limit)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error('Image size must be less than 5MB');
  }

  try {
    // Compress image (returns base64 string directly)
    const base64 = await compressImage(file, {
      maxWidth: 512,
      maxHeight: 512,
      quality: 0.8,
    });

    return base64;
  } catch (error) {
    console.error('Failed to process image:', error);
    throw new Error('Failed to process image');
  }
};
