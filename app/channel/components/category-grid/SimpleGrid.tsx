'use client';

import React from 'react';
import { GridItem } from './GridItem';

// mock 데이터
const mockItems = Array.from({ length: 36 }).map((_, i) => ({
  title: [
    'WiseType', 'Jolie Ngo', 'Delphine Lejeune', 'Balmer Hählen', 'Eunji Lee', 'Jung-Lee Type Foundry',
    'Studio XYZ', 'Artisan', 'Pixel Lab', 'Soundwave', 'TypeLab', 'DesignHub',
  ][i % 12],
  imageUrl: i % 4 === 0 ? undefined : `https://picsum.photos/seed/${i}/400/500`,
  category: [
    'Outerwear', 'Footwear', 'Accessories', 'Bags', 'Jewelry', 'Streetwear',
    'Sportswear', 'Designer', 'Vintage', 'Sustainable', 'Unisex', 'Kids',
  ][i % 12],
  editors: [
    // 3명 이하
    [
      { name: 'Alice', avatarUrl: 'https://randomuser.me/api/portraits/women/1.jpg' },
      { name: 'Bob', avatarUrl: 'https://randomuser.me/api/portraits/men/2.jpg' },
      { name: 'Carol', avatarUrl: 'https://randomuser.me/api/portraits/women/3.jpg' },
    ],
    // 5명
    [
      { name: 'Dave', avatarUrl: 'https://randomuser.me/api/portraits/men/4.jpg' },
      { name: 'Eve', avatarUrl: 'https://randomuser.me/api/portraits/women/5.jpg' },
      { name: 'Frank', avatarUrl: 'https://randomuser.me/api/portraits/men/6.jpg' },
      { name: 'Grace', avatarUrl: 'https://randomuser.me/api/portraits/women/7.jpg' },
      { name: 'Heidi', avatarUrl: 'https://randomuser.me/api/portraits/women/8.jpg' },
    ],
    // 7명 (6명 이상)
    [
      { name: 'Ivan', avatarUrl: 'https://randomuser.me/api/portraits/men/9.jpg' },
      { name: 'Judy', avatarUrl: 'https://randomuser.me/api/portraits/women/10.jpg' },
      { name: 'Mallory', avatarUrl: 'https://randomuser.me/api/portraits/women/11.jpg' },
      { name: 'Oscar', avatarUrl: 'https://randomuser.me/api/portraits/men/12.jpg' },
      { name: 'Peggy', avatarUrl: 'https://randomuser.me/api/portraits/women/13.jpg' },
      { name: 'Sybil', avatarUrl: 'https://randomuser.me/api/portraits/women/14.jpg' },
      { name: 'Trent', avatarUrl: 'https://randomuser.me/api/portraits/men/15.jpg' },
    ],
  ][i % 3],
  date: [
    'May 28, 2025', 'May 28, 2025', 'Feb 16, 2025', 'Jan 25, 2025', 'Jan 18, 2025', 'Jan 18, 2025',
    'Mar 10, 2025', 'Apr 2, 2025', 'Feb 20, 2025', 'Mar 5, 2025', 'Apr 15, 2025', 'May 1, 2025',
  ][i % 12],
}));

export function SimpleGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {mockItems.map((item, idx) => (
        <GridItem
          key={idx}
          imageUrl={item.imageUrl}
          title={item.title}
          category={item.category}
          editors={item.editors}
          date={item.date}
        />
      ))}
    </div>
  );
} 