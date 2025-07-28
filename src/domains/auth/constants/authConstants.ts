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
  },

  // Success messages
  SUCCESS: {
    LOGIN: 'Login successful!',
    LOGOUT: 'Logged out successfully.',
  },

  // Loading states
  LOADING: {
    LOGIN: 'Signing in...',
    LOGOUT: 'Signing out...',
  },
} as const;
