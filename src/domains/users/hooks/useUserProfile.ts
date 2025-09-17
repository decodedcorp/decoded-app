import { useQuery } from '@tanstack/react-query';
import { UsersService, GetUserProfile } from '@/api/generated';

export interface UseUserProfileOptions {
  enabled?: boolean;
}

export const useUserProfile = (userId: string, options: UseUserProfileOptions = {}) => {
  const { enabled = true } = options;

  return useQuery<GetUserProfile>({
    queryKey: ['userProfile', userId],
    queryFn: () => UsersService.getProfileUsersUserIdProfileGet(userId),
    enabled: enabled && !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 1, // API 실패 시 1번만 재시도
  });
};
