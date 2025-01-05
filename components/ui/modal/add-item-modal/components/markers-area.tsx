import { MarkersAreaProps } from "../types";

export function MarkersArea({ newMarkers, setNewMarkers }: MarkersAreaProps) {
  return (
    <div className="space-y-2 w-full max-w-[380px] mx-auto">
      {newMarkers.map((marker, idx) => (
        <div
          key={idx}
          className="relative flex items-center p-3 bg-gray-50 rounded-lg w-full"
        >
          <div
            className="flex-shrink-0 w-5 h-5 flex items-center justify-center 
            bg-blue-500 text-white rounded-full font-medium text-xs"
          >
            {idx + 1}
          </div>

          <div className="flex-1 px-3">
            <span className="text-xs text-gray-500">
              아이템 위치 {idx + 1}
            </span>
          </div>

          {/* Delete Button */}
          <button
            onClick={() => setNewMarkers((prev) => prev.filter((_, i) => i !== idx))}
            className="flex-shrink-0 p-1 rounded-full 
             hover:bg-gray-200 text-gray-400 hover:text-red-500 
             transition-colors duration-200"
            title="삭제"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
} 