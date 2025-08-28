'use client';

import { useState, ReactNode } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface SidebarSectionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  action?: ReactNode;
}

export function SidebarSection({
  title,
  children,
  defaultOpen = true,
  action,
}: SidebarSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2 px-3">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider hover:text-zinc-300 transition-colors"
        >
          <ChevronDownIcon
            className={`w-3 h-3 transition-transform duration-200 ${
              isOpen ? 'rotate-0' : '-rotate-90'
            }`}
          />
          {title}
        </button>
        {action && <div>{action}</div>}
      </div>
      
      {isOpen && (
        <div className="space-y-1">
          {children}
        </div>
      )}
    </div>
  );
}