'use client';

import React from 'react';
import { useChannelModalStore } from '@/store/channelModalStore';

export function TestChannelItem() {
  const openModalById = useChannelModalStore((state) => state.openModalById);

  const handleChannelClick = () => {
    openModalById('6888ad5cc623bd789721d11a');
  };

  return (
    <div className="w-full bg-zinc-900 rounded-lg overflow-hidden shadow-2xl border border-zinc-700">
      {/* 카테고리 + 배지 */}
      <div className="flex items-start justify-between px-3 pt-3 pb-1 min-h-[28px]">
        <span className="text-xs font-thin text-zinc-400 tracking-wide uppercase">
          Test Channel
        </span>
        <div className="flex gap-1">
          <span className="px-2 py-0.5 rounded-full bg-green-600 text-xs text-white font-bold">
            NEW
          </span>
          <span className="px-2 py-0.5 rounded-full bg-pink-600 text-xs text-white font-bold">
            HOT
          </span>
        </div>
      </div>

      {/* 이미지 + hover overlay */}
      <div className="relative w-full aspect-[4/5] bg-zinc-800 flex items-center justify-center overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20"></div>
        <div className="text-center text-white">
          <div className="text-4xl mb-2">🎯</div>
          <div className="text-sm font-medium">API Test Channel</div>
        </div>

        {/* hover overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
          <button
            className="px-3 py-1.5 rounded-full bg-white/90 text-zinc-900 text-xs font-semibold shadow hover:bg-white"
            onClick={handleChannelClick}
          >
            View Details
          </button>
        </div>
      </div>

      {/* 텍스트 정보 */}
      <div className="flex flex-col gap-2 px-3 py-2 flex-1">
        <div className="text-2xl font-semibold text-white leading-tight truncate">
          Test Channel 6888ad5cc623bd789721d11a
        </div>

        {/* Editors 아바타 스택 */}
        <div className="flex items-center mt-1 gap-1">
          <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-xs text-white font-thin border-2 border-blue-500">
            <span>AI</span>
          </div>
          <div className="w-7 h-7 rounded-full bg-green-600 flex items-center justify-center text-xs text-white font-thin -ml-2 border-2 border-green-500">
            <span>Dev</span>
          </div>
        </div>

        <div className="text-xs font-thin text-zinc-500 mt-1">2024-01-15</div>
      </div>
    </div>
  );
}
