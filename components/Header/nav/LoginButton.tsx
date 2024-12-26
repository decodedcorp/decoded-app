'use client';

import { LoginModal } from './modal/LoginModal';
import { cn } from '@/lib/utils';
import { useState, useRef, useEffect } from 'react';

export function LoginButton() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const loginButtonRef = useRef<HTMLDivElement>(null);

  // 모달 외부 클릭 시 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (loginButtonRef.current && !loginButtonRef.current.contains(event.target as Node)) {
        setIsLoginModalOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={loginButtonRef} className="relative">
      <button 
        onClick={() => setIsLoginModalOpen(!isLoginModalOpen)}
        className={cn(
          "rounded-[12px] px-6 h-9",
          "border border-white/50 text-white",
          "hover:bg-white/10 hover:border-white/70",
          "transition-colors text-sm"
        )}
      >
        LOGIN
      </button>
      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  );
} 