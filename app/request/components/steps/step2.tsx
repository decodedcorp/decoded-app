"use client";

import { Point } from "@/types/model.d";
import { ImageMarker } from "@/components/ui/image-marker";
import { useImageMarker } from "@/lib/hooks/features/images/useImageMarker";

interface Step2Props {
  selectedImage: string | null;
  points: Point[];
  setPoints: (points: Point[]) => void;
}

export function Step2({ selectedImage, points, setPoints }: Step2Props) {
  const { updatePointContext } = useImageMarker({
    initialPoints: points,
    onChange: setPoints,
  });

  return (
    <div className="space-y-6">
      <h2 className="text-lg md:text-xl font-bold text-gray-400 text-center">
        궁금한 아이템을 선택해주세요
      </h2>

      <div className="max-w-sm mx-auto space-y-2 text-gray-600">
        <p className="text-xs text-gray-500">
          이미지를 클릭하여 궁금한 아이템의 위치를 표시해주세요
        </p>
        <div className="bg-[#1A1A1A] rounded-lg p-3">
          <p className="text-xs font-medium text-gray-400">필수 입력사항</p>
          <div className="mt-2 flex items-start space-x-2">
            <div className="w-4 h-4 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center flex-shrink-0 mt-0.5 text-xs">
              1
            </div>
            <div>
              <p className="text-xs font-medium text-gray-400">아이템 선택</p>
              <p className="text-xs text-gray-600">
                최소 1개 이상의 아이템을 선택해주세요
              </p>
            </div>
          </div>
        </div>
        <div className="bg-[#1A1A1A] rounded-lg p-3 text-xs text-gray-400">
          <p className="font-medium">주의사항</p>
          <ul className="mt-1 text-xs space-y-1 list-disc list-inside text-gray-500">
            <li>최소 1개 이상의 아이템을 선택해야 합니다</li>
            <li>
              선택한 위치를 삭제하려면 마커에 마우스를 올린 후 X 버튼을
              클릭하세요
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-sm mx-auto">
        {selectedImage && (
          <div className="relative aspect-[4/5]">
            <ImageMarker
              imageUrl={selectedImage}
              points={points}
              onPointsChange={setPoints}
              onPointContextChange={updatePointContext}
            />
          </div>
        )}

        {points.length === 0 && (
          <div className="mt-4 text-center text-xs text-gray-500">
            이미지를 클릭하여 궁금한 아이템을 선택해주세요
          </div>
        )}
      </div>
    </div>
  );
}
