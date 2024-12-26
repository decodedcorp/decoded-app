'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { pretendardBold, pretendardMedium, pretendardRegular } from '@/lib/constants/fonts';

interface AccountSectionProps {
  email?: string;
}

export function AccountSection({ email }: AccountSectionProps) {
  return (
    <div className="px-6 pt-6 pb-8">
      <div className="bg-[#222222] rounded-xl p-6">
        <div className={cn(pretendardBold.className, "text-base mb-6")}>계정</div>
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-start">
            <span className={cn(pretendardMedium.className, "bg-[#222222] pr-4 text-sm text-white/60")}>CURRENT</span>
          </div>
        </div>
        <div className="bg-[#151515] rounded-xl p-4">
          <button className="w-full flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src="/icons/auth/google-icon.svg" alt="Google" className="w-5 h-5" />
              <span className={cn(pretendardRegular.className, "text-sm text-white/80")}>{email || 'krty98000@gmail.com'}</span>
            </div>
            <div className="text-white/60 w-[18px] h-[18px] flex items-center justify-center">
              <img 
                src="/icons/nav/logout.svg" 
                alt="Logout" 
                width={18}
                height={18}
                style={{ filter: 'brightness(0) invert(1)', opacity: 0.6 }}
              />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
} 