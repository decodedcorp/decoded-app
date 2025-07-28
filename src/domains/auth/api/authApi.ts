import { AuthService } from '../../../api/generated';
import {
  LoginFormData,
  LoginResponse,
  GoogleOAuthResponse,
  RefreshTokenResponse,
} from '../types/auth';
import { handleAuthError } from '../utils/errorHandler';

/**
 * 로그인 API 호출
 */
export const loginUser = async (credentials: LoginFormData): Promise<LoginResponse> => {
  try {
    // Convert LoginFormData to LoginRequest format
    const loginRequest = {
      jwt_token: credentials.email, // 임시로 email을 jwt_token으로 사용
      sui_address: credentials.password, // 임시로 password를 sui_address로 사용
      email: credentials.email,
    };

    const response = await AuthService.loginAuthLoginPost(loginRequest);
    return response;
  } catch (error) {
    const authError = handleAuthError(error);
    throw new Error(authError.message);
  }
};

/**
 * Google OAuth 콜백 처리
 */
export const handleGoogleOAuthCallback = async (code: string): Promise<GoogleOAuthResponse> => {
  try {
    // Note: This might need to be adjusted based on the actual generated API
    const response = await fetch('/api/auth/google/callback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error = new Error(
        errorData.message || `HTTP ${response.status}: ${response.statusText}`,
      );
      throw error;
    }

    return response.json();
  } catch (error) {
    const authError = handleAuthError(error);
    throw new Error(authError.message);
  }
};

/**
 * 토큰 갱신
 */
export const refreshToken = async (refreshToken: string): Promise<RefreshTokenResponse> => {
  try {
    // Note: This might need to be adjusted based on the actual generated API
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error = new Error(
        errorData.message || `HTTP ${response.status}: ${response.statusText}`,
      );
      throw error;
    }

    return response.json();
  } catch (error) {
    const authError = handleAuthError(error);
    throw new Error(authError.message);
  }
};

/**
 * 로그아웃
 */
export const logoutUser = async (): Promise<void> => {
  try {
    // Note: This might need to be adjusted based on the actual generated API
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.warn('Logout API call failed, but proceeding with local logout');
    }
  } catch (error) {
    console.warn('Logout API call failed, but proceeding with local logout:', error);
  }
};

/**
 * 사용자 프로필 조회
 */
export const getUserProfile = async (): Promise<LoginResponse['user']> => {
  try {
    // Note: This might need to be adjusted based on the actual generated API
    const response = await fetch('/api/auth/profile', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error = new Error(
        errorData.message || `HTTP ${response.status}: ${response.statusText}`,
      );
      throw error;
    }

    return response.json();
  } catch (error) {
    const authError = handleAuthError(error);
    throw new Error(authError.message);
  }
};
