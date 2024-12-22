export interface ItemInfo {
  category: string;
  description: string;
  point: number;
}

export interface HoverItem {
  id: string;
  info: ItemInfo;
  brands: string[];
  images: string[];
  pos: {
    x: number;
    y: number;
  };
}

export interface NoImageListItemProps {
  item: HoverItem;
} 