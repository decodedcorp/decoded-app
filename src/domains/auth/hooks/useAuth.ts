import { useAuthCore } from './useAuthCore';
import { useAuthMutations } from './useAuthMutations';
import { useAuthStore } from '../../../store/authStore';
import { UserRole } from '../types/auth';

/**
 * 메인 인증 훅 - 모든 인증 관련 기능을 제공
 */
export const useAuth = () => {
  const authCore = useAuthCore();
  const authStore = useAuthStore();
  const { loginMutation, logoutMutation, googleOAuthMutation } = useAuthMutations();

  // 통합된 로딩 상태 - 개별 상태를 직접 구독
  const storeLoading = useAuthStore((state) => state.isLoading);
  const isLoading = storeLoading || authCore.isProfileLoading;

  return {
    // Core auth state
    user: authCore.user,
    isAuthenticated: authCore.isAuthenticated,
    isLoading,
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
    useLogin: loginMutation,
    useLogout: logoutMutation,
    useGoogleOAuth: googleOAuthMutation,
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
 * 로딩 상태만 필요한 경우 (통합된 로딩 상태)
 */
export const useAuthLoading = () => {
  const { isLoading } = useAuth();
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

/**
 * 인증 상태와 로딩 상태를 함께 제공하는 훅
 */
export const useAuthState = () => {
  const { isAuthenticated, isLoading, error } = useAuth();

  return {
    isAuthenticated,
    isLoading,
    error,
    isReady: !isLoading && !error,
  };
};

/**
 * 보호된 액션을 위한 훅 (인증 필요)
 */
export const useProtectedAction = () => {
  const { isAuthenticated, login } = useAuth();

  return {
    isAuthenticated,
    requireAuth: (action: () => void) => {
      if (isAuthenticated) {
        action();
      } else {
        // 로그인 모달 열기 또는 로그인 페이지로 리다이렉트
        console.log('Authentication required for this action');
      }
    },
  };
};
