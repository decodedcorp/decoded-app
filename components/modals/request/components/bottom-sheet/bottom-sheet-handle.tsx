import { forwardRef } from "react";

interface BottomSheetHandleProps {
  onMouseDown: (e: React.MouseEvent) => void;
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: () => void;
}

export const BottomSheetHandle = forwardRef<HTMLDivElement, BottomSheetHandleProps>(
  ({ onMouseDown, onTouchStart, onTouchMove, onTouchEnd }, ref) => {
    return (
      <div
        ref={ref}
        className="h-[40px] flex items-center justify-center cursor-grab active:cursor-grabbing"
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="w-12 h-1 bg-gray-600 rounded-full" />
      </div>
    );
  }
);

BottomSheetHandle.displayName = "BottomSheetHandle"; 