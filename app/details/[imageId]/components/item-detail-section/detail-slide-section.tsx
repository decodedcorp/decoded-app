'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils/style';
import { useItemDetail } from '@/app/details/utils/hooks/use-item-detail';
import { useState } from 'react';
import { DetailHeader } from './components/detail-header';
import { DetailContent } from './components/detail-content';
import { DetailError } from './components/detail-error';
import { DetailLoading } from './components/detail-loading';
import { ItemDetailData, ItemDetailResponse, LinkInfo } from './types';

type TabType = 'sale' | 'related';

interface ApiResponse {
  data: {
    docs: {
      _id: string;
      requester: string;
      requested_at: string;
      link_info: {
        url: string;
        label: string | null;
        date: string;
        provider: string;
        og_metadata: null;
        link_metadata: null;
        status?: 'pending' | 'confirm';
      }[] | null;
      metadata: {
        name: string;
        description: string;
        brand: string;
        designed_by: string;
        material: string;
        color: string;
        item_class: string;
        item_sub_class: string;
        category?: string;
        sub_category?: string;
        product_type: string;
      };
      img_url: string;
      like: number;
    };
    metadata?: {
      brand: string;
    };
    next_id: string | null;
  };
}

export function DetailSlideSection() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const selectedId = searchParams.get('selectedItem');
  const { data, isLoading, error } = useItemDetail(selectedId);
  const [activeTab, setActiveTab] = useState<TabType>('sale');

  // Ensure data is of type ItemDetailResponse | null
  const apiResponse: ItemDetailResponse | null = data ? (data as unknown as ItemDetailResponse) : null;

  const handleClose = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('selectedItem');
    router.push(`?${params.toString()}`, { scroll: false });
  };

  if (!selectedId) return null;

  const transformedData: ItemDetailData | null = apiResponse ? {
    docs: {
      _id: apiResponse.data.docs._id,
      requester: apiResponse.data.docs.requester,
      requested_at: apiResponse.data.docs.requested_at,
      links: apiResponse.data.docs.links?.map(link => ({
        value: link.value,
        label: link.label,
        date: link.date,
        provider: link.provider,
        og_metadata: link.og_metadata,
        link_metadata: link.link_metadata,
        status: link.status || 'pending'
      })) || [],
      metadata: {
        name: apiResponse.data.docs.metadata.name,
        description: apiResponse.data.docs.metadata.description,
        brand: apiResponse.data.docs.metadata.brand,
        designed_by: apiResponse.data.docs.metadata.designed_by,
        material: apiResponse.data.docs.metadata.material,
        color: apiResponse.data.docs.metadata.color,
        item_class: apiResponse.data.docs.metadata.item_class,
        item_sub_class: apiResponse.data.docs.metadata.item_sub_class,
        category: apiResponse.data.docs.metadata.category || '',
        sub_category: apiResponse.data.docs.metadata.sub_category || '',
        product_type: apiResponse.data.docs.metadata.product_type
      },
      img_url: apiResponse.data.docs.img_url,
      like: apiResponse.data.docs.like
    },
    metadata: {
      brand: apiResponse.data.metadata?.brand || ''
    }
  } : null;

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
          ) : transformedData ? (
            <DetailContent
              data={transformedData}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
