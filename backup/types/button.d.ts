import { DetailPageState } from '@/types/model.d';

export interface BaseButtonProps {
  className?: string;
  position?: 'left' | 'right';
}

export interface ItemButtonProps extends BaseButtonProps {
  item: NonNullable<DetailPageState['itemList']>[number];
  isActive: boolean;
}
