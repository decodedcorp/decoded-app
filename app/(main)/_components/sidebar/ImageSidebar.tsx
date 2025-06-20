'use client';

import { useState, useEffect, useRef } from 'react';
import { ImageDetail } from '../../_types/image-grid';
import Image from 'next/image';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

interface ImageSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  imageDetail: ImageDetail | null;
  isFetchingDetail: boolean;
  detailError: string | null;
}

type TabType = 'summary' | 'items' | 'related';

export function ImageSidebar({
  isOpen,
  onClose,
  imageDetail,
  isFetchingDetail,
  detailError,
}: ImageSidebarProps) {
  // 탭 상태
  const [activeTab, setActiveTab] = useState<TabType>('summary');

  // 해시태그 뱃지 데이터
  const tags = ['#Aespa', '#SM', '#Prada', '#Prada'];

  // 메인 이미지 슬라이드 데이터
  const mainImages = [
    { 
      src: '/images/related/karina01.jpg', 
      alt: 'Karina 1',
      title: 'Next Level : Karina',
      subtitle: 'The Face of Future K-POP'
    },
    { 
      src: '/images/related/karina02.jpeg', 
      alt: 'Karina 2',
      title: '봄이 왔나봐',
      subtitle: '카리나와 함께 봄 나들이'
    },
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

  // 아이템 데이터 하나 정의
  const baseItem = {
    id: 1,
    label: 'BOTTOM',
    brand: 'PRADA',
    name: 'LOW-RISE PANTS',
    imageUrl: '/images/items/item01.jpg',
    links: [
      {
        url: 'https://decoded.style/',
        imageUrl: '/images/brand/prada.png',
        title: 'Prada',
        description: "Prada's signature utilitarian cut meets Y2K cool",
      },
      {
        url: 'https://decoded.style/',
        imageUrl: '/images/related/karina01.jpg',
        title: 'Karina',
        description: "Karina's signature utilitarian cut meets Y2K cool",
      },
    ],
  };

  // 4개로 복사 (id만 다르게)
  const items = Array.from({ length: 4 }).map((_, i) => ({
    ...baseItem,
    id: i + 1,
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

  // 아이템 슬라이드 관련 상태
  const [activeIndex, setActiveIndex] = useState(0);
  const activeItem = items[activeIndex];

  return (
    <div className="h-full w-full bg-[#1D1D1D] shadow-lg relative overflow-y-auto">
      {/* Header Tabs */}
      <div className="flex items-center px-4 pt-4">
        <button
          className={`font-semibold pb-2 mr-6 ${
            activeTab === 'summary' ? 'text-primary' : 'text-[#888] hover:text-primary'
          }`}
          onClick={() => setActiveTab('summary')}
        >
          Summary
        </button>
        <button
          className={`font-semibold pb-2 mr-6 ${
            activeTab === 'items' ? 'text-primary' : 'text-[#888] hover:text-primary'
          }`}
          onClick={() => setActiveTab('items')}
        >
          Items
        </button>
        <button
          className={`font-semibold pb-2 ${
            activeTab === 'related' ? 'text-primary' : 'text-[#888] hover:text-primary'
          }`}
          onClick={() => setActiveTab('related')}
        >
          Related
        </button>
      </div>
      {/* Divider */}
      <div className="border-b-2 border-primary mx-4" />

      {/* Tab Content */}
      {activeTab === 'summary' && (
        <div className="px-4 py-6">
          {/* Title, Subtitle & Description */}
          <div className="mb-6">
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
              className="rounded-xl object-cover w-[95%] max-w-2xl h-64 opacity-80"
              style={{ objectPosition: 'center top' }}
              priority
            />
            {/* 이미지 위 텍스트 오버레이 */}
            <div className="absolute bottom-4 left-8 transform translate-x-4">
              <h3 className="text-2xl font-bold text-white mb-1 drop-shadow-lg">
                {mainImages[mainIndex].title}
              </h3>
              <p className="text-sm text-white/90 font-medium drop-shadow-lg">
                {mainImages[mainIndex].subtitle}
              </p>
            </div>
          </div>
          {/* Items Section (2x2 그리드, more/less) */}
          <div className="mb-6">
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
          <div>
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
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-bold text-white text-sm">
                      {comment.user.name}
                    </span>
                    <span className="bg-[#F6FF4A] text-black text-[10px] px-1.5 py-0.5 rounded font-semibold">
                      {comment.user.badge}
                    </span>
                  </div>
                  <div className="text-white text-xs mb-2">{comment.text}</div>
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-primary transition-colors">
                      <ThumbsUp size={12} />
                      <span>{comment.thumbsUp}</span>
                    </button>
                    <button className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-red-400 transition-colors">
                      <ThumbsDown size={12} />
                      <span>{comment.thumbsDown}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'items' && (
        <div className="px-4 py-6">
          {/* 타이틀/디스크립션 */}
          <div className="mb-6">
            <h2 className="text-4xl font-extrabold text-[#F6FF4A] mb-2 leading-tight">
              Back to Y2K<br />
              — Karina's Retro Future Look
            </h2>
            <p className="text-base text-white/80">
              It's not just about wearing Y2K — it's about reinterpreting it.<br />
              Karina blends high-gloss textures, exposed skin, and statement accessories with modern polish.<br />
              It's throwback, but it's also completely now — just like her.
            </p>
          </div>

          {/* 아이템 썸네일 리스트 */}
          <div className="w-full flex items-center gap-4 overflow-x-auto mb-6 pb-2">
            {items.map((item, idx) => (
              <button
                key={item.id}
                className={`rounded-2xl p-1 transition-all border-2
                  ${activeIndex === idx ? 'border-white bg-white' : 'border-transparent bg-[#333] opacity-60'}
                  focus:outline-none`}
                style={{ minWidth: 120, minHeight: 120 }}
                onClick={() => setActiveIndex(idx)}
              >
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  width={120}
                  height={120}
                  className={`rounded-xl object-contain w-[120px] h-[120px] transition-all
                    ${activeIndex === idx ? '' : 'grayscale brightness-75'}`}
                  style={{ background: '#fff' }}
                />
              </button>
            ))}
          </div>

          {/* 상세+링크 2단 배치 */}
          <div className="flex flex-col gap-6">
            {/* 선택된 아이템 상세 */}
            <div className="flex flex-col items-center bg-[#181818] rounded-2xl p-6 shadow">
              <div className="flex items-center gap-2 mb-2">
                <Image src="/images/brand/prada.png" alt="brand" width={32} height={32} className="rounded-full" />
                <span className="text-lg font-bold text-white">{activeItem.brand}</span>
              </div>
              <div className="text-xs text-gray-400 font-bold uppercase">{activeItem.label}</div>
              <div className="text-xl font-extrabold text-white text-center">{activeItem.name}</div>
              <div className="text-xs text-white/70 mt-2 text-center">
                Prada's signature utilitarian cut meets Y2K cool<br />
                — these low-rise pants bring sharp tailoring to early-2000s
              </div>
            </div>

            {/* 아이템 세부 링크 메이슨리 그리드 */}
            <div className="w-full columns-2 gap-4 space-y-4">
              {Array.from({ length: 15 }).map((_, idx) => {
                // 다양한 크기와 비율을 위한 패턴 설정
                const patterns = [
                  { height: 200, aspectRatio: '4/3', type: 'normal' },
                  { height: 280, aspectRatio: '3/4', type: 'tall' },
                  { height: 180, aspectRatio: '16/9', type: 'wide' },
                  { height: 320, aspectRatio: '1/1', type: 'square' },
                  { height: 240, aspectRatio: '5/4', type: 'normal' },
                  { height: 300, aspectRatio: '2/3', type: 'tall' },
                  { height: 160, aspectRatio: '3/2', type: 'normal' },
                  { height: 260, aspectRatio: '4/5', type: 'tall' },
                ];
                
                const pattern = patterns[idx % patterns.length];
                const isSpecial = idx % 7 === 0; // 7번째마다 특별한 이미지
                const imageSrc = isSpecial ? activeItem.imageUrl : 
                  idx % 3 === 0 ? mainImages[0].src : mainImages[1].src;

                return (
                  <div
                    key={`grid-${idx}`}
                    className="break-inside-avoid rounded-xl overflow-hidden bg-[#222] hover:bg-[#2a2a2a] transition-all duration-300 hover:shadow-lg mb-4"
                  >
                    <div className="relative">
                      <Image
                        src={imageSrc}
                        alt={isSpecial ? activeItem.name : 'Related'}
                        width={400}
                        height={pattern.height}
                        className={`w-full h-auto rounded-t-xl transition-all duration-300 hover:scale-105 ${
                          isSpecial ? 'object-contain bg-white' : 'object-cover'
                        }`}
                        style={{ 
                          maxHeight: pattern.height,
                          minHeight: pattern.height * 0.8,
                          aspectRatio: pattern.aspectRatio
                        }}
                      />
                      {/* 이미지 위 오버레이 라벨 */}
                      <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm rounded-full px-2 py-1">
                        <span className="text-xs text-white font-semibold">
                          {isSpecial ? 'FEATURED' : 'RELATED'}
                        </span>
                      </div>
                    </div>
                    {/* 카드 내용 */}
                    <div className="p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`w-3 h-3 rounded-full ${isSpecial ? 'bg-primary' : 'bg-[#F6FF4A]'}`}></div>
                        <span className={`text-xs font-bold ${isSpecial ? 'text-primary' : 'text-[#F6FF4A]'}`}>
                          {isSpecial ? activeItem.brand : 'KARINA'}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white mb-1 line-clamp-1">
                        {isSpecial ? activeItem.name : mainImages[idx % mainImages.length].title}
                      </h4>
                      <p className="text-xs text-gray-400 line-clamp-2">
                        {isSpecial 
                          ? "Signature style highlight with premium quality" 
                          : mainImages[idx % mainImages.length].subtitle
                        }
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'related' && (
        <div className="px-4 py-6">
          <div className="w-full columns-2 gap-4 space-y-4">
            {Array.from({ length: 20 }).map((_, idx) => {
              // 다양한 크기와 비율을 위한 패턴 설정
              const patterns = [
                { height: 220, aspectRatio: '4/3', type: 'normal' },
                { height: 300, aspectRatio: '3/4', type: 'tall' },
                { height: 200, aspectRatio: '16/9', type: 'wide' },
                { height: 350, aspectRatio: '1/1', type: 'square' },
                { height: 260, aspectRatio: '5/4', type: 'normal' },
                { height: 320, aspectRatio: '2/3', type: 'tall' },
                { height: 180, aspectRatio: '3/2', type: 'normal' },
                { height: 280, aspectRatio: '4/5', type: 'tall' },
              ];
              
              const pattern = patterns[idx % patterns.length];
              const isMainItem = idx % 4 === 0; // 4번째마다 메인 아이템
              const imageSrc = isMainItem ? activeItem.imageUrl : 
                idx % 2 === 0 ? mainImages[0].src : mainImages[1].src;

              return (
                <div
                  key={`related-${idx}`}
                  className="break-inside-avoid rounded-xl overflow-hidden bg-[#222] hover:bg-[#2a2a2a] transition-all duration-300 hover:shadow-lg mb-4"
                >
                  <div className="relative">
                    <Image
                      src={imageSrc}
                      alt={isMainItem ? activeItem.name : 'Related'}
                      width={400}
                      height={pattern.height}
                      className={`w-full h-auto rounded-t-xl transition-all duration-300 hover:scale-105 ${
                        isMainItem ? 'object-contain bg-white' : 'object-cover'
                      }`}
                      style={{ 
                        maxHeight: pattern.height,
                        minHeight: pattern.height * 0.8,
                        aspectRatio: pattern.aspectRatio
                      }}
                    />
                    {/* 이미지 위 오버레이 라벨 */}
                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm rounded-full px-2 py-1">
                      <span className="text-xs text-white font-semibold">
                        {isMainItem ? 'MAIN ITEM' : 'RELATED'}
                      </span>
                    </div>
                  </div>
                  {/* 카드 내용 */}
                  <div className="p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`w-3 h-3 rounded-full ${isMainItem ? 'bg-primary' : 'bg-[#F6FF4A]'}`}></div>
                      <span className={`text-xs font-bold ${isMainItem ? 'text-primary' : 'text-[#F6FF4A]'}`}>
                        {isMainItem ? activeItem.brand : 'KARINA'}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white mb-1 line-clamp-1">
                      {isMainItem ? activeItem.name : mainImages[idx % mainImages.length].title}
                    </h4>
                    <p className="text-xs text-gray-400 line-clamp-2">
                      {isMainItem 
                        ? "Main item with related styling inspiration" 
                        : mainImages[idx % mainImages.length].subtitle
                      }
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
