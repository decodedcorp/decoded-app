import { HoverItem as ModelHoverItem } from '@/types/model.d';

export interface ItemInfo {
  name: string;
  category: string;
  description: string;
  point: number;
  brands?: string[];
  hyped: number;
}

export type HoverItem = ModelHoverItem;

export interface NoImageListItemProps {
  item: HoverItem;
} 