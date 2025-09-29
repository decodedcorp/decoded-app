'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';

import { useRouter } from 'next/navigation';
import { useCommonTranslation } from '@/lib/i18n/hooks';
import { useRecentContentStore } from '@/store/recentContentStore';

import { SearchAutocomplete, type AutocompleteItem } from '../../domains/search';

interface GlobalSearchBarProps {
  onSearch?: (query: string) => void;
  onSearchComplete?: () => void;
  className?: string;
  defaultValue?: string;
}

export function GlobalSearchBar({
  onSearch,
  onSearchComplete,
  className = '',
  defaultValue = '',
}: GlobalSearchBarProps) {
  const [query, setQuery] = useState(defaultValue);
  const [isAutocompleteOpen, setIsAutocompleteOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const t = useCommonTranslation();
  const { addContent } = useRecentContentStore();

  // Placeholder를 state로 관리하여 locale 변경 시 업데이트
  const [placeholder, setPlaceholder] = useState(t.search.placeholder());

  // Locale 변경 시 placeholder 업데이트
  useEffect(() => {
    setPlaceholder(t.search.placeholder());
  }, [t]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      if (onSearch) {
        onSearch(query.trim());
      } else {
        // Default behavior - navigate to search results
        router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      }
      setIsAutocompleteOpen(false);
      onSearchComplete?.();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setHighlightedIndex(-1);
    setIsAutocompleteOpen(value.trim().length >= 2); // 2글자 이상에서만 표시
  };

  const handleInputFocus = () => {
    if (query.trim().length >= 2) {
      // 2글자 이상에서만 포커스 시 열기
      setIsAutocompleteOpen(true);
    }
  };

  const handleInputBlur = () => {
    // Delay closing to allow for clicks on autocomplete items
    setTimeout(() => {
      setIsAutocompleteOpen(false);
    }, 200);
  };

  const handleAutocompleteSelect = useCallback(
    (item: AutocompleteItem) => {
      if (item.type === 'channel') {
        // 채널인 경우: 채널 페이지로 이동
        router.push(`/channels/${item.channelId}`);
      } else {
        // 콘텐츠인 경우: 최근 본 콘텐츠에 추가 후 라우팅
        if (item.channelId) {
          addContent({
            id: item.id,
            channelId: item.channelId,
            title: item.title || '제목 없음',
            thumbnailUrl: item.thumbnail || undefined,
          });

          router.push(`/channels/${item.channelId}?content=${item.id}`);
        } else {
          console.warn('Channel ID not available for content:', item);
        }
      }
      setQuery('');
      setIsAutocompleteOpen(false);
      inputRef.current?.blur();
    },
    [router, addContent],
  );

  const handleAutocompleteClose = useCallback(() => {
    setIsAutocompleteOpen(false);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isAutocompleteOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(
          (prev) => (prev < 7 ? prev + 1 : 0), // Assuming max 8 results
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(
          (prev) => (prev > 0 ? prev - 1 : 7), // Assuming max 8 results
        );
        break;
      case 'Escape':
        e.preventDefault();
        setIsAutocompleteOpen(false);
        setHighlightedIndex(-1);
        inputRef.current?.blur();
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0) {
          // Handle selection of highlighted item
          // This would need the actual results array
          return;
        }
        // Enter 키로 검색 실행
        if (query.trim()) {
          if (onSearch) {
            onSearch(query.trim());
          } else {
            // Default behavior - navigate to search results
            router.push(`/search?q=${encodeURIComponent(query.trim())}`);
          }
          setIsAutocompleteOpen(false);
          onSearchComplete?.();
        }
        break;
    }
  };

  // Close autocomplete when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setIsAutocompleteOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={`w-full ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center bg-zinc-800/70 hover:bg-zinc-800/90 rounded-full border border-zinc-600/50 hover:border-zinc-500/50 focus-within:border-[#eafd66]/50 transition-all duration-200">
          {/* 검색 아이콘 */}
          <div className="flex items-center justify-center w-8 h-8 text-zinc-400">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
              <path
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="flex-1 py-2 pr-3 bg-transparent text-white placeholder-zinc-400 focus:outline-none rounded-full text-sm"
            autoComplete="off"
            role="combobox"
            aria-expanded={isAutocompleteOpen}
            aria-haspopup="listbox"
            aria-autocomplete="list"
          />

          {/* Clear button */}
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setIsAutocompleteOpen(false);
                inputRef.current?.focus();
              }}
              className="mr-2 p-1 text-zinc-400 hover:text-white transition-colors"
              aria-label={t.search.clearSearch()}
            >
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                <path
                  d="M18 6L6 18M6 6l12 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}

          {/* 숨겨진 검색 버튼 (접근성을 위해 유지) */}
          <button type="submit" className="sr-only" aria-label={t.search.searchButton()}>
            {t.search.searchButton()}
          </button>
        </div>

        {/* Autocomplete dropdown */}
        {isAutocompleteOpen && (
          <SearchAutocomplete
            query={query}
            onSelect={handleAutocompleteSelect}
            onClose={handleAutocompleteClose}
            highlightedIndex={highlightedIndex}
            onHighlightChange={setHighlightedIndex}
          />
        )}
      </form>
    </div>
  );
}
