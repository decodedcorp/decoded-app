import Logo from '@/components/logo/Logo';
import { SearchBar } from '../search/SearchBar';
import { LoginButton } from './LoginButton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

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
  return (
    <nav className="w-full h-16">
      <div className="h-full px-4 mx-auto container">
        <div className="h-full grid grid-cols-[240px_1fr_240px] items-center gap-8">
          {/* 로고 영역 */}
          <div className="flex items-center">
            <Logo />
          </div>

          {/* 검색바 영역 */}
          <div className="flex justify-center">
            <div className="w-full max-w-2xl">
              <SearchBar onSearch={(query) => console.log(query)} />
            </div>
          </div>

          {/* 버튼 영역 */}
          <div className="flex items-center justify-end gap-4">
            <Link href="/request">
              <Button variant="default">요청하기</Button>
            </Link>
            <LoginButton />
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Nav;
