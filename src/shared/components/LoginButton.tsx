'use client';

import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { LoginModal } from '@/domains/auth/components/LoginModal';
import { UserAvatar } from '@/shared/components/UserAvatar';
import { Button } from '@decoded/ui';

export function LoginButton() {
  const router = useRouter();

  // 🔄 RESET: Simplified state management - only use essential states
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Hydration mismatch 방지를 위한 클라이언트 사이드 상태
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClick = () => {
    // 로그인되지 않은 경우 로그인 모달 열기
    setIsLoginModalOpen(true);
  };

  const handleLoginSuccess = () => {
    // 로그인 성공 시 모달 닫기
    setIsLoginModalOpen(false);
  };

  const handleCloseModal = () => {
    setIsLoginModalOpen(false);
  };

  // 🔄 RESET: Simple hydration handling only
  if (!mounted) {
    return <Button size="sm">Login</Button>;
  }

  return (
    <>
      <div className="flex items-center space-x-2">
        {isAuthenticated ? (
          <UserAvatar size="md" showDropdown={true} />
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
