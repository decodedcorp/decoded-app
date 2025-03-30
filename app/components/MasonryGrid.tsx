'use client';

import React, { useState, useEffect } from 'react';
import { MasonryInfiniteGrid } from '@egjs/react-infinitegrid';
import Image from 'next/image';
// 이미지 아이템의 타입 정의
interface MasonryItem {
  id: number;
  key: number;
  groupKey: number;
  // 실제 데이터 (프로젝트에 맞게 수정 필요)
  data: {
    imageUrl: string;
    title?: string;
  };
}

interface MasonryGridProps {
  // 초기 아이템 목록 (옵션)
  initialItems?: MasonryItem[];
  // 더 많은 아이템을 로드하는 함수
  loadMore?: (nextGroupKey: number) => Promise<MasonryItem[]>;
  // 그리드 갭
  gap?: number;
  // 아이템 너비 (픽셀)
  itemWidth?: number;
}

/**
 * 4:5 비율을 유지하는 마소닉 그리드 컴포넌트
 */
const MasonryGrid: React.FC<MasonryGridProps> = ({
  initialItems = [],
  loadMore,
  gap = 16,
  itemWidth = 250,
}) => {
  const [items, setItems] = useState<MasonryItem[]>(initialItems);

  // 모든 아이템이 동일한 너비를 가지도록 스타일 정의
  const getItemStyle = (): React.CSSProperties => {
    return {
      width: `${itemWidth}px`,
    };
  };

  // 아이템 렌더링 컴포넌트
  const MasonryItem = React.memo(
    ({
      data,
    }: {
      data: MasonryItem['data'];
    }) => {
      const style = getItemStyle();
      
      // 4:5 비율에 따른 높이 계산
      const height = Math.floor(itemWidth * 1.25); // 5/4 = 1.25

      return (
        <div className="masonry-item" style={style}>
          <div className="masonry-item-content relative overflow-hidden rounded-md">
            {/* 이미지 컨테이너 - 4:5 비율 유지 */}
            <div className="relative bg-gray-100">
              {/* 이미지 - 내재적 크기 사용 */}
              <Image
                src={data.imageUrl}
                alt={data.title || 'Image'}
                width={itemWidth}
                height={height}
                style={{ 
                  width: '100%', 
                  height: 'auto',
                  objectFit: 'cover', 
                  aspectRatio: '4/5'
                }}
                unoptimized={true}
                priority={false}
              />
            </div>
            {/* 제목이 있는 경우 표시 */}
            {data.title && (
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-black bg-opacity-50 text-white">
                <p className="text-sm truncate">{data.title}</p>
              </div>
            )}
          </div>
        </div>
      );
    }
  );

  // displayName 설정
  MasonryItem.displayName = 'MasonryItem';

  // InfiniteGrid에서 더 많은 아이템을 요청할 때 호출되는 핸들러
  const handleRequestAppend = async (e: any) => {
    if (!loadMore) return;

    const nextGroupKey = Number(e.groupKey || 0) + 1;
    try {
      const newItems = await loadMore(nextGroupKey);
      setItems([...items, ...newItems]);
    } catch (error) {
      console.error('Failed to load more items:', error);
    }
  };

  // 테스트용 데모 데이터 생성 함수
  const generateDemoItems = (
    groupKey: number,
    count: number
  ): MasonryItem[] => {
    const nextItems: MasonryItem[] = [];
    const nextKey = groupKey * count;

    for (let i = 0; i < count; ++i) {
      const key = nextKey + i;

      nextItems.push({
        id: key,
        key,
        groupKey,
        data: {
          // 플레이스홀더 이미지 URL - 4:5 비율로 명시적 요청
          imageUrl: `https://picsum.photos/400/500?random=${key}`,
          title: `Item ${key}`,
        },
      });
    }
    return nextItems;
  };

  // 초기 아이템이 없으면 데모 데이터로 채우기
  useEffect(() => {
    if (initialItems.length === 0 && items.length === 0) {
      setItems(generateDemoItems(0, 20));
    }
  }, [initialItems.length, items.length]);

  return (
    <div className="masonry-grid-container">
      <MasonryInfiniteGrid
        className="masonry-grid"
        gap={gap}
        onRequestAppend={handleRequestAppend}
        useResizeObserver={true}
        observeChildren={true}
        placeholder={
          <div className="w-full h-40 bg-gray-200 animate-pulse rounded-md" />
        }
      >
        {items.map((item) => (
          <MasonryItem
            key={item.key}
            data-grid-groupkey={item.groupKey}
            data={item.data}
          />
        ))}
      </MasonryInfiniteGrid>
    </div>
  );
};

export default MasonryGrid;
