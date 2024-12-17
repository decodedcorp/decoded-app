'use client';

import { useState, Dispatch, SetStateAction } from 'react';
import { useRouter } from 'next/navigation';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import { pretendardSemiBold } from '@/lib/constants/fonts';
import { colors } from '@/lib/constants/colors';
import debounce from 'lodash/debounce';
import KeywordSection from './KeywordSection';

// 컴포넌트 외부로 상수 이동
const SEARCH_KEYWORDS = [
  '제니가 착용했던 아이템들',
  '로제',
  '다니엘',
  '민지',
  '리사가 착용했던 루이비통',
];

function SearchBar({
  isOpen,
  setIsOpen,
  isScrolled,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  isScrolled: boolean;
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const [keywords, setKeywords] = useState<string[]>(SEARCH_KEYWORDS);
  const router = useRouter();

  const handleSearch = (query: string) => {
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query)}`);
    setIsOpen(false);
  };

  const handleKeywordClick = (keyword: string) => {
    router.push(`/search?q=${encodeURIComponent(keyword)}`);
    setIsOpen(false);
  };

  return (
    <div
      className={`
        fixed 
        ${isScrolled ? 'top-[64px]' : 'top-[120px] md:top-[140px]'}
        left-0
        w-full 
        bg-gray-900
        ${pretendardSemiBold.className} 
        border-b border-gray-400/50 
        transition-all duration-300 ease-in-out 
        h-auto
        max-h-[calc(100vh-64px)]
        overflow-y-auto
        z-50
        ${isOpen 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 -translate-y-10 pointer-events-none'
        }
      `}
    >
      <div className="flex flex-col h-full justify-center items-center py-10">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch(searchQuery);
          }}
          className="flex justify-center w-full"
        >
          <div className="flex w-[80%] md:w-[50%] border-b-2 border-white/50">
            <input
              type="text"
              className="w-full py-2 text-base md:text-xl bg-transparent focus:outline-none text-white"
              placeholder="검색어를 입력하세요"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="검색어 입력"
            />
            {searchQuery && (
              <button
                type="button"
                className="ml-5 cursor-pointer text-white"
                onClick={() => setSearchQuery('')}
                aria-label="검색어 지우기"
              >
                <CloseIcon className="text-xl md:text-2xl" />
              </button>
            )}
            <button
              type="submit"
              className="ml-5 cursor-pointer text-white"
              aria-label="검색하기"
            >
              <SearchIcon className="text-xl md:text-2xl" />
            </button>
          </div>
        </form>
        <KeywordSection
          keywords={keywords}
          onKeywordClick={handleKeywordClick}
        />
      </div>
    </div>
  );
}

export default SearchBar;
