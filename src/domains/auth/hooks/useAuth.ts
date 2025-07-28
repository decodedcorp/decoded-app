import {
  useAuthStore,
  selectUser,
  selectIsAuthenticated,
  selectIsLoading,
  selectError,
  selectUserRole,
  selectUserName,
  selectUserEmail,
} from '../../../store/authStore';

/**
 * 인증 상태와 관련 액션들을 제공하는 메인 훅
 */
export const useAuth = () => {
  const authStore = useAuthStore();

  return {
    // State
    user: useAuthStore(selectUser),
    isAuthenticated: useAuthStore(selectIsAuthenticated),
    isLoading: useAuthStore(selectIsLoading),
    error: useAuthStore(selectError),

    // Actions
    login: authStore.login,
    loginWithGoogle: authStore.loginWithGoogle,
    logout: authStore.logout,
    setLoading: authStore.setLoading,
    setError: authStore.setError,
    clearError: authStore.clearError,
    updateUser: authStore.updateUser,

    // Token management
    getAccessToken: authStore.getAccessToken,
    getRefreshToken: authStore.getRefreshToken,
    setTokens: authStore.setTokens,
    clearTokens: authStore.clearTokens,
  };
};

/**
 * 사용자 정보만 필요한 경우 사용하는 훅
 */
export const useUser = () => {
  return {
    user: useAuthStore(selectUser),
    isAuthenticated: useAuthStore(selectIsAuthenticated),
    role: useAuthStore(selectUserRole),
    name: useAuthStore(selectUserName),
    email: useAuthStore(selectUserEmail),
  };
};

/**
 * 인증 상태만 필요한 경우 사용하는 훅
 */
export const useAuthStatus = () => {
  return {
    isAuthenticated: useAuthStore(selectIsAuthenticated),
    isLoading: useAuthStore(selectIsLoading),
    error: useAuthStore(selectError),
  };
};

/**
 * 로딩 상태만 필요한 경우 사용하는 훅
 */
export const useAuthLoading = () => {
  return useAuthStore(selectIsLoading);
};

/**
 * 에러 상태만 필요한 경우 사용하는 훅
 */
export const useAuthError = () => {
  return useAuthStore(selectError);
};

/**
 * 사용자 역할을 확인하는 훅
 */
export const useUserRole = () => {
  return useAuthStore(selectUserRole);
};

/**
 * 특정 역할을 가졌는지 확인하는 훅
 */
export const useHasRole = (requiredRole: string) => {
  const userRole = useAuthStore(selectUserRole);
  const isAuthenticated = useAuthStore(selectIsAuthenticated);

  return isAuthenticated && userRole === requiredRole;
};

/**
 * 관리자 권한을 확인하는 훅
 */
export const useIsAdmin = () => {
  return useHasRole('admin');
};

/**
 * 사용자 권한을 확인하는 훅
 */
export const useIsUser = () => {
  return useHasRole('user');
};
