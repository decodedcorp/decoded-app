'use client';

import React, { useCallback } from 'react';
import Masonry from './grid'; // 원래의 grid.tsx 컴포넌트로 복원

// grid.tsx의 Item 인터페이스와 일치하도록 정의
interface Item {
  id: string;
  img: string;
  url: string;
  width?: number;
  height?: number;
  aspectRatio?: number;
  title?: string;
  category?: string;
  editors?: Array<{ name: string; avatar: string | null }>;
}

interface MasonryGridProps {
  items: Item[];
  onItemClick?: (item: Item) => void;
}

const MasonryGrid: React.FC<MasonryGridProps> = ({ items, onItemClick }) => {
  // channelItems를 Item 타입으로 변환 (url 필드 추가)
  const channelItems: Item[] = items.map((item) => ({
    id: item.id,
    img: item.img,
    url: `/channels/${item.id}`, // url 필드 추가
    title: item.title,
    category: item.category,
    editors: item.editors,
    width: item.width,
    height: item.height,
    aspectRatio: item.aspectRatio,
  }));

  // 안정적인 클릭 핸들러 (리렌더 방지)
  const handleItemClick = useCallback(
    (item: Item) => {
      onItemClick?.(item);
    },
    [onItemClick],
  );

  return (
    <div className="w-full pt-4">
      <Masonry items={channelItems} onItemClick={handleItemClick} />
    </div>
  );
};

export default MasonryGrid;
