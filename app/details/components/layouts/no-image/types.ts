import { HoverItem } from '@/types/model.d';

export interface NoImageItem extends HoverItem {
  info: HoverItem['info'] & {
    points: number;
  };
}

export interface NoImagePopupProps {
  item: NoImageItem;
  isVisible: boolean;
  position?: 'left' | 'right';
}

export interface NoImageButtonProps {
  onClick?: () => void;
  className?: string;
} 