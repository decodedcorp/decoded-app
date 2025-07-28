// Re-export domain-specific hooks for backward compatibility
export * from '../../domains/channels';
export * from '../../domains/contents';
export * from '../../domains/feeds';
export * from '../../domains/interactions';

// Users and Auth hooks (keeping these here for now)
import { useQuery, useMutation } from '@tanstack/react-query';
import { UsersService, AuthService } from '../generated';
import { queryKeys } from '../../lib/api/queryKeys';

// Users API hook - temporarily disabled due to missing service method
// export const useUsers = (params?: Record<string, any>) => {
//   return useQuery({
//     queryKey: queryKeys.users.list(params || {}),
//     queryFn: () =>
//       UsersService.listUsersUsersGet(
//         params?.page || 1,
//         params?.limit || 20,
//         params?.search,
//         params?.role,
//         params?.status,
//         params?.sortBy || 'created_at',
//         params?.sortOrder || 'desc',
//       ),
//   });
// };

export const useLogin = () => {
  return useMutation({
    mutationFn: AuthService.loginAuthLoginPost,
  });
};
