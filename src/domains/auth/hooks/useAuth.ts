import { useAuthCore } from './useAuthCore';
import { useLogin, useLogout, useGoogleOAuth } from './useAuthMutations';
import { useAuthStore } from '../../../store/authStore';
import { UserRole } from '../types/auth';

/**
 * 메인 인증 훅 - 모든 인증 관련 기능을 제공
 */
export const useAuth = () => {
  const authCore = useAuthCore();
  const authStore = useAuthStore();

  return {
    // Core auth state
    user: authCore.user,
    isAuthenticated: authCore.isAuthenticated,
    isLoading: authCore.isLoading || authCore.isAuthLoading || authCore.isProfileLoading,
    error: authCore.error,

    // Query state
    authStatus: authCore.authStatus,
    userProfile: authCore.userProfile,
    profileError: authCore.profileError,

    // Actions
    login: authCore.login,
    logout: authCore.logout,
    setLoading: authCore.setLoading,
    setError: authCore.setError,
    clearError: authCore.clearError,
    updateUser: authCore.updateUser,

    // Mutation hooks (직접 사용 가능)
    useLogin,
    useLogout,
    useGoogleOAuth,
  };
};

/**
 * 사용자 정보를 편리하게 접근할 수 있는 훅
 */
export const useUser = () => {
  const { user } = useAuth();

  return {
    user,
    role: user?.role || 'user',
    name: user?.nickname || '',
    email: user?.email || '',
  };
};

/**
 * 사용자 정보만 필요한 경우 (기존 호환성)
 */
export const useUserData = () => {
  const user = useAuthStore((state) => state.user);
  return user;
};

/**
 * 인증 상태만 필요한 경우
 */
export const useAuthStatus = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated;
};

/**
 * 로딩 상태만 필요한 경우
 */
export const useAuthLoading = () => {
  const isLoading = useAuthStore((state) => state.isLoading);
  return isLoading;
};

/**
 * 에러 상태만 필요한 경우
 */
export const useAuthError = () => {
  const error = useAuthStore((state) => state.error);
  return error;
};

/**
 * 사용자 역할 확인
 */
export const useUserRole = () => {
  const user = useAuthStore((state) => state.user);
  return user?.role;
};

/**
 * 특정 역할 확인
 */
export const useHasRole = (requiredRole: UserRole) => {
  const userRole = useUserRole();
  return userRole === requiredRole;
};

/**
 * 관리자 확인
 */
export const useIsAdmin = () => {
  return useHasRole('admin');
};

/**
 * 일반 사용자 확인
 */
export const useIsUser = () => {
  const userRole = useUserRole();
  return userRole === 'user';
};

/**
 * 모더레이터 확인
 */
export const useIsModerator = () => {
  return useHasRole('moderator');
};
