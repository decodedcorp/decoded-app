'use client';

import React, { useState } from 'react';
import { SearchModal } from './SearchModal';
import { cn } from '@/lib/utils';
import { pretendardRegular } from '@/lib/constants/fonts';
import { Search } from 'lucide-react';

export function SearchBar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleFocus = () => {
    setIsModalOpen(true);
  };

  const handleBlur = () => {
    // 모달 클릭 시 바로 닫히지 않도록 setTimeout 사용
    setTimeout(() => {
      setIsModalOpen(false);
    }, 200);
  };

  return (
    <div className="relative w-full max-w-[460px] mx-auto">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
        <input
          type="text"
          placeholder="아티스트, 브랜드로 검색해보세요"
          className={cn(
            pretendardRegular.className,
            "w-full bg-[#222222] rounded-xl pl-10 pr-4 py-2.5 text-sm",
            "text-white placeholder-white/40",
            "focus:outline-none focus:ring-1 focus:ring-white/20"
          )}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </div>
      <SearchModal isOpen={isModalOpen} />
    </div>
  );
} 