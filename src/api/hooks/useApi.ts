// Re-export domain-specific hooks for centralized access (excluding auth types to prevent conflicts)
export * from '../../domains/channels';
export * from '../../domains/contents';
export * from '../../domains/interactions';

// Auth-specific hooks using generated services
import { useMutation } from '@tanstack/react-query';

import { AuthService } from '../generated';
import { updateApiTokenFromStorage } from '../config';
import { OpenAPI } from '../generated/core/OpenAPI';
import { getValidAccessToken } from '../../domains/auth/utils/tokenManager';

// Configure OpenAPI with dynamic token resolver
OpenAPI.BASE = '/api/proxy';

// Function to update OpenAPI token dynamically
const updateOpenAPIToken = () => {
  const token = getValidAccessToken();
  if (token) {
    // 토큰 형식 확인
    if (!token.startsWith('eyJ')) {
      console.error('[useApi] Invalid token format:', token.substring(0, 20) + '...');
      return;
    }

    // 토큰을 동기적으로 설정 (함수 대신 직접 값 설정)
    OpenAPI.TOKEN = token;
    if (process.env.NODE_ENV === 'development') {
      console.log('[useApi] OpenAPI token updated:', token.substring(0, 20) + '...');
      console.log('[useApi] Token length:', token.length);
    }
  } else {
    OpenAPI.TOKEN = undefined;
    if (process.env.NODE_ENV === 'development') {
      console.log('[useApi] OpenAPI token cleared');
    }
  }
};

// 토큰을 동적으로 가져오는 함수로 설정 (더 안정적인 방식)
OpenAPI.TOKEN = () => {
  const token = getValidAccessToken();
  if (process.env.NODE_ENV === 'development') {
    console.log('[useApi] Dynamic token resolver called:', token ? 'token found' : 'no token');
    if (token) {
      console.log('[useApi] Token starts with:', token.substring(0, 20) + '...');
    }
  }

  // 토큰이 없으면 에러를 발생시키지 않고 빈 문자열 반환
  if (!token) {
    console.warn('[useApi] No valid token available for API request');
    return Promise.resolve('');
  }

  return Promise.resolve(token);
};

// Initial token setup
updateOpenAPIToken();

// Export function for external use
export const refreshOpenAPIToken = updateOpenAPIToken;

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
        // 로그인 성공 후 즉시 OpenAPI 토큰 업데이트
        updateOpenAPIToken();
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
        // OAuth 성공 후 즉시 OpenAPI 토큰 업데이트
        updateOpenAPIToken();
      }
    },
  });
};
