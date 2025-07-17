import { cn } from "@/lib/utils/style";
import { BottomSheetHandle } from "./bottom-sheet-handle";

interface BottomSheetProps {
  isOpen: boolean;
  isDragging: boolean;
  currentDragY: number;
  bottomSheetRef: React.RefObject<HTMLDivElement>;
  onMouseDown: (e: React.MouseEvent) => void;
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: () => void;
  children: React.ReactNode;
}

export function BottomSheet({
  isOpen,
  isDragging,
  currentDragY,
  bottomSheetRef,
  onMouseDown,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  children
}: BottomSheetProps) {
  return (
    <div
      className={cn(
        "md:hidden fixed bottom-0 left-0 right-0",
        "bg-[#1A1A1A] rounded-t-2xl",
        "transition-all duration-300 ease-out",
        "shadow-[0_-4px_20px_rgba(0,0,0,0.3)]",
        "z-50",
        isOpen ? "translate-y-0" : "translate-y-[calc(100%-40px)]",
        isDragging && "transition-none"
      )}
      style={{
        transform: isDragging 
          ? `translateY(${currentDragY}px)` 
          : isOpen 
            ? 'translateY(0)' 
            : 'translateY(calc(100% - 40px))',
        willChange: 'transform'
      }}
    >
      <BottomSheetHandle
        ref={bottomSheetRef}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      />
      <div className="h-[60vh] overflow-y-auto">
        {children}
      </div>
    </div>
  );
} 