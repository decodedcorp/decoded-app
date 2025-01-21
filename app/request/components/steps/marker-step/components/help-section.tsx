export function HelpSection() {
  return (
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
  );
} 