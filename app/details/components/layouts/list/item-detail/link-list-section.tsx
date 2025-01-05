import { ItemDocument } from '@/types/model';
import EmptyState from './components/empty-state';
import { useState } from 'react';
import { LinkItem } from './components/link-item';
import { TabButton } from './components/tab-button';
import { FilterButton } from './components/filter-button';

interface Link {
  label: string;
  value: string;
}

interface LinkListSectionProps {
  item: ItemDocument & { linkInfo?: Link[] };
}

export default function LinkListSection({ item }: LinkListSectionProps) {
  const [activeTab, setActiveTab] = useState<'sale' | 'reference'>('sale');
  const [activeFilter, setActiveFilter] = useState('all');

  const links = item.linkInfo || [];
  const saleLinks = links.filter((link) => link.label === 'sale');
  const referenceLinks = links.filter((link) => link.label !== 'sale');
  const saleCount = saleLinks.length;
  const referenceCount = referenceLinks.length;

  const filteredReferenceLinks =
    activeFilter === 'all'
      ? referenceLinks
      : referenceLinks.filter((link) => link.label === activeFilter);

  const uniqueLabels = Array.from(
    new Set(referenceLinks.map((link) => link.label))
  );

  return (
    <div>
      {/* 링크 타입 탭 */}
      <div className="relative">
        <div className="flex justify-center w-full border-b border-gray-800">
          <TabButton
            isActive={activeTab === 'sale'}
            onClick={() => setActiveTab('sale')}
          >
            <span>판매링크</span>
            <span
              className={
                activeTab === 'sale' ? 'text-[#EAFD66]' : 'text-gray-500'
              }
            >
              {saleCount}
            </span>
          </TabButton>
          <TabButton
            isActive={activeTab === 'reference'}
            onClick={() => setActiveTab('reference')}
          >
            <span>관련링크</span>
            <span>{referenceCount}</span>
          </TabButton>
        </div>

        {/* 언더바 */}
        <div className="absolute bottom-0 left-0 w-full">
          <div
            className={`
              absolute h-[2px] bg-white transition-all duration-300 ease-in-out
              ${
                activeTab === 'sale'
                  ? 'left-1/4 -translate-x-1/2 w-1/2'
                  : 'left-3/4 -translate-x-1/2 w-1/2'
              }
            `}
          />
        </div>
      </div>

      {/* 링크 목록 */}
      <div>
        {activeTab === 'sale' ? (
          <div className="space-y-2 p-4">
            {saleCount > 0 ? (
              saleLinks.map((link, index) => (
                <LinkItem
                  key={`${link.label}-${index}`}
                  url={link.value}
                  label={link.label}
                  description="구매하기"
                />
              ))
            ) : (
              <EmptyState />
            )}
          </div>
        ) : (
          <div className="space-y-2 p-4">
            {referenceCount > 0 ? (
              <div className="space-y-6 p-4">
                <div className="flex gap-2 overflow-x-auto pb-2">
                  <FilterButton
                    label="All"
                    isActive={activeFilter === 'all'}
                    onClick={() => setActiveFilter('all')}
                  />
                  {uniqueLabels.map((label) => (
                    <FilterButton
                      key={label}
                      label={label}
                      isActive={activeFilter === label}
                      onClick={() => setActiveFilter(label)}
                    />
                  ))}
                </div>
                <div className="space-y-2">
                  {filteredReferenceLinks.map((link, index) => (
                    <LinkItem
                      key={`${link.label}-${index}`}
                      url={link.value}
                      label={link.label}
                      description="자세히 보기"
                    />
                  ))}
                </div>
              </div>
            ) : (
              <EmptyState />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
