export interface ExploreImage {
  image_doc_id: string;
  image_url: string;
  positions?: Array<{ top: number; left: number }>;
}

export interface ExploreCategory {
  keyword: string;
  images: ExploreImage[];
}

export interface ExploreResponse {
  explore_images: ExploreCategory[];
}

export interface ExploreProps {
  position: 'left-main' | 'right-main';
  of: 'identity' | 'brand';
}
