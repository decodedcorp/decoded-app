import { LoginRequest, GetUserProfile } from '../../../api/generated';
import { getRequestConfig, API_BASE_URL } from '../../../api/config';
import { LoginResponse, SessionData, User } from '../types/auth';
import {
  storeUserSession,
  storeLoginResponse,
  getAccessToken,
  getUserData,
} from '../utils/tokenManager';
import { ResponseMapper } from '../utils/responseMapper';
import { TokenDecoder } from '../utils/tokenDecoder';

/**
 * JWT 토큰에서 user_doc_id 추출
 */
const extractUserDocIdFromToken = (): string => {
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
 * GetUserProfile을 User 타입으로 변환
 */
const mapGetUserProfileToUser = (profile: GetUserProfile, docId: string): User => {
  return ResponseMapper.mapUserProfile(profile, docId);
};

/**
 * Login user with JWT token
 */
export const loginUser = async (request: LoginRequest): Promise<LoginResponse> => {
  try {
    console.log('[Auth] Attempting login with config API:', {
      hasJwtToken: !!request.jwt_token,
      hasSuiAddress: !!request.sui_address,
    });

    const config = getRequestConfig('POST', request);
    console.log('[Auth] Making fetch request to:', `${API_BASE_URL}/auth/login`);
    console.log('[Auth] Request config:', {
      method: config.method,
      headers: config.headers,
      body: config.body,
    });

    console.log('[Auth] Starting fetch request...');
    const response = await fetch(`${API_BASE_URL}/auth/login`, config);
    console.log('[Auth] Fetch request completed, status:', response.status);

    if (!response.ok) {
      throw new Error(`Login failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('[Auth] Full response data:', JSON.stringify(data, null, 2));

    // 백엔드 응답 구조에 맞게 LoginResponse 형태로 변환
    const loginResponse = ResponseMapper.mapLoginResponse(data);

    // 세션 저장
    storeLoginResponse(loginResponse);

    console.log('[Auth] Login successful:', {
      hasAccessToken: !!loginResponse.access_token,
      hasRefreshToken: !!loginResponse.refresh_token,
      hasUser: !!loginResponse.user,
      userDocId: loginResponse.user?.doc_id,
    });

    return loginResponse;
  } catch (error) {
    console.error('[Auth] Login error:', error);
    throw error;
  }
};

/**
 * Logout user
 */
export const logoutUser = async (): Promise<void> => {
  try {
    // 로컬 정리만 수행 (백엔드에 logout 요청은 없음)
    console.log('[Auth] Logging out user');

    // 세션 스토리지 정리
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('user_data');

    // 로컬 스토리지 정리
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('last_token_check');

    console.log('[Auth] Logout completed');
  } catch (error) {
    console.error('[Auth] Logout error:', error);
    throw error;
  }
};

/**
 * Get user profile
 */
export const getUserProfile = async (): Promise<User> => {
  try {
    console.log('[Auth] Fetching user profile with config API');

    // 토큰에서 user_doc_id 추출
    const userDocId = extractUserDocIdFromToken();
    if (!userDocId) {
      throw new Error('No user ID found in token');
    }

    const config = getRequestConfig('GET');
    const response = await fetch(`${API_BASE_URL}/users/${userDocId}/profile`, config);

    if (!response.ok) {
      throw new Error(`Profile fetch failed: ${response.status} ${response.statusText}`);
    }

    const profileData: GetUserProfile = await response.json();
    console.log('[Auth] Profile data received:', JSON.stringify(profileData, null, 2));

    // GetUserProfile을 User 타입으로 변환
    const user = mapGetUserProfileToUser(profileData, userDocId);

    console.log('[Auth] Mapped user data:', user);

    return user;
  } catch (error) {
    console.error('[Auth] Profile fetch error:', error);
    throw error;
  }
};

/**
 * Check authentication status
 */
export const checkAuthStatus = async () => {
  try {
    // 먼저 토큰이 있는지 확인
    const token = getAccessToken();
    if (!token) {
      return { authenticated: false, error: 'No access token found' };
    }

    // 토큰이 유효한지 확인하기 위해 프로필 API 호출
    const config = getRequestConfig('GET');
    const response = await fetch(`${API_BASE_URL}/users/me/profile`, config);

    if (!response.ok) {
      if (response.status === 401) {
        // 토큰이 만료되었거나 유효하지 않음
        return { authenticated: false, error: 'Token expired or invalid' };
      }
      return { authenticated: false, error: `HTTP ${response.status}` };
    }

    const profile = await response.json();
    return { authenticated: true, user: profile };
  } catch (error) {
    console.error('[Auth] Auth status check failed:', error);

    // CORS 에러인지 확인
    if (error instanceof Error && error.message === 'Failed to fetch') {
      console.warn('[Auth] CORS error detected, this might be a development environment issue');
      // CORS 에러의 경우 토큰이 있으면 인증된 것으로 간주
      const token = getAccessToken();
      if (token) {
        return { authenticated: true, error: 'CORS blocked, but token exists' };
      }
    }

    // 네트워크 오류나 기타 예외 상황
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return { authenticated: false, error: errorMessage };
  }
};

/**
 * Handle Google OAuth callback
 * This function should be called with the authorization code from Google
 */
export const handleGoogleOAuthCallback = async (code: string): Promise<LoginResponse> => {
  try {
    console.log('[Auth] Processing Google OAuth callback with code:', {
      codeLength: code.length,
      hasCode: !!code,
    });

    // Google OAuth 코드를 백엔드로 전송
    // 백엔드에서 Google API를 호출하여 사용자 정보를 가져오고 JWT 토큰을 생성
    const response = await loginUser({
      jwt_token: code, // Google OAuth authorization code
      sui_address: '', // 임시 값, 실제로는 적절한 주소 필요
    });

    console.log('[Auth] Google OAuth login successful:', {
      hasAccessToken: !!response.access_token,
      hasUser: !!response.user,
    });

    return response;
  } catch (error) {
    console.error('[Auth] Google OAuth callback error:', error);
    throw error;
  }
};
