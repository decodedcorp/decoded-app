import { cn } from '@/lib/utils/style';

interface BoxOverlayProps {
  isHovered: boolean;
}

export function BoxOverlay({ isHovered }: BoxOverlayProps) {
  return (
    <div
      className={cn(
        'absolute inset-0 transition-opacity duration-200',
        isHovered ? 'bg-black/0' : 'bg-black/40'
      )}
    />
  );
} 