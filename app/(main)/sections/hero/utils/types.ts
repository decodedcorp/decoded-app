import { ImageMetadata } from '@/lib/api/types/image';

export type BoxSizeMode = 'LARGE' | 'SMALL';

export interface BoxPosition {
  LEFT_BOTTOM?: {
    top: number;
    left: number;
  };
  RIGHT_TOP?: {
    top: number;
    right: number;
  };
  RIGHT_BOTTOM?: {
    top: number;
    right: number;
  };
}

export interface BoxNumberPosition {
  BOX_1?: boolean;
  BOX_2?: boolean;
  BOX_3?: boolean;
  BOX_4?: boolean;
  BOX_5?: boolean;
  BOX_6?: boolean;
  BOX_7?: boolean;
  BOX_8?: boolean;
  BOX_9?: boolean;
  BOX_10?: boolean;
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
  isLarge?: boolean;
}
