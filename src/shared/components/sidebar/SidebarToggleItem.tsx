'use client';

import { ReactNode, useState } from 'react';

import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface SidebarToggleItemProps {
  href?: string;
  icon?: ReactNode;
  label: string;
  count?: number;
  isActive?: boolean;
  className?: string;
  children?: ReactNode;
  defaultExpanded?: boolean;
}

export function SidebarToggleItem({
  href,
  icon,
  label,
  count,
  isActive = false,
  className = '',
  children,
  defaultExpanded = true,
}: SidebarToggleItemProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const router = useRouter();

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleClick = (e: React.MouseEvent) => {
    console.log('SidebarToggleItem clicked:', { href, label });
    e.preventDefault();
    e.stopPropagation();

    // If there's an href, navigate to it
    if (href) {
      console.log('Navigating to:', href);
      router.push(href);
    }
    // Always toggle the expansion state
    console.log('Toggling expansion state');
    handleToggle();
  };

  const buttonContent = (
    <>
      {icon && <span className="w-5 h-5 lg:w-7 lg:h-7 flex-shrink-0">{icon}</span>}
      <span className="flex-1 truncate">{label}</span>
      {count !== undefined && (
        <span className="text-xs lg:text-sm text-zinc-500">{count > 999 ? '999+' : count}</span>
      )}
      {isExpanded ? (
        <ChevronDownIcon className="w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0" />
      ) : (
        <ChevronRightIcon className="w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0" />
      )}
    </>
  );

  const buttonClasses = `
    flex items-center gap-3 lg:gap-4 px-3 py-2 lg:py-3 rounded-xl
    text-sm lg:text-base font-normal transition-all duration-200 w-full text-left cursor-pointer
    ${isActive ? 'bg-zinc-900 text-white' : 'text-zinc-300 hover:bg-zinc-900/50 hover:text-white'}
  `;

  return (
    <div className={`space-y-1 ${className}`}>
      {/* Toggle button */}
      <button onClick={handleClick} className={buttonClasses}>
        {buttonContent}
      </button>

      {/* Children content */}
      {isExpanded && children && <div className="ml-4 space-y-1">{children}</div>}
    </div>
  );
}
