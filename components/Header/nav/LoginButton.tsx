'use client';

import { LoginModal } from './modal/LoginModal';
import { useState } from 'react';
import { useAuth } from '@/lib/hooks/features/auth/useAuth';
import useModalClose from '@/lib/hooks/common/useModalClose';
import { cn } from '@/lib/utils/style';

export function LoginButton() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { isLogin } = useAuth();

  const { modalRef } = useModalClose({
    onClose: () => setIsLoginModalOpen(false),
    isOpen: isLoginModalOpen,
  });

  return (
    <div ref={modalRef} className="relative flex items-center gap-3">
      <span
        className={cn(
          'text-xs md:text-sm transition-colors duration-200 cursor-pointer',
          isLoginModalOpen
            ? 'text-[#EAFD66]'
            : 'text-gray-600 hover:text-[#EAFD66]'
        )}
        onClick={() => setIsLoginModalOpen(true)}
      >
        {isLogin ? '마이페이지' : '로그인'}
      </span>
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  );
}
