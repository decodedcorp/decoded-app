import { useAuthStore } from '../../../store/authStore';

export interface TokenData {
  access_token: string;
  refresh_token: string;
}

export interface DecodedToken {
  exp: number;
  iat: number;
  sub: string;
  email?: string;
  role?: string;
}

/**
 * JWT 토큰을 디코딩합니다 (payload 부분만)
 */
export const decodeToken = (token: string): DecodedToken | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};

/**
 * 토큰이 만료되었는지 확인합니다
 */
export const isTokenExpired = (token: string): boolean => {
  const decoded = decodeToken(token);
  if (!decoded) return true;

  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp < currentTime;
};

/**
 * 토큰이 곧 만료될 예정인지 확인합니다 (5분 이내)
 */
export const isTokenExpiringSoon = (token: string): boolean => {
  const decoded = decodeToken(token);
  if (!decoded) return true;

  const currentTime = Math.floor(Date.now() / 1000);
  const fiveMinutes = 5 * 60;
  return decoded.exp < currentTime + fiveMinutes;
};

/**
 * 토큰을 안전하게 저장합니다
 */
export const storeTokens = (tokens: TokenData): void => {
  try {
    localStorage.setItem('access_token', tokens.access_token);
    localStorage.setItem('refresh_token', tokens.refresh_token);
  } catch (error) {
    console.error('Failed to store tokens:', error);
  }
};

/**
 * 저장된 토큰을 안전하게 가져옵니다
 */
export const getStoredTokens = (): TokenData | null => {
  try {
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');

    if (!accessToken || !refreshToken) {
      return null;
    }

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  } catch (error) {
    console.error('Failed to get stored tokens:', error);
    return null;
  }
};

/**
 * 저장된 토큰을 안전하게 제거합니다
 */
export const clearStoredTokens = (): void => {
  try {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  } catch (error) {
    console.error('Failed to clear stored tokens:', error);
  }
};

/**
 * 현재 유효한 액세스 토큰을 가져옵니다
 */
export const getValidAccessToken = (): string | null => {
  const tokens = getStoredTokens();
  if (!tokens) return null;

  if (isTokenExpired(tokens.access_token)) {
    return null;
  }

  return tokens.access_token;
};

/**
 * 토큰 갱신을 시도합니다
 */
export const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const tokens = getStoredTokens();
    if (!tokens) {
      throw new Error('No refresh token available');
    }

    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refresh_token: tokens.refresh_token,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const data = await response.json();
    const newTokens: TokenData = {
      access_token: data.access_token,
      refresh_token: data.refresh_token || tokens.refresh_token, // 새로운 refresh token이 없으면 기존 것 사용
    };

    storeTokens(newTokens);
    useAuthStore.getState().setTokens(newTokens.access_token, newTokens.refresh_token);

    return newTokens.access_token;
  } catch (error) {
    console.error('Failed to refresh access token:', error);
    // 토큰 갱신 실패 시 로그아웃
    useAuthStore.getState().logout();
    return null;
  }
};

/**
 * API 요청을 위한 인증 헤더를 생성합니다
 */
export const getAuthHeaders = async (): Promise<Record<string, string>> => {
  let accessToken = getValidAccessToken();

  if (!accessToken) {
    // 토큰이 없거나 만료된 경우 갱신 시도
    accessToken = await refreshAccessToken();
  }

  if (!accessToken) {
    throw new Error('No valid access token available');
  }

  return {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  };
};

/**
 * 인증이 필요한 API 요청을 위한 래퍼 함수
 */
export const authenticatedFetch = async (
  url: string,
  options: RequestInit = {},
): Promise<Response> => {
  try {
    const headers = await getAuthHeaders();

    const response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });

    // 401 에러가 발생하면 토큰 갱신을 시도하고 재요청
    if (response.status === 401) {
      const newAccessToken = await refreshAccessToken();
      if (newAccessToken) {
        const newHeaders = await getAuthHeaders();
        return fetch(url, {
          ...options,
          headers: {
            ...newHeaders,
            ...options.headers,
          },
        });
      }
    }

    return response;
  } catch (error) {
    console.error('Authenticated fetch failed:', error);
    throw error;
  }
};
