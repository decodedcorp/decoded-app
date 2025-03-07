"use client";

import { ItemButtonProps } from '@/types/button.d';

interface InfoButtonProps {
  item: ItemButtonProps['item'];
  isActive: boolean;
  onClick?: () => void;
}

export function InfoButton({ item, isActive, onClick }: InfoButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative transition-transform duration-200 hover:scale-110 active:scale-95`}
    >
      <div className="relative">
        <div className="w-3 h-3 cursor-pointer">
          <div className="absolute inset-0 border-2 border-[#EAFD66]/40 rounded-full animate-ping"></div>
          <div className="relative w-full h-full">
            <div className="absolute inset-0 bg-[#EAFD66]/30 backdrop-blur-sm rounded-full border-2 border-[#EAFD66]/50"></div>
            <div className="absolute inset-[2px] bg-[#EAFD66] rounded-full shadow-lg"></div>
          </div>
        </div>
      </div>
    </button>
  );
}
