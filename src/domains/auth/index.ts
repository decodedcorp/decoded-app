// Components
export { LoginForm } from './components/LoginForm';
export { LoginModal } from './components/LoginModal';
export { AuthProvider } from './components/AuthProvider';
export { AuthStatus } from './components/AuthStatus';
export { ProtectedRoute } from './components/ProtectedRoute';

// Types
export type {
  LoginRequest,
  LoginResponse,
  User,
  UserRole,
  UserStatus,
  AuthState,
  SessionData,
  DecodedToken,
} from './types/auth';

export type { TokenData, TokenType } from './utils/tokenManager';

// Constants
export {
  STORAGE_KEYS,
  API_ENDPOINTS,
  GOOGLE_OAUTH_CONFIG,
  TIMING,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  LOADING_MESSAGES,
  USER_ROLES,
  USER_STATUSES,
} from './constants';

// Token Management
export {
  setTokens,
  getAccessToken,
  getRefreshToken,
  clearTokens,
  isTokenExpired,
  storeUserSession,
  storeLoginResponse,
  clearSession,
  isAuthenticated,
  getValidAccessToken,
  getUserData,
  setUserData,
  setLastTokenCheck,
  shouldCheckToken,
} from './utils/tokenManager';

// Token Decoder
export { TokenDecoder } from './utils/tokenDecoder';

// Response Mapper
export { ResponseMapper } from './utils/responseMapper';

// API Functions
export {
  loginUser,
  logoutUser,
  getUserProfile,
  checkAuthStatus,
  handleGoogleOAuthCallback,
} from './api/authApi';

// Core Hooks
export { useAuthCore } from './hooks/useAuthCore';
export { useTokenMonitor } from './hooks/useTokenMonitor';
export { useAuthInit } from './hooks/useAuthInit';

// Main Auth Hook
export {
  useAuth,
  useUser,
  useAuthStatus,
  useAuthLoading,
  useAuthError,
  useUserRole,
  useHasRole,
  useIsAdmin,
  useIsUser,
  useIsModerator,
} from './hooks/useAuth';

// React Query Hooks
export { useLogin, useLogout, useGoogleOAuth } from './hooks/useAuthMutations';
