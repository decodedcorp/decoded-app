import { AuthService } from '../../../api/generated/services/AuthService';
import { UsersService } from '../../../api/generated/services/UsersService';
import { LoginRequest } from '../../../api/generated/models/LoginRequest';
import { ResponseMapper } from '../utils/responseMapper';
import { storeLoginResponse, clearSession, extractUserDocIdFromToken } from '../utils/tokenManager';
import { updateApiTokenFromStorage } from '../../../api/config';

/**
 * Login user with JWT token and Sui address
 */
export const loginUser = async (jwtToken: string, suiAddress: string, email?: string) => {
  try {
    const loginData: LoginRequest = {
      jwt_token: jwtToken,
      sui_address: suiAddress,
      email: email || null,
    };

    if (process.env.NODE_ENV === 'development') {
      console.log('[Auth] Login request:', {
        jwtToken: jwtToken.substring(0, 10) + '...',
        suiAddress: suiAddress.substring(0, 10) + '...',
        email: email || 'not provided',
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
    if (process.env.NODE_ENV === 'development') {
      console.log('[Auth] Processing Google OAuth callback with code:', {
        code: code.substring(0, 10) + '...',
        codeLength: code.length,
      });
    }

    // Call the backend OAuth endpoint
    const response = await fetch('/api/auth/google', {
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
    const mappedResponse = ResponseMapper.mapLoginResponse(data);

    // Store login response
    storeLoginResponse(mappedResponse);

    if (process.env.NODE_ENV === 'development') {
      console.log('[Auth] Google OAuth login successful:', {
        hasUser: !!mappedResponse.user,
        hasAccessToken: !!mappedResponse.access_token,
      });
    }

    return mappedResponse;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[Auth] Google OAuth callback error:', error);
    }
    throw error;
  }
};
