'use client';

import { useState, useEffect, useRef } from 'react';
import { ImageDetail } from '../_types/image-grid';
import Image from 'next/image';

interface ImageSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  imageDetail: ImageDetail | null;
  isFetchingDetail: boolean;
  detailError: string | null;
}

export function ImageSidebar({
  isOpen,
  onClose,
  imageDetail,
  isFetchingDetail,
  detailError,
}: ImageSidebarProps) {
  // 해시태그 뱃지 데이터
  const tags = ['#Aespa', '#SM', '#Prada', '#Prada'];

  // 메인 이미지 슬라이드 데이터
  const mainImages = [
    { src: '/images/related/karina01.jpg', alt: 'Karina 1' },
    { src: '/images/related/karina02.jpeg', alt: 'Karina 2' },
  ];
  const [mainIndex, setMainIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // 자동 슬라이드
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setMainIndex((prev) => (prev + 1) % mainImages.length);
    }, 3500);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [mainImages.length]);

  // 클릭 시 슬라이드 이동
  function handleSlideClick(e: React.MouseEvent<HTMLDivElement>) {
    const { left, width } = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - left;
    if (x < width / 2) {
      setMainIndex((prev) => (prev === 0 ? mainImages.length - 1 : prev - 1));
    } else {
      setMainIndex((prev) => (prev + 1) % mainImages.length);
    }
    // 클릭 시 자동 슬라이드 타이머 리셋
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        setMainIndex((prev) => (prev + 1) % mainImages.length);
      }, 3500);
    }
  }

  // 아이템 이미지(스트라이프 니트) 하나만 사용
  const itemImage = '/images/items/item01.jpg';
  const items = Array.from({ length: 4 }).map((_, i) => ({
    id: i + 1,
    label: 'TOP',
    brand: 'TOMMY HILFIGER',
    name: 'Striped Knit Sweater',
    imageUrl: itemImage,
  }));

  const comments = [
    {
      id: 1,
      user: {
        name: 'Kiyori',
        badge: 'K-pop expert',
        avatar: '/images/kiyori.png',
      },
      text: 'Karina effortlessly blends futuristic flair with classic K-pop elegance.',
      thumbsUp: 33,
      thumbsDown: 0,
    },
    {
      id: 2,
      user: {
        name: 'Kiyori',
        badge: 'K-pop expert',
        avatar: '/images/kiyori.png',
      },
      text: 'Karina effortlessly blends futuristic flair with classic K-pop elegance.',
      thumbsUp: 33,
      thumbsDown: 0,
    },
  ];

  // 디스크립션 토글 상태
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  // 아이템 토글 상태
  const [isItemsExpanded, setIsItemsExpanded] = useState(false);

  // 디스크립션 텍스트
  const description = `From futuristic silhouettes to effortless streetwear, Karina continues
to redefine what it means to be a K-pop fashion icon. In this curated
moment, every detail speaks — the cut, the texture, the energy. Zoom
in, take a closer look, and uncover the layers behind her style.
Because with Karina, it's never just an outfit — it's a statement.`;

  // 아이템 2줄만 보여주기 위한 slice (2x2 그리드 기준 2줄 = 4개, 1줄 = 2개)
  const visibleItems = isItemsExpanded ? items : items.slice(0, 2);

  return (
    <div className="h-full w-full bg-[#1D1D1D] shadow-lg relative overflow-y-auto">
      {/* Header Tabs */}
      <div className="flex items-center px-4 pt-4">
        <button className="text-primary font-semibold pb-2 mr-6">
          Summary
        </button>
        <button className="text-[#888] font-semibold pb-2 mr-6 hover:text-primary">
          Items
        </button>
        <button className="text-[#888] font-semibold pb-2 hover:text-primary">
          Related
        </button>
      </div>
      {/* Divider */}
      <div className="border-b-2 border-primary mx-4" />
      {/* Title, Subtitle & Description */}
      <div className="px-4 py-6">
        <h2 className="text-4xl font-extrabold text-[#F6FF4A] mb-2 leading-tight">
          What Is She Wearing?
        </h2>
        <div className="text-xl font-semibold text-[#F6FF4A] mb-4">
          — KARINA in Focus
        </div>
        {/* Description with line clamp and toggle */}
        <div className="relative">
          <p
            className={
              `text-base text-white/80 whitespace-pre-line mb-2 transition-all duration-200 ` +
              (isDescExpanded ? '' : 'line-clamp-2')
            }
            style={
              isDescExpanded
                ? {}
                : {
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }
            }
          >
            {description}
          </p>
          <button
            className="text-xs text-primary font-semibold focus:outline-none absolute right-0 top-0"
            onClick={() => setIsDescExpanded((prev) => !prev)}
          >
            {isDescExpanded ? 'less' : 'more'}
          </button>
        </div>
        {/* 해시태그 뱃지 */}
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="bg-[#222] text-white text-xs px-3 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      {/* Main Image Section (자동 슬라이드 & 클릭 영역) */}
      <div
        className="w-full flex justify-center items-center mb-6 relative cursor-pointer select-none"
        onClick={handleSlideClick}
        style={{ userSelect: 'none' }}
      >
        <Image
          src={mainImages[mainIndex].src}
          alt={mainImages[mainIndex].alt}
          width={480}
          height={270}
          className="rounded-xl object-cover w-[95%] max-w-2xl h-64"
          style={{ objectPosition: 'center top' }}
          priority
        />
      </div>
      {/* Items Section (2x2 그리드, more/less) */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-base font-bold text-white">Items</h3>
          <button
            className="text-xs text-primary font-semibold focus:outline-none"
            onClick={() => setIsItemsExpanded((prev) => !prev)}
          >
            {isItemsExpanded ? 'less' : 'more'}
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {visibleItems.map((item) => (
            <div
              key={item.id}
              className="bg-[#222] rounded-xl p-3 flex flex-row items-center"
            >
              <Image
                src={item.imageUrl}
                alt={item.name}
                width={72}
                height={72}
                className="rounded object-contain bg-white flex-shrink-0"
                style={{ width: 72, height: 72 }}
              />
              <div className="ml-3 flex flex-col">
                <span className="text-xs text-gray-400 mb-1">{item.label}</span>
                <span className="text-sm font-bold text-white">
                  {item.brand}
                </span>
                <span className="text-xs text-white">{item.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Comments Section */}
      <div className="px-4 pb-8">
        <h3 className="text-base font-bold text-white mb-2">Comments</h3>
        {comments.map((comment) => (
          <div key={comment.id} className="flex items-start mb-3">
            <Image
              src={comment.user.avatar}
              alt={comment.user.name}
              width={32}
              height={32}
              className="w-8 h-8 rounded-full mr-2 object-cover"
            />
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="font-bold text-white text-sm">
                  {comment.user.name}
                </span>
                <span className="bg-[#F6FF4A] text-black text-[10px] px-1.5 py-0.5 rounded font-semibold">
                  {comment.user.badge}
                </span>
              </div>
              <div className="text-white text-xs mb-0.5">{comment.text}</div>
              <div className="flex items-center gap-3 text-[10px] text-gray-400">
                <span>Thumbs up {comment.thumbsUp}</span>
                <span>Thumbs down {comment.thumbsDown}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
