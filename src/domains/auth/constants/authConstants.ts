export const AUTH_CONSTANTS = {
  // Form validation rules
  VALIDATION: {
    EMAIL: {
      REQUIRED: 'Email is required',
      INVALID: 'Please enter a valid email address',
      PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    PASSWORD: {
      REQUIRED: 'Password is required',
      MIN_LENGTH: 'Password must be at least 8 characters',
      MIN_LENGTH_VALUE: 8,
    },
  },

  // API endpoints
  ENDPOINTS: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    GOOGLE_OAUTH: '/auth/google',
    GOOGLE_CALLBACK: '/auth/google/callback',
  },

  // Google OAuth configuration
  GOOGLE_OAUTH: {
    CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
    REDIRECT_URI: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI || '',
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
    INVALID_CREDENTIALS: 'Invalid email or password',
    NETWORK_ERROR: 'Network error. Please try again.',
    SERVER_ERROR: 'Server error. Please try again later.',
    UNKNOWN_ERROR: 'An unexpected error occurred.',
    GOOGLE_OAUTH_ERROR: 'Google login failed. Please try again.',
  },

  // Success messages
  SUCCESS: {
    LOGIN: 'Login successful!',
    LOGOUT: 'Logged out successfully.',
    GOOGLE_LOGIN: 'Google login successful!',
  },

  // Loading states
  LOADING: {
    LOGIN: 'Signing in...',
    LOGOUT: 'Signing out...',
    GOOGLE_LOGIN: 'Signing in with Google...',
  },
} as const;
