'use client';

import { LoginModal } from './modal/LoginModal';
import { Button } from '@/components/ui/button';
import { useRef, useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';

export function LoginButton() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const loginButtonRef = useRef<HTMLDivElement>(null);
  const { isLogin } = useAuth();

  // 모달 외부 클릭 시 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        loginButtonRef.current &&
        !loginButtonRef.current.contains(event.target as Node)
      ) {
        setIsLoginModalOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={loginButtonRef} className="relative flex items-center gap-3">
      {isLogin && (
        <Button variant="default" onClick={() => setIsLoginModalOpen(true)}>
          MY PAGE
        </Button>
      )}
      <Button
        variant={isLogin ? "secondary" : "default"}
        onClick={() => setIsLoginModalOpen(true)}
      >
        {isLogin ? 'MY ACCOUNT' : 'LOGIN'}
      </Button>
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  );
}
