'use client';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { LoginModal } from '@/domains/auth/components/LoginModal';
import { Button } from '@decoded/ui';

export function LoginButton() {
  const router = useRouter();

  // 개별 상태를 직접 구독하여 무한 루프 방지
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  // 사용자 표시 이름 계산
  const userDisplayName = user?.nickname || user?.email || '';

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Hydration mismatch 방지를 위한 클라이언트 사이드 상태
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClick = () => {
    if (isAuthenticated) {
      // 로그인된 경우 프로필 페이지로 이동
      router.push('/profile');
    } else {
      // 로그인되지 않은 경우 로그인 모달 열기
      setIsLoginModalOpen(true);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleLoginSuccess = () => {
    // 로그인 성공 시 모달 닫기
    setIsLoginModalOpen(false);
  };

  const handleCloseModal = () => {
    setIsLoginModalOpen(false);
  };

  // 서버 사이드 렌더링 시 기본 버튼만 표시 (hydration mismatch 방지)
  if (!mounted) {
    return (
      <Button disabled size="sm">
        Loading...
      </Button>
    );
  }

  // 로딩 중이거나 아직 초기화되지 않았을 때는 버튼을 비활성화
  if (isLoading || !isInitialized) {
    return (
      <Button disabled size="sm" loading={isLoading}>
        {isLoading ? 'Loading...' : 'Initializing...'}
      </Button>
    );
  }

  return (
    <>
      <div className="flex items-center space-x-2">
        {isAuthenticated ? (
          <>
            {/* 사용자 정보 표시 */}
            <span className="text-sm text-[#EAFD66] hidden md:block">{userDisplayName}</span>

            {/* 프로필 버튼 */}
            <Button onClick={handleClick} variant="login" size="sm">
              My Page
            </Button>

            {/* 로그아웃 버튼 */}
            <Button onClick={handleLogout} variant="destructive" size="sm">
              Logout
            </Button>
          </>
        ) : (
          <Button onClick={handleClick} variant="login" size="sm">
            Login
          </Button>
        )}
      </div>

      {/* 로그인 모달 */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={handleCloseModal}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  );
}
