'use client';

import { useState } from 'react';
import { ImageDetail } from '../../_types/image-grid';

interface ImageSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  imageDetail: ImageDetail | null;
  isFetchingDetail: boolean;
  detailError: string | null;
}

type TabType = 'summary' | 'items' | 'related';

// 분리된 컴포넌트들
import { TabHeader } from './components/TabHeader';
import { ExpandableText } from './components/ExpandableText';
import { ImageSlider } from './components/ImageSlider';
import { ItemGrid } from './components/ItemGrid';
import { CommentList } from './components/CommentList';
import { MasonryGrid } from './components/MasonryGrid';
import { ItemThumbnailList } from './components/ItemThumbnailList';
import { ItemDetailCard } from './components/ItemDetailCard';

// 상수 데이터들을 별도 파일로 분리
import { SIDEBAR_DATA } from './data/sidebar-data';

export function ImageSidebar({
  isOpen,
  onClose,
  imageDetail,
  isFetchingDetail,
  detailError,
}: ImageSidebarProps) {
  const [activeTab, setActiveTab] = useState<TabType>('summary');
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const [isItemsExpanded, setIsItemsExpanded] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  
  const { tags, mainImages, items, comments, description } = SIDEBAR_DATA;
  const visibleItems = isItemsExpanded ? items : items.slice(0, 2);
  const activeItem = items[activeIndex];

  return (
    <div className="h-full w-full bg-[#1D1D1D] shadow-lg relative overflow-y-auto">
      <TabHeader activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'summary' && (
        <div className="px-4 py-6">
          {/* Title, Subtitle & Description */}
          <div className="mb-6">
            <h2 className="text-4xl font-extrabold text-[#F6FF4A] mb-2 leading-tight">
              What Is She Wearing?
            </h2>
            <div className="text-xl font-semibold text-[#F6FF4A] mb-4">
              — KARINA in Focus
            </div>
            
            <ExpandableText
              text={description}
              isExpanded={isDescExpanded}
              onToggle={() => setIsDescExpanded(prev => !prev)}
            />
            
            {/* 해시태그 뱃지 */}
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-[#222] text-white text-xs px-3 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <ImageSlider images={mainImages} />
          
          <ItemGrid
            items={visibleItems}
            isExpanded={isItemsExpanded}
            onToggle={() => setIsItemsExpanded(prev => !prev)}
          />
          
          <CommentList comments={comments} />
        </div>
      )}

      {activeTab === 'items' && (
        <div className="px-4 py-6">
          <div className="mb-6">
            <h2 className="text-4xl font-extrabold text-[#F6FF4A] mb-2 leading-tight">
              Back to Y2K<br />
              — Karina's Retro Future Look
            </h2>
            <p className="text-base text-white/80">
              It's not just about wearing Y2K — it's about reinterpreting it.<br />
              Karina blends high-gloss textures, exposed skin, and statement accessories with modern polish.<br />
              It's throwback, but it's also completely now — just like her.
            </p>
          </div>

          <ItemThumbnailList
            items={items}
            activeIndex={activeIndex}
            onIndexChange={setActiveIndex}
          />

          <div className="flex flex-col gap-6">
            <ItemDetailCard item={activeItem} />
            
            <MasonryGrid
              items={Array.from({ length: 15 })}
              mainImages={mainImages}
              activeItem={activeItem}
              type="items"
            />
          </div>
        </div>
      )}

      {activeTab === 'related' && (
        <div className="px-4 py-6">
          <MasonryGrid
            items={Array.from({ length: 20 })}
            mainImages={mainImages}
            activeItem={activeItem}
            type="related"
          />
        </div>
      )}
    </div>
  );
}
