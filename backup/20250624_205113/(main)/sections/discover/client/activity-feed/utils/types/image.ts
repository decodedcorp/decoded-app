interface Position {
  top: string;
  left: string;
}

interface LinkInfo {
  url: string;
  label: string | null;
  date: string;
  provider: string;
  og_metadata: any | null;
  link_metadata: any | null;
}

interface ItemMetadata {
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
}

interface DecodedItem {
  _id: string;
  requester: string;
  requested_at: string;
  link_info: LinkInfo[] | null;
  metadata: ItemMetadata;
  img_url: string | null;
  like: number;
}

interface ItemWithBrand {
  item: DecodedItem;
  brand_name: string | null;
  brand_logo_image_url: string | null;
}

interface DecodedPosition {
  is_decoded: boolean;
  position: Position;
  item: ItemWithBrand;
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
  items: Record<string, DecodedPosition[]>;
}

// New interfaces for the images API response
export interface ImageItem {
  image_doc_id: string;
  image_url: string;
  items: number;
  at: string;
}

export interface ImagesResponse {
  images: ImageItem[];
  maybe_next_id: string | null;
}

export interface APIImageResponse {
  status_code: number;
  description: string;
  data: ImagesResponse;
} 