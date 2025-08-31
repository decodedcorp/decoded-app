import { jwtDecode } from 'jwt-decode';

import { AuthService } from '../../../api/generated/services/AuthService';
import { UsersService } from '../../../api/generated/services/UsersService';
import { LoginRequest } from '../../../api/generated/models/LoginRequest';
import { ResponseMapper } from '../utils/responseMapper';
import { storeLoginResponse, clearSession, extractUserDocIdFromToken } from '../utils/tokenManager';
import { updateApiTokenFromStorage } from '../../../api/config';

import { GoogleAuthApi } from './googleAuthApi';

// Google OAuth JWT 타입
interface GoogleJWT {
  iss: string;
  aud: string;
  sub: string;
  exp: number;
  email: string;
  given_name: string;
}

/**
 * Login user with JWT token and optional sui_address
 * Modified to use backup's hashing approach
 */
export const loginUser = async (jwtToken: string, suiAddress?: string, email?: string) => {
  try {
    // JWT 디코딩
    const decodedGoogle = jwtDecode<GoogleJWT>(jwtToken);

    if (process.env.NODE_ENV === 'development') {
      console.log('[Auth] Decoded Google token:', {
        sub: decodedGoogle.sub,
        iss: decodedGoogle.iss,
        aud: decodedGoogle.aud,
        email: decodedGoogle.email,
        given_name: decodedGoogle.given_name,
      });
    }

    // 필요한 값 추출
    const { sub, iss, aud } = decodedGoogle;
    if (!sub || !iss || !aud) {
      throw new Error('[Auth] Missing required fields in decoded token');
    }

    // 해싱 (backup 방식과 동일) - GoogleAuthApi의 기존 함수 사용
    const hashedToken = GoogleAuthApi.generateHashedToken(sub, iss, aud);

    if (process.env.NODE_ENV === 'development') {
      console.log('[Auth] Hash input:', `${sub}${iss}${aud}`);
      console.log('[Auth] Hashed token:', hashedToken);
    }

    const loginData: LoginRequest = {
      jwt_token: hashedToken, // 해시된 토큰 사용
      sui_address: suiAddress || '',
      email: email || decodedGoogle.email || null,
    };

    if (process.env.NODE_ENV === 'development') {
      console.log('[Auth] Login request:', {
        hashedToken: hashedToken.substring(0, 10) + '...',
        suiAddress: suiAddress ? suiAddress.substring(0, 10) + '...' : 'empty string',
        email: email || decodedGoogle.email || 'not provided',
      });
    }

    const response = await AuthService.loginAuthLoginPost(loginData);

    if (process.env.NODE_ENV === 'development') {
      console.log('[Auth] Response data received:', {
        hasAccessToken: !!response.access_token,
        hasRefreshToken: !!response.refresh_token,
        hasUser: !!response.user,
        accessTokenKeys: response.access_token ? Object.keys(response.access_token) : null,
        userKeys: response.user ? Object.keys(response.user) : null,
      });
    }

    const mappedResponse = ResponseMapper.mapLoginResponse(response);

    if (process.env.NODE_ENV === 'development') {
      console.log('[Auth] Login response mapped successfully');
    }

    // Store login response in session storage
    storeLoginResponse(mappedResponse);

    if (process.env.NODE_ENV === 'development') {
      console.log('[Auth] Login response stored in session');
    }

    return mappedResponse;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[Auth] Login error:', error);
    }
    throw error;
  }
};

/**
 * Logout user
 */
export const logoutUser = async () => {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log('[Auth] Logging out user');
    }

    // Clear all auth data
    clearSession();

    if (process.env.NODE_ENV === 'development') {
      console.log('[Auth] Logout completed');
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[Auth] Logout error:', error);
    }
    throw error;
  }
};

/**
 * Fetch user profile using typgen-generated API
 */
export const fetchUserProfile = async () => {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log('[Auth] Fetching user profile with typgen API');
    }

    // Ensure API token is set from storage
    updateApiTokenFromStorage();

    // Get user ID from token
    const userDocId = extractUserDocIdFromToken();
    if (!userDocId) {
      throw new Error('No user ID found in token');
    }

    const profileData = await UsersService.getProfileUsersUserIdProfileGet(userDocId);

    if (process.env.NODE_ENV === 'development') {
      console.log('[Auth] Profile data received:', JSON.stringify(profileData, null, 2));
    }

    const user = ResponseMapper.mapUserProfile(profileData);

    if (process.env.NODE_ENV === 'development') {
      console.log('[Auth] Mapped user data:', user);
    }

    return user;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[Auth] Fetch user profile error:', error);
    }
    throw error;
  }
};

/**
 * Handle Google OAuth callback
 */
export const handleGoogleOAuthCallback = async (code: string) => {
  try {
    console.log('[Auth] Processing Google OAuth callback with code:', {
      code: code.substring(0, 10) + '...',
      codeLength: code.length,
      timestamp: new Date().toISOString(),
    });

    // Call the backend OAuth endpoint
    const response = await fetch('/api/auth/google', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });

    console.log('[Auth] OAuth API response:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      headers: Object.fromEntries(response.headers.entries()),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Auth] OAuth API error response:', errorText);
      throw new Error(`OAuth callback failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    console.log('[Auth] OAuth API success data:', {
      hasAccessToken: !!data.access_token,
      hasUser: !!data.user,
      hasRefreshToken: !!data.refresh_token,
      tokenType: data.token_type,
    });

    const mappedResponse = ResponseMapper.mapLoginResponse(data);

    // Store login response
    storeLoginResponse(mappedResponse);

    console.log('[Auth] Google OAuth login successful:', {
      hasUser: !!mappedResponse.user,
      hasAccessToken: !!mappedResponse.access_token,
      userEmail: mappedResponse.user?.email,
    });

    return mappedResponse;
  } catch (error) {
    console.error('[Auth] Google OAuth callback error:', {
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    });
    throw error;
  }
};
