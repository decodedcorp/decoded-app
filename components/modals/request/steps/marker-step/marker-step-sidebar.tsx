"use client";

import { Point } from "@/types/model.d";
import { MousePointerClick, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocaleContext } from "@/lib/contexts/locale-context";

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
  const { t } = useLocaleContext();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const hasSeenGuide = localStorage.getItem("hasSeenMarkerGuide");
    if (hasSeenGuide) {
      setIsVisible(false);
    }
  }, []);

  if (!isVisible) return null;

  return (
    <div className="absolute top-0 left-1/2 -translate-x-1/2 z-50">
      <div className="w-[24rem] bg-[#1A1A1A]/95 backdrop-blur-sm rounded-lg border border-zinc-800/50">
        <div className="flex justify-end p-1">
          <button
            onClick={() => setIsVisible(false)}
            className="p-1 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-zinc-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-4 pb-3">
          <div className="flex items-start gap-3">
            <div className="p-1.5 rounded-lg bg-[#EAFD66]/10 shrink-0">
              <MousePointerClick className="w-4 h-4 text-[#EAFD66]" />
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-white/80">
                {t.request.steps.marker.guide.required.title}
              </h3>
              <div className="text-xs text-zinc-400 space-y-1">
                {t.request.steps.marker.guide.required.description.map(
                  (desc, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <span className="text-[#EAFD66]">•</span>
                      <p>{desc}</p>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
