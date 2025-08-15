'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

import { useScrollDirection } from '@/lib/hooks/useScrollDirection';
import { LoginButton } from './LoginButton';

export function Header() {
  const pathname = usePathname();
  const { scrollDirection, isScrolled, isAtTop } = useScrollDirection({
    threshold: 15,
    debounceMs: 10,
  });
  
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  // 채널 페이지인지 확인
  const isChannelPage = pathname?.startsWith('/channels/') && pathname !== '/channels';
  
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
        ${isScrolled ? 'backdrop-blur bg-black/70' : 'bg-transparent'}
        ${shouldShowHeader ? 'translate-y-0' : '-translate-y-full'}
        ${isChannelPage ? 'shadow-lg' : ''}
      `}
      style={{ WebkitBackdropFilter: 'blur(8px)' }}
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
        <div className="text-2xl font-bold text-[#EAFD66] tracking-tight drop-shadow">decoded</div>

        {/* Search Bar */}
        {/* <SearchBar onSearch={handleSearch} /> */}

        {/* Login Button */}
        <LoginButton />
      </div>
    </header>
  );
}
