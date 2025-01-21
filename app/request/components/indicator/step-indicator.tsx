interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

// 스텝별 텍스트 정의
const STEP_MESSAGES = {
  1: "이미지를 업로드해주세요",
  2: "궁금한 아이템을 선택해주세요",
  3: "사진에 대한 더 많은 정보를 알려주세요"
} as const;

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="w-full mb-8">
      <div className="relative pt-1">
        {/* 프로그레스 바 컨테이너 - 너비 조정 */}
        <div className="max-w-[160px] mx-auto relative">
          {/* 프로그레스 바 */}
          <div className="absolute top-[9px] w-full">
            <div className="h-[1.5px] bg-gray-800">
              <div
                className="h-[1.5px] bg-[#EAFD66] transition-all duration-500 relative"
                style={{
                  width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* 스텝 마커들 */}
          <div className="flex items-center justify-between">
            {[...Array(totalSteps)].map((_, index) => (
              <div key={index} className="relative">
                {/* 현재 스텝의 링 애니메이션 */}
                {currentStep === index + 1 && (
                  <>
                    <div className="absolute -inset-1.5 rounded-full border-[1.5px] border-[#EAFD66]/20 animate-ping" />
                    <div className="absolute -inset-1.5 rounded-full border-[1.5px] border-[#EAFD66]/20" />
                  </>
                )}

                {/* 스텝 마커 */}
                <div
                  className={`
                    w-5 h-5 rounded-full flex items-center justify-center
                    transition-all duration-300 text-[10px]
                    ${
                      index + 1 < currentStep
                        ? 'bg-[#EAFD66] text-black'
                        : index + 1 === currentStep
                        ? 'bg-[#EAFD66] text-black ring-2 ring-[#EAFD66]/30'
                        : 'border-[1.5px] border-gray-800 bg-gray-900'
                    }
                  `}
                >
                  {index + 1 <= currentStep && (
                    <span className="font-medium">{index + 1}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        <h2 className="mt-6 text-lg md:text-xl font-bold text-gray-400 text-center">
          {STEP_MESSAGES[currentStep as keyof typeof STEP_MESSAGES]}
        </h2>
      </div>
    </div>
  );
}
