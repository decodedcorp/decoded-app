// Components
export { LoginForm } from './components/LoginForm';
export { LoginModal } from './components/LoginModal';
export { AuthProvider } from './components/AuthProvider';

// Types
export type {
  GoogleOAuthResponse,
  AuthState,
} from './types/auth';

// Constants
export { AUTH_CONSTANTS } from './constants/authConstants';

// OAuth Utils
export {
  initiateGoogleOAuth,
  extractAuthCodeFromUrl,
  buildGoogleOAuthUrl,
  getGoogleOAuthConfig,
  getGoogleOAuthErrorMessage,
} from './utils/oauth';

// Token Management
export {
  setTokens,
  getAccessToken,
  getRefreshToken,
  clearTokens,
  isTokenExpired,
} from './utils/tokenManager';

// Error Handling
export { handleAuthError, getAuthErrorMessage, logAuthError } from './utils/errorHandler';

// API Functions
export {
  handleGoogleOAuthCallback,
  logoutUser,
  refreshUserToken,
  getUserProfile,
} from './api/authApi';

// Hooks
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
} from './hooks/useAuth';

export { useAuthInit } from './hooks/useAuthInit';
export { useTokenRefresh } from './hooks/useTokenRefresh';

// React Query Hooks
export { useGoogleOAuth, useLogout } from './hooks/useAuthMutations';
