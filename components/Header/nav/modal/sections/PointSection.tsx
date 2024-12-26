'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { pretendardBold, pretendardMedium } from '@/lib/constants/fonts';

interface PointSectionProps {
  points?: number;
}

export function PointSection({ points = 100 }: PointSectionProps) {
  return (
    <div className="px-6 pb-8">
      <div className="px-6 py-5 bg-gradient-to-b from-[#494E29] from-0% via-[#2C2C2C] via-100% to-[#2C2C2C] to-100% rounded-b-2xl">
        <div className="flex items-center justify-between px-2">
          <div className={cn(pretendardMedium.className, "text-sm text-white/60")}>MY POINT</div>
          <div className="flex items-center gap-1">
            <span className={cn(pretendardBold.className, "text-[#D6F34C] text-2xl font-medium")}>{points}</span>
            <span className={cn(pretendardBold.className, "text-[#D6F34C] ml-0.5")}>P</span>
          </div>
        </div>
      </div>
    </div>
  );
} 