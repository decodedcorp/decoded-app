export function InfoSection() {
  return (
    <div className="p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="w-5 h-5 rounded-full bg-[#EAFD66]/10 border border-[#EAFD66]/30 text-[#EAFD66] flex items-center justify-center text-xs">
          !
        </span>
        <h3 className="text-xs font-medium text-gray-400">필수 입력사항</h3>
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
  );
}
