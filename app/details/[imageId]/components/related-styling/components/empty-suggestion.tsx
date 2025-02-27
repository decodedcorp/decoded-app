import { SearchIcon } from "lucide-react";

export function EmptySuggestion() {
  return (
    <div className="aspect-[4/5] bg-gray-800/30 rounded-lg overflow-hidden flex flex-col items-center justify-center p-4 border border-gray-700/50">
      <div className="w-12 h-12 rounded-full bg-gray-700/50 flex items-center justify-center mb-3">
        <SearchIcon className="w-6 h-6 text-gray-400" />
      </div>
      <p className="text-gray-400 text-center text-sm">
        더 많은 스타일링을 준비 중입니다
      </p>
    </div>
  );
} 