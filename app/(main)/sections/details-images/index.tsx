'use client';

import { useImageDetails } from '@/app/details/utils/hooks/use-image-details';
import { ImageDetailResponse } from '@/components/ui/modal/add-item-modal/types';
import type { Response_GetDocumentResponse_ } from '@/lib/api/types/models/Response_GetDocumentResponse_';
import { UseQueryResult } from '@tanstack/react-query';
import Image from 'next/image';

interface DetailSection {
  title: string;
  description: string;
  mainImage: string;
  items: Array<{
    title: string;
    imageUrl: string;
    docId: string;
    category?: string;
    subCategory?: string;
  }>;
}

interface DetailCardProps {
  detail: DetailSection;
  mainImage: string;
  subImages: string[];
}

function DetailCard({ detail, mainImage, subImages }: DetailCardProps) {
  return (
    <div className="flex flex-col md:flex-row bg-zinc-900/50 rounded-xl overflow-hidden">
      {/* 메인 이미지 */}
      <div className="relative w-full md:w-[320px] aspect-[4/5] overflow-hidden">
        {mainImage ? (
          <Image
            src={mainImage}
            alt={detail.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
            <span className="text-sm text-zinc-500">이미지 없음</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-lg font-bold text-white mb-1">{detail.title}</h3>
          <p className="text-xs text-zinc-300">{detail.description}</p>
        </div>
      </div>

      {/* 서브 아이템 리스트 */}
      <div className="flex-1 p-4 max-h-[600px] overflow-y-auto">
        <div className="space-y-3">
          {detail.items.map((item, index) => (
            <div
              key={item.docId}
              className="flex items-center gap-4 p-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 transition-colors"
            >
              {subImages[index] ? (
                <div className="w-14 h-14 rounded-lg bg-zinc-800 flex-shrink-0 relative overflow-hidden">
                  <Image
                    src={subImages[index]}
                    alt={item.title || '아이템 이미지'}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-14 h-14 rounded-lg bg-zinc-800 flex-shrink-0 flex items-center justify-center">
                  <span className="text-xs text-zinc-500">No Image</span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm text-white mb-1 truncate">
                  {item.title || (
                    <>
                      {item.category} {item.subCategory && `• ${item.subCategory}`}
                    </>
                  )}
                </h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface ImageItem {
  is_decoded: boolean;
  position: {
    top: string;
    left: string;
  };
  item: {
    item: {
      _id: string;
      metadata: {
        name: string | null;
      };
      img_url: string | null;
    };
  };
}

interface ImageData {
  title: string | null;
  description: string;
  img_url: string;
  items: Record<string, ImageItem[]>;
}

export default function DetailsImagesSection({
  imageId,
}: {
  imageId: string[];
}) {
  const firstImageDetails = useImageDetails(imageId[0]);
  const secondImageDetails = useImageDetails(imageId[1]);
  const imageDetails = [firstImageDetails, secondImageDetails] as Array<UseQueryResult<Response_GetDocumentResponse_, Error>>;
  
  const isLoading = imageDetails.some(detail => detail.isLoading);
  const allImagesLoaded = imageDetails.every(detail => detail.data?.data);
  
  if (isLoading || !allImagesLoaded) return null;

  const detailSections = imageDetails.map(detail => {
    const imageData = detail.data?.data as ImageDetailResponse;
    if (!imageData) return null;
    
    return {
      title: imageData.image.title || '이미지 정보',
      description: imageData.image.description || '상세 설명이 없습니다',
      mainImage: imageData.image.img_url,
      items: Object.values(imageData.image.items || {})
        .flat()
        .map((item) => ({
          title: item.item.item.metadata?.name || '아이템명 없음',
          imageUrl: item.item.item.img_url || '',
          docId: item.item.item._id,
          category: item.item.item.metadata?.category || '',
          subCategory: item.item.item.metadata?.sub_category || '',
        })),
    };
  }).filter(Boolean) as DetailSection[];

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-white">상품 상세</h2>
          <p className="text-sm text-zinc-400">상품의 상세 정보를 확인하세요</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {detailSections.map((detail, index) => (
            <DetailCard
              key={index}
              detail={detail}
              mainImage={detail.mainImage}
              subImages={detail.items.map((item) => item.imageUrl)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
