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

/**
 * Token management utility
 * Centralizes localStorage access and enhances security.
 */

const TOKEN_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
} as const;

/**
 * Check if we're in a browser environment
 */
const isBrowser = typeof window !== 'undefined';

/**
 * Safely store tokens
 */
export const setTokens = (accessToken: string, refreshToken: string): void => {
  if (!isBrowser) {
    console.warn('Cannot store tokens in server environment');
    return;
  }

  try {
    // Validate tokens
    if (!accessToken || !refreshToken) {
      throw new Error('Invalid tokens provided');
    }

    // Validate JWT token format (simple validation)
    if (!accessToken.includes('.') || !refreshToken.includes('.')) {
      throw new Error('Invalid token format');
    }

    localStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, accessToken);
    localStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, refreshToken);
  } catch (error) {
    console.error('Failed to store tokens:', error);
    throw new Error('Failed to store tokens.');
  }
};

/**
 * Get access token
 */
export const getAccessToken = (): string | null => {
  if (!isBrowser) {
    return null;
  }

  try {
    return localStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN);
  } catch (error) {
    console.error('Failed to get access token:', error);
    return null;
  }
};

/**
 * Get refresh token
 */
export const getRefreshToken = (): string | null => {
  if (!isBrowser) {
    return null;
  }

  try {
    return localStorage.getItem(TOKEN_KEYS.REFRESH_TOKEN);
  } catch (error) {
    console.error('Failed to get refresh token:', error);
    return null;
  }
};

/**
 * Clear all tokens
 */
export const clearTokens = (): void => {
  if (!isBrowser) {
    return;
  }

  try {
    localStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(TOKEN_KEYS.REFRESH_TOKEN);
  } catch (error) {
    console.error('Failed to clear tokens:', error);
  }
};

/**
 * Check if tokens exist
 */
export const hasTokens = (): boolean => {
  return !!(getAccessToken() && getRefreshToken());
};

/**
 * Check if token is expired (for JWT tokens)
 */
export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch (error) {
    console.error('Failed to parse token:', error);
    return true;
  }
};

/**
 * Check if token will expire soon (default: 5 minutes)
 */
export const isTokenExpiringSoon = (token: string, minutes: number = 5): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiresAt = payload.exp * 1000;
    const now = Date.now();
    const threshold = minutes * 60 * 1000; // Convert minutes to milliseconds

    return expiresAt - now < threshold;
  } catch (error) {
    console.error('Failed to check token expiration:', error);
    return true;
  }
};

/**
 * Decode JWT token
 */
export const decodeToken = (token: string): any => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};

/**
 * Extract user information from token
 */
export const extractUserFromToken = (token: string) => {
  try {
    const payload = decodeToken(token);
    if (!payload) return null;

    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      status: payload.status,
    };
  } catch (error) {
    console.error('Failed to extract user from token:', error);
    return null;
  }
};

/**
 * Get remaining token validity time in milliseconds
 */
export const getTokenTimeRemaining = (token: string): number => {
  try {
    const payload = decodeToken(token);
    if (!payload) return 0;

    const expiresAt = payload.exp * 1000;
    const now = Date.now();

    return Math.max(0, expiresAt - now);
  } catch (error) {
    console.error('Failed to get token time remaining:', error);
    return 0;
  }
};

/**
 * Get the currently valid access token
 */
export const getValidAccessToken = (): string | null => {
  const accessToken = getAccessToken();
  if (!accessToken) return null;

  if (isTokenExpired(accessToken)) {
    return null;
  }

  return accessToken;
};

/**
 * Attempt to refresh the access token
 */
export const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refresh_token: refreshToken,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const data = await response.json();
    const newTokens: TokenData = {
      access_token: data.access_token,
      refresh_token: data.refresh_token || refreshToken, // Use existing refresh token if new one is not provided
    };

    setTokens(newTokens.access_token, newTokens.refresh_token);
    useAuthStore.getState().setTokens(newTokens.access_token, newTokens.refresh_token);

    return newTokens.access_token;
  } catch (error) {
    console.error('Failed to refresh access token:', error);
    // Log out on token refresh failure
    useAuthStore.getState().logout();
    return null;
  }
};

/**
 * Generate authentication headers for API requests
 */
export const getAuthHeaders = async (): Promise<Record<string, string>> => {
  let accessToken = getValidAccessToken();

  if (!accessToken) {
    // Attempt to refresh if no token or expired
    accessToken = await refreshAccessToken();
  }

  if (!accessToken) {
    throw new Error('No valid access token available');
  }

  return {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  };
};

/**
 * Wrapper function for authenticated API requests
 */
export const authenticatedFetch = async (
  url: string,
  options: RequestInit = {},
): Promise<Response> => {
  try {
    const headers = await getAuthHeaders();

    const response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });

    // Retry on 401 error by refreshing token
    if (response.status === 401) {
      const newAccessToken = await refreshAccessToken();
      if (newAccessToken) {
        const newHeaders = await getAuthHeaders();
        return fetch(url, {
          ...options,
          headers: {
            ...newHeaders,
            ...options.headers,
          },
        });
      }
    }

    return response;
  } catch (error) {
    console.error('Authenticated fetch failed:', error);
    throw error;
  }
};
