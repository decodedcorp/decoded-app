import { cn } from '@/lib/utils/style';
import { CELL_SIZE } from '../../utils/constants';

interface GridCellProps {
  className?: string;
  isHighlighted?: boolean;
  opacity?: number;
}

export function GridCell({ className, isHighlighted, opacity = 0 }: GridCellProps) {
  return (
    <div
      className={cn(
        'border-r border-b border-solid',
        'transition-all duration-500',
        className
      )}
      style={{ 
        width: CELL_SIZE, 
        height: CELL_SIZE,
        borderWidth: '1px',
        borderColor: isHighlighted 
          ? `rgb(226, 255, 125, ${Math.min(1, opacity * 1.5)})`
          : `rgb(255 255 255 / 0.12)`,
        backgroundColor: isHighlighted 
          ? `rgb(0 0 0 / ${1 - opacity * 0.2})`
          : `rgb(0 0 0 / 0.8)`,
      }}
    />
  );
} 