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
