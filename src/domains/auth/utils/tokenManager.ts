import { STORAGE_KEYS } from '../constants';
import { TokenDecoder } from './tokenDecoder';
import { AuthError, TokenError } from '../types/auth';

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
 * Set access token in localStorage (primary storage)
 */
export const setAccessToken = (token: string): void => {
  if (!token) {
    throw new TokenError('Access token cannot be empty');
  }

  const storage = getLocalStorage();
  if (storage) {
    storage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
    if (process.env.NODE_ENV === 'development') {
      console.log('[Auth] Access token stored in localStorage');
    }
  }
};

/**
 * Get access token from localStorage (primary storage)
 */
export const getAccessToken = (): string | null => {
  const localStorage = getLocalStorage();

  // localStorage에서 토큰 확인 (primary storage)
  const token = localStorage ? localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) : null;

  if (process.env.NODE_ENV === 'development') {
    console.log('[Auth] getAccessToken result:', token ? 'found' : 'not found');
  }

  return token;
};

/**
 * Set refresh token in localStorage
 */
export const setRefreshToken = (token: string): void => {
  // 빈 문자열이나 undefined인 경우 저장하지 않음 (에러 발생하지 않음)
  if (!token || token.trim() === '') {
    console.warn('[Auth] Refresh token is empty, skipping storage');
    return;
  }

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
 * JWT 토큰에서 user_doc_id 추출
 */
export const extractUserDocIdFromToken = (): string => {
  const token = getAccessToken();
  if (!token) return '';

  try {
    return TokenDecoder.extractUserDocId(token);
  } catch (error) {
    console.error('[Auth] Failed to extract user_doc_id from token:', error);
    // 토큰 디코딩 실패 시 sessionStorage에서 직접 user_doc_id 가져오기
    const userData = getUserData();
    return userData.doc_id || '';
  }
};

/**
 * Set user data in sessionStorage (backup 방식)
 */
export const setUserData = (userData: {
  doc_id: string;
  email: string;
  nickname: string;
}): void => {
  if (!userData.doc_id) {
    throw new TokenError('User doc_id cannot be empty');
  }

  const storage = getSessionStorage();
  if (storage) {
    // 개별 키로 저장 (기존 방식)
    storage.setItem(STORAGE_KEYS.USER_DOC_ID, userData.doc_id);
    storage.setItem(STORAGE_KEYS.USER_EMAIL, userData.email || '');
    storage.setItem(STORAGE_KEYS.USER_NICKNAME, userData.nickname || '');

    // JSON 형태로도 저장 (useAuthInit에서 사용)
    const userObject = {
      doc_id: userData.doc_id,
      email: userData.email || '',
      nickname: userData.nickname || '',
    };
    storage.setItem('user', JSON.stringify(userObject));

    if (process.env.NODE_ENV === 'development') {
      console.log('[Auth] User data stored:', userObject);
    }
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
 * Set both access and refresh tokens
 */
export const setTokens = (accessToken: string, refreshToken: string): void => {
  setAccessToken(accessToken);
  setRefreshToken(refreshToken);
};

/**
 * Store user session from session data
 */
export const storeUserSession = (data: {
  access_token: string;
  refresh_token: string;
  doc_id: string;
  email: string;
  nickname: string;
}): void => {
  setTokens(data.access_token, data.refresh_token);
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

  // refresh_token이 있는 경우에만 저장
  if (response.refresh_token && response.refresh_token.trim() !== '') {
    setRefreshToken(response.refresh_token);
  } else {
    console.warn('[Auth] No refresh token provided in login response');
  }

  setUserData({
    doc_id: response.user.doc_id,
    email: response.user.email,
    nickname: response.user.nickname,
  });
};

/**
 * Clear tokens from storage
 */
export const clearTokens = (): void => {
  const sessionStorage = getSessionStorage();
  const localStorage = getLocalStorage();

  if (sessionStorage) {
    sessionStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    sessionStorage.removeItem(STORAGE_KEYS.USER_DOC_ID);
    sessionStorage.removeItem(STORAGE_KEYS.USER_EMAIL);
    sessionStorage.removeItem(STORAGE_KEYS.USER_NICKNAME);
    // sessionStorage의 'user' 항목도 제거
    sessionStorage.removeItem('user');
  }

  if (localStorage) {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.LAST_TOKEN_CHECK);
  }
};

/**
 * Clear session storage
 */
export const clearSession = (): void => {
  const sessionStorage = getSessionStorage();
  if (sessionStorage) {
    sessionStorage.clear();
    if (process.env.NODE_ENV === 'development') {
      console.log('[Auth] Session cleared');
    }
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  const token = getValidAccessToken();
  return !!token;
};

/**
 * Get valid access token (check expiration)
 */
export const getValidAccessToken = (): string | null => {
  const token = getAccessToken();
  if (!token) {
    return null;
  }

  if (isTokenExpired(token)) {
    console.warn('[Auth] Access token is expired');
    // 만료된 토큰 제거 (localStorage에서)
    const localStorage = getLocalStorage();
    if (localStorage) {
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    }
    return null;
  }

  return token;
};

/**
 * Check if token is expired
 */
export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch (error) {
    console.error('[Auth] Failed to decode token:', error);
    return true; // 디코딩 실패 시 만료된 것으로 간주
  }
};

/**
 * Set last token check time
 */
export const setLastTokenCheck = (): void => {
  const storage = getLocalStorage();
  if (storage) {
    storage.setItem(STORAGE_KEYS.LAST_TOKEN_CHECK, Date.now().toString());
  }
};

/**
 * Check if we should check token validity
 */
export const shouldCheckToken = (): boolean => {
  const storage = getLocalStorage();
  if (!storage) return false;

  const lastCheck = storage.getItem(STORAGE_KEYS.LAST_TOKEN_CHECK);
  if (!lastCheck) return true;

  const timeSinceLastCheck = Date.now() - parseInt(lastCheck);
  const checkInterval = 5 * 60 * 1000; // 5분

  return timeSinceLastCheck > checkInterval;
};

/**
 * JWT 토큰 디코딩 유틸리티
 */
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
    throw new TokenError('Failed to decode JWT token');
  }
}

/**
 * Force update access token (for debugging/testing)
 */
export const forceUpdateAccessToken = (newToken: string): void => {
  const localStorage = getLocalStorage();
  if (localStorage) {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, newToken);
    if (process.env.NODE_ENV === 'development') {
      console.log('[Auth] Access token force updated');
    }
  }
};

/**
 * Get token info for debugging
 */
export const getTokenInfo = () => {
  const token = getAccessToken();
  if (!token) {
    return { hasToken: false, isExpired: true, expiresIn: 0 };
  }

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    const currentTime = Math.floor(Date.now() / 1000);
    const expiresIn = decoded.exp - currentTime;

    return {
      hasToken: true,
      isExpired: expiresIn <= 0,
      expiresIn,
      payload: decoded,
    };
  } catch (error) {
    return { hasToken: true, isExpired: true, expiresIn: 0, error: 'Failed to decode' };
  }
};
