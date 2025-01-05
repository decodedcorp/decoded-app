import { cn } from '@/lib/utils/style';
import { BoxContent } from './types';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ImagePlaceholder } from '@/components/ui/icons/image-placeholder';
import ItemDetail from '@/app/details/components/layouts/list/item-detail';
import { HoverItem } from '@/types/model';

interface ImageInfo {
  doc_id: string;
  img_url: string | null;
  title: string | null;
  style: string | null;
  position?: {
    top: string;
    left: string;
  };
  item?: {
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
      requester: string;
      requested_at: string;
      link_info: any;
      like: number;
    };
    brand_name: string | null;
    brand_logo_image_url: string | null;
  };
}

interface FloatingBoxProps {
  content: BoxContent;
  isLarge?: boolean;
  onHover?: (isHovered: boolean, event?: React.MouseEvent) => void;
  image?: ImageInfo;
}

function BoxImage({ image, isLarge }: { image: ImageInfo; isLarge: boolean }) {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Image
        src={image.img_url!}
        alt={image.title || ''}
        fill
        className="object-fill w-full h-full"
        sizes={isLarge ? '264px' : '132px'}
        priority
      />
    </div>
  );
}

function BoxOverlay({ isHovered }: { isHovered: boolean }) {
  return (
    <div
      className={cn(
        'absolute inset-0 transition-opacity duration-200',
        isHovered ? 'bg-black/0' : 'bg-black/40'
      )}
    />
  );
}

function BoxBorder({ isHovered }: { isHovered: boolean }) {
  return (
    <div
      className={cn(
        'absolute inset-0 rounded-lg',
        'transition-all duration-300',
        isHovered
          ? [
              'border-[1px] border-[#EAFD66]',
              'shadow-[0_0_10px_#EAFD66,inset_0_0_10px_#EAFD66]',
              'animate-pulse-subtle',
            ]
          : 'border border-white/20'
      )}
    />
  );
}

function BoxImageInfo({
  image,
  isLarge,
  isHovered,
}: {
  image: ImageInfo;
  isLarge: boolean;
  isHovered: boolean;
}) {
  return (
    <div
      className={cn(
        'absolute bottom-0 left-0 right-0 p-2 bg-black/80 text-white',
        'transition-transform duration-200',
        isHovered ? 'translate-y-0' : 'translate-y-full'
      )}
    >
      <p className="text-xs truncate">{image.title || '제목 없음'}</p>
      {isLarge && image.style && (
        <p className="text-xs text-primary mt-1">{image.style}</p>
      )}
    </div>
  );
}

export function FloatingBox({
  content,
  isLarge = false,
  onHover,
  image,
}: FloatingBoxProps) {
  const [isHovered, setIsHovered] = useState(false);
  const width = isLarge ? 264 : 132;
  const height = isLarge ? Math.floor(width * 1.25) : width;

  const handleMouseEnter = (e: React.MouseEvent) => {
    setIsHovered(true);
    onHover?.(true, e);
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    setIsHovered(false);
    onHover?.(false, e);
  };

  const getDetailUrl = (image: ImageInfo, isLarge: boolean) => {
    if (isLarge) {
      return `/details?imageId=${image.doc_id}`;
    }
    return `/details?imageId=${image.doc_id}&itemId=${image.item?.item?._id}&showList=true`;
  };

  return (
    <div
      className={cn(
        'relative rounded-lg overflow-hidden',
        'transition-all duration-300',
        'hover:border-primary group',
        'active:border-primary',
        'bg-white/[0.03] backdrop-blur-sm',
        'flex items-center justify-center',
        'cursor-pointer',
        'z-30',
        isLarge && '-translate-y-6'
      )}
      style={{
        width,
        height,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {image ? (
        <Link
          href={getDetailUrl(image, isLarge)}
          className="block w-full h-full"
        >
          {image.img_url ? (
            <BoxImage image={image} isLarge={isLarge} />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-white/20">
              <ImagePlaceholder className="w-12 h-12" />
            </div>
          )}
          <BoxOverlay isHovered={isHovered} />
          <BoxBorder isHovered={isHovered} />
          <BoxImageInfo
            image={image}
            isLarge={isLarge}
            isHovered={isHovered}
          />
        </Link>
      ) : (
        <>
          <div className="absolute inset-0 flex items-center justify-center text-white/20">
            <ImagePlaceholder className="w-12 h-12" />
          </div>
          <BoxBorder isHovered={isHovered} />
        </>
      )}
    </div>
  );
}
