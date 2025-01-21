import { MarkersAreaProps } from '../types';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export function MarkersArea({ newMarkers, setNewMarkers }: MarkersAreaProps) {
  return (
    <div className="space-y-2 w-full max-w-[380px] mx-auto">
      {newMarkers.map((marker, idx) => (
        <div
          key={idx}
          className="relative flex items-center p-3 bg-secondary/50 rounded-lg w-full border border-border"
        >
          <div
            className="flex-shrink-0 w-5 h-5 flex items-center justify-center 
            bg-primary text-primary-foreground rounded-full font-medium text-xs"
          >
            {idx + 1}
          </div>

          <div className="flex-1 px-3">
            <span className="text-xs text-muted-foreground">
              아이템 위치 {idx + 1}
            </span>
          </div>

          <Button
            onClick={() =>
              setNewMarkers((prev) => prev.filter((_, i) => i !== idx))
            }
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive 
              hover:bg-destructive/10"
            title="삭제"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}
