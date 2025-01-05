export default function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center py-20 min-h-[400px]">
      <div className="text-center space-y-4">
        {/* 아이콘 */}
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#EAFD66]/10 mb-2">
          <svg
            className="w-6 h-6 text-[#EAFD66]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M13.5 3H12H8C6.34315 3 5 4.34315 5 6V18C5 19.6569 6.34315 21 8 21H16C17.6569 21 19 19.6569 19 18V8.625M13.5 3L19 8.625M13.5 3V7.625C13.5 8.17728 13.9477 8.625 14.5 8.625H19"
            />
          </svg>
        </div>

        {/* 메인 텍스트 */}
        <div className="space-y-1.5">
          <p className="text-white/80 text-sm font-medium">
            아직 제공된 정보가 없어요
          </p>
          <p className="text-zinc-500 text-xs leading-relaxed">
            이 아이템의 첫 번째 정보 제공자가 되어보세요!
            <br />
            정확한 정보 제공 시
            <span className="text-[#EAFD66] ml-1">포인트가 지급</span>
            됩니다
          </p>
        </div>
      </div>
    </div>
  );
}
