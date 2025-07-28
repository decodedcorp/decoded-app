import { AuthService, UsersService } from '../../../api/generated';
import {
  LoginFormData,
  LoginResponse,
  GoogleOAuthResponse,
  RefreshTokenResponse,
} from '../types/auth';
import { handleAuthError } from '../utils/errorHandler';
import { updateApiTokenFromStorage } from '../../../api/config';

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

    // Update API token after successful login
    if (response.access_token) {
      updateApiTokenFromStorage();
    }

    return {
      access_token: response.access_token,
      refresh_token: response.refresh_token,
      user: response.user,
    };
  } catch (error) {
    throw handleAuthError(error);
  }
};

/**
 * Google OAuth 콜백 처리
 * Note: This uses Next.js API routes, not the generated service
 */
export const handleGoogleOAuthCallback = async (code: string): Promise<GoogleOAuthResponse> => {
  try {
    const response = await fetch('/api/auth/google/callback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      throw new Error(`OAuth callback failed: ${response.statusText}`);
    }

    const data = await response.json();

    // Update API token after successful OAuth
    if (data.access_token) {
      updateApiTokenFromStorage();
    }

    return data;
  } catch (error) {
    throw handleAuthError(error);
  }
};

/**
 * 토큰 갱신
 * Note: This uses Next.js API routes, not the generated service
 */
export const refreshUserToken = async (refreshToken: string): Promise<RefreshTokenResponse> => {
  try {
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) {
      throw new Error(`Token refresh failed: ${response.statusText}`);
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
 * Note: This uses Next.js API routes, not the generated service
 */
export const logoutUser = async (): Promise<void> => {
  try {
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
    // Logout errors are usually not critical, just log them
    console.warn('Logout error:', error);
  }
};

/**
 * 사용자 프로필 조회
 * Uses the generated UsersService to call the backend API
 */
export const getUserProfile = async () => {
  try {
    // Use the generated UsersService instead of Next.js API route
    const profile = await UsersService.getMyProfileUsersMeProfileGet();
    return profile;
  } catch (error) {
    throw handleAuthError(error);
  }
};
