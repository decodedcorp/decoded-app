export interface ImageMetadata {
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
}

export interface ImageItem {
  _id: string;
  requester: string;
  requested_at: string;
  link_info: any;
  metadata: ImageMetadata;
  img_url: string | null;
  like: number;
}

export interface DecodedItem {
  is_decoded: boolean;
  position: {
    top: string;
    left: string;
  };
  item: {
    item: ImageItem;
    brand_name: string | null;
    brand_logo_image_url: string | null;
  };
}

export interface ImageData {
  title: string | null;
  description: string | null;
  like: number;
  style: string | null;
  img_url: string;
  source: string | null;
  upload_by: string;
  doc_id: string;
  decoded_percent: number;
  items?: Record<string, DecodedItem[]>;
  img?: {
    title?: string;
    description?: string;
    items?: Record<string, DecodedItem[]>;
  };
  itemList?: Array<{
    imageDocId: string;
    info: {
      item: {
        item: {
          _id: string;
          name: string;
          description?: string;
          img_url?: string;
          price?: number;
          metadata?: ImageMetadata;
        };
        brand_name?: string;
        brand_logo_image_url?: string | null;
      };
    };
    pos: {
      top: number;
      left: number;
    };
  }>;
}

export interface DetailPageState extends ImageData {
  // Additional fields specific to detail page if needed
}

export interface ItemDocument {
  _id: string;
  item: ImageItem;
  brand_name: string | null;
  brand_logo_image_url: string | null;
}
