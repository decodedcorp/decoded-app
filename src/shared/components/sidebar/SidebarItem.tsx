'use client';

import { ReactNode } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useNavigationPrefetch } from '@/lib/hooks/usePrefetch';

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
  const router = useRouter();
  const { createHoverHandlers } = useNavigationPrefetch();

  const handleClick = (e: React.MouseEvent) => {
    console.log('SidebarItem clicked:', { href, onClick, label });
    e.preventDefault();
    e.stopPropagation();

    if (onClick) {
      console.log('Calling onClick handler');
      onClick();
    } else if (href) {
      console.log('Navigating to:', href);
      router.push(href);
    }
  };

  const content = (
    <>
      {icon && <span className="w-5 h-5 lg:w-6 lg:h-6 flex-shrink-0">{icon}</span>}
      <span className="flex-1 truncate">{label}</span>
      {count !== undefined && (
        <span className="text-xs lg:text-sm text-zinc-500">{count > 999 ? '999+' : count}</span>
      )}
    </>
  );

  const baseClasses = `
    flex items-center gap-3 lg:gap-4 px-3 py-2 lg:py-3 rounded-xl
    text-sm lg:text-sm font-normal transition-all duration-200 cursor-pointer w-full text-left
    ${isActive ? 'bg-zinc-900 text-white' : 'text-zinc-300 hover:bg-zinc-900/50 hover:text-white'}
    ${className}
  `;

  return (
    <button
      onClick={handleClick}
      className={baseClasses}
      {...(href ? createHoverHandlers(href) : {})}
    >
      {content}
    </button>
  );
}
