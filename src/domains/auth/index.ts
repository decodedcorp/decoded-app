// Components
export { LoginForm } from './components/LoginForm';
export { LoginModal } from './components/LoginModal';
export { AuthProvider } from './components/AuthProvider';

// UI Components
export { FormField } from './components/ui/FormField';
export { PasswordField } from './components/ui/PasswordField';
export { SubmitButton } from './components/ui/SubmitButton';

// Types
export type {
  LoginFormData,
  LoginResponse,
  GoogleOAuthResponse,
  AuthState,
  LoginFormErrors,
  LoginFormState,
} from './types/auth';

// Constants
export { AUTH_CONSTANTS } from './constants/authConstants';

// Utils
export {
  validateEmail,
  validatePassword,
  validateLoginForm,
  isFormValid,
} from './utils/validation';

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
  hasTokens,
  isTokenExpired,
  isTokenExpiringSoon,
  decodeToken,
  extractUserFromToken,
  getTokenTimeRemaining,
} from './utils/tokenManager';

// Error Handling
export { handleAuthError, getErrorMessage, logAuthError } from './utils/errorHandler';

// API Functions
export {
  loginUser,
  handleGoogleOAuthCallback,
  logoutUser,
  refreshToken,
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
export { useLogin, useGoogleOAuth, useLogout } from './hooks/useAuthMutations';
