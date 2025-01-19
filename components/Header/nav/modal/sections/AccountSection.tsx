'use client';

import React from 'react';
import { useAuth } from '@/lib/hooks/features/auth/useAuth';
import { GoogleIcon } from '@/styles/icons/auth/google-icon';

interface AccountSectionProps {
  onClose?: () => void;
}

export function AccountSection({ onClose }: AccountSectionProps) {
  const { isLogin, handleGoogleLogin, handleDisconnect } = useAuth();

  return (
    <div className="space-y-6">
      {isLogin ? (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-black/20 rounded-xl p-4 text-center">
              <div className="text-[#EAFD66] text-xl font-bold">2,400</div>
              <div className="text-xs text-gray-400 mt-1">포인트</div>
            </div>
            <div className="bg-black/20 rounded-xl p-4 text-center">
              <div className="text-[#EAFD66] text-xl font-bold">5</div>
              <div className="text-xs text-gray-400 mt-1">활동권</div>
            </div>
            <div className="bg-black/20 rounded-xl p-4 text-center">
              <div className="text-[#EAFD66] text-xl font-bold">Lv.3</div>
              <div className="text-xs text-gray-400 mt-1">기여도</div>
            </div>
          </div>

          {/* Contribution Graph */}
          <div className="bg-black/20 rounded-xl p-4">
            <h3 className="text-sm font-medium text-gray-400 mb-3">
              활동 그래프
            </h3>
            <div className="grid grid-cols-7 gap-1.5">
              {[...Array(28)].map((_, i) => (
                <div
                  key={i}
                  className={`aspect-square rounded-sm ${
                    Math.random() > 0.5 ? 'bg-[#EAFD66]/20' : 'bg-white/5'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={() => {
              handleDisconnect();
              onClose?.();
            }}
            className="w-full px-6 py-4 rounded-xl text-sm font-medium
              bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white
              transition-all duration-200 ease-out"
          >
            로그아웃하기
          </button>
        </>
      ) : (
        <button
          onClick={() => {
            handleGoogleLogin();
            onClose?.();
          }}
          className="w-full px-6 py-4 rounded-xl text-sm font-medium
            bg-gradient-to-r from-white to-gray-100 text-gray-900 
            hover:from-gray-50 hover:to-gray-100
            transition-all duration-200 ease-out
            flex items-center justify-center gap-3
            shadow-lg shadow-black/5"
        >
          <GoogleIcon />
          <span className="font-medium">Google로 계속하기</span>
        </button>
      )}
    </div>
  );
}
