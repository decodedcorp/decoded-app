'use client';

import { formatUrl } from '../utils';
import { ChevronRight } from 'lucide-react';
import type { LinkInfo } from '../types';

interface LinkListProps {
  links?: LinkInfo[];
  activeTab: 'sale' | 'related';
  status: 'pending' | 'confirmed';
}

export function LinkList({ links, activeTab, status }: LinkListProps) {
  // First filter confirmed links only
  const confirmedLinks = links?.filter(link => link.status === 'confirmed') || [];
  
  // Then filter by tab type
  const filteredLinks = confirmedLinks.filter(
    link => activeTab === 'sale' ? link.label === 'sale' : !link.label
  );

  return (
    <div className="space-y-4">
      {filteredLinks.map((link, index) => (
        <a
          key={index}
          href={link.value}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex justify-between items-center hover:bg-neutral-900 transition-colors"
        >
          <div className="space-y-1.5">
            {activeTab === 'sale' && (
              <div className="text-primary text-[11px] font-medium">SALE</div>
            )}
            <div className="text-white text-xs">{formatUrl(link.value)}</div>
            <div className="text-neutral-600 text-[11px]">
              {activeTab === 'sale' ? '구매하기' : link.label || '관련정보'}
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-600 group-hover:text-primary transition-colors" />
        </a>
      ))}
    </div>
  );
}
