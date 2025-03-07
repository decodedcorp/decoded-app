export interface AccountData {
  points: number;
  active_ticket_num: number;
  request_num: number;
  provide_num: number;
  pending_num: number;
}

export interface RequestItem {
  category: string | null;
  is_provided: boolean;
}

export interface RequestImage {
  image_doc_id: string;
  image_url: string;
  items: RequestItem[];
  provided_num: number;
}

export interface RequestData {
  request_num: number;
  requests: RequestImage[];
  next_id: string | null;  // 페이지네이션을 위한 next_id
}

export interface ProvideData {
  provide_num: number;
  provides: Array<any> | null;  // 실제 provide 데이터 구조가 필요할 때 더 구체적으로 정의
  next_id: string | null;
}

export interface LikedImage {
  image_doc_id: string;
  image_url: string;
}

export interface LikedItem {
  item_doc_id: string;
  image_url: string | null;
  name: string | null;
  item_category: string;
}

export interface LikeData {
  images: {
    likes: LikedImage[];
    next_id: string | null;
  };
  items: {
    likes: LikedItem[];
    next_id: string | null;
  };
}

export type TabType = 'home' | 'request' | 'provide' | 'like';
