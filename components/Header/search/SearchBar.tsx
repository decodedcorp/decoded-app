'use client';

import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { useRouter } from 'next/navigation';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import { pretendardSemiBold } from '@/lib/constants/fonts';
import { colors } from '@/lib/constants/colors';

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
  const [keywords, setKeywords] = useState<string[] | null>(null);
  const router = useRouter();

  useEffect(() => {
    setKeywords([
      '제니가 착용했던 아이템들',
      '로제',
      '다니엘',
      '민지',
      '리사가 착용했던 루이비통',
    ]);
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim() === '') return;
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    setIsOpen(false);
  };

  return (
    <div
      className={`fixed w-full justify-center bg-[${
        colors.gray[900]
      }] z-10 ${
        pretendardSemiBold.className
      } border-b border-gray-400/50 transition-all duration-300 ease-in-out ${
        isScrolled ? 'h-[250px] mt-16 md:mt-24' : 'h-[400px] mt-8 md:mt-32'
      } ${
        isOpen
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 -translate-y-full pointer-events-none'
      }`}
    >
      <div className="flex flex-col h-full justify-center items-center">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="flex justify-center"
        >
          <div
            className={`flex w-[80%] md:w-[50%] border-b-2 border-white/50 ${
              isScrolled ? 'mt-10' : 'mt-20'
            }`}
          >
            <input
              type="text"
              className="w-full py-2 text-base md:text-xl bg-transparent focus:outline-none text-white"
              placeholder="검색어를 입력하세요"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="ml-5 cursor-pointer text-white"
                onClick={() => setSearchQuery('')}
              >
                <CloseIcon className="text-xl md:text-2xl" />
              </button>
            )}
            <button type="submit" className="ml-5 cursor-pointer text-white">
              <SearchIcon className="text-xl md:text-2xl" />
            </button>
          </div>
        </form>
        <div className="flex flex-wrap w-full md:w-[70%] justify-center mt-5">
          {keywords?.map((keyword, index) => (
            <button
              key={index}
              className="w-fit rounded-2xl border-2 border-white/50 m-2 p-2 text-sm md:text-base cursor-pointer"
              onClick={() => {
                router.push(`/search?query=${keyword}`);
                setIsOpen(false);
              }}
            >
              {keyword}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SearchBar;
