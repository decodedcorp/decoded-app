'use client';

import React from 'react';
import { cn } from '@/lib/utils/style';
import { pretendardMedium, pretendardRegular } from '@/lib/constants/fonts';

interface SearchResult {
  id: string;
  name: string;
  decodedCount: number;
}

interface SearchModalProps {
  isOpen: boolean;
  results?: SearchResult[];
}

export function SearchModal({ isOpen, results = [] }: SearchModalProps) {
  if (!isOpen) return null;

  const defaultResults = [
    { id: '1', name: '뉴진스 다니엘', decodedCount: 5 },
    { id: '2', name: '나이키', decodedCount: 5 },
    { id: '3', name: '아디다스', decodedCount: 5 },
    { id: '4', name: 'G-Dragon', decodedCount: 5 },
  ];

  const searchResults = results.length > 0 ? results : defaultResults;

  return (
    <div className="absolute left-0 right-0 top-[calc(100%+12px)] bg-[#171717] rounded-xl overflow-hidden shadow-lg">
      <div className="p-4">
        {searchResults.map((result) => (
          <div key={result.id} className="flex items-center justify-between p-2 hover:bg-white/5 rounded-lg cursor-pointer">
            <div className={cn(pretendardMedium.className, "text-sm text-white/80")}>
              {result.name}
            </div>
            <div className={cn(pretendardRegular.className, "text-sm flex items-center gap-1")}>
              <span className="text-[#D6F34C]">{result.decodedCount}</span>
              <span className="text-white/60">DECODED</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 