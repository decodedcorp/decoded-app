'use client';

import { HoverItem } from '@/types/model.d';
import { useState } from 'react';

interface BottomSectionProps {
  item: HoverItem;
}

export function BottomSection({ item }: BottomSectionProps) {
  const [activeSection, setActiveSection] = useState<'sales' | 'reference'>('sales');

  return (
    <div className="flex-1 min-h-0 overflow-y-auto mt-6">
      {/* Section Header */}
      <div className="sticky top-0">
        <div className="flex">
          <div 
            className={`flex-1 text-center py-3 cursor-pointer ${activeSection === 'sales' ? 'border-b-2 border-white' : 'border-b border-white/10'}`}
            onClick={() => setActiveSection('sales')}
          >
            <span className="text-white">판매링크</span>
            <span className={`ml-2 ${activeSection === 'sales' ? 'text-primary' : 'text-white'}`}>3</span>
          </div>
          <div 
            className={`flex-1 text-center py-3 cursor-pointer ${activeSection === 'reference' ? 'border-b-2 border-white' : 'border-b border-white/10'}`}
            onClick={() => setActiveSection('reference')}
          >
            <span className="text-white/40">레퍼런스</span>
            <span className={`ml-2 ${activeSection === 'reference' ? 'text-primary' : 'text-white/40'}`}>3</span>
          </div>
        </div>
      </div>

      {/* Content based on active section */}
      <div className="px-4">
        {activeSection === 'sales' ? (
          <>
            {/* WELLBEING EXPRESS */}
            <div className="flex items-center justify-between py-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-white">WELLBEING EXPRESS</span>
              </div>
              <div className="flex items-center text-white">
                <span className="ml-2">&gt;</span>
              </div>
            </div>

            {/* 29CM */}
            <div className="flex items-center justify-between py-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-white">29CM</span>
              </div>
              <div className="flex items-center text-white">
                <span className="ml-2">&gt;</span>
              </div>
            </div>

            {/* MUSINSA */}
            <div className="flex items-center justify-between py-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-white">MUSINSA</span>
              </div>
              <div className="flex items-center text-white">
                <span className="ml-2">&gt;</span>
              </div>
            </div>
          </>
        ) : (
          // Reference list content
          <div className="py-4">
            <div className="text-white">List</div>
          </div>
        )}
      </div>
    </div>
  );
} 