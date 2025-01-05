import { ImageMetadata } from '@/lib/api/types/image';

export type BoxPosition = {
  LEFT_TOP?: { top: number; left: number };
  LEFT_BOTTOM?: { top: number; left: number };
  RIGHT_TOP?: { top: number; right: number };
  RIGHT_BOTTOM?: { top: number; right: number };
};

export interface BoxContent {
  // Empty interface for future use if needed
}

export interface ImageInfo {
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
      metadata: ImageMetadata;
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

export interface FloatingBoxProps {
  className?: string;
  style?: React.CSSProperties;
  content: BoxContent;
  isLarge?: boolean;
} 