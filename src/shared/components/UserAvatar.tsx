'use client';

import { useState, useRef, useEffect } from 'react';

import { useRouter } from 'next/navigation';
import { useLocale } from '@/lib/hooks/useLocale';
import { useAuthStore } from '@/store/authStore';
import { useMyProfile } from '@/domains/profile/hooks/useProfile';
import { getAvatarFallback } from '@/lib/utils/defaultImages';

interface UserAvatarProps {
  size?: 'sm' | 'md' | 'lg';
  showDropdown?: boolean;
}

export function UserAvatar({ size = 'md', showDropdown = true }: UserAvatarProps) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const { data: profileData } = useMyProfile();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { t } = useLocale();

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    router.push('/');
  };

  const handleProfileClick = () => {
    setIsDropdownOpen(false);
    if (user?.doc_id) {
      router.push(`/profile/${user.doc_id}`);
    } else {
      router.push('/profile');
    }
  };


  // Get user initials for avatar
  const getInitials = () => {
    if (!user) return '?';
    
    // Try to get nickname from AuthStore user first
    if (user.nickname && user.nickname.trim()) {
      return user.nickname.substring(0, 2).toUpperCase();
    }
    
    // Fallback to profile data if AuthStore user has no nickname
    if (profileData?.aka && profileData.aka.trim()) {
      return profileData.aka.substring(0, 2).toUpperCase();
    }
    
    // Fallback to email from AuthStore
    if (user.email && user.email.trim()) {
      return user.email.substring(0, 2).toUpperCase();
    }
    
    return '?';
  };

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => showDropdown && setIsDropdownOpen(!isDropdownOpen)}
        className={`
          ${sizeClasses[size]}
          relative rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800
          border border-zinc-600 hover:border-zinc-500
          flex items-center justify-center
          text-zinc-300 font-semibold
          transition-all duration-200
          hover:ring-2 hover:ring-zinc-500 hover:ring-offset-2 hover:ring-offset-black
          ${showDropdown ? 'cursor-pointer' : 'cursor-default'}
        `}
        aria-label={t('user.userMenu')}
      >
        {/* Avatar content */}
        <span className="select-none">{getInitials()}</span>

        {/* Online indicator */}
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-black rounded-full" />
      </button>

      {/* Dropdown Menu */}
      {showDropdown && isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl overflow-hidden z-50">
          {/* User info section */}
          <div className="px-4 py-3 border-b border-zinc-800">
            <p className="text-sm font-medium text-zinc-200">
              {user.nickname?.trim() || profileData?.aka?.trim() || t('user.user')}
            </p>
            <p className="text-xs text-zinc-500 truncate">
              {user.email?.trim() || ''}
            </p>
          </div>

          {/* Menu items */}
          <div className="py-1">
            <button
              onClick={handleProfileClick}
              className="w-full px-4 py-2 text-left text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors flex items-center gap-3"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              {t('user.myPage')}
            </button>

            <button
              disabled
              className="w-full px-4 py-2 text-left text-sm text-zinc-500 cursor-not-allowed flex items-center gap-3 opacity-50"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {t('user.settings')}
            </button>

            <div className="border-t border-zinc-800 my-1" />

            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-zinc-800 hover:text-red-300 transition-colors flex items-center gap-3"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              {t('user.logout')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
