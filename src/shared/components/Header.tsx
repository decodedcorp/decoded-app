'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

import { useScrollDirection } from '@/lib/hooks/useScrollDirection';
import { useChannel } from '@/domains/channels/hooks/useChannels';
import { useAuthStore } from '@/store/authStore';
import { LoginButton } from './LoginButton';
import { UserAvatar } from './UserAvatar';
import { NotificationButton } from './NotificationButton';
import { CreateButton } from './CreateButton';
import { ChannelSearchBar } from './ChannelSearchBar';
import { GlobalSearchBar } from './GlobalSearchBar';

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { scrollDirection, isScrolled, isAtTop } = useScrollDirection({
    threshold: 15,
    debounceMs: 10,
  });

  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  // Get auth state
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const isInitialized = useAuthStore((state) => state.isInitialized);

  // 채널 페이지인지 확인
  const isChannelPage = pathname?.startsWith('/channels/') && pathname !== '/channels';

  // 채널 ID 추출
  const channelId = isChannelPage ? pathname?.split('/channels/')[1] : null;

  // 채널 데이터 가져오기
  const { data: channelData } = useChannel(channelId || '');

  // 채널명 결정
  const channelName = channelData?.name || channelId;

  // 검색 핸들러
  const handleChannelSearch = (query: string) => {
    console.log('Channel search:', query);
    // 채널 내 검색 시 검색 페이지로 이동 (채널 컨텍스트 유지)
    if (query.trim() && channelId) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}&channel=${channelId}`);
    }
  };

  const handleGlobalSearch = (query: string) => {
    console.log('Global search:', query);
    // 전역 검색 시 검색 페이지로 이동
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleClearChannel = () => {
    console.log('Clear channel filter');
    // TODO: 채널 필터 해제 로직 (메인 페이지로 이동 등)
  };

  // 키보드 네비게이션 감지
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab' && isChannelPage) {
        setIsFocused(true);
        // 3초 후 자동으로 포커스 상태 해제
        setTimeout(() => setIsFocused(false), 3000);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isChannelPage]);

  // 헤더 표시 여부 결정
  const shouldShowHeader =
    isAtTop || // 페이지 상단에 있을 때
    scrollDirection === 'up' || // 위로 스크롤할 때
    isHovered || // 마우스 호버 시
    isFocused || // 키보드 포커스 시
    !isChannelPage; // 채널 페이지가 아닐 때

  return (
    <header
      className={`
        fixed top-0 left-0 w-full z-[9999] transition-all duration-300 ease-in-out
        backdrop-blur bg-black/80 border-b border-zinc-700/50 shadow-xl
        ${shouldShowHeader ? 'translate-y-0' : '-translate-y-full'}
      `}
      style={{
        WebkitBackdropFilter: 'blur(12px)',
        backdropFilter: 'blur(12px)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="
          flex items-center justify-between
          w-full
          px-4 md:px-8
          h-[60px] md:h-[72px]
        "
      >
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-[#EAFD66] tracking-tight drop-shadow">
          decoded
        </Link>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 mx-8 justify-center">
          {isChannelPage && channelName ? (
            <ChannelSearchBar
              channelId={channelId || ''}
              channelName={channelName}
              onSearch={handleChannelSearch}
              onClearChannel={handleClearChannel}
            />
          ) : (
            <GlobalSearchBar onSearch={handleGlobalSearch} />
          )}
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Mobile Search Button */}
          <button className="md:hidden p-2 text-white hover:text-[#eafd66] transition-colors">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
              <path
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Actions for authenticated users */}
          {isAuthenticated && isInitialized ? (
            <>
              <CreateButton />
              <NotificationButton />
              <UserAvatar />
            </>
          ) : (
            /* Show login button for non-authenticated users */
            <LoginButton />
          )}
        </div>
      </div>
    </header>
  );
}
