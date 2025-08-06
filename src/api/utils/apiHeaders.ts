import { getValidAccessToken } from '../../domains/auth/utils/tokenManager';

/**
 * API 요청에 사용할 기본 헤더를 생성합니다.
 */
export const createApiHeaders = (additionalHeaders?: Record<string, string>): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'User-Agent': 'Decoded-App/1.0',
  };

  // 토큰이 있으면 Authorization 헤더 추가
  const token = getValidAccessToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
    if (process.env.NODE_ENV === 'development') {
      console.log('[apiHeaders] Authorization header added:', token.substring(0, 20) + '...');
    }
  } else {
    if (process.env.NODE_ENV === 'development') {
      console.log('[apiHeaders] No valid token found, skipping Authorization header');
    }
  }

  // 추가 헤더가 있으면 병합
  if (additionalHeaders) {
    Object.assign(headers, additionalHeaders);
  }

  return headers;
};

/**
 * 토큰을 새로고침하고 헤더를 업데이트합니다.
 */
export const refreshApiHeaders = (): HeadersInit => {
  return createApiHeaders();
};

/**
 * 현재 토큰 상태를 확인합니다.
 */
export const getTokenStatus = () => {
  const token = getValidAccessToken();
  return {
    hasToken: !!token,
    tokenPreview: token ? token.substring(0, 20) + '...' : null,
  };
};
