import { useEffect } from 'react';
import { useAuthStore } from '../../../store/authStore';
import { getStoredTokens, isTokenExpired, decodeToken } from '../utils/tokenManager';

/**
 * 앱 시작 시 인증 상태를 초기화하고 복원하는 훅
 */
export const useAuthInit = () => {
  const { setLoading, setError, login, logout } = useAuthStore();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);

        // 저장된 토큰 확인
        const tokens = getStoredTokens();

        if (!tokens) {
          // 토큰이 없으면 로그아웃 상태로 설정
          logout();
          return;
        }

        // 액세스 토큰이 만료되었는지 확인
        if (isTokenExpired(tokens.access_token)) {
          // 토큰이 만료되었으면 로그아웃
          logout();
          return;
        }

        // 토큰에서 사용자 정보 추출
        const decodedToken = decodeToken(tokens.access_token);
        if (!decodedToken) {
          logout();
          return;
        }

        // 사용자 정보를 스토어에 설정
        const user = {
          id: decodedToken.sub,
          email: decodedToken.email || '',
          role: decodedToken.role || 'user',
          status: 'active',
        };

        login({
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          user,
        });
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        setError('인증 상태 초기화에 실패했습니다.');
        logout();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [setLoading, setError, login, logout]);

  return null;
};
