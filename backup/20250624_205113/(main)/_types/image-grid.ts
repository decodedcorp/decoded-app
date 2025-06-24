export interface ApiImage {
  image_doc_id: string;
  image_url: string;
  items: number;
  at: string;
}

export interface ApiResponse {
  status_code: number;
  description: string;
  data: {
    images: ApiImage[];
    maybe_next_id: string | null;
  };
}

export interface ImageItemData {
  id: string;
  row: number;
  col: number;
  src: string;
  alt: string;
  left: number;
  top: number;
  loaded: boolean;
  image_doc_id: string;
  width?: number;
  height?: number;
  likes?: number;
  x: number;
  y: number;
  priority?: 'high' | 'low';
}

// --- Interfaces for Image Detail API ---
export interface ItemLinkMetadata {
  is_payout: boolean | null;
  price: number | null;
  currency: string | null;
  is_soldout: boolean | null;
  is_affiliated: boolean | null;
}

export interface ItemLink {
  value: string;
  label: string;
  date: string;
  provider: string;
  og_metadata: any | null; // Replace 'any' with a more specific type if available
  link_metadata: ItemLinkMetadata;
  status: string;
}

export interface ItemMetadata {
  name: string;
  description: string | null;
  brand: string; // brand_id
  designed_by: string | null;
  material: string | null;
  color: string | null;
  item_class: string;
  item_sub_class: string;
  category: string;
  sub_category: string;
  product_type: string;
}

export interface DecodedItemInfo {
  _id: string;
  requester: string;
  requested_at: string;
  links: ItemLink[];
  metadata: ItemMetadata;
  img_url: string;
  like: number;
  created_at: string;
}

export interface BrandInfo {
  item: DecodedItemInfo;
  brand_name: string;
  brand_logo_image_url: string;
}

export interface DecodedItemPosition {
  top: string;
  left: string;
}

export interface DecodedItem {
  is_decoded: boolean;
  position: DecodedItemPosition;
  item: BrandInfo;
}

export interface DecodedItemContainer {
  [key: string]: DecodedItem[];
}

export interface ImageDetailMetadata {
  [key: string]: string | boolean | undefined;
  profile_image_url?: string;
}

export interface ImageDetail {
  title: string | null;
  context: string | null;
  description: string | null;
  like: number;
  style: string | null;
  img_url: string;
  source: string | null;
  upload_by: string;
  doc_id: string;
  items: DecodedItemContainer;
  metadata: ImageDetailMetadata;
}

export interface ImageDetailDataWrapper {
  image: ImageDetail;
}

export interface ImageDetailResponse {
  status_code: number;
  description: string;
  data: ImageDetailDataWrapper;
}
// --- End of Interfaces for Image Detail API ---

export interface LoadedGrid {
  rows: { min: number; max: number };
  cols: { min: number; max: number };
} 