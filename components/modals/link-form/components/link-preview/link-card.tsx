'use client';

import { useState, useRef } from 'react';

export interface LinkMetadata {
  url: string;
  title: string;
  description: string;
  image: string;
  favicon: string;
}

interface LinkCardProps {
  metadata: LinkMetadata;
  onRemove?: () => void;
}

export function LinkCard({ metadata, onRemove }: LinkCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [glowPosition, setGlowPosition] = useState({ x: 50, y: 50 });
  const [imageError, setImageError] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || isClicked) return; // 클릭 상태에서는 마우스 움직임 효과 비활성화

    // 카드의 위치와 크기를 구합니다
    const rect = cardRef.current.getBoundingClientRect();

    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    // rotateX & rotateY
    const rotateY = (x - 0.5) * 8;
    const rotateX = (0.5 - y) * 8;

    setRotation({ x: rotateX, y: rotateY });

    // 홀로그래픽 효과를 위한 마우스 위치 업데이트 (0~100%)
    setGlowPosition({ x: x * 100, y: y * 100 });
    setMousePosition({ x, y });
  };

  const handleMouseEnter = () => {
    if (!isClicked) setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (!isClicked) {
      setRotation({ x: 0, y: 0 });
      setGlowPosition({ x: 50, y: 50 });
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsClicked(!isClicked);

    if (!isClicked) {
      // 클릭 시 카드 회전 설정
      const randomRotation = {
        x: Math.random() * 10 - 5,
        y: Math.random() * 20 - 10,
      };
      setRotation(randomRotation);
    } else {
      // 클릭 해제 시 원래 상태로
      setRotation({ x: 0, y: 0 });
    }
  };

  // 가져온 도메인 이름
  const hostname = metadata.url ? new URL(metadata.url).hostname : '';

  return (
    <div
      ref={cardRef}
      className={`relative w-full my-3 mx-auto cursor-pointer ${
        isHovered || isClicked ? 'z-20' : 'z-10'
      }`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleCardClick}
      style={{
        perspective: '1000px',
        maxWidth: '340px',
        height: isClicked ? '400px' : 'auto',
      }}
    >
      <div
        className={`relative rounded-lg overflow-hidden transition-all duration-300 ${
          isClicked ? 'absolute inset-x-0' : ''
        }`}
        style={{
          transform: `
            ${isClicked ? 'scale(1.15) translateY(-30px) ' : ''}
            rotateY(${rotation.y}deg) 
            rotateX(${rotation.x}deg)
            ${isClicked ? ` rotate(${rotation.y > 0 ? 5 : -5}deg)` : ''}
          `,
          transformStyle: 'preserve-3d',
          transformOrigin: 'center center',
          transition: isClicked
            ? 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            : 'all 0.3s ease',
          boxShadow: isClicked
            ? '0 20px 30px rgba(0, 0, 0, 0.3), 0 0 15px rgba(234, 253, 102, 0.2)'
            : isHovered
            ? '0 5px 15px rgba(0, 0, 0, 0.15), 0 0 5px rgba(234, 253, 102, 0.1)'
            : '0 2px 5px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div className="bg-[#111111] border border-white/5 rounded-lg overflow-hidden">
          {/* 이미지 영역 - 홀로그래픽 효과 여기에만 적용 */}
          <div className="w-full h-44 bg-[#1A1A1A] flex items-center justify-center overflow-hidden relative">
            {/* 홀로그래픽 효과 (이미지 영역에만 적용) */}
            {(isHovered || isClicked) && (
              <>
                {/* 마우스 포인트 하이라이트 */}
                <div
                  className="absolute inset-0 opacity-5 mix-blend-overlay transition-opacity duration-300"
                  style={{
                    background: `radial-gradient(circle at ${glowPosition.x}% ${glowPosition.y}%, rgba(255, 255, 255, 0.7), transparent 60%)`,
                    pointerEvents: 'none',
                  }}
                />
                {/* 미세한 홀로그래픽 효과 */}
                <div
                  className="absolute inset-0 opacity-15 mix-blend-color-dodge pointer-events-none"
                  style={{
                    background: `
                      linear-gradient(
                        120deg,
                        rgba(0, 183, 255, 0),
                        rgba(0, 183, 255, 0.2) 10%,
                        rgba(0, 0, 255, 0.1) 20%,
                        rgba(130, 0, 255, 0.1) 30%,
                        rgba(255, 0, 230, 0.2) 40%,
                        rgba(255, 140, 0, 0.2) 50%,
                        rgba(255, 230, 0, 0.3) 60%,
                        rgba(0, 230, 64, 0.3) 70%,
                        rgba(0, 230, 153, 0.2) 80%,
                        rgba(0, 153, 230, 0.2) 90%,
                        rgba(0, 64, 230, 0) 100%
                      )
                    `,
                    backgroundSize: '200% 200%',
                    backgroundPosition: `${glowPosition.x}% ${glowPosition.y}%`,
                    animation: isClicked
                      ? 'colorShift 3s infinite alternate'
                      : 'none',
                  }}
                />
                {/* 부드러운 하이라이트 스웹 */}
                <div
                  className="absolute inset-0 opacity-15 mix-blend-color-dodge pointer-events-none"
                  style={{
                    background: `
                      linear-gradient(
                        ${mousePosition.x * 360}deg,
                        rgba(255, 255, 255, 0) 40%,
                        rgba(255, 255, 255, 0.2) ${glowPosition.x - 5}%,
                        rgba(255, 255, 255, 0) ${glowPosition.x + 5}%
                      )
                    `,
                    animation: isClicked ? 'sweep 2s infinite linear' : 'none',
                  }}
                />
              </>
            )}

            {/* OG 이미지 또는 기본 아이콘 표시 */}
            {metadata.image && !imageError ? (
              <div className="w-full h-full relative">
                <img
                  src={metadata.image}
                  alt={metadata.title || 'Link preview'}
                  className="w-full h-full object-cover transition-transform duration-300"
                  style={{
                    transform: `translateZ(${
                      isClicked ? '20' : isHovered ? '5' : '0'
                    }px)`,
                  }}
                  onError={() => setImageError(true)}
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-[#111111]/70 to-transparent"
                  style={{
                    transform: `translateZ(${
                      isClicked ? '25' : isHovered ? '7' : '0'
                    }px)`,
                  }}
                />
              </div>
            ) : (
              <div
                className={`rounded-full bg-[#2A2A2A] flex items-center justify-center transition-all duration-300 ${
                  isClicked ? 'scale-in-center' : ''
                }`}
                style={{
                  width: isClicked ? '60px' : '56px',
                  height: isClicked ? '60px' : '56px',
                  transform: `
                    ${isHovered && !isClicked ? 'scale(1.05) ' : ''}
                    ${isClicked ? 'scale(1.2) ' : ''}
                    translateZ(${isClicked ? '30' : isHovered ? '10' : '0'}px)
                    ${isClicked ? ` rotate(${Date.now() % 360}deg)` : ''}
                  `,
                  animation: isClicked
                    ? 'pulse 1.5s infinite alternate'
                    : 'none',
                  boxShadow: isClicked
                    ? '0 0 10px rgba(234, 253, 102, 0.3)'
                    : 'none',
                }}
              >
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={`${
                    isHovered || isClicked ? 'text-[#EAFD66]' : 'text-white/60'
                  } transition-colors duration-300`}
                  style={{
                    animation: isClicked ? 'spin 3s infinite linear' : 'none',
                  }}
                >
                  <path
                    d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            )}
          </div>

          {/* 컨텐츠 영역 */}
          <div className="p-4 flex flex-col">
            <div
              style={{
                transform:
                  isHovered || isClicked
                    ? `translateZ(${isClicked ? '15' : '5'}px)`
                    : 'none',
              }}
              className="transition-transform duration-300"
            >
              <h3
                className={`font-medium text-md mb-2 transition-colors duration-300
                ${isHovered || isClicked ? 'text-[#EAFD66]' : 'text-white/90'}`}
              >
                {metadata.title || hostname || 'No title'}
              </h3>
              <p
                className={`text-white/70 text-xs mb-3 leading-relaxed ${
                  isClicked ? '' : 'line-clamp-2'
                }`}
              >
                {metadata.description || 'No description available'}
              </p>
            </div>

            {/* URL 표시 */}
            <div className="flex items-center mt-1">
              <a
                href={metadata.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()} // 클릭 시 부모 onClick 이벤트 전파 방지
                className={`text-xs truncate max-w-full transition-colors duration-300 
                  ${
                    isHovered || isClicked
                      ? 'text-[#EAFD66]/90'
                      : 'text-[#EAFD66]/70'
                  }`}
                style={{
                  transform:
                    isHovered || isClicked
                      ? `translateZ(${isClicked ? '10' : '3'}px)`
                      : 'none',
                }}
              >
                {hostname}
              </a>
            </div>
          </div>
        </div>

        {/* 클릭 유도 텍스트 */}
        {isHovered && !isClicked && (
          <div
            className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200"
            style={{
              background: 'rgba(0,0,0,0.3)',
              backdropFilter: 'blur(1px)',
              pointerEvents: 'none',
            }}
          >
            <span className="text-white/90 text-xs font-medium bg-black/40 px-2 py-1 rounded">
              클릭하여 확대
            </span>
          </div>
        )}

        {/* 삭제 버튼 (onRemove prop이 전달된 경우에만 표시) */}
        {onRemove && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center text-white/80 hover:text-white hover:bg-black/80 transition-colors"
            style={{
              transform: `translateZ(${isClicked ? '50' : '10'}px)`,
              zIndex: 30,
            }}
            aria-label="Remove link"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>

      {/* CSS 애니메이션 정의 */}
      <style jsx>{`
        @keyframes pulse {
          0% {
            transform: scale(1.2) translateZ(30px);
          }
          100% {
            transform: scale(1.3) translateZ(40px);
          }
        }
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        @keyframes colorShift {
          0% {
            background-position: 0% 0%;
          }
          100% {
            background-position: 100% 100%;
          }
        }
        @keyframes sweep {
          0% {
            background-position: 0% 0%;
          }
          100% {
            background-position: 100% 100%;
          }
        }
        @keyframes scale-in-center {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
