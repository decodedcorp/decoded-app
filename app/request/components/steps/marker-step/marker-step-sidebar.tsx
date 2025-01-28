'use client';

import { EmptyState } from './components/empty-state';
import { HelpSection } from './components/help-section';
import { InfoSection } from './components/upload-info-section';
import { Point } from '@/types/model.d';
import { MarkerList } from './components/marker-list';
import { MarkerHeader } from './components/marker-header';

interface MarkerStepSidebarProps {
  points: Point[];
  selectedPoint: number | null;
  onSelect: (point: Point | null) => void;
  onUpdateContext: (point: Point, context: string | null) => void;
}

export function MarkerStepSidebar({
  points,
  selectedPoint,
  onSelect,
  onUpdateContext,
}: MarkerStepSidebarProps) {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="bg-[#1A1A1A] rounded-lg divide-y divide-gray-800 mb-4 flex-shrink-0">
        <InfoSection />
        <HelpSection />
      </div>

      <div className="flex-1 bg-[#1A1A1A] rounded-lg">
        {points.length > 0 ? (
          <div className="h-[280px] overflow-y-auto px-4 py-2">
            <MarkerList
              points={points}
              selectedPoint={
                selectedPoint !== null ? points[selectedPoint] : null
              }
              onSelect={onSelect}
              onUpdateContext={onUpdateContext}
            />
          </div>
        ) : (
          <div className="h-[280px] overflow-y-auto px-4 py-2">
            <EmptyState />
          </div>
        )}
      </div>
    </div>
  );
}
