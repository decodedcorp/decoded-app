export interface Position {
  top: string;
  left: string;
}

export interface ItemMetadata {
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

export interface LinkInfo {
  url: string;
  label: string | null;
  date: string;
  provider: string;
  og_metadata: any | null;
  link_metadata: any | null;
}

export interface Item {
  _id: string;
  requester: string;
  requested_at: string;
  link_info: LinkInfo[] | null;
  metadata: ItemMetadata;
  img_url: string | null;
  like: number;
}

export interface DecodedItem {
  is_decoded: boolean;
  position: Position;
  item: {
    item: Item;
    brand_name: string | null;
    brand_logo_image_url: string | null;
  };
}

export interface ImageDetails {
  title: string | null;
  description: string;
  like: number;
  style: string | null;
  img_url: string;
  source: string | null;
  upload_by: string;
  doc_id: string;
  decoded_percent: number;
  items: {
    [key: string]: DecodedItem[];
  };
  metadata: {
    artistId: string;
    artistName: string;
  };
}

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

export interface ImageData {
  title: string | null;
  description: string;
  like: number;
  style: string | null;
  img_url: string;
  source: string | null;
  upload_by: string;
  doc_id: string;
  decoded_percent: number;
  items: {
    [key: string]: DecodedItem[];
  };
}

export interface DetailPageState extends ImageData {
  // Additional fields specific to detail page if needed
}

export interface ItemDocument {
  id: string;
  requester: string;
  requested_at: string;
  link_info: Array<{ url: string }>;
  metadata: {
    name: string;
    product_type: string;
    category: string;
    sub_category: string;
  };
  img_url: string;
  like: number;
}

export interface ItemDetailResponse {
  status_code: number;
  description: string;
  data: {
    docs: {
      _id: string;
      requester: string;
      requested_at: string;
      link_info: Array<{
        url: string;
        label: string | null;
        date: string;
        provider: string;
        og_metadata: null;
        link_metadata: null;
      }> | null;
      metadata: {
        name: string | null;
        description: string | null;
        brand: string | null;
        designed_by: string | null;
        material: string | null;
        color: string | null;
        item_class: string;
        item_sub_class: string;
        category: string | null;
        sub_category: string | null;
        product_type: string;
      };
      img_url: string;
      like: number;
    };
    next_id: string | null;
  };
}

export interface ProcessedImageData extends Omit<ImageDetails, 'items'> {
  items: DecodedItem[];
  doc_id: string;
  img_url: string;
  title: string | null;
  description: string;
  like: number;
  style: string | null;
  decoded_percent: number;
}

export interface ImageApiResponse {
  status_code: number;
  description: string;
  data: {
    image: ImageDetails;
  };
}
