'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { cn } from '@/lib/utils/style';
import { useItemDetail } from '@/app/details/utils/hooks/use-item-detail';
import { useState } from 'react';

interface ItemDetailData {
  id: string;
  requester: string;
  requested_at: string;
  link_info: Array<{
    url: string;
    label: string | null;
    date: string;
    provider: string;
    og_metadata: null;
    link_metadata: null;
  }>;
  metadata: {
    name: string | null;
    description: string | null;
    brand: string | null;
    designed_by: string | null;
    material: string | null;
    color: string | null;
    item_class: string;
    item_sub_class: string;
    category: string;
    sub_category: string;
    product_type: string;
  };
  img_url: string;
  like: number;
}

// 탭 타입 정의
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

  function formatUrl(url: string) {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace('www.', '');
    } catch {
      return url;
    }
  }

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
          <button
            onClick={handleClose}
            className="absolute left-4  z-10 text-white"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {error ? (
            <div className="h-24 flex items-center justify-center">
              <div className="text-sm text-red-400">
                데이터를 불러오는데 실패했습니다
              </div>
            </div>
          ) : isLoading ? (
            <div className="h-24 flex items-center justify-center">
              <div className="text-sm text-neutral-400">로딩중...</div>
            </div>
          ) : data ? (
            <div className="w-full">
              <div className="flex flex-col items-center pb-6">
                <div className="w-[6rem] h-[6rem] bg-white mb-3 border border-neutral-800 rounded-lg overflow-hidden">
                  <Image
                    src={data.data.docs.img_url}
                    alt={data.data.docs.metadata.name || ''}
                    width={240}
                    height={240}
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="text-neutral-500 text-sm mb-1.5">
                  {data.data.docs.metadata.category}
                </div>

                <div className="text-white text-xs font-bold mb-1.5">
                  {data.data.docs.metadata.brand
                    ? typeof data.data.docs.metadata.brand === 'object'
                      ? data.data.docs.metadata.brand ?? 'Unknown Brand'
                      : data.data.docs.metadata.brand
                    : 'Unknown Brand'}
                </div>

                <div className="text-white text-base mb-2">
                  {data.data.docs.metadata.name}
                </div>

                <div className="flex items-center gap-2 mb-10">
                  <button className="px-5 py-2 rounded-full border border-neutral-600 text-xs text-white">
                    아이템 정보 제공
                  </button>
                  
                  <button 
                    className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-neutral-600 text-xs text-white"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    <span>{data.data.docs.like}</span>
                  </button>
                </div>
              </div>

              <div className="px-4">
                {/* 탭 헤더 섹션 */}
                <div className="flex mb-6 border-b border-neutral-800">
                  <button
                    onClick={() => setActiveTab('sale')}
                    className={cn(
                      'flex-1 flex items-center justify-center gap-2 px-4 py-3 relative',
                      'text-sm transition-colors',
                      activeTab === 'sale' 
                        ? 'text-primary' 
                        : 'text-neutral-400 hover:text-neutral-200'
                    )}
                  >
                    <span>판매링크</span>
                    <span className="text-sm">
                      {data.data.docs.link_info?.filter(link => !link.label).length}
                    </span>
                    {activeTab === 'sale' && (
                      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary" />
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab('related')}
                    className={cn(
                      'flex-1 flex items-center justify-center gap-2 px-4 py-3 relative',
                      'text-sm transition-colors',
                      activeTab === 'related' 
                        ? 'text-primary' 
                        : 'text-neutral-400 hover:text-neutral-200'
                    )}
                  >
                    <span>관련링크</span>
                    <span className="text-sm">
                      {data.data.docs.link_info?.filter(link => link.label).length}
                    </span>
                    {activeTab === 'related' && (
                      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary" />
                    )}
                  </button>
                </div>

                {/* 링크 리스트 섹션 */}
                <div className="space-y-4">
                  {activeTab === 'sale' && data.data.docs.link_info
                    ?.filter(link => !link.label)
                    .map((link, index) => (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex justify-between items-center hover:bg-neutral-900 transition-colors"
                      >
                        <div className="space-y-1.5">
                          <div className="text-primary text-[11px] font-medium">SALE</div>
                          <div className="text-white text-xs">{formatUrl(link.url)}</div>
                          <div className="text-neutral-600 text-[11px]">구매하기</div>
                        </div>
                        <svg
                          className="w-4 h-4 text-neutral-600 group-hover:text-primary transition-colors"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </a>
                    ))}

                  {activeTab === 'related' && data.data.docs.link_info
                    ?.filter(link => link.label)
                    .map((link, index) => (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex justify-between items-center hover:bg-neutral-900 transition-colors"
                      >
                        <div className="space-y-1.5">
                          <div className="text-white text-xs">{formatUrl(link.url)}</div>
                          <div className="text-neutral-600 text-[11px]">{link.label || '관련정보'}</div>
                        </div>
                        <svg
                          className="w-4 h-4 text-neutral-600 group-hover:text-primary transition-colors"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </a>
                    ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
