'use client';

import Link from 'next/link';
import { ReactNode } from 'react';

interface SidebarItemProps {
  href?: string;
  onClick?: () => void;
  icon?: ReactNode;
  label: string;
  count?: number;
  isActive?: boolean;
  className?: string;
}

export function SidebarItem({
  href,
  onClick,
  icon,
  label,
  count,
  isActive = false,
  className = '',
}: SidebarItemProps) {
  const content = (
    <>
      {icon && <span className="w-7 h-7 flex-shrink-0">{icon}</span>}
      <span className="flex-1 truncate">{label}</span>
      {count !== undefined && (
        <span className="text-sm text-zinc-500">{count > 999 ? '999+' : count}</span>
      )}
    </>
  );

  const baseClasses = `
    flex items-center gap-4 px-3 py-3 rounded-xl
    text-base font-normal transition-all duration-200
    ${isActive 
      ? 'bg-zinc-900 text-white' 
      : 'text-zinc-300 hover:bg-zinc-900/50 hover:text-white'
    }
    ${className}
  `;

  if (href) {
    return (
      <Link href={href} className={baseClasses}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={`${baseClasses} w-full text-left`}>
      {content}
    </button>
  );
}