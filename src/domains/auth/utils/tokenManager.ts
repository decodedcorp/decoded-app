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

export type TokenType = 'jwt' | 'oauth' | 'unknown';

/**
 * Enhanced Token Management - Backup 방식 적용
 * - Access tokens: SessionStorage (브라우저 종료 시 삭제)
 * - User data: SessionStorage (브라우저 종료 시 삭제)
 * - Refresh tokens: LocalStorage (장기 보관)
 */

const STORAGE_KEYS = {
  // SessionStorage (브라우저 종료 시 삭제) - Backup과 동일한 키 사용
  ACCESS_TOKEN: 'ACCESS_TOKEN',
  USER_DOC_ID: 'USER_DOC_ID',
  USER_EMAIL: 'USER_EMAIL',
  USER_NICKNAME: 'USER_NICKNAME',

  // LocalStorage (장기 보관)
  REFRESH_TOKEN: 'REFRESH_TOKEN',
  LAST_TOKEN_CHECK: 'LAST_TOKEN_CHECK',

  // 임시 저장용 (모바일 OAuth 처리)
  TEMP_ID_TOKEN: 'TEMP_ID_TOKEN',
  LOGIN_TIMESTAMP: 'LOGIN_TIMESTAMP',
} as const;

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
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    const now = Math.floor(Date.now() / 1000);
    return decoded.exp < now;
  } catch (error) {
    console.error('Failed to decode token for expiration check:', error);
    return true;
  }
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
 */
export const shouldCheckToken = (): boolean => {
  const storage = getLocalStorage();
  if (!storage) return true;

  const lastCheck = storage.getItem(STORAGE_KEYS.LAST_TOKEN_CHECK);
  if (!lastCheck) return true;

  const now = Date.now();
  const timeSinceLastCheck = now - parseInt(lastCheck, 10);

  // 5분(300000ms)에 한 번만 토큰 검증 실행
  return timeSinceLastCheck > 300000;
};

// JWT decode helper (simple implementation)
function jwtDecode<T>(token: string): T {
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
    throw new Error('Invalid JWT token');
  }
}
