import { STORAGE_KEYS } from '../constants';
import { AuthError, TokenError } from '../types/auth';

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
 * Enhanced Token Management - 보안 강화 적용
 * - Access tokens: SessionStorage (브라우저 종료 시 삭제, XSS 공격 완화)
 * - User data: SessionStorage (브라우저 종료 시 삭제)
 * - Refresh tokens: LocalStorage (장기 보관, 향후 HttpOnly Cookie 권장)
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
 * Set access token in sessionStorage (보안 강화)
 */
export const setAccessToken = (token: string): void => {
  if (!token) {
    throw new TokenError('Access token cannot be empty');
  }

  const storage = getSessionStorage();
  if (storage) {
    storage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
    if (process.env.NODE_ENV === 'development') {
      console.log('[Auth] Access token stored in sessionStorage:', {
        key: STORAGE_KEYS.ACCESS_TOKEN,
        tokenLength: token.length,
        tokenStart: token.substring(0, 20) + '...',
        storageAvailable: !!storage
      });
    }
  } else {
    console.error('[Auth] SessionStorage not available!');
  }
};

/**
 * Get access token from sessionStorage (보안 강화)
 */
export const getAccessToken = (): string | null => {
  const sessionStorage = getSessionStorage();

  // sessionStorage에서 토큰 확인 (XSS 보안 강화)
  const token = sessionStorage ? sessionStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) : null;

  if (process.env.NODE_ENV === 'development') {
    console.log('[Auth] getAccessToken from sessionStorage:', {
      key: STORAGE_KEYS.ACCESS_TOKEN,
      found: !!token,
      tokenLength: token?.length || 0,
      storageAvailable: !!sessionStorage,
      allKeys: sessionStorage ? Object.keys(sessionStorage).filter(k => k.includes('token') || k.includes('user')) : []
    });
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
  if (process.env.NODE_ENV === 'development') {
    console.log('[Auth] storeLoginResponse called with:', {
      hasAccessToken: !!response.access_token?.access_token,
      accessTokenLength: response.access_token?.access_token?.length || 0,
      hasRefreshToken: !!response.refresh_token,
      hasUser: !!response.user,
      userDocId: response.user?.doc_id
    });
  }

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

  if (process.env.NODE_ENV === 'development') {
    console.log('[Auth] storeLoginResponse completed, checking storage...');
    // 즉시 확인
    setTimeout(() => {
      const storedToken = getAccessToken();
      console.log('[Auth] Token verification after storage:', !!storedToken);
    }, 100);
  }
};

/**
 * Clear tokens from storage (완전 제거 보장)
 */
export const clearTokens = (): void => {
  const sessionStorage = getSessionStorage();
  const localStorage = getLocalStorage();

  if (sessionStorage) {
    // sessionStorage에서 모든 인증 관련 데이터 제거
    sessionStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    sessionStorage.removeItem(STORAGE_KEYS.USER_DOC_ID);
    sessionStorage.removeItem(STORAGE_KEYS.USER_EMAIL);
    sessionStorage.removeItem(STORAGE_KEYS.USER_NICKNAME);
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('isLoggingOut');
    
    if (process.env.NODE_ENV === 'development') {
      console.log('[Auth] SessionStorage 완전 정리 완료');
    }
  }

  if (localStorage) {
    // localStorage에서 refresh token 및 기타 인증 데이터 제거
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.LAST_TOKEN_CHECK);
    
    // 혹시 남아있을 수 있는 legacy access token도 제거
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    
    if (process.env.NODE_ENV === 'development') {
      console.log('[Auth] LocalStorage 인증 데이터 정리 완료');
    }
  }
};

/**
 * Clear session storage (강화된 세션 정리)
 */
export const clearSession = (): void => {
  const sessionStorage = getSessionStorage();
  if (sessionStorage) {
    // 선택적 정리: 인증 관련 항목만 제거 (다른 앱 데이터 보존)
    const authKeys = [
      STORAGE_KEYS.ACCESS_TOKEN,
      STORAGE_KEYS.USER_DOC_ID,
      STORAGE_KEYS.USER_EMAIL,
      STORAGE_KEYS.USER_NICKNAME,
      'user',
      'isLoggingOut'
    ];
    
    authKeys.forEach(key => {
      sessionStorage.removeItem(key);
    });
    
    if (process.env.NODE_ENV === 'development') {
      console.log('[Auth] 인증 관련 세션 데이터만 선택적 정리 완료');
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
    // 만료된 토큰 제거 (sessionStorage에서)
    const sessionStorage = getSessionStorage();
    if (sessionStorage) {
      sessionStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
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
 * 강제 로그아웃 (모든 저장소에서 토큰 완전 제거)
 */
export const forceLogout = (): void => {
  const sessionStorage = getSessionStorage();
  const localStorage = getLocalStorage();

  // sessionStorage 완전 정리
  if (sessionStorage) {
    const keysToRemove = [
      STORAGE_KEYS.ACCESS_TOKEN,
      STORAGE_KEYS.USER_DOC_ID,
      STORAGE_KEYS.USER_EMAIL,
      STORAGE_KEYS.USER_NICKNAME,
      'user',
      'isLoggingOut',
      // Legacy 대문자 키들도 정리
      'ACCESS_TOKEN',
      'USER_DOC_ID', 
      'USER_EMAIL',
      'USER_NICKNAME'
    ];
    
    keysToRemove.forEach(key => {
      sessionStorage.removeItem(key);
    });
  }

  // localStorage에서 인증 관련 데이터 제거
  if (localStorage) {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN); // legacy
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.LAST_TOKEN_CHECK);
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('[Auth] 강제 로그아웃: 모든 저장소에서 인증 데이터 완전 제거');
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
      storage: 'sessionStorage', // 저장소 위치 명시
    };
  } catch (error) {
    return { hasToken: true, isExpired: true, expiresIn: 0, error: 'Failed to decode' };
  }
};
