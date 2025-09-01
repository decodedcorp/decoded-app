// Storage keys (소문자 통일)
export const STORAGE_KEYS = {
  // SessionStorage (브라우저 종료 시 삭제)
  ACCESS_TOKEN: 'access_token',
  USER_DOC_ID: 'user_doc_id',
  USER_EMAIL: 'user_email',
  USER_NICKNAME: 'user_nickname',

  // LocalStorage (장기 보관)
  REFRESH_TOKEN: 'refresh_token',
  LAST_TOKEN_CHECK: 'last_token_check',

  // 임시 저장용 (모바일 OAuth 처리)
  TEMP_ID_TOKEN: 'temp_id_token',
  LOGIN_TIMESTAMP: 'login_timestamp',
} as const;

// API endpoints
export const API_ENDPOINTS = {
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REFRESH: '/auth/refresh',
  PROFILE: '/auth/profile',
  GOOGLE_OAUTH: '/auth/google',
  GOOGLE_CALLBACK: '/auth/callback',
} as const;

// Google OAuth configuration
export const GOOGLE_OAUTH_CONFIG = {
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
} as const;

// Cache and timing constants
export const TIMING = {
  AUTH_STATUS_STALE_TIME: 5 * 60 * 1000, // 5 minutes
  AUTH_STATUS_GC_TIME: 10 * 60 * 1000, // 10 minutes
  USER_PROFILE_STALE_TIME: 10 * 60 * 1000, // 10 minutes
  USER_PROFILE_GC_TIME: 15 * 60 * 1000, // 15 minutes
  TOKEN_CHECK_INTERVAL: 5 * 60 * 1000, // 5 minutes
  TOKEN_REFRESH_THRESHOLD: 60 * 1000, // 1 minute before expiry
} as const;

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNKNOWN_ERROR: 'An unexpected error occurred.',
  GOOGLE_OAUTH_ERROR: 'Google login failed. Please try again.',
  TOKEN_EXPIRED: 'Your session has expired. Please login again.',
  INVALID_TOKEN: 'Invalid token format.',
  LOGIN_FAILED: 'Login failed. Please check your credentials.',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  LOGOUT: 'Logged out successfully.',
  GOOGLE_LOGIN: 'Google login successful!',
  LOGIN: 'Login successful!',
} as const;

// Loading states
export const LOADING_MESSAGES = {
  LOGOUT: 'Signing out...',
  GOOGLE_LOGIN: 'Signing in with Google...',
  LOGIN: 'Signing in...',
  LOADING_PROFILE: 'Loading profile...',
} as const;

// User roles
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  MODERATOR: 'moderator',
} as const;

// User statuses
export const USER_STATUSES = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
} as const;
