'use client';

import React, { useState } from 'react';

const categories = [
  'All',
  'Art',
  'Design',
  'Photography',
  'Music',
  'Video',
  'Technology',
  'Fashion',
  'Food',
  'Travel',
  'Sports',
  'Education',
];

export function ChannelHero() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  return (
    <section className="h-[40vh] bg-black relative overflow-hidden">
      {/* 카테고리 필터 */}
      <div className="relative z-10 flex items-center justify-center h-full px-4">
        <div className="w-full max-w-4xl mx-auto">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-white text-black shadow-lg'
                    : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
