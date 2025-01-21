interface StylingSectionProps {
  // 추후 데이터 타입 추가 예정
}

export function StylingSection({}: StylingSectionProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-white text-2xl font-bold">다니엘의 STYLING</h2>
          <p className="text-gray-400 mt-1">아티스트의 다양한 스타일을 확인해보세요</p>
        </div>
        <div className="text-gray-400">
          <span>1 / 2</span>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div 
            key={i} 
            className="aspect-[3/4] bg-gray-800 rounded-lg overflow-hidden"
          />
        ))}
      </div>
    </div>
  );
} 