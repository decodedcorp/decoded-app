'use client';

import { networkManager } from '@/lib/network/network';
import type { ImageData, DetailPageState, ItemDocument } from '../types/image';
import type { 
  RelatedImage, 
  TrendingImagesResponse,
  ArtistImagesResponse,
  BrandImagesResponse,
  APIResponse,
  ItemDetailResponse
} from '@/app/details/[imageId]/components/related-styling/types';

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

export interface RandomItemResource {
  _id: string;
  requester: string;
  requested_at: string;
  link_info: LinkInfo[] | null;
  metadata: ItemMetadata;
  img_url: string | null;
  like: number;
}

export interface RandomImageResource extends ImageData {
  _id: any;
  requested_items: {
    [key: string]: Array<{
      item_doc_id: string;
      position: {
        top: string;
        left: string;
      };
    }>;
  };
}

export interface RandomResourcesResponse {
  label: 'image' | 'item';
  resources: RandomImageResource[] | RandomItemResource[];
}


export const imagesAPI = {
  // Get image items
  getImageItems: async (imageId: string): Promise<APIResponse<ItemDocument[]>> => {
    try {
      const response = await networkManager.request(
        `images/${imageId}/items`,
        'GET'
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update image item
  updateImageItem: async (
    imageId: string,
    itemId: string,
    data: {
      links?: string[];
      provider?: string;
    }
  ): Promise<APIResponse<void>> => {
    try {
      const response = await networkManager.request(
        `images/${imageId}/items/${itemId}`,
        'PUT',
        data
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get featured images
  getFeaturedImages: async (): Promise<APIResponse<ImageData[]>> => {
    try {
      const response = await networkManager.request(
        'images/featured',
        'GET'
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get random resources (images or items)
  getRandomResources: async (limit: number = 10): Promise<APIResponse<RandomResourcesResponse>> => {
    try {
      const response = await networkManager.request(`random?limit=${limit}`, 'GET');
      return response;
    } catch (error) {
      throw error;
    }
  },

  getNewalImages: async (): Promise<APIResponse<TrendingImagesResponse>> => {
    try {
      const response = await networkManager.request('image', 'GET');
      return response;
    } catch (error) {
      throw error;
    }
  },

  getArtistImages: async (imageId: string, artistId: string): Promise<APIResponse<ArtistImagesResponse>> => {
    try {
      const response = await networkManager.request(`image/${imageId}/artist/${artistId}`, 'GET');
      return response;
    } catch (error) {
      throw error;
    }
  },

  getBrandImages: async (brandId: string): Promise<APIResponse<BrandImagesResponse>> => {
    try {
      const response = await networkManager.request(`item/related/${brandId}`, 'GET');
      return response;
    } catch (error) {
      throw error;
    }
  },

  getItemDetail: async (itemId: string): Promise<APIResponse<ItemDetailResponse>> => {
    try {
      const response = await networkManager.request(
        `item/${itemId}`,
        'GET'
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
};
