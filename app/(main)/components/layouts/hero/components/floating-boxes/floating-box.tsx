import { cn } from '@/lib/utils';
import { BoxContent } from './types';
import { PointIcon } from '@/components/ui/icons/point-icon';

interface FloatingBoxProps {
  content: BoxContent;
  isLarge?: boolean;
  onHover?: (isHovered: boolean, event?: React.MouseEvent) => void;
}

export function FloatingBox({
  content,
  isLarge = false,
  onHover,
}: FloatingBoxProps) {
  const size = isLarge ? 264 : 132;
  const iconSize = isLarge ? 96 : 48;

  return (
    <div className="flex flex-col items-center">
      <div
        className={cn(
          'border border-white/20',
          'rounded-lg',
          'transition-all duration-300',
          'hover:border-primary group',
          'active:border-primary',
          'bg-white/[0.03] backdrop-blur-sm',
          'flex items-center justify-center',
          'cursor-pointer',
          'z-30'
        )}
        style={{
          width: size,
          height: size,
        }}
        onMouseEnter={(e) => onHover?.(true, e)}
        onMouseLeave={(e) => onHover?.(false, e)}
      >
        <div className="flex flex-col items-center gap-2">
          <PointIcon
            className={cn(
              'text-white/50 transition-colors duration-300 group-hover:text-primary',
              isLarge ? 'w-12 h-12' : 'w-10 h-10'
            )}
          />
          <span className={cn('font-medium', isLarge ? 'text-2xl' : 'text-lg')}>
            {content.title}
          </span>
        </div>
      </div>
      {content.subtitle && (
        <span
          className={cn(
            'mt-4 text-muted-foreground',
            isLarge ? 'text-base' : 'text-sm'
          )}
        >
          {content.subtitle}
        </span>
      )}
    </div>
  );
}
