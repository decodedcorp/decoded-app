export function Caution() {
  return (
    <div className="flex bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-2.5 w-full">
      <div className="flex gap-2">
        <svg
          className="h-4 w-4 text-yellow-400 flex-shrink-0 mt-0.5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
        <div className="space-y-1.5">
          <div className="space-y-1">
            <h3 className="text-xs font-medium text-yellow-800">
              아이템 요청 시 주의사항
            </h3>
            <ul className="text-[11px] leading-normal text-yellow-700 list-disc pl-3.5 space-y-0.5">
              <li>잘못된 카테고리 선택은 반려될 수 있습니다</li>
              <li>각 요청 건당 포인트가 차감됩니다</li>
              <li>이미 요청된 카테고리는 제외해 주세요</li>
            </ul>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-yellow-800">
            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium">
              신중한 요청이 더 나은 서비스로 이어집니다
            </span>
          </div>
        </div>
      </div>
    </div>
  );
} 