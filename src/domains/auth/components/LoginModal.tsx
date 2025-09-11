'use client';

import React from 'react';

import { Dialog, DialogContent } from '@decoded/ui';

import { LoginForm } from './LoginForm';


interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const handleLoginSuccess = () => {
    onLoginSuccess?.();
    onClose();
  };

  const handleLoginError = (error: string) => {
    console.error('Google login failed:', error);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-md mx-4 sm:mx-auto bg-gradient-to-br from-zinc-900/95 to-black/95 border border-white/10 backdrop-blur-xl">
        {/* 상단 섹션 (로고 + 제목) */}
        <div className="flex flex-col items-center mb-8">
          <div className="text-3xl font-bold text-[#EAFD66] tracking-tight drop-shadow mb-2">
            decoded
          </div>
          <div className="text-center">
            <p className="text-gray-300 text-sm">Sign in with your Google account to continue</p>
          </div>
        </div>

        {/* 로그인 폼 섹션 */}
        <div className="mb-8">
          <LoginForm onSuccess={handleLoginSuccess} onError={handleLoginError} />
        </div>

        {/* 하단 섹션 (약관 및 개인정보처리방침) */}
        <div className="text-center text-xs text-gray-400 space-x-4">
          <a href="/terms-of-service" className="hover:text-gray-200 transition-colors">
            Terms of Service
          </a>
          <span>|</span>
          <a href="/privacy-policy" className="hover:text-gray-200 transition-colors">
            Privacy Policy
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
};
