"use client"; // useState를 사용하므로 'use client' 필요

import React, { useState } from "react";
import { useRequestModal } from "@/components/modals/request/hooks/use-request-modal"; // 경로 수정

export function FabMenu() {
  const [isFabMenuOpen, setIsFabMenuOpen] = useState(false);
  const { onOpen: openRequestModal, RequestModal } = useRequestModal({}); // useRequestModal 사용

  const handlePhotoIconClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // 이벤트 버블링 방지
    openRequestModal(); // 모달 열기 함수 호출
    setIsFabMenuOpen(false); // FAB 메뉴는 닫아줍니다.
  };

  const handleMouseLeave = () => {
    if (isFabMenuOpen) {
      setIsFabMenuOpen(false);
    }
  };

  return (
    <>
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40">
        <div
          className={`relative flex items-center justify-center bg-yellow-400 rounded-full shadow-xl text-black cursor-pointer transition-all duration-300 ease-in-out ${
            isFabMenuOpen ? "w-48 h-12 px-4" : "w-10 h-10"
          }`}
          onClick={() => setIsFabMenuOpen(!isFabMenuOpen)}
          onMouseLeave={handleMouseLeave}
          aria-expanded={isFabMenuOpen}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ")
              setIsFabMenuOpen(!isFabMenuOpen);
          }}
        >
          {/* Plus Icon - visible when menu is closed */}
          <div
            className={`transition-opacity duration-200 ${
              isFabMenuOpen ? "opacity-0 scale-0" : "opacity-100 scale-100"
            }`}
          >
            <svg
              className="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
          </div>

          {/* Menu Options - visible when menu is open */}
          {isFabMenuOpen && (
            <div className="absolute inset-0 flex items-center justify-around px-2 transition-opacity duration-300 delay-100 opacity-100">
              {/* Option 1: Image Icon */}
              <button
                type="button"
                className="p-2 rounded-full hover:bg-yellow-500 focus:outline-none focus:bg-yellow-500"
                aria-label="Upload image"
                onClick={handlePhotoIconClick} // 수정된 클릭 핸들러 연결
              >
                <svg
                  className="w-5 h-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </button>
              {/* Option 2: Camera Icon */}
              <button
                type="button"
                className="p-2 rounded-full hover:bg-yellow-500 focus:outline-none focus:bg-yellow-500"
                aria-label="Use camera"
                onClick={(e) => e.stopPropagation()} // Prevent parent onClick
              >
                <svg
                  className="w-5 h-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>
              {/* Option 3: Document/Text Icon */}
              <button
                type="button"
                className="p-2 rounded-full hover:bg-yellow-500 focus:outline-none focus:bg-yellow-500"
                aria-label="Add text post"
                onClick={(e) => e.stopPropagation()} // Prevent parent onClick
              >
                <svg
                  className="w-5 h-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
      {RequestModal} {/* 모달 컴포넌트 직접 렌더링 */}
    </>
  );
}

export default FabMenu; 