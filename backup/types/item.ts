export interface ItemDetailResponse {
  id: string;
  name: string;
  description?: string;
  price?: number;
  url: string;
  affiliateUrl?: string;
  imageUrl: string;
  brand?: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ItemListResponse {
  items: ItemDetailResponse[];
  total: number;
  page: number;
  limit: number;
}

export interface ItemCreateRequest {
  name: string;
  description?: string;
  price?: number;
  url: string;
  imageUrl: string;
  brand?: string;
  category?: string;
}

export interface ItemUpdateRequest extends Partial<ItemCreateRequest> {
  id: string;
}
