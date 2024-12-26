'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { pretendardBold, pretendardMedium, pretendardRegular } from '@/lib/constants/fonts';

interface StatItemProps {
  label: string;
  value: number;
}

function StatItem({ label, value }: StatItemProps) {
  return (
    <div className="flex flex-col items-center">
      <div className={cn(pretendardRegular.className, "text-sm text-white/60 mb-1")}>{label}</div>
      <div className={cn(pretendardBold.className, "text-[#D6F34C] text-2xl font-medium")}>{value}</div>
    </div>
  );
}

interface StatsSectionProps {
  stats?: {
    requests: number;
    offers: number;
    inProgress: number;
    completed: number;
  };
}

export function StatsSection({ stats }: StatsSectionProps) {
  const defaultStats = {
    requests: 12,
    offers: 3,
    inProgress: 1,
    completed: 10,
  };

  const currentStats = stats || defaultStats;

  return (
    <div>
      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10"></div>
        </div>
        <div className="relative flex justify-center">
          <span className={cn(pretendardMedium.className, "bg-[#171717] px-6 text-sm text-white/60 z-10")}>MY PAGE</span>
        </div>
      </div>
      <div className="px-6 py-5 bg-[#1f210e] rounded-t-2xl mx-6">
        <div className="flex justify-between px-2">
          <StatItem label="요청" value={currentStats.requests} />
          <StatItem label="제공" value={currentStats.offers} />
          <StatItem label="진행중" value={currentStats.inProgress} />
          <StatItem label="완료" value={currentStats.completed} />
        </div>
      </div>
    </div>
  );
} 