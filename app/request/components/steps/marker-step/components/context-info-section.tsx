export function InfoSection() {
  return (
    <div className="p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="w-5 h-5 rounded-full bg-[#EAFD66]/10 border border-[#EAFD66]/30 text-[#EAFD66] flex items-center justify-center text-xs">
          !
        </span>
        <h3 className="text-xs font-medium text-gray-400">선택 입력사항</h3>
      </div>
      <div className="ml-7">
        <p className="text-xs text-gray-500">
          선택적으로 추가 정보를 입력해 주세요. 사진의 맥락을 강화하는 데 사용됩니다.
        </p>
      </div>
    </div>
  );
}
