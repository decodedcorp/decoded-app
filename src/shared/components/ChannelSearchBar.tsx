'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SearchAutocomplete, type AutocompleteItem } from '../../domains/search';

interface ChannelSearchBarProps {
  channelId: string;
  channelName: string;
  onSearch?: (query: string) => void;
  onClearChannel?: () => void;
  className?: string;
}

export function ChannelSearchBar({
  channelId,
  channelName,
  onSearch,
  onClearChannel,
  className = '',
}: ChannelSearchBarProps) {
  const [query, setQuery] = useState('');
  const [isAutocompleteOpen, setIsAutocompleteOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      if (onSearch) {
        onSearch(query.trim());
      } else {
        // Default behavior - navigate to channel search results
        router.push(`/channels/${channelId}/search?q=${encodeURIComponent(query.trim())}`);
      }
      setIsAutocompleteOpen(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setHighlightedIndex(-1);
    setIsAutocompleteOpen(value.trim().length > 0);
  };

  const handleInputFocus = () => {
    if (query.trim().length > 0) {
      setIsAutocompleteOpen(true);
    }
  };

  const handleInputBlur = () => {
    // Delay closing to allow for clicks on autocomplete items
    setTimeout(() => {
      setIsAutocompleteOpen(false);
    }, 200);
  };

  const handleClear = () => {
    setQuery('');
    setIsAutocompleteOpen(false);
    onClearChannel?.();
  };

  const handleAutocompleteSelect = useCallback((item: AutocompleteItem) => {
    console.log('Channel autocomplete item selected:', item); // 디버깅용 로그
    // For channel search, navigate to the content detail
    router.push(`/content/${item.id}`);
    setQuery('');
    setIsAutocompleteOpen(false);
    inputRef.current?.blur();
  }, [router]);

  const handleAutocompleteClose = useCallback(() => {
    setIsAutocompleteOpen(false);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isAutocompleteOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < 7 ? prev + 1 : 0 // Assuming max 8 results
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : 7 // Assuming max 8 results
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
        handleSubmit(e);
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
    <div className={`w-full max-w-2xl mx-auto ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center bg-zinc-800/70 hover:bg-zinc-800/90 rounded-full border border-zinc-600/50 hover:border-zinc-500/50 focus-within:border-[#eafd66]/50 transition-all duration-200">
          {/* 큰 검색 아이콘 - Reddit 스타일 */}
          <div className="flex items-center justify-center w-12 h-12 text-zinc-400">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
              <path
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className="flex items-center bg-zinc-700/60 rounded-full px-3 py-1.5 mx-2">
            <div className="flex items-center space-x-1.5">
              {/* 채널 아이콘 */}
              <div className="w-3 h-3 rounded-full bg-[#eafd66]"></div>
              <span className="text-[#eafd66] text-sm font-medium">{channelName}</span>
            </div>
            <button
              type="button"
              onClick={handleClear}
              className="ml-2 text-zinc-400 hover:text-white transition-colors p-0.5"
              aria-label="Clear channel filter"
            >
              <svg width="10" height="10" fill="none" viewBox="0 0 24 24">
                <path
                  d="M18 6L6 18M6 6l12 12"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          {/* 검색 입력 */}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onKeyDown={handleKeyDown}
            placeholder={`Search in ${channelName}`}
            className="flex-1 py-3 pr-4 bg-transparent text-white placeholder-zinc-400 focus:outline-none rounded-full"
            autoComplete="off"
            role="combobox"
            aria-expanded={isAutocompleteOpen}
            aria-haspopup="listbox"
            aria-autocomplete="list"
          />

          {/* Clear search button */}
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setIsAutocompleteOpen(false);
                inputRef.current?.focus();
              }}
              className="mr-3 p-1 text-zinc-400 hover:text-white transition-colors"
              aria-label="Clear search"
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
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
          <button type="submit" className="sr-only" aria-label="Search">
            Search
          </button>
        </div>

        {/* Autocomplete dropdown */}
        {isAutocompleteOpen && (
          <SearchAutocomplete
            query={query}
            channelId={channelId}
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
