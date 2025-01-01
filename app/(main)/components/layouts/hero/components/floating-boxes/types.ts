export type BoxPosition = {
  LEFT_TOP?: { top: number; left: number };
  LEFT_BOTTOM?: { top: number; left: number };
  RIGHT_TOP?: { top: number; right: number };
  RIGHT_BOTTOM?: { top: number; right: number };
};

export type BoxContent = {
  icon: string;
  title: string;
  subtitle?: string;
  isLarge?: boolean;
};

export interface FloatingBoxProps {
  className?: string;
  style?: React.CSSProperties;
  content: BoxContent;
  isLarge?: boolean;
} 