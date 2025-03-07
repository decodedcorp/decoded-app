"use client";

import Image from 'next/image';
import { Heart } from 'lucide-react';
import { ItemButton } from '@/components/ui/item-marker';
import { useNavigateToDetail } from '@/lib/hooks/common/useNavigateToDetail';
import { ProcessedImageData } from '@/lib/api/_types/image';
import { cn } from '@/lib/utils/style';
import { ItemActionsWrapper } from '../item-list-section/client/item-actions-wrapper';
import { AddItemModal } from '@/components/ui/modal/add-item-modal';
import { useState } from 'react';

interface ItemData {
  _id: string;
  brand_name: string;
  brand_logo_image_url: string;
}

interface DecodedItem {
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
      img_url: string | null;
      like: number;
    };
    brand_name: string | null;
    brand_logo_image_url: string | null;
  };
}

interface ImageSectionProps {
  imageData: ProcessedImageData;
  selectedItemId?: string;
  className?: string;
}

export function ImageSection({ imageData, selectedItemId }: ImageSectionProps) {
  const navigateToDetail = useNavigateToDetail();
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  
  if (!imageData) return null;

  const allItems = Object.values(imageData.items).flat();

  return (
    <div className="relative w-full h-full">
      <div className="relative w-full h-full aspect-[4/5] overflow-hidden rounded-lg">
        <Image
          src={imageData.img_url}
          alt={Object.values(imageData.metadata)[0] || "이미지"}
          fill
          className="object-cover sm:object-cover w-full h-full"
          priority
          unoptimized
        />
        
        {allItems?.map((decodedItem, index) => {
          const top = parseFloat(decodedItem.position.top);
          const left = parseFloat(decodedItem.position.left);

          return (
            <div
              key={decodedItem.item.item._id || index}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{
                top: `${top}%`,
                left: `${left}%`,
              }}
            >
              <ItemButton
                item={{
                  pos: {
                    top: decodedItem.position.top,
                    left: decodedItem.position.left,
                  },
                  info: {
                    item: {
                      item: decodedItem.item.item,
                      brand_name: decodedItem.item.brand_name,
                      brand_logo_image_url: decodedItem.item.brand_logo_image_url,
                    },
                  },
                  imageDocId: decodedItem.item.item._id,
                }}
                isActive={decodedItem.item.item._id === selectedItemId}
              />
            </div>
          );
        })}
      </div>

      {/* 모바일 액션 버튼 섹션 */}
      <div className="lg:hidden mt-4 bg-[#1A1A1A] rounded-lg">
        <div className="px-4 py-3 flex items-center justify-between">
          <ItemActionsWrapper
            initialLikeCount={imageData.like}
            imageId={imageData.doc_id}
            render={({ likeCount, isLiked, isLoading, onLike }) => (
              <>
                <button
                  onClick={onLike}
                  disabled={isLoading}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full",
                    "bg-white/5 hover:bg-white/10 transition-colors",
                    isLoading && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <Heart
                    className={cn(
                      "w-5 h-5",
                      isLiked ? "fill-red-500 text-red-500" : "text-white/60"
                    )}
                  />
                  <span className="text-sm text-white/60">{likeCount}</span>
                </button>
                
                <button
                  onClick={() => setIsAddItemModalOpen(true)}
                  className={cn(
                    "px-6 py-2 rounded-full text-sm font-medium",
                    "bg-[#EAFD66] text-black hover:bg-[#EAFD66]/90 transition-colors"
                  )}
                >
                  아이템 추가
                </button>
              </>
            )}
          />
        </div>
      </div>

      {/* 아이템 추가 모달 */}
      {isAddItemModalOpen && (
        <AddItemModal
          isOpen={isAddItemModalOpen}
          onClose={() => setIsAddItemModalOpen(false)}
          imageId={imageData.doc_id}
          requestUrl={`user/${sessionStorage.getItem("USER_DOC_ID")}/image/${imageData.doc_id}/request/add`}
        />
      )}
    </div>
  );
}
