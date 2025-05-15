'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

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
  const imgRef = useRef<HTMLImageElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [glowPosition, setGlowPosition] = useState({ x: 50, y: 50 });
  const [imageError, setImageError] = useState(false);

  const [imageAspectRatio, setImageAspectRatio] = useState<number | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  // RGB를 HEX로 변환하는 함수
  const rgbToHex = (rgb: [number, number, number]) => {
    return (
      '#' +
      rgb
        .map((x) => {
          const hex = x.toString(16);
          return hex.length === 1 ? '0' + hex : hex;
        })
        .join('')
    );
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const aspectRatio = img.naturalWidth / img.naturalHeight;
    setImageAspectRatio(aspectRatio);
    setImageLoaded(true);

    console.log('이미지 로드됨:', img.src);
    console.log('이미지 크기:', img.naturalWidth, 'x', img.naturalHeight);
    console.log('이미지 비율:', aspectRatio);
  };

  const getImageHeight = () => {
    if (!imageAspectRatio) return 'h-44'; // 기본값

    if (imageAspectRatio > 2.0) return 'h-32'; // 파노라마
    if (imageAspectRatio > 1.4) return 'h-40'; // 일반 가로형
    if (imageAspectRatio > 1.3) return 'h-48'; // 가로형 (4:3)
    if (imageAspectRatio > 1.1) return 'h-52'; // 거의 정사각형
    if (imageAspectRatio > 0.95) return 'h-56'; // 살짝 세로
    if (imageAspectRatio > 0.5) return 'h-72'; // 세로형

    const result = 'h-96'; // 매우 세로

    // 디버그용 로그
    console.log(
      `이미지 비율: ${imageAspectRatio?.toFixed(2) || 'N/A'}, 적용된 높이: ${
        imageAspectRatio > 2.0
          ? 'h-32'
          : imageAspectRatio > 1.4
          ? 'h-40'
          : imageAspectRatio > 1.3
          ? 'h-48'
          : imageAspectRatio > 1.1
          ? 'h-52'
          : imageAspectRatio > 0.95
          ? 'h-56'
          : imageAspectRatio > 0.5
          ? 'h-72'
          : 'h-96'
      }`
    );

    return result;
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    // 카드의 위치와 크기를 구합니다
    const rect = cardRef.current.getBoundingClientRect();

    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    // rotateX & rotateY - 기울기를 더 크게 수정 (8도에서 15도로)
    const rotateY = (x - 0.5) * 40;
    const rotateX = (0.5 - y) * 40;

    setRotation({ x: rotateX, y: rotateY });

    // 홀로그래픽 효과를 위한 마우스 위치 업데이트 (0~100%)
    setGlowPosition({ x: x * 100, y: y * 100 });
    setMousePosition({ x, y });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotation({ x: 0, y: 0 });
    setGlowPosition({ x: 50, y: 50 });
  };

  // 가져온 도메인 이름
  const hostname = metadata?.url ? new URL(metadata.url).hostname : '';

  return (
    <div
      ref={cardRef}
      className={`relative w-full my-3 mx-auto ${
        isHovered ? 'z-20' : 'z-10'
      }`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: '1000px',
        maxWidth: '340px',
        height: 'auto',
      }}
    >
      <div
        className="relative rounded-lg overflow-hidden transition-all duration-300"
        style={{
          transform: `
            rotateY(${rotation.y}deg) 
            rotateX(${rotation.x}deg)
          `,
          transformOrigin: 'center center',
          transition: 'all 0.3s ease',
          boxShadow: isHovered
            ? '0 0 20px rgba(234, 253, 102, 0.4), 0 5px 15px rgba(0, 0, 0, 0.2)'
            : '0 0 8px rgba(234, 253, 102, 0.15), 0 2px 5px rgba(0, 0, 0, 0.1)',
          border: isHovered ? '1px solid rgba(234, 253, 102, 0.3)' : '1px solid rgba(255, 255, 255, 0.05)',
        }}
      >
        <div className="bg-[#111111] rounded-lg overflow-hidden">
          {/* 이미지 영역 - 홀로그래픽 효과 여기에만 적용 */}
          <div
            className={`w-full ${getImageHeight()} bg-[#1A1A1A] flex items-center justify-center overflow-hidden relative`}
          >
            {/* 디버그 정보 - 개발 중에만 사용 */}
            {/* <div className="absolute top-1 left-1 bg-black/60 px-1.5 py-0.5 rounded text-[10px] text-white/80 z-10">
              {imageAspectRatio?.toFixed(2) || 'N/A'}
            </div> */}
            {/* 홀로그래픽 효과 (이미지 영역에만 적용) */}
            {isHovered && (
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
                    animation: 'none',
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
                  }}
                />
              </>
            )}

            {/* 홀로그래픽 효과 적용 */}
            <div
              className="absolute inset-0 opacity-0 holographic-effect"
              style={{
                background: `linear-gradient(
                  125deg, 
                  rgba(234, 253, 102, 0.1) 0%,
                  rgba(255, 236, 210, 0.3) 30%, 
                  rgba(234, 253, 102, 0.5) 48%,
                  rgba(255, 236, 210, 0.3) 70%,
                  rgba(234, 253, 102, 0.1) 100%)`,
                backgroundSize: '300% 300%',
                backgroundPosition: `${glowPosition.x}% ${glowPosition.y}%`,
                filter: 'saturate(1.5) contrast(1.2)',
                mixBlendMode: 'overlay',
                transform: `translateZ(${isHovered ? '10' : '0'}px)`,
                opacity: isHovered ? 0.6 : 0,
              }}
            />
            {/* OG 이미지 또는 기본 아이콘 표시 */}
            {metadata.image && !imageError ? (
              <div className="w-full h-full relative">
                <Image
                  ref={imgRef}
                  src={metadata.image}
                  alt={metadata.title || 'Link preview'}
                  className="object-cover transition-transform duration-300"
                  style={{
                    transform: `translateZ(${isHovered ? '5' : '0'}px)`,
                    objectFit: 'cover',
                  }}
                  fill
                  sizes="(max-width: 340px) 100vw, 340px"
                  quality={85}
                  unoptimized // 외부 이미지 URL을 사용하기 위해 추가
                  onLoad={handleImageLoad}
                  onError={(e) => {
                    console.error('이미지 로드 오류:', e);
                    setImageError(true);
                  }}
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-[#111111]/70 to-transparent"
                  style={{
                    transform: `translateZ(${isHovered ? '7' : '0'}px)`,
                  }}
                />
              </div>
            ) : (
              <div
                className="rounded-full bg-[#2A2A2A] flex items-center justify-center transition-all duration-300"
                style={{
                  width: '56px',
                  height: '56px',
                  transform: `
                    ${isHovered ? 'scale(1.05) ' : ''}
                    translateZ(${isHovered ? '10' : '0'}px)
                  `,
                  boxShadow: isHovered
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
                    isHovered ? 'text-[#EAFD66]' : 'text-white/60'
                  } transition-colors duration-300`}
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
                transform: isHovered ? `translateZ(5px)` : 'none',
              }}
              className="transition-transform duration-300"
            >
              <h3
                className={`font-medium text-md mb-2 transition-colors duration-300
                ${isHovered ? 'text-[#EAFD66]' : 'text-white/90'}`}
              >
                {metadata.title || hostname || 'No title'}
              </h3>
              <p
                className={`text-white/70 text-xs mb-3 leading-relaxed ${
                  isHovered ? '' : 'line-clamp-2'
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
                  ${isHovered ? 'text-[#EAFD66]/90' : 'text-[#EAFD66]/70'}`}
                style={{
                  transform: isHovered ? `translateZ(3px)` : 'none',
                }}
              >
                {hostname}
              </a>
            </div>
          </div>
        </div>

        {/* 삭제 버튼 (onRemove prop이 전달된 경우에만 표시) */}
        {onRemove && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center text-white/80 hover:text-white hover:bg-black/80 transition-colors"
            style={{
              transform: `translateZ(10px)`,
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
            transform: scale(1.05) translateZ(20px);
          }
          100% {
            transform: scale(1.1) translateZ(25px);
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
        @keyframes glow {
          0% {
            box-shadow: 0 0 12px rgba(234, 253, 102, 0.3), 0 3px 8px rgba(0, 0, 0, 0.15);
          }
          50% {
            box-shadow: 0 0 22px rgba(234, 253, 102, 0.5), 0 5px 12px rgba(0, 0, 0, 0.18);
          }
          100% {
            box-shadow: 0 0 12px rgba(234, 253, 102, 0.3), 0 3px 8px rgba(0, 0, 0, 0.15);
          }
        }
      `}</style>
    </div>
  );
}
