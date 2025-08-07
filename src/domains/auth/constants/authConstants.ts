export const AUTH_CONSTANTS = {
  // API endpoints
  ENDPOINTS: {
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    GOOGLE_OAUTH: '/auth/google',
    GOOGLE_CALLBACK: '/auth/callback',
  },

  // Google OAuth configuration
  GOOGLE_OAUTH: {
    CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
    REDIRECT_URI:
      process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI ||
      (typeof window !== 'undefined'
        ? `${window.location.origin}/auth/callback`
        : 'http://localhost:3000/auth/callback'),
    SCOPE: 'email profile',
    AUTH_URL: 'https://accounts.google.com/o/oauth2/v2/auth',
  },

  // Storage keys
  STORAGE: {
    ACCESS_TOKEN: 'access_token',
    REFRESH_TOKEN: 'refresh_token',
    USER_DATA: 'user_data',
  },

  // Error messages
  ERRORS: {
    NETWORK_ERROR: 'Network error. Please try again.',
    SERVER_ERROR: 'Server error. Please try again later.',
    UNKNOWN_ERROR: 'An unexpected error occurred.',
    GOOGLE_OAUTH_ERROR: 'Google login failed. Please try again.',
  },

  // Success messages
  SUCCESS: {
    LOGOUT: 'Logged out successfully.',
    GOOGLE_LOGIN: 'Google login successful!',
  },

  // Loading states
  LOADING: {
    LOGOUT: 'Signing out...',
    GOOGLE_LOGIN: 'Signing in with Google...',
  },
} as const;
