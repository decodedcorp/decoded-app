'use client';

import { useMemo } from 'react';
import MasonryGridCore from './MasonryGridCore';
import { Editor } from '@/domains/channels/types/masonry';
import type { Item } from './utils/masonryCalculations';

interface ChannelItem {
  id: string;
  title: string;
  category: string;
  editors: Editor[];
  imageUrl: string;
}

// 임시 채널 데이터 (나중에 API로 교체)
const generateChannelItems = (count: number = 20): ChannelItem[] => {
  const categories = [
    'Business',
    'Technology',
    'Design',
    'Marketing',
    'Education',
    'Art',
    'Science',
    'Health',
  ];

  // 다양한 이미지들 (메이슨리 그리드 테스트용)
  const images = [
    '/images/sususupanova.jpg', // 기본 이미지
    '/images/karina01.jpg', // 세로형 이미지
    '/images/karina02.jpeg', // 가로형 이미지
    '/images/karina_profile.webp', // 프로필 이미지
    '/images/73032-1920x1200-desktop-hd-kanye-west-background.jpg', // 와이드 이미지
    '/images/image-proxy.webp', // 작은 이미지
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: `channel-${i + 1}`,
    title: `Channel ${i + 1}`,
    category: categories[i % categories.length],
    editors: [
      { name: `Editor ${i + 1}`, avatarUrl: undefined },
      { name: `Editor ${i + 2}`, avatarUrl: undefined },
    ],
    // 다양한 이미지를 순환하여 사용 (메이슨리 그리드 효과 확인)
    imageUrl: images[i % images.length],
  }));
};

export function MasonryGrid() {
  const channelItems = useMemo(() => generateChannelItems(20), []);

  // MasonryGridCore에 맞는 데이터 형식으로 변환
  const masonryItems = useMemo(
    () =>
      channelItems.map(
        (item): Item => ({
          id: item.id,
          img: item.imageUrl,
          url: `/channels/${item.id}`,
          title: item.title,
          category: item.category,
          editors: item.editors.map((editor) => ({
            name: editor.name,
            avatar: editor.avatarUrl || null,
          })),
          // 기본 이미지 크기 (실제로는 이미지 로딩 후 naturalWidth/Height로 계산됨)
          width: 300,
          height: 200,
        }),
      ),
    [channelItems],
  );

  const handleItemClick = (item: Item) => {
    console.log('Channel clicked:', item);
    // TODO: 채널 모달 열기 또는 라우팅
  };

  return (
    <div className="w-full pt-4 animate-in fade-in duration-500">
      <MasonryGridCore
        items={masonryItems}
        scaleOnHover={true}
        hoverScale={0.95}
        blurToFocus={true}
        animateFrom="bottom"
        stagger={0.05}
        onItemClick={handleItemClick}
      />
    </div>
  );
}
