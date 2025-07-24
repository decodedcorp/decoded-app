// MasonryGrid에서 사용하는 타입 정의

export interface MasonryItem {
  title: string;
  imageUrl?: string;
  category: string;
  editors: Array<{ name: string; avatarUrl: string }>;
  date: string;
  isNew: boolean;
  isHot: boolean;
}

export interface CtaCardType {
  type: 'cta';
  id: string;
  ctaIdx: number;
}

export interface EmptyItemType {
  type: 'empty';
  id: string;
  title: string;
  category?: string;
}

export interface Editor {
  name: string;
  avatarUrl?: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface GridItemProps {
  imageUrl?: string;
  title: string;
  category?: string;
  editors?: Editor[];
  date?: string;
  isNew?: boolean;
  isHot?: boolean;
  avatarBorder?: string;
  // 채널 추가 기능을 위한 props
  isEmpty?: boolean;
  onAddChannel?: () => void;
  // 채널 클릭 기능을 위한 props
  onChannelClick?: () => void;
}
