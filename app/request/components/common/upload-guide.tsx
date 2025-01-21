export function UploadGuide() {
  return (
    <div className="h-full bg-[#1A1A1A] flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-[280px] mx-auto">
        <div className="mb-10 text-center">
          <svg
            className="w-12 h-12 text-gray-500 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-sm font-medium text-gray-400 mb-2">
            이미지를 업로드해주세요
          </p>
          <p className="text-xs text-gray-500">
            클릭하여 이미지를 선택하거나 드래그앤드롭 하세요
          </p>
        </div>

        <div className="space-y-5">
          <div className="flex items-start gap-3.5">
            <span className="w-5 h-5 rounded-full bg-[#EAFD66]/10 border border-[#EAFD66]/30 text-[#EAFD66] flex items-center justify-center text-xs flex-shrink-0 mt-1">
              !
            </span>
            <div className="space-y-1.5">
              <h3 className="text-xs font-medium text-gray-400">
                필수 입력사항
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                아이템을 찾고 싶은 이미지를 업로드해주세요
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <span className="w-5 h-5 rounded-full bg-gray-900 text-gray-400 flex items-center justify-center text-xs flex-shrink-0 mt-1">
              ?
            </span>
            <div className="space-y-1.5">
              <h3 className="text-xs font-medium text-gray-400">
                도움말
              </h3>
              <ul className="text-xs space-y-1.5 text-gray-500">
                <li>• 최대 5MB까지 업로드 가능</li>
                <li>• jpg, jpeg, png 형식만 가능</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
