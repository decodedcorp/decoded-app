import { getAccessToken, getValidAccessToken } from '../domains/auth/utils/tokenManager';

/**
 * API Configuration
 * Backup 방식: sessionStorage 기반 토큰 관리
 */

// Base URL configuration
// 개발 환경에서는 Next.js 프록시를 사용하여 CORS 문제 해결
export const API_BASE_URL =
  process.env.NODE_ENV === 'development'
    ? '/api/proxy'
    : process.env.NEXT_PUBLIC_API_BASE_URL || 'https://dev.decoded.style';

// Default headers
const getDefaultHeaders = () => ({
  'Content-Type': 'application/json',
});

/**
 * Get request configuration with authentication
 * Backup 방식: sessionStorage에서 토큰 가져오기
 */
export const getRequestConfig = (
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
  body?: any,
  additionalHeaders?: Record<string, string>,
) => {
  const config: RequestInit = {
    method,
    headers: {
      ...getDefaultHeaders(),
      ...additionalHeaders,
    },
  };

  // Add body for non-GET requests
  if (method !== 'GET' && body) {
    config.body = JSON.stringify(body);
  }

  // Add authorization header if token is available
  const accessToken = getValidAccessToken();
  if (accessToken) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${accessToken}`,
    };
  }

  return config;
};

/**
 * Update API token from storage
 * Backup 방식: sessionStorage에서 토큰 업데이트
 */
export const updateApiTokenFromStorage = () => {
  // This function is called when tokens are updated
  // The actual token retrieval happens in getRequestConfig
  // No additional logic needed for sessionStorage approach
};

/**
 * Check if user is authenticated for API calls
 */
export const isAuthenticatedForAPI = (): boolean => {
  return !!getValidAccessToken();
};

/**
 * Get current access token for API calls
 */
export const getCurrentAccessToken = (): string | null => {
  return getValidAccessToken();
};

/**
 * Configure API settings
 * This function is called during app initialization
 */
export const configureApi = () => {
  // Initialize API configuration
  // For sessionStorage approach, no additional setup is needed
  // Tokens are retrieved on-demand in getRequestConfig
  console.log('API configured for sessionStorage-based authentication');
};
