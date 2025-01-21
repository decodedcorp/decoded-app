export interface LinkInfo {
  url: string;
  label: string | null;
  date: string;
  provider: string;
  og_metadata: null;
  link_metadata: null;
}

export interface ItemDetailData {
  id: string;
  requester: string;
  requested_at: string;
  link_info: LinkInfo[];
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
  img_url: string;
  like: number;
} 