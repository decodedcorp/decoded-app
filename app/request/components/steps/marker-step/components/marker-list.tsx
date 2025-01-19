'use client';

import { Point } from '@/types/model.d';
import { MarkerListProps } from '../types';
import { MarkerHeader } from './marker-header';
import { MarkerTextarea } from './marker-textarea';

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
              <div key={index} className="space-y-2">
                <div
                  onClick={() =>
                    onSelect(isPointSelected(point, selectedPoint) ? null : point)
                  }
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
                    <span className="text-gray-400 truncate">
                      {point.context || '설명을 입력해주세요'}
                    </span>
                  </div>
                </div>

                {isPointSelected(point, selectedPoint) && (
                  <MarkerTextarea 
                    point={point}
                    onUpdateContext={onUpdateContext}
                    onSelect={onSelect}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
