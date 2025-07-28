import { UsersService } from '../../../api/generated';
import { GoogleOAuthResponse, RefreshTokenResponse } from '../types/auth';
import { handleAuthError } from '../utils/errorHandler';
import { updateApiTokenFromStorage, getRequestConfig } from '../../../api/config';
import {
  storeUserSession,
  clearSession,
  getValidAccessToken,
  setLastTokenCheck,
  shouldCheckToken,
} from '../utils/tokenManager';

/**
 * Google OAuth 토큰 교환 및 사용자 정보 가져오기
 * Backup 방식: 직접 백엔드 API 호출
 */
export const handleGoogleOAuthCallback = async (code: string): Promise<GoogleOAuthResponse> => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://dev.decoded.style';
    const url = `${baseUrl}/auth/google/callback`;

    const requestBody = { code };
    const config = getRequestConfig('POST', requestBody);

    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Google OAuth API error:', errorData);
      throw new Error(errorData.error || 'Google OAuth 처리에 실패했습니다.');
    }

    const data = await response.json();

    // Backup 방식: 세션 데이터 저장
    if (data.access_token && data.doc_id) {
      storeUserSession({
        access_token: data.access_token,
        refresh_token: data.refresh_token || '',
        doc_id: data.doc_id,
        email: data.user?.email || '',
        nickname: data.user?.nickname || data.user?.name || '',
      });

      // Update API token configuration
      updateApiTokenFromStorage();
    }

    return {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      user: data.user,
      token_type: data.token_type || 'oauth',
    };
  } catch (error) {
    throw handleAuthError(error);
  }
};

/**
 * 토큰 갱신
 * Backup 방식: 클라이언트에서 직접 백엔드 API 호출
 */
export const refreshUserToken = async (refreshToken: string): Promise<RefreshTokenResponse> => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://dev.decoded.style';
    const url = `${baseUrl}/auth/refresh`;

    const requestBody = { refresh_token: refreshToken };
    const config = getRequestConfig('POST', requestBody);

    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Token refresh failed' }));
      throw new Error(errorData.error || `Token refresh failed: ${response.statusText}`);
    }

    const data = await response.json();

    // Update API token after successful refresh
    if (data.access_token) {
      updateApiTokenFromStorage();
    }

    return {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
    };
  } catch (error) {
    throw handleAuthError(error);
  }
};

/**
 * 로그아웃
 * Backup 방식: 클라이언트에서 직접 처리 (백엔드 API 호출 없이 로컬 상태만 정리)
 */
export const logoutUser = async (): Promise<void> => {
  try {
    // Backup 방식: 세션만 정리
    clearSession();

    // API 토큰 초기화
    updateApiTokenFromStorage();

    // 백엔드에 로그아웃 요청을 보내고 싶다면 아래 주석을 해제
    // const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://dev.decoded.style';
    // const url = `${baseUrl}/auth/logout`;
    // const config = getRequestConfig('POST');
    // await fetch(url, config);
  } catch (error) {
    // Logout errors are usually not critical, just log them
    console.warn('Logout error:', error);
  }
};

/**
 * 사용자 프로필 조회
 * Backup 방식: 토큰 검증 후 API 호출
 */
export const getUserProfile = async () => {
  try {
    // Backup 방식: 토큰 검증
    const accessToken = getValidAccessToken();
    if (!accessToken) {
      throw new Error('No valid access token available');
    }

    // Use the generated UsersService
    const profile = await UsersService.getMyProfileUsersMeProfileGet();
    return profile;
  } catch (error) {
    throw handleAuthError(error);
  }
};

/**
 * 인증 상태 확인
 * Backup 방식: 토큰 유효성 검사
 */
export const checkAuthStatus = async (): Promise<boolean> => {
  try {
    // Backup 방식: 5분마다 한 번만 검증
    if (!shouldCheckToken()) {
      return true; // 최근에 검증했으면 유효하다고 가정
    }

    const accessToken = getValidAccessToken();
    if (!accessToken) {
      return false;
    }

    // 토큰이 유효하면 검증 시간 업데이트
    setLastTokenCheck();
    return true;
  } catch (error) {
    console.error('Auth status check failed:', error);
    return false;
  }
};
