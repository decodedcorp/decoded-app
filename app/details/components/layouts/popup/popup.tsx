'use client';

import { DetailPageState } from '@/types/model.d';
import { ItemButton } from '../buttons';

interface ImagePopupProps {
  detailPageState: DetailPageState;
  currentIndex: number | null;
  isTouch: boolean;
  hoveredItem: number | null;
  setHoveredItem: (index: number | null) => void;
}

export function ImagePopup({
  detailPageState,
  currentIndex,
  isTouch,
  hoveredItem,
  setHoveredItem,
}: ImagePopupProps) {
  // 샘플 검색 버튼 데이터
  const searchButtonData = {
    info: {
      name: '이미지 검색',
      brands: ['SEARCH'],
      affiliateUrl: '#',
      imageUrl: '',
      description: '이미지의 상품을 검색합니다',
      price: ['', ''] as [string, string],
      category: 'search',
      hyped: 0,
    },
    pos: {
      top: '50%',
      left: '50%',
    },
  };

  return (
    <div className="w-full">
      {/* 검색 버튼 */}
      <a
        href="#"
        style={{
          position: 'absolute',
          top: searchButtonData.pos.top,
          left: searchButtonData.pos.left,
          cursor: 'pointer',
          transform: 'translate(-50%, -50%)',
        }}
        className="point group z-10"
        onMouseEnter={() => setHoveredItem(-1)}
        onMouseLeave={() => setHoveredItem(null)}
      >
        <ItemButton
          item={searchButtonData}
          isActive={hoveredItem === -1}
          variant="search"
        />
      </a>

      {/* 기존 아이템 버튼들 */}
      {detailPageState.img &&
        detailPageState.itemList?.map((item, index) => (
          <a
            key={item.info.name}
            href={item.info?.affiliateUrl ?? ''}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              position: 'absolute',
              top: item.pos.top,
              left: item.pos.left,
              cursor: 'pointer',
              transform: 'translate(-50%, -50%)',
            }}
            className={`point group ${currentIndex === index ? 'z-50' : 'z-10'}`}
            onMouseEnter={() => setHoveredItem(index)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <ItemButton
              item={item}
              isActive={currentIndex === index || hoveredItem === index}
            />
          </a>
        ))}
    </div>
  );
}
