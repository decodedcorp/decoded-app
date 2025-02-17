'use client';

import Logo from '@/styles/logos/LogoSvg';
import { SearchBar } from '../search/SearchBar';
import { LoginButton } from './LoginButton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useLocaleContext } from '@/lib/contexts/locale-context';
import { Menu, User, Search } from 'lucide-react';
import { cn } from '@/lib/utils/style';
import { useState } from 'react';
import { MypageModal } from './modal/MypageModal';

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
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

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
                onClick={() => setIsLoginModalOpen(true)}
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
            <Link
              href="/request"
              className={cn(
                'text-sm text-gray-400 hover:text-[#EAFD66]',
                'transition-colors duration-200'
              )}
            >
              {t.header.nav.request}
            </Link>
            <LoginButton />
          </div>
        </div>
      </div>

      <MypageModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </nav>
  );
}

export default Nav;
