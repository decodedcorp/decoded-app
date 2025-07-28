'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/domains/auth/hooks/useAuth';

export function LoginButton() {
  const router = useRouter();
  const { isAuthenticated, user, logout, isLoading } = useAuth();

  const handleClick = () => {
    if (isAuthenticated) {
      // 로그인된 경우 프로필 페이지로 이동
      router.push('/profile');
    } else {
      // 로그인되지 않은 경우 Google OAuth 시작
      try {
        initiateGoogleOAuth();
      } catch (error) {
        console.error('Failed to initiate Google OAuth:', error);
        // 에러 발생 시 로그인 페이지로 이동
        router.push('/login');
      }
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  // Google OAuth 시작 함수
  const initiateGoogleOAuth = () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const redirectUri =
      process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI || 'http://localhost:3000/auth/callback';

    if (!clientId) {
      throw new Error('Google Client ID가 설정되지 않았습니다.');
    }

    const googleAuthUrl =
      `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `response_type=code&` +
      `scope=${encodeURIComponent('openid email profile')}&` +
      `access_type=offline&` +
      `prompt=consent`;

    window.location.href = googleAuthUrl;
  };

  // 로딩 중일 때는 버튼을 비활성화
  if (isLoading) {
    return (
      <button
        disabled
        className="px-4 py-2 rounded-md text-sm font-medium bg-neutral-900/50 text-[#EAFD66]/50 cursor-not-allowed transition"
      >
        로딩 중...
      </button>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      {isAuthenticated ? (
        <>
          {/* 사용자 정보 표시 */}
          <span className="text-sm text-[#EAFD66] hidden md:block">
            {user?.nickname || user?.email}
          </span>

          {/* 프로필 버튼 */}
          <button
            onClick={handleClick}
            className="px-4 py-2 rounded-md text-sm font-medium bg-neutral-900 text-[#EAFD66] hover:bg-[#EAFD66] hover:text-black transition"
          >
            마이페이지
          </button>

          {/* 로그아웃 버튼 */}
          <button
            onClick={handleLogout}
            className="px-3 py-2 rounded-md text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition"
          >
            로그아웃
          </button>
        </>
      ) : (
        <button
          onClick={handleClick}
          className="px-4 py-2 rounded-md text-sm font-medium bg-neutral-900 text-[#EAFD66] hover:bg-[#EAFD66] hover:text-black transition"
        >
          로그인
        </button>
      )}
    </div>
  );
}
