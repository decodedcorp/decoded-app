import { ItemInfo } from './item-info';
import { ItemActions } from './item-actions';
import { LinkTabs } from './link-tabs';
import { LinkList } from './link-list';
import type { ItemDetailData } from '../types';

interface DetailContentProps {
  data: ItemDetailData;
  activeTab: 'sale' | 'related';
  onTabChange: (tab: 'sale' | 'related') => void;
}

export function DetailContent({
  data,
  activeTab,
  onTabChange,
}: DetailContentProps) {
  return (
    <div className="w-full">
      <div className="flex flex-col items-center pb-6">
        <ItemInfo data={data} />
        <ItemActions likeCount={data.like} itemId={data.id} />
      </div>

      <div className="px-4">
        <LinkTabs
          activeTab={activeTab}
          onTabChange={onTabChange}
          saleCount={data.link_info?.filter((link) => (link.label)).length}
          relatedCount={data.link_info?.filter( (link) => (link.label && status !== 'confirm')).length}
        />
        <LinkList links={data.link_info} activeTab={activeTab} status={data.status} />
      </div>
    </div>
  );
}
