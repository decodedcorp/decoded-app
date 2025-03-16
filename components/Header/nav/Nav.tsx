'use client';

import Logo from '@/styles/logos/LogoSvg';
import { SearchBar } from '../search/SearchBar';
import { LoginButton } from './LoginButton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useLocaleContext } from '@/lib/contexts/locale-context';
import { Menu, User, Search, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils/style';
import { useState } from 'react';
import { useRequestModal } from '@/components/modals/request/hooks/use-request-modal';
import { useLoginModalStore } from '@/components/auth/login-modal/store';

interface NavProps {
  isSearchOpen: boolean;
  onSearchToggle: () => void;
  onLoginClick: () => void;
  onSidebarOpen: () => void;
}

function Nav({
  isSearchOpen,
  onSearchToggle,
  onLoginClick,
  onSidebarOpen,
}: NavProps) {
  const { t } = useLocaleContext();
  const [isIconLoginModalOpen, setIconLoginModalOpen] = useState(false);
  const { onOpen: openRequestModal, RequestModal } = useRequestModal();
  
  // 로그인 모달 스토어 사용 - LoginButton 컴포넌트와 같은 스토어 공유
  const { 
    isOpen: isLoginModalOpen, 
    openLoginModal, 
    closeLoginModal 
  } = useLoginModalStore();

  return (
    <nav className="w-full h-16 px-2 lg:px-16 flex items-center justify-center">
      <div className="h-full w-full">
        {/* 모바일 뷰 (sm) */}
        <div className="lg:hidden h-full flex flex-col">
          <div className="h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <Logo className="h-8 w-auto" />
            </Link>

            <div className="flex items-center gap-3">
              <button
                onClick={openRequestModal}
                className="p-2 text-gray-400 hover:text-[#EAFD66]"
              >
                <PlusCircle className="w-5 h-5" />
              </button>
              <button
                onClick={onSearchToggle}
                className={cn(
                  'p-2 rounded-full transition-colors duration-200',
                  isSearchOpen
                    ? 'text-[#EAFD66] '
                    : 'text-gray-400 hover:text-[#EAFD66]'
                )}
              >
                <Search className="w-5 h-5" />
              </button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  console.log('User icon clicked, opening login modal');
                  openLoginModal();
                }}
                className={cn(
                  'transition-colors duration-200',
                  isLoginModalOpen
                    ? 'text-[#EAFD66] '
                    : 'text-gray-400 hover:text-[#EAFD66]'
                )}
              >
                <User className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* 모바일 검색바 - 슬라이드 애니메이션 */}
          <div
            className={cn(
              'absolute top-16 left-0 right-0 z-20',
              'transition-all duration-200 ease-in-out',
              isSearchOpen ? 'h-16 opacity-100' : 'h-0 opacity-0'
            )}
          >
            <div className="px-4 py-3">
              <SearchBar onSearch={(query) => console.log(query)} />
            </div>
          </div>
        </div>

        {/* 데스크톱 뷰 (lg) */}
        <div className="hidden lg:grid h-full grid-cols-[240px_1fr_240px] items-center gap-8">
          <Link href="/" className="flex items-center">
            <Logo className="h-8 w-auto" />
          </Link>

          <div className="flex justify-center">
            <div className="w-full max-w-2xl">
              <SearchBar onSearch={(query) => console.log(query)} />
            </div>
          </div>

          <div className="flex items-center justify-end gap-6">
            <button
              onClick={openRequestModal}
              className={cn(
                'text-sm text-gray-400 hover:text-[#EAFD66]',
                'transition-colors duration-200'
              )}
            >
              {t.header.nav.request}
            </button>
            <LoginButton />
          </div>
        </div>
      </div>

      {/* 요청 모달 렌더링 */}
      {RequestModal}
    </nav>
  );
}

export default Nav;
