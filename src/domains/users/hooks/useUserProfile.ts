import { useQuery } from '@tanstack/react-query';
import { UsersService } from '@/api/generated/services/UsersService';
import { queryKeys } from '@/lib/api/queryKeys';

interface UseUserProfileParams {
  userId: string;
  enabled?: boolean;
}

export function useUserProfile({ userId, enabled = true }: UseUserProfileParams) {
  return useQuery({
    queryKey: queryKeys.users.profile(userId),
    queryFn: () => UsersService.getProfileUsersUserIdProfileGet(userId),
    enabled: enabled && !!userId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    retry: 3,
  });
}
