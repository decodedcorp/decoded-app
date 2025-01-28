'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils/style';
import { useItemDetail } from '@/app/details/utils/hooks/use-item-detail';
import type { ItemDetailData } from '../item-detail-section/types';
import { useState } from 'react';
import { DetailHeader } from './components/detail-header';
import { DetailContent } from './components/detail-content';
import { DetailError } from './components/detail-error';
import { DetailLoading } from './components/detail-loading';

type TabType = 'sale' | 'related';

export function DetailSlideSection() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const selectedId = searchParams.get('selectedItem');
  const { data, isLoading, error } = useItemDetail(selectedId);
  const [activeTab, setActiveTab] = useState<TabType>('sale');

  const handleClose = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('selectedItem');
    router.push(`?${params.toString()}`, { scroll: false });
  };

  if (!selectedId) return null;

  return (
    <div
      className={cn(
        'absolute inset-0 bg-[#1A1A1A]',
        'transform transition-all duration-300 ease-in-out',
        selectedId ? 'translate-x-0' : 'translate-x-full'
      )}
    >
      <div className="h-full overflow-y-auto">
        <div className="relative">
          <DetailHeader onClose={handleClose} />

          {error ? (
            <DetailError />
          ) : isLoading ? (
            <DetailLoading />
          ) : data ? (
            <DetailContent
              data={{
                id: data.data.docs._id,
                requester: data.data.docs.requester,
                requested_at: data.data.docs.requested_at,
                link_info: data.data.docs.link_info ?? [],
                status: data.data.docs.status as 'pending' | 'confirm',
                metadata: {
                  ...data.data.docs.metadata,
                  category: data.data.docs.metadata.category ?? 'Unknown',
                  sub_category: data.data.docs.metadata.sub_category ?? 'Unknown'
                },
                img_url: data.data.docs.img_url,
                like: data.data.docs.like
              }}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
