'use client';

import React, { useState, useMemo } from 'react';

import { useRouter } from 'next/navigation';
import { ChannelData } from '@/store/channelModalStore';
import { useChannelModalStore } from '@/store/channelModalStore';
import { CategoryType } from '@/api/generated/models/CategoryType';
import { ChannelCard } from '@/components/ChannelCard/ChannelCard';

import { useCategories, formatCategoriesForDropdown } from '../../hooks/useCategories';

interface DiscoverSectionProps {
  channels: ChannelData[];
  className?: string;
  onChannelClick?: (channel: ChannelData) => void;
}

export function DiscoverSection({
  channels,
  className = '',
  onChannelClick,
}: DiscoverSectionProps) {
  const router = useRouter();
  const openChannelModal = useChannelModalStore((state) => state.openModal);

  // Category filters state
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState('all');

  // Fetch categories from API
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories(
    CategoryType.CHANNEL,
  );
  const { categories, subcategories } = formatCategoriesForDropdown(categoriesData);

  const handleChannelClick = (channel: ChannelData) => {
    if (onChannelClick) {
      onChannelClick(channel);
    } else {
      openChannelModal(channel);
    }
  };

  // Filter channels based on selected category and subcategory
  const filteredChannels = useMemo(() => {
    let filtered = [...channels];

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

    return filtered.slice(0, 12); // Show up to 12 channels
  }, [channels, selectedCategory, selectedSubcategory, categories, subcategories]);

  if (!channels.length) {
    return null;
  }

  return (
    <section className={`${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-400 mb-2">모든 채널</h2>
          <p className="text-zinc-500 text-sm mt-1">
            카테고리별로 채널을 둘러보고 나에게 맞는 채널을 찾아보세요
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center space-x-3">
          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setSelectedSubcategory('all'); // Reset subcategory when category changes
            }}
            className="bg-zinc-800 text-white text-sm px-3 py-2 rounded-lg border border-zinc-700 hover:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#eafd66]/20"
            disabled={categoriesLoading}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.label}
              </option>
            ))}
          </select>

          {/* Subcategory Dropdown */}
          {subcategories[selectedCategory] && subcategories[selectedCategory].length > 1 && (
            <select
              value={selectedSubcategory}
              onChange={(e) => setSelectedSubcategory(e.target.value)}
              className="bg-zinc-800 text-white text-sm px-3 py-2 rounded-lg border border-zinc-700 hover:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#eafd66]/20"
            >
              {subcategories[selectedCategory].map((subcategory) => (
                <option key={subcategory.id} value={subcategory.id}>
                  {subcategory.label}
                </option>
              ))}
            </select>
          )}
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
            className="h-full"
          />
        ))}
      </div>

      {/* Show More Button */}
      {/* <div className="text-center mt-8">
        <button
          onClick={() => router.push('/channels')}
          className="px-8 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-medium transition-colors duration-200 inline-flex items-center space-x-2"
        >
          <span>View All Channels</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div> */}
    </section>
  );
}
