import { cn } from '@/lib/utils/style';

interface BoxBorderProps {
  isHovered: boolean;
}

export function BoxBorder({ isHovered }: BoxBorderProps) {
  return (
    <div
      className={cn(
        'absolute inset-0 rounded-lg',
        'transition-all duration-300',
        isHovered
          ? [
              'border-[1px] border-[#EAFD66]',
              'shadow-[0_0_10px_#EAFD66,inset_0_0_10px_#EAFD66]',
              'animate-pulse-subtle',
            ]
          : 'border border-white/20'
      )}
    />
  );
} 