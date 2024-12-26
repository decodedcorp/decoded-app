'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface NavItemProps {
  icon: string;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

function NavItem({ icon, label, isActive, onClick }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-1",
        "text-xs",
        isActive ? "text-[#D6F34C]" : "text-white/60"
      )}
    >
      <div className="w-[22px] h-[22px] flex items-center justify-center">
        <img 
          src={icon} 
          alt={label} 
          width={22}
          height={22}
          style={{ 
            filter: isActive 
              ? 'invert(89%) sepia(25%) saturate(803%) hue-rotate(28deg) brightness(103%) contrast(96%)' 
              : 'brightness(0) invert(1)',
            opacity: isActive ? 1 : 0.6,
          }}
        />
      </div>
      <span>{label}</span>
    </button>
  );
}

export function ModalNav() {
  return (
    <div className="flex items-center justify-between px-8 py-4 border-t border-white/10">
      <NavItem
        icon="/icons/nav/home.svg"
        label="홈"
        isActive={true}
      />
      <NavItem
        icon="/icons/nav/request.svg"
        label="요청"
      />
      <NavItem
        icon="/icons/nav/offer.svg"
        label="제공"
      />
      <NavItem
        icon="/icons/nav/like.svg"
        label="좋아요"
      />
      <NavItem
        icon="/icons/nav/notification.svg"
        label="알림"
      />
    </div>
  );
} 