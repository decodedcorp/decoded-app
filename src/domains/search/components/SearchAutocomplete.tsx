'use client';

import React, { useCallback, useMemo, useRef, useEffect } from 'react';
import { clsx } from 'clsx';
import { ProxiedImage } from '../../../components/ProxiedImage';
import { useSearchAutocomplete, type AutocompleteItem } from '../hooks/useSearchAutocomplete';

interface SearchAutocompleteProps {
  query: string;
  channelId?: string;
  onSelect: (item: AutocompleteItem) => void;
  onClose?: () => void;
  className?: string;
  maxResults?: number;
  highlightedIndex?: number;
  onHighlightChange?: (index: number) => void;
}

interface AutocompleteItemProps {
  item: AutocompleteItem;
  isHighlighted: boolean;
  onClick: () => void;
  query: string;
}

const AutocompleteItemComponent = React.memo(
  ({ item, isHighlighted, onClick, query }: AutocompleteItemProps) => {
    const highlightMatch = useCallback((text: string, query: string) => {
      if (!query.trim()) return text;

      const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
      const parts = text.split(regex);

      return parts.map((part, index) =>
        regex.test(part) ? (
          <mark key={index} className="bg-[#EAFD66]/30 text-white">
            {part}
          </mark>
        ) : (
          part
        ),
      );
    }, []);

    const getIcon = () => {
      switch (item.type) {
        case 'channel':
          return (
            <div className="w-6 h-6 rounded-full bg-[#EAFD66] flex items-center justify-center">
              <span className="text-xs font-bold text-black">#</span>
            </div>
          );
        case 'image':
          return (
            <div className="w-6 h-6 rounded bg-blue-500 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          );
        case 'video':
          return (
            <div className="w-6 h-6 rounded bg-red-500 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          );
        case 'link':
          return (
            <div className="w-6 h-6 rounded bg-green-500 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          );
        default:
          return null;
      }
    };

    return (
      <div
        className={clsx(
          'flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors',
          'hover:bg-zinc-700/50',
          isHighlighted && 'bg-zinc-700/70',
        )}
        style={{ pointerEvents: 'auto' }} // 명시적으로 pointer-events 설정
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onMouseDown={(e) => {
          // 이벤트 위임: 클릭된 요소가 현재 컨테이너 내부에 있으면 클릭 처리
          if (e.currentTarget.contains(e.target as Node)) {
            if (e.button === 0) {
              // 왼쪽 클릭만 처리
              onClick();
            }
          }
        }}
        onMouseUp={(e) => {
          // mouseup에서도 클릭 로직 처리 (백업용)
          if (e.button === 0) {
            onClick();
          }
        }}
        role="option"
        aria-selected={isHighlighted}
      >
        {/* Icon or Thumbnail */}
        <div className="flex-shrink-0">
          {item.thumbnail ? (
            <ProxiedImage
              src={item.thumbnail}
              alt={item.title}
              className="w-6 h-6 rounded object-cover"
              width={24}
              height={24}
            />
          ) : (
            getIcon()
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-white truncate">
            {highlightMatch(item.title, query)}
          </div>
          {item.subtitle && (
            <div className="text-xs text-zinc-400 truncate">
              {highlightMatch(item.subtitle, query)}
            </div>
          )}
        </div>

        {/* Type badge */}
        <div className="flex-shrink-0">
          <span
            className={clsx('px-2 py-1 text-xs font-medium rounded-full', {
              'bg-[#EAFD66]/20 text-[#EAFD66]': item.type === 'channel',
              'bg-blue-500/20 text-blue-400': item.type === 'image',
              'bg-red-500/20 text-red-400': item.type === 'video',
              'bg-green-500/20 text-green-400': item.type === 'link',
            })}
          >
            {item.type}
          </span>
        </div>
      </div>
    );
  },
);

AutocompleteItemComponent.displayName = 'AutocompleteItem';

export const SearchAutocomplete = React.memo(
  ({
    query,
    channelId,
    onSelect,
    onClose,
    className = '',
    maxResults = 8,
    highlightedIndex = -1,
    onHighlightChange,
  }: SearchAutocompleteProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

    const { results, groupedResults, isLoading, error, hasResults } = useSearchAutocomplete({
      query,
      channelId,
      enabled: query.trim().length > 0,
    });

    // Limit results for display
    const limitedResults = useMemo(() => {
      return results.slice(0, maxResults);
    }, [results, maxResults]);

    const handleItemClick = useCallback(
      (item: AutocompleteItem, index: number) => {
        onSelect(item);
        onClose?.();

        // Set focus back to the search input for better UX
        setTimeout(() => {
          const searchInput = document.querySelector('input[role="combobox']') as HTMLInputElement;
          searchInput?.focus();
        }, 0);
      },
      [onSelect, onClose],
    );

    // Handle keyboard selection
    const handleKeyboardSelect = useCallback(
      (index: number) => {
        if (limitedResults[index]) {
          handleItemClick(limitedResults[index], index);
        }
      },
      [limitedResults, handleItemClick],
    );

    // Handle keyboard navigation
    useEffect(() => {
      if (highlightedIndex >= 0 && highlightedIndex < limitedResults.length) {
        const element = itemRefs.current[highlightedIndex];
        if (element) {
          element.scrollIntoView({
            block: 'nearest',
            behavior: 'smooth',
          });
          // Set focus for screen readers
          element.focus();
        }
      }
    }, [highlightedIndex, limitedResults]);

    // Update refs array when results change
    useEffect(() => {
      itemRefs.current = itemRefs.current.slice(0, limitedResults.length);
    }, [limitedResults.length]);

    // Expose keyboard selection for parent components
    useEffect(() => {
      const handleKeyPress = (e: KeyboardEvent) => {
        if (e.key === 'Enter' && highlightedIndex >= 0) {
          e.preventDefault();
          handleKeyboardSelect(highlightedIndex);
        }
      };

      document.addEventListener('keydown', handleKeyPress);
      return () => {
        document.removeEventListener('keydown', handleKeyPress);
      };
    }, [highlightedIndex, handleKeyboardSelect]);

    // Don't render if no query
    if (!query.trim()) {
      return null;
    }

    // Loading state
    if (isLoading && !hasResults) {
      return (
        <div
          className={clsx(
            'absolute top-full left-0 right-0 mt-2 bg-zinc-800/95 backdrop-blur-sm',
            'border border-zinc-600/50 rounded-lg shadow-xl z-[99999]',
            className,
          )}
        >
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-2 text-zinc-400">
              <div className="w-4 h-4 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm">Searching...</span>
            </div>
          </div>
        </div>
      );
    }

    // Error state
    if (error) {
      return (
        <div
          className={clsx(
            'absolute top-full left-0 right-0 mt-2 bg-zinc-800/95 backdrop-blur-sm',
            'border border-zinc-600/50 rounded-lg shadow-xl z-[99999]',
            className,
          )}
        >
          <div className="flex items-center justify-center py-8">
            <div className="text-red-400 text-sm">Search error occurred. Please try again.</div>
          </div>
        </div>
      );
    }

    // No results
    if (!hasResults && !isLoading) {
      return (
        <div
          className={clsx(
            'absolute top-full left-0 right-0 mt-2 bg-zinc-800/95 backdrop-blur-sm',
            'border border-zinc-600/50 rounded-lg shadow-xl z-[99999]',
            className,
          )}
        >
          <div className="flex items-center justify-center py-8">
            <div className="text-zinc-400 text-sm">No results found for "{query}"</div>
          </div>
        </div>
      );
    }

    return (
      <div
        ref={containerRef}
        className={clsx(
          'absolute top-full left-0 right-0 mt-2 bg-zinc-800/95 backdrop-blur-sm',
          'border border-zinc-600/50 rounded-lg shadow-xl z-[99999] max-h-96 overflow-y-auto',
          className,
        )}
        role="listbox"
        aria-label="Search results"
      >
        {/* Channels section */}
        {!channelId && groupedResults.channels.length > 0 && (
          <div role="group" aria-labelledby="channels-heading">
            <div
              id="channels-heading"
              className="px-4 py-2 text-xs font-semibold text-zinc-500 uppercase tracking-wide bg-zinc-900/50"
            >
              Channels
            </div>
            {groupedResults.channels.map((item, index) => {
              const resultIndex = results.indexOf(item);
              return (
                <div
                  key={`channel-${item.id}`}
                  ref={(el) => {
                    if (el) itemRefs.current[resultIndex] = el;
                  }}
                  tabIndex={-1}
                  className="focus:outline-none"
                  style={{ pointerEvents: 'auto' }} // 명시적으로 pointer-events 설정
                  onFocus={() => onHighlightChange?.(resultIndex)}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <AutocompleteItemComponent
                    item={item}
                    isHighlighted={highlightedIndex === resultIndex}
                    onClick={() => handleItemClick(item, resultIndex)}
                    query={query}
                  />
                </div>
              );
            })}
          </div>
        )}

        {/* Contents section */}
        {groupedResults.contents.length > 0 && (
          <div role="group" aria-labelledby="contents-heading">
            {!channelId && groupedResults.channels.length > 0 && (
              <div className="border-t border-zinc-700/50" />
            )}
            <div
              id="contents-heading"
              className="px-4 py-2 text-xs font-semibold text-zinc-500 uppercase tracking-wide bg-zinc-900/50"
            >
              Content
            </div>
            {groupedResults.contents
              .slice(0, maxResults - groupedResults.channels.length)
              .map((item) => {
                const resultIndex = results.indexOf(item);
                return (
                  <div
                    key={`content-${item.id}`}
                    ref={(el) => {
                      if (el) itemRefs.current[resultIndex] = el;
                    }}
                    tabIndex={-1}
                    className="focus:outline-none"
                    style={{ pointerEvents: 'auto' }} // 명시적으로 pointer-events 설정
                    onFocus={() => onHighlightChange?.(resultIndex)}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <AutocompleteItemComponent
                      item={item}
                      isHighlighted={highlightedIndex === resultIndex}
                      onClick={() => handleItemClick(item, resultIndex)}
                      query={query}
                    />
                  </div>
                );
              })}
          </div>
        )}

        {/* Loading indicator for additional results */}
        {isLoading && hasResults && (
          <div className="border-t border-zinc-700/50 px-4 py-2">
            <div className="flex items-center gap-2 text-zinc-400 text-xs">
              <div className="w-3 h-3 border border-zinc-400 border-t-transparent rounded-full animate-spin" />
              <span>Loading more...</span>
            </div>
          </div>
        )}
      </div>
    );
  },
);

SearchAutocomplete.displayName = 'SearchAutocomplete';
