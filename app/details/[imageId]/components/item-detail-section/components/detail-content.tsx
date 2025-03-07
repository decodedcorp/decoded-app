import { ItemInfo } from './item-info';
import { ItemActions } from './item-actions';
import { LinkTabs } from './link-tabs';
import { LinkList } from './link-list';
import type { ItemDetailData } from '../types';
import { useParams } from 'next/navigation';

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
  const params = useParams();
  const imageId = params.imageId as string;

  // Filter confirmed links
  const confirmedLinks = data.docs.links?.filter(link => link.status === 'confirmed') || [];
  
  // Count sale and related links from confirmed links only
  const saleCount = confirmedLinks.filter(link => link.label === 'sale').length;
  const relatedCount = confirmedLinks.filter(link => !link.label).length;

  return (
    <div className="w-full grid grid-rows-[0.5fr_auto] gap-2">
      <div className="flex flex-col items-center">
        <ItemInfo data={data} />
        <ItemActions 
          likeCount={data.docs.like} 
          itemId={data.docs._id} 
          imageId={imageId}
        />
      </div>

      <div>
        <LinkTabs
          activeTab={activeTab}
          onTabChange={onTabChange}
          saleCount={saleCount}
          relatedCount={relatedCount}
        />
        <LinkList 
          links={data.docs.links}
          activeTab={activeTab}
          status="confirmed"
        />
      </div>
    </div>
  );
}
