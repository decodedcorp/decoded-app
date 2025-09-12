import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UsersService } from '@/api/generated/services/UsersService';
import { UpdateProfileRequest } from '@/api/generated/models/UpdateProfileRequest';
import { queryKeys } from '@/lib/api/queryKeys';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

/**
 * Hook to get current user's profile
 */
export const useMyProfile = () => {
  const user = useAuthStore((state) => state.user);
  
  return useQuery({
    queryKey: queryKeys.users.profile(user?.doc_id || ''),
    queryFn: () => UsersService.getMyProfileUsersMeProfileGet(),
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
  
  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => 
      UsersService.updateMyProfileUsersMeProfilePatch(data),
    onSuccess: () => {
      // Invalidate profile queries
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.users.profile(user?.doc_id || '') 
      });
      
      toast.success('Profile updated successfully');
    },
    onError: (error: any) => {
      console.error('Failed to update profile:', error);
      toast.error(error?.body?.detail || 'Failed to update profile');
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
    // Compress image
    const compressedFile = await compressImage(file, {
      maxWidth: 512,
      maxHeight: 512,
      quality: 0.8,
    });
    
    // Convert to base64
    const base64 = await fileToBase64(compressedFile);
    
    return base64;
  } catch (error) {
    console.error('Failed to process image:', error);
    throw new Error('Failed to process image');
  }
};