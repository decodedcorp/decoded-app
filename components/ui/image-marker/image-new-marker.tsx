"use client";

interface Position {
  x: number;
  y: number;
}

interface ImageNewMarkerProps {
  position: Position;
  onClick?: (e: React.MouseEvent) => void;
}

export function ImageNewMarker({ position, onClick }: ImageNewMarkerProps) {
  return (
    <div
      onClick={onClick}
      className="absolute w-4 h-4 -translate-x-1/2 -translate-y-1/2 cursor-pointer 
        hover:scale-125 transition-transform"
      style={{
        top: `${position.y}%`,
        left: `${position.x}%`,
      }}
    >
      <div className="absolute inset-0 border-2 border-yellow-400 rounded-full animate-pulse"></div>
      <div className="absolute inset-[2px] bg-yellow-400/30 rounded-full backdrop-blur-sm"></div>
    </div>
  );
} 