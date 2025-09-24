'use client';

import React, { useState, useMemo } from 'react';

import { useRouter } from 'next/navigation';
import { ChannelData } from '@/store/channelModalStore';
import { useChannelModalStore } from '@/store/channelModalStore';
import { CategoryType } from '@/api/generated/models/CategoryType';
import { ChannelCard } from '@/components/ChannelCard/ChannelCard';
import { useTranslation } from 'react-i18next';

import { useCategories, formatCategoriesForDropdown } from '../../hooks/useCategories';
import { useInfiniteChannels } from '../../hooks/useChannels';
import { InfiniteScrollLoader } from '@/domains/main/components/InfiniteScrollLoader';

interface DiscoverSectionProps {
  className?: string;
  onChannelClick?: (channel: ChannelData) => void;
}

export function DiscoverSection({ className = '', onChannelClick }: DiscoverSectionProps) {
  const { t } = useTranslation('common');
  const router = useRouter();
  const openChannelModal = useChannelModalStore((state) => state.openModal);

  // Category filters state
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState('all');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Fetch categories from API
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories(
    CategoryType.CHANNEL,
  );
  const { categories, subcategories } = formatCategoriesForDropdown(categoriesData, t);

  // Infinite scroll channels data
  const {
    data,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    isLoading,
    isError,
    error,
    refetch,
  } = useInfiniteChannels({
    limit: 12, // Show 12 channels per page
    sortBy: 'created_at',
    sortOrder: 'desc',
  });

  // Flatten all channels from all pages
  const allChannels = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page) => page?.channels || []);
  }, [data?.pages]);

  const handleChannelClick = (channel: ChannelData) => {
    if (onChannelClick) {
      onChannelClick(channel);
    } else {
      openChannelModal(channel);
    }
  };

  // Filter channels based on selected category and subcategory
  const filteredChannels = useMemo(() => {
    let filtered = [...allChannels];

    if (selectedCategory !== 'all') {
      // Convert API category format back to match channel data format
      const targetCategory = categories.find((c) => c.id === selectedCategory)?.label;
      filtered = filtered.filter(
        (channel) => channel.category?.toLowerCase() === targetCategory?.toLowerCase(),
      );
    }

    if (selectedSubcategory !== 'all') {
      const targetSubcategory = subcategories[selectedCategory]?.find(
        (s) => s.id === selectedSubcategory,
      )?.label;
      filtered = filtered.filter(
        (channel) => channel.subcategory?.toLowerCase() === targetSubcategory?.toLowerCase(),
      );
    }

    return filtered;
  }, [allChannels, selectedCategory, selectedSubcategory, categories, subcategories]);

  // Loading state
  if (isLoading && !allChannels.length) {
    return (
      <section className={`${className}`}>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-400 mb-2">{t('discover.title')}</h2>
          <p className="text-zinc-500 text-sm">{t('discover.subtitle')}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-64 bg-zinc-900 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </section>
    );
  }

  // Error state
  if (isError && !allChannels.length) {
    return (
      <section className={`${className}`}>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-400 mb-2">{t('discover.title')}</h2>
          <p className="text-zinc-500 text-sm">{t('discover.subtitle')}</p>
        </div>
        <div className="text-center py-12">
          <div className="text-red-400 mb-4">Failed to load channels</div>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-zinc-800 text-white rounded hover:bg-zinc-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  // Empty state
  if (!allChannels.length) {
    return null;
  }

  return (
    <section className={`${className}`}>
      <div className="mb-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-400 mb-2">{t('discover.title')}</h2>
            <p className="text-zinc-500 text-sm">{t('discover.subtitle')}</p>
          </div>

          {/* Category Filters */}
          <div className="flex items-center gap-3 lg:gap-4">
            {/* Desktop: Full dropdowns */}
            <div className="hidden sm:flex flex-row gap-3 lg:gap-4">
              {/* Category Dropdown */}
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setSelectedSubcategory('all'); // Reset subcategory when category changes
                  }}
                  className="bg-zinc-900/50 text-white text-base px-3 py-2 rounded-lg border border-zinc-700/50 hover:border-zinc-600/70 focus:outline-none focus:ring-2 focus:ring-[#eafd66]/30 focus:border-[#eafd66]/50 transition-all duration-200 backdrop-blur-sm appearance-none cursor-pointer"
                  disabled={categoriesLoading}
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.label}
                    </option>
                  ))}
                </select>
                {/* Custom dropdown arrow */}
                <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-zinc-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>

              {/* Subcategory Dropdown */}
              {subcategories[selectedCategory] && subcategories[selectedCategory].length > 1 && (
                <div className="relative">
                  <select
                    value={selectedSubcategory}
                    onChange={(e) => setSelectedSubcategory(e.target.value)}
                    className="bg-zinc-900/50 text-white text-base px-3 py-2 rounded-lg border border-zinc-700/50 hover:border-zinc-600/70 focus:outline-none focus:ring-2 focus:ring-[#eafd66]/30 focus:border-[#eafd66]/50 transition-all duration-200 backdrop-blur-sm appearance-none cursor-pointer"
                  >
                    {subcategories[selectedCategory].map((subcategory) => (
                      <option key={subcategory.id} value={subcategory.id}>
                        {subcategory.label}
                      </option>
                    ))}
                  </select>
                  {/* Custom dropdown arrow */}
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-zinc-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile: Filter icon */}
            <div className="sm:hidden">
              <button
                onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                className="bg-zinc-900/50 text-white p-2.5 rounded-lg border border-zinc-700/50 hover:border-zinc-600/70 focus:outline-none focus:ring-2 focus:ring-[#eafd66]/30 focus:border-[#eafd66]/50 transition-all duration-200 backdrop-blur-sm"
                disabled={categoriesLoading}
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
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Filter Dropdown */}
        {isMobileFilterOpen && (
          <div className="mt-4 sm:hidden">
            <div className="bg-zinc-900/80 backdrop-blur-sm rounded-lg border border-zinc-700/50 p-4">
              <div className="space-y-4">
                {/* Category Selection */}
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Category</label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => {
                          setSelectedCategory(category.id);
                          setSelectedSubcategory('all');
                        }}
                        className={`px-3 py-2 text-sm rounded-lg border transition-all duration-200 ${
                          selectedCategory === category.id
                            ? 'bg-[#eafd66]/20 text-[#eafd66] border-[#eafd66]/50'
                            : 'bg-zinc-800/50 text-zinc-300 border-zinc-700/50 hover:border-zinc-600/70'
                        }`}
                      >
                        {category.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Subcategory Selection */}
                {subcategories[selectedCategory] && subcategories[selectedCategory].length > 1 && (
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Subcategory
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {subcategories[selectedCategory].map((subcategory) => (
                        <button
                          key={subcategory.id}
                          onClick={() => setSelectedSubcategory(subcategory.id)}
                          className={`px-3 py-2 text-sm rounded-lg border transition-all duration-200 ${
                            selectedSubcategory === subcategory.id
                              ? 'bg-[#eafd66]/20 text-[#eafd66] border-[#eafd66]/50'
                              : 'bg-zinc-800/50 text-zinc-300 border-zinc-700/50 hover:border-zinc-600/70'
                          }`}
                        >
                          {subcategory.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Close Button */}
                <div className="pt-2">
                  <button
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="w-full bg-zinc-800/50 text-zinc-300 px-4 py-2 rounded-lg border border-zinc-700/50 hover:border-zinc-600/70 transition-all duration-200"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mobile: Show active filters as chips */}
        <div className="mt-4 lg:hidden">
          <div className="flex flex-wrap gap-2">
            {selectedCategory !== 'all' && (
              <div className="flex items-center gap-2 bg-zinc-800/60 text-zinc-300 text-sm px-4 py-2 rounded-lg border border-zinc-700/50">
                <span>{categories.find((c) => c.id === selectedCategory)?.label}</span>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedSubcategory('all');
                  }}
                  className="text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            )}
            {selectedSubcategory !== 'all' && subcategories[selectedCategory] && (
              <div className="flex items-center gap-2 bg-zinc-800/60 text-zinc-300 text-sm px-4 py-2 rounded-lg border border-zinc-700/50">
                <span>
                  {
                    subcategories[selectedCategory]?.find((s) => s.id === selectedSubcategory)
                      ?.label
                  }
                </span>
                <button
                  onClick={() => setSelectedSubcategory('all')}
                  className="text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Magazine Style Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredChannels.map((channel: ChannelData) => (
          <ChannelCard
            key={channel.id}
            channel={channel}
            variant="magazine"
            size="medium"
            onCardClick={handleChannelClick}
            className="h-full animate-fade-in-up"
          />
        ))}
      </div>

      {/* Infinite Scroll Loader */}
      {filteredChannels.length > 0 && (
        <div className="mt-8">
          <InfiniteScrollLoader
            hasNextPage={hasNextPage || false}
            isFetchingNextPage={isFetchingNextPage}
            fetchNextPage={fetchNextPage}
            error={error}
            onRetry={() => refetch()}
            className="mt-8"
            scrollRoot={null}
            rootMargin="400px"
            threshold={0.1}
          />
        </div>
      )}
    </section>
  );
}
