import { EmptyState } from './components/empty-state';
import { HelpSection } from './components/help-section';
import { InfoSection } from './components/info-section';
import { Point } from '@/types/model.d';
import { MarkerList } from './components/marker-list';

interface MarkerStepSidebarProps {
  points: Point[];
  selectedPoint: number | null;
  onSelect: (point: Point | null) => void;
  onUpdateContext: (point: Point, context: string) => void;
}

export function MarkerStepSidebar({
  points,
  selectedPoint,
  onSelect,
  onUpdateContext,
}: MarkerStepSidebarProps) {
  return (
    <div className="w-full flex flex-col h-full">
      <div className="flex flex-col h-full">
        <div className="bg-[#1A1A1A] rounded-lg divide-y divide-gray-800 mb-4 flex-shrink-0">
          <InfoSection />
          <HelpSection />
        </div>

        <div className="flex-1 overflow-hidden flex flex-col bg-[#1A1A1A] rounded-lg">
          {points.length > 0 ? (
            <div className="h-full overflow-y-auto">
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
            <div className="h-full flex-grow">
              <EmptyState />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
