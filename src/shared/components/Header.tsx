'use client';

import { useEffect, useState, memo, useMemo, useCallback } from 'react';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCommonTranslation } from '@/lib/i18n/hooks';
import { useScrollDirection } from '@/lib/hooks/useScrollDirection';
import { useChannel } from '@/domains/channels/hooks/useChannels';
import { useAuthStore } from '@/store/authStore';

import { LoginButton } from './LoginButton';
import { UserAvatar } from './UserAvatar';
import { NotificationButton } from './NotificationButton';
import { CreateButton } from './CreateButton';
import { ChannelSearchBar } from './ChannelSearchBar';
import { GlobalSearchBar } from './GlobalSearchBar';

export const Header = memo(function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const t = useCommonTranslation();
  const { scrollDirection, isScrolled, isAtTop } = useScrollDirection({
    threshold: 15,
    debounceMs: 10,
  });

  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  // Get auth state - 개별적으로 구독하여 무한 루프 방지
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const isInitialized = useAuthStore((state) => state.isInitialized);

  // 채널 페이지인지 확인 - useMemo로 최적화
  const isChannelPage = useMemo(
    () => pathname?.startsWith('/channels/') && pathname !== '/channels',
    [pathname],
  );

  // 채널 ID 추출 - useMemo로 최적화
  const channelId = useMemo(
    () => (isChannelPage ? pathname?.split('/channels/')[1] : null),
    [isChannelPage, pathname],
  );

  // 채널 데이터 가져오기 - 조건부로만 실행
  const channelQuery = useChannel(channelId || '');
  const channelData = channelQuery.data;

  // 채널명 결정 - useMemo로 최적화
  const channelName = useMemo(() => channelData?.name || channelId, [channelData?.name, channelId]);

  // 검색 핸들러 - useCallback으로 최적화
  const handleChannelSearch = useCallback(
    (query: string) => {
      console.log('Channel search:', query);
      // 채널 내 검색 시 검색 페이지로 이동 (채널 컨텍스트 유지)
      if (query.trim() && channelId) {
        router.push(`/search?q=${encodeURIComponent(query.trim())}&channel=${channelId}`);
      }
    },
    [router, channelId],
  );

  const handleGlobalSearch = useCallback(
    (query: string) => {
      console.log('Global search:', query);
      // 전역 검색 시 검색 페이지로 이동
      if (query.trim()) {
        router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      }
    },
    [router],
  );

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
        {/* Mobile Menu Button */}
        <button
          onClick={() => {
            // 모바일 사이드바 토글 로직을 여기에 추가
            const event = new CustomEvent('toggle-mobile-sidebar');
            window.dispatchEvent(event);
          }}
          className="lg:hidden p-2 rounded-lg bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 transition-colors"
          aria-label={t.header.openMenu()}
        >
          <svg
            className="w-5 h-5 text-zinc-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold text-[#EAFD66] tracking-tight drop-shadow ml-2 lg:ml-0"
        >
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
          <button
            onClick={() => setIsMobileSearchOpen(true)}
            className="md:hidden p-2 text-white hover:text-[#eafd66] transition-colors"
            aria-label={t.header.openSearch()}
          >
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

      {/* Mobile Search Overlay */}
      {isMobileSearchOpen && (
        <div className="fixed top-[60px] md:top-[72px] left-0 right-0 bg-black border-b border-zinc-700 p-4 z-[10000] md:hidden">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileSearchOpen(false)}
              className="p-2 text-zinc-400 hover:text-white transition-colors"
              aria-label={t.header.closeSearch()}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <div className="flex-1">
              {isChannelPage && channelName ? (
                <ChannelSearchBar
                  channelId={channelId || ''}
                  channelName={channelName}
                  onSearch={(query) => {
                    handleChannelSearch(query);
                    setIsMobileSearchOpen(false);
                  }}
                  onClearChannel={handleClearChannel}
                />
              ) : (
                <GlobalSearchBar
                  onSearch={(query) => {
                    handleGlobalSearch(query);
                    setIsMobileSearchOpen(false);
                  }}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
});
