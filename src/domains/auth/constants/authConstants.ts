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
    REDIRECT_URI: (() => {
      // 명시적으로 설정된 경우 우선 사용
      if (process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI) {
        return process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI;
      }
      
      // 브라우저 환경에서는 현재 origin 사용
      if (typeof window !== 'undefined') {
        return `${window.location.origin}/auth/callback`;
      }
      
      // 서버 환경에서 환경별 기본값 설정
      if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}/auth/callback`;
      }
      
      // 프로덕션 환경 기본값
      if (process.env.NODE_ENV === 'production') {
        return 'https://decoded.style/auth/callback';
      }
      
      // 개발 환경 기본값
      return 'http://localhost:3000/auth/callback';
    })(),
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
