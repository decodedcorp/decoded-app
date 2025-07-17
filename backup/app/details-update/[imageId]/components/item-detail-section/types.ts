export interface LinkInfo {
  value: string;
  label: string | null;
  date: string;
  provider: string;
  og_metadata: null;
  link_metadata: {
    is_payout: null;
    price: null;
    currency: null;
    is_soldout: null;
    is_affiliated: null;
  } | null;
  status: 'pending' | 'confirmed';
}

export interface ItemDetailData {
  docs: {
    _id: string;
    requester: string;
    requested_at: string;
    links: LinkInfo[];
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
  metadata: {
    brand: string | null;
  };
}

export interface ItemDetailResponse {
  status_code: number;
  description: string;
  data: {
    docs: {
      _id: string;
      requester: string;
      requested_at: string;
      links: LinkInfo[];
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
    };
    metadata: {
      brand: string;
    };
    next_id: string | null;
  };
}
