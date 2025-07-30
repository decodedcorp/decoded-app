import { getAccessToken, getValidAccessToken } from '../domains/auth/utils/tokenManager';

/**
 * API Configuration
 * Backup 방식: sessionStorage 기반 토큰 관리
 */

// Base URL configuration
// 개발 환경에서는 Next.js 프록시를 사용하여 CORS 문제 해결
// 프로덕션에서도 프록시 사용 (CORS 및 보안상 이점)
// 백업 방식으로 전환하려면 USE_DIRECT_API=true 환경변수 설정
const getApiBaseUrl = () => {
  // 환경 변수 확인
  const envApiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const nodeEnv = process.env.NODE_ENV;
  const useDirectApi = process.env.NEXT_PUBLIC_USE_DIRECT_API === 'true';

  console.log('[API Config] Environment check:', {
    NODE_ENV: nodeEnv,
    NEXT_PUBLIC_API_BASE_URL: envApiUrl,
    USE_DIRECT_API: useDirectApi,
  });

  // 백업 방식 사용 시 직접 API 호출
  if (useDirectApi) {
    if (envApiUrl) {
      console.log('[API Config] Using direct API URL:', envApiUrl);
      return envApiUrl;
    }
    const defaultUrl = 'https://dev.decoded.style';
    console.log('[API Config] Using default direct URL:', defaultUrl);
    return defaultUrl;
  }

  // 모든 환경에서 프록시 사용 (CORS 및 보안상 이점)
  console.log('[API Config] Using proxy for all environments: /api/proxy');
  return '/api/proxy';
};

export const API_BASE_URL = getApiBaseUrl();

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
  console.log('[API Config] API configured for sessionStorage-based authentication');
  console.log('[API Config] Base URL:', API_BASE_URL);

  // Configure OpenAPI with dynamic token resolver
  // Note: OpenAPI configuration is now handled in useApi.ts
  console.log('[API Config] OpenAPI configuration handled in useApi.ts');
};
