"use client";

import Image from 'next/image';
import { ItemButton } from '@/components/ui/item-marker';
import { useNavigateToDetail } from '@/lib/hooks/common/useNavigateToDetail';
import { ProcessedImageData } from '@/lib/api/_types/image';

interface ItemData {
  _id: string;
  brand_name: string;
  brand_logo_image_url: string;
  // ... 필요한 다른 필드들
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
}

export function ImageSection({ imageData, selectedItemId }: ImageSectionProps) {
  const navigateToDetail = useNavigateToDetail();
  
  if (!imageData) return null;

  const allItems = Object.values(imageData.items).flat();

  return (
    <div className="w-full h-full">
      <div className="bg-[#1A1A1A] rounded-lg overflow-auto flex justify-center items-center">
        <div className="relative aspect-[3/4] min-w-[30rem]">
          <Image
            src={imageData.img_url}
            alt="Detail image"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={true}
          />
          {allItems.map((decodedItem, index) => {
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
      </div>
    </div>
  );
}
