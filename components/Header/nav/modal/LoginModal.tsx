'use client';

import React from 'react';
import { AccountSection } from './sections/AccountSection';
import { StatsSection } from './sections/StatsSection';
import { PointSection } from './sections/PointSection';
import { ModalNav } from './sections/ModalNav';
import Logo from '@/app/components/ui/Logo';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  if (!isOpen) return null;

  return (
    <div className="absolute right-0 top-[calc(100%+12px)] w-[400px] bg-[#171717] rounded-xl overflow-hidden">
      <div className="flex items-center bg-[#494E29] p-4 relative">
        <div className="flex-1 flex items-center justify-center">
          <Logo width={200} height={48} />
        </div>
        <button
          onClick={onClose}
          className="absolute right-4 text-white/60 hover:text-white transition-colors"
        >
          ✕
        </button>
      </div>

      <div className="bg-[#171717]">
        <AccountSection onClose={onClose} />
      </div>
      <div className="bg-[#171717]">
        <StatsSection />
        <PointSection />
      </div>
      <div className="bg-[#222222] border-t border-white/10">
        <ModalNav />
      </div>
    </div>
  );
}
