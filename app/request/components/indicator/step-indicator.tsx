import React from 'react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="w-full mb-20">
      <div className="relative pt-1">
        {/* 프로그레스 바 컨테이너 - 너비 제한 */}
        <div className="max-w-[120px] mx-auto relative">
          {/* 프로그레스 바 */}
          <div className="absolute top-[11px] w-full">
            <div className="h-[2px] bg-[#070707]">
              <div
                className="h-[2px] bg-[#EAFD66] transition-all duration-500 relative"
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
                    <div className="absolute -inset-1 rounded-full border-2 border-[#EAFD66]/30 animate-ping" />
                    <div className="absolute -inset-1 rounded-full border-2 border-[#EAFD66]/30" />
                  </>
                )}

                {/* 스텝 마커 */}
                <div
                  className={`
                    w-5 h-5 rounded-full 
                    ${
                      index + 1 < currentStep
                        ? 'bg-[#EAFD66]' // 완료된 스텝
                        : index + 1 === currentStep
                        ? 'bg-[#EAFD66]' // 현재 스텝
                        : 'border-[2.5px] border-[#333333] bg-transparent' // 미완료 스텝
                    }
                  `}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 