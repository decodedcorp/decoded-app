'use client';

import Image from 'next/image';

interface ItemDetailData {
  docs: {
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
  };
  img_url: string;
  like: number;
  metadata: {
    brand: string;
  };
}

interface ItemDetailContentProps {
  data: ItemDetailData;
}

export function ItemDetailContent({ data }: ItemDetailContentProps) {
  if (!data) return null;
  
  return (
    <div className="space-y-4">
      {/* 이미지와 기본 정보 */}
      <div className="flex gap-4">
        <div className="w-20 h-20 rounded-md overflow-hidden bg-neutral-800 flex-shrink-0">
          <Image
            src={data.img_url || ''}
            alt={data.docs.metadata.name || ''}
            width={80}
            height={80}
            className="w-full h-full object-cover"
            unoptimized
          />
        </div>
        <div className="flex-1 space-y-1">
          <h3 className="text-sm text-neutral-200 font-medium">{data.docs.metadata.name}</h3>
          <p className="text-xs text-neutral-400">{data.docs.metadata.product_type}</p>
        </div>
      </div>

      {/* 카테고리 정보 */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-neutral-500">카테고리</span>
          <span className="text-neutral-300">{data.docs.metadata.category}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-neutral-500">서브카테고리</span>
          <span className="text-neutral-300">{data.docs.metadata.sub_category}</span>
        </div>
      </div>

      {/* 링크 정보 */}
      {data.docs.link_info?.[0] && (
        <a
          href={data.docs.link_info[0].url}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full px-4 py-2.5 text-xs text-neutral-400 border border-neutral-700 rounded-md hover:bg-neutral-800 transition-colors text-center"
        >
          상품 정보 보기
        </a>
      )}
    </div>
  );
} 