"use client";

import { Point } from "@/types/model.d";
import { ImageMarker } from "@/components/ui/image-marker";
import { useImageMarker } from "@/lib/hooks/features/images/useImageMarker";
import { useState } from "react";

interface Step2Props {
  selectedImage: string | null;
  points: Point[];
  setPoints: (points: Point[]) => void;
}

function MarkerList({
  points,
  selectedPoint,
  onSelect,
  onUpdateContext,
}: {
  points: Point[];
  selectedPoint: Point | null;
  onSelect: (point: Point | null) => void;
  onUpdateContext: (point: Point, context: string) => void;
}) {
  return (
    <div className="bg-[#1A1A1A] rounded-lg p-4">
      <h3 className="text-xs font-medium text-gray-400 mb-3">
        선택한 아이템 목록
      </h3>
      <div className="space-y-2">
        {points.map((point, index) => (
          <div key={index} className="space-y-2">
            <button
              onClick={() => onSelect(point === selectedPoint ? null : point)}
              className={`w-full p-2.5 rounded-lg text-left text-xs transition-colors
                ${
                  selectedPoint === point
                    ? "bg-[#EAFD66]/10 border border-[#EAFD66]/30"
                    : "bg-gray-900/50 hover:bg-gray-900"
                }`}
            >
              <div className="flex items-center gap-3">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#EAFD66]/10 border border-[#EAFD66]/30 text-[#EAFD66] flex items-center justify-center text-[10px]">
                  {index + 1}
                </span>
                <span className="text-gray-400 truncate">
                  {point.context || "설명을 입력해주세요"}
                </span>
              </div>
            </button>

            {/* 선택된 아이템의 설명 입력 영역 */}
            {selectedPoint === point && (
              <div className="pl-8 pr-2">
                <textarea
                  className="w-full h-20 bg-gray-900/50 border border-gray-800 rounded-lg p-3 text-xs text-gray-300 placeholder-gray-600"
                  placeholder="찾고 싶은 아이템에 대해 설명해주세요"
                  value={point.context || ""}
                  onChange={(e) => onUpdateContext(point, e.target.value)}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function Step2({ selectedImage, points, setPoints }: Step2Props) {
  const { updatePointContext } = useImageMarker({
    initialPoints: points,
    onChange: setPoints,
  });

  const [selectedPoint, setSelectedPoint] = useState<Point | null>(null);

  const handleUpdateContext = (point: Point, context: string) => {
    const newPoints = points.map((p) => (p === point ? { ...p, context } : p));
    setPoints(newPoints);
    setSelectedPoint({ ...point, context });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg md:text-xl font-bold text-gray-400 text-center">
        궁금한 아이템을 선택해주세요
      </h2>

      <div className="flex gap-6 h-[427px]">
        <div className="w-[320px] flex-shrink-0">
          {selectedImage && (
            <div className="relative h-full rounded-lg overflow-hidden">
              <ImageMarker
                imageUrl={selectedImage}
                points={points}
                onPointsChange={setPoints}
                onPointContextChange={updatePointContext}
                onPointSelect={setSelectedPoint}
                showPointList={false}
              />
            </div>
          )}
        </div>

        <div className="flex-1 flex flex-col">
          <div className="bg-[#1A1A1A] rounded-lg divide-y divide-gray-800 mb-4">
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-5 h-5 rounded-full bg-[#EAFD66]/10 border border-[#EAFD66]/30 text-[#EAFD66] flex items-center justify-center text-xs">
                  !
                </span>
                <h3 className="text-xs font-medium text-gray-400">
                  필수 입력사항
                </h3>
              </div>
              <div className="ml-7">
                <p className="text-xs text-gray-500">
                  이미지를 클릭하여 궁금한 아이템의 위치를 표시해주세요
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  최소 1개 이상의 아이템을 선택해야 합니다
                </p>
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-5 h-5 rounded-full bg-gray-900 text-gray-400 flex items-center justify-center text-xs">
                  ?
                </span>
                <h3 className="text-xs font-medium text-gray-400">도움말</h3>
              </div>
              <div className="ml-7">
                <ul className="text-xs space-y-1 text-gray-500">
                  <li>
                    • 선택한 위치를 삭제하려면 마커에 마우스를 올린 후 X 버튼을
                    클릭하세요
                  </li>
                  <li>
                    • 선택한 아이템에 대한 설명은 아이템 정보에 도움이 됩니다
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {points.length > 0 ? (
            <div className="flex-1 min-h-0">
              <div className="h-full overflow-y-auto">
                <MarkerList
                  points={points}
                  selectedPoint={selectedPoint}
                  onSelect={setSelectedPoint}
                  onUpdateContext={handleUpdateContext}
                />
              </div>
            </div>
          ) : (
            <div className="bg-[#1A1A1A] rounded-lg p-4">
              <p className="text-xs text-gray-500 text-center">
                이미지를 클릭하여 궁금한 아이템을 선택해주세요
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
