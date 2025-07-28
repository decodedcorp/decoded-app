// Re-export all domain-specific hooks for centralized access
export * from '../../domains/auth';
export * from '../../domains/channels';
export * from '../../domains/contents';
export * from '../../domains/feeds';
export * from '../../domains/interactions';

// Auth-specific hooks using generated services
import { useMutation, useQuery } from '@tanstack/react-query';
import { AuthService } from '../generated';
import { queryKeys } from '../../lib/api/queryKeys';
import { updateApiTokenFromStorage } from '../config';

/**
 * Login mutation hook using generated AuthService
 */
export const useLoginMutation = () => {
  return useMutation({
    mutationFn: AuthService.loginAuthLoginPost,
    onSuccess: (data) => {
      // Update API token after successful login
      if (data.access_token) {
        updateApiTokenFromStorage();
      }
    },
  });
};

/**
 * Google OAuth mutation hook
 * Note: This uses Next.js API routes, not the generated service
 */
export const useGoogleOAuthMutation = () => {
  return useMutation({
    mutationFn: async (code: string) => {
      const response = await fetch('/api/auth/google/callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        throw new Error(`OAuth callback failed: ${response.statusText}`);
      }

      return response.json();
    },
    onSuccess: (data) => {
      // Update API token after successful OAuth
      if (data.access_token) {
        updateApiTokenFromStorage();
      }
    },
  });
};
