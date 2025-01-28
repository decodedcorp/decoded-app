'use client';

import { Point } from '@/types/model.d';
import { MarkerHeader } from './marker-header';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MarkerListProps {
  points: Point[];
  selectedPoint: Point | null;
  onSelect: (point: Point | null) => void;
  onUpdateContext: (point: Point, context: string | null) => void;
}

export function MarkerList({
  points,
  selectedPoint,
  onSelect,
  onUpdateContext,
}: MarkerListProps) {
  const isPointSelected = (p1: Point, p2: Point | null) => {
    if (!p2) return false;
    return p1.x === p2.x && p1.y === p2.y;
  };

  return (
    <div className="bg-[#1A1A1A] rounded-lg flex flex-col h-full">
      <MarkerHeader />
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto">
          <div className="p-2 space-y-2">
            {points.map((point, index) => (
              <div key={index}>
                <div
                  className={`w-full p-2.5 rounded-lg text-left text-xs transition-colors cursor-pointer
                    ${
                      isPointSelected(point, selectedPoint)
                        ? 'bg-[#EAFD66]/10 border border-[#EAFD66]/30'
                        : 'bg-gray-900/60 hover:bg-gray-900'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#EAFD66]/10 border border-[#EAFD66]/30 text-[#EAFD66] flex items-center justify-center text-[10px]">
                      {index + 1}
                    </span>
                    <div className="flex-1 flex items-center gap-2">
                      <input
                        value={point.context || ''}
                        onChange={(e) => onUpdateContext(point, e.target.value || null)}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelect(point);
                        }}
                        onFocus={() => onSelect(point)}
                        placeholder="설명을 입력해주세요"
                        className="flex-1 bg-transparent text-gray-400 outline-none placeholder:text-gray-600"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 text-gray-500 hover:text-gray-400"
                        onClick={(e) => {
                          e.stopPropagation();
                          onUpdateContext(point, null);
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
