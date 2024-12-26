'use client';

import { SearchBar } from '../search/SearchBar';
import { LoginButton } from './LoginButton';
import { cn } from '@/lib/utils';

interface NavProps {
  isSearchOpen: boolean;
  onSearchToggle: () => void;
  onLoginClick: () => void;
  onSidebarOpen: () => void;
}

function Nav({ isSearchOpen, onSearchToggle, onLoginClick, onSidebarOpen }: NavProps) {
  return (
    <nav className="w-full flex items-center justify-between px-8">
      <SearchBar onSearch={(query) => console.log(query)} />
      
      {/* 오른쪽 버튼 */}
      <div className="flex items-center gap-4">
        <button 
          className={cn(
            "rounded-[12px] px-7 h-10",
            "bg-[#1f210e] hover:bg-[#1f210e]/90",
            "text-primary font-medium text-[15px]",
            "transition-colors"
          )}
        >
          Item Request
        </button>
        <LoginButton />
      </div>
    </nav>
  );
}

export default Nav;
