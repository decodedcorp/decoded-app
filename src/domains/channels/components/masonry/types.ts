export interface Editor {
  name: string;
  avatar: string | null;
}

export interface Item {
  id: string;
  img: string;
  url: string;
  title?: string;
  category?: string;
  editors?: Editor[];
  width: number;
  height: number;
  aspectRatio?: number;
  
  // API 응답에서 추가되는 필드들
  description?: string | null;
  owner_id?: string;
  subscriber_count?: number;
  content_count?: number;
  created_at?: string;
  updated_at?: string | null;
  is_subscribed?: boolean;
}

export interface MasonryProps {
  items: Item[];
  ease?: string;
  duration?: number;
  stagger?: number;
  animateFrom?: string;
  scaleOnHover?: boolean;
  hoverScale?: number;
  blurToFocus?: boolean;
  colorShiftOnHover?: boolean;
  onItemClick?: (item: Item) => void;
}
