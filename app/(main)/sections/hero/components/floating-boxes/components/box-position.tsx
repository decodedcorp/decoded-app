import { FloatingBox } from '../floating-box';
import type { RandomImageResource, RandomItemResource } from '@/lib/api/client/images';

interface BoxPositionProps {
  top: number;
  left?: number;
  right?: number;
  isLarge?: boolean;
  image?: RandomImageResource | RandomItemResource;
  onHover?: (
    isHovered: boolean,
    event?: React.MouseEvent,
    isLarge?: boolean
  ) => void;
}

export function BoxPosition({
  top,
  left,
  right,
  isLarge,
  image,
  onHover,
}: BoxPositionProps) {
  if (!image) return null;

  return (
    <div
      className="absolute"
      style={{
        top: `${top}%`,
        ...(left !== undefined ? { left: `${left}%` } : {}),
        ...(right !== undefined ? { right: `${right}%` } : {}),
      }}
    >
      <FloatingBox
        resource={image}
        initialDelay={0}
        depthLevel={isLarge ? 1 : 2}
        position={{ x: 0, y: 0 }}
        onHover={(isHovered, event) => onHover?.(isHovered, event, isLarge)}
      />
    </div>
  );
}
