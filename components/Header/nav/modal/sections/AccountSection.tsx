'use client';

import React from 'react';
import { cn } from '@/lib/utils/style';
import { pretendardBold, pretendardMedium, pretendardRegular } from '@/lib/constants/fonts';
import { useAuth } from '@/lib/hooks/useAuth';
import Image from "next/image"

interface AccountSectionProps {
  email?: string;
  onClose?: () => void;
}

export function AccountSection({ email, onClose }: AccountSectionProps) {
  const { isLogin, handleGoogleLogin, handleDisconnect } = useAuth();

  const handleAuth = async () => {
    if (isLogin) {
      handleDisconnect();
    } else {
      handleGoogleLogin();
    }
    onClose?.();
  };

  return (
    <div className="px-6 pt-6 pb-8">
      <div className="bg-[#222222] rounded-xl p-6">
        <div className={cn(pretendardBold.className, "text-base mb-6")}>계정</div>
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-start">
            <span className={cn(pretendardMedium.className, "bg-[#222222] pr-4 text-sm text-white/60")}>
              {isLogin ? 'CURRENT' : 'LOGIN WITH'}
            </span>
          </div>
        </div>
        <div className="bg-[#151515] rounded-xl p-4">
          <button 
            onClick={handleAuth}
            className="w-full flex items-center justify-between group hover:opacity-80 transition-opacity"
          >
            <div className="flex items-center gap-2">
              <Image 
                src="/icons/auth/google-icon.svg" 
                alt="Google" 
                width={20}
                height={20}
                className="rounded-full"
              />
              {isLogin ? (
                <span className={cn(pretendardRegular.className, "text-sm text-white/80")}>
                  {email || 'krty98000@gmail.com'}
                </span>
              ) : (
                <span className={cn(pretendardRegular.className, "text-sm text-white/80")}>
                  Google로 로그인
                </span>
              )}
            </div>
            {isLogin && (
              <div className="text-white/60 w-[18px] h-[18px] flex items-center justify-center">
                <img 
                  src="/icons/nav/logout.svg" 
                  alt="Logout" 
                  width={18}
                  height={18}
                  style={{ filter: 'brightness(0) invert(1)', opacity: 0.6 }}
                  className="group-hover:opacity-100 transition-opacity"
                />
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 