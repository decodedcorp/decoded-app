import { MarkerHeader } from './marker-header';

export function EmptyState() {
  return (
    <div className="flex flex-col h-full">
      <MarkerHeader />
      <div className="flex-1 flex items-center justify-center p-4">
        <p className="text-xs text-gray-500 text-center">
          이미지를 클릭하여 궁금한 아이템을 선택해주세요
        </p>
      </div>
    </div>
  );
} 