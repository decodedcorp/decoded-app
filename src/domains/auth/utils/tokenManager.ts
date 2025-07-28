import { STORAGE_KEYS } from '../constants';
import { TokenDecoder } from './tokenDecoder';

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

export type TokenType = 'jwt' | 'oauth' | 'unknown';

/**
 * Enhanced Token Management - Backup 방식 적용
 * - Access tokens: SessionStorage (브라우저 종료 시 삭제)
 * - User data: SessionStorage (브라우저 종료 시 삭제)
 * - Refresh tokens: LocalStorage (장기 보관)
 */

/**
 * Check if we're in a browser environment
 */
const isBrowser = typeof window !== 'undefined';

/**
 * Get sessionStorage safely
 */
const getSessionStorage = () => {
  if (!isBrowser) return null;
  return window.sessionStorage;
};

/**
 * Get localStorage safely
 */
const getLocalStorage = () => {
  if (!isBrowser) return null;
  return window.localStorage;
};

/**
 * Set access token in sessionStorage
 */
export const setAccessToken = (token: string): void => {
  const storage = getSessionStorage();
  if (storage) {
    storage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
  }
};

/**
 * Get access token from sessionStorage
 */
export const getAccessToken = (): string | null => {
  const storage = getSessionStorage();
  return storage ? storage.getItem(STORAGE_KEYS.ACCESS_TOKEN) : null;
};

/**
 * Set refresh token in localStorage
 */
export const setRefreshToken = (token: string): void => {
  const storage = getLocalStorage();
  if (storage) {
    storage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
  }
};

/**
 * Get refresh token from localStorage
 */
export const getRefreshToken = (): string | null => {
  const storage = getLocalStorage();
  return storage ? storage.getItem(STORAGE_KEYS.REFRESH_TOKEN) : null;
};

/**
 * Set user data in sessionStorage (backup 방식)
 */
export const setUserData = (userData: {
  doc_id: string;
  email: string;
  nickname: string;
}): void => {
  const storage = getSessionStorage();
  if (storage) {
    storage.setItem(STORAGE_KEYS.USER_DOC_ID, userData.doc_id);
    storage.setItem(STORAGE_KEYS.USER_EMAIL, userData.email);
    storage.setItem(STORAGE_KEYS.USER_NICKNAME, userData.nickname);
  }
};

/**
 * Get user data from sessionStorage
 */
export const getUserData = (): {
  doc_id: string | null;
  email: string | null;
  nickname: string | null;
} => {
  const storage = getSessionStorage();
  if (!storage) {
    return { doc_id: null, email: null, nickname: null };
  }

  return {
    doc_id: storage.getItem(STORAGE_KEYS.USER_DOC_ID),
    email: storage.getItem(STORAGE_KEYS.USER_EMAIL),
    nickname: storage.getItem(STORAGE_KEYS.USER_NICKNAME),
  };
};

/**
 * Set both tokens and user data (backup 방식)
 */
export const setTokens = (accessToken: string, refreshToken: string): void => {
  setAccessToken(accessToken);
  setRefreshToken(refreshToken);
};

/**
 * Store complete user session data (backup 방식)
 */
export const storeUserSession = (data: {
  access_token: string;
  refresh_token: string;
  doc_id: string;
  email: string;
  nickname: string;
}): void => {
  setAccessToken(data.access_token);
  setRefreshToken(data.refresh_token);
  setUserData({
    doc_id: data.doc_id,
    email: data.email,
    nickname: data.nickname,
  });
};

/**
 * Store user session from LoginResponse
 */
export const storeLoginResponse = (response: {
  access_token: { access_token: string };
  refresh_token: string;
  user: { doc_id: string; email: string; nickname: string };
}): void => {
  setAccessToken(response.access_token.access_token);
  setRefreshToken(response.refresh_token);
  setUserData({
    doc_id: response.user.doc_id,
    email: response.user.email,
    nickname: response.user.nickname,
  });
};

/**
 * Clear all tokens and user data
 */
export const clearTokens = (): void => {
  const sessionStorage = getSessionStorage();
  const localStorage = getLocalStorage();

  if (sessionStorage) {
    sessionStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    sessionStorage.removeItem(STORAGE_KEYS.USER_DOC_ID);
    sessionStorage.removeItem(STORAGE_KEYS.USER_EMAIL);
    sessionStorage.removeItem(STORAGE_KEYS.USER_NICKNAME);
  }

  if (localStorage) {
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.LAST_TOKEN_CHECK);
  }
};

/**
 * Clear session storage only (backup 방식)
 */
export const clearSession = (): void => {
  const storage = getSessionStorage();
  if (storage) {
    storage.clear();
  }
};

/**
 * Check if user is authenticated (backup 방식)
 */
export const isAuthenticated = (): boolean => {
  const accessToken = getAccessToken();
  const userDocId = getUserData().doc_id;
  return !!(accessToken && userDocId);
};

/**
 * Get valid access token with expiration check
 */
export const getValidAccessToken = (): string | null => {
  const token = getAccessToken();
  if (!token) return null;

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    const now = Math.floor(Date.now() / 1000);

    if (decoded.exp < now) {
      // Token expired, clear session
      clearSession();
      return null;
    }

    return token;
  } catch (error) {
    console.error('Failed to decode token:', error);
    clearSession();
    return null;
  }
};

/**
 * Check if token is expired
 */
export const isTokenExpired = (token: string): boolean => {
  return TokenDecoder.isExpired(token);
};

/**
 * Set last token check timestamp (backup 방식)
 */
export const setLastTokenCheck = (): void => {
  const storage = getLocalStorage();
  if (storage) {
    storage.setItem(STORAGE_KEYS.LAST_TOKEN_CHECK, Date.now().toString());
  }
};

/**
 * Check if token validation is needed (backup 방식)
 * 최적화: 더 긴 간격으로 체크하여 불필요한 API 호출 방지
 */
export const shouldCheckToken = (): boolean => {
  const storage = getLocalStorage();
  if (!storage) return true;

  const lastCheck = storage.getItem(STORAGE_KEYS.LAST_TOKEN_CHECK);
  if (!lastCheck) return true;

  const now = Date.now();
  const timeSinceLastCheck = now - parseInt(lastCheck, 10);

  // 10분(600000ms)에 한 번만 토큰 검증 실행 (5분에서 10분으로 증가)
  return timeSinceLastCheck > 600000;
};

// JWT decode helper (simple implementation) - TokenDecoder로 대체됨
function jwtDecode<T>(token: string): T {
  return TokenDecoder.decode<T>(token);
}
