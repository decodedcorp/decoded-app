"use client";

import React from "react";
import { GridItem } from "./GridItem";
import { cn } from "@/lib/utils";

// 파스텔 컬러 배열 (아바타 테두리용)
const pastelColors = [
  "border-pink-200",
  "border-blue-200",
  "border-green-200",
  "border-yellow-200",
  "border-purple-200",
  "border-orange-200",
];

// mock 데이터 (신규/인기 랜덤 플래그 추가)
function getMockItems() {
  return Array.from({ length: 36 }).map((_, i) => ({
    title: [
      "WiseType", "Jolie Ngo", "Delphine Lejeune", "Balmer Hählen", "Eunji Lee", "Jung-Lee Type Foundry",
      "Studio XYZ", "Artisan", "Pixel Lab", "Soundwave", "TypeLab", "DesignHub",
    ][i % 12],
    imageUrl: i % 4 === 0 ? undefined : `https://picsum.photos/seed/${i}/400/500`,
    category: [
      "Outerwear", "Footwear", "Accessories", "Bags", "Jewelry", "Streetwear",
      "Sportswear", "Designer", "Vintage", "Sustainable", "Unisex", "Kids",
    ][i % 12],
    editors: [
      [
        { name: "Alice", avatarUrl: "https://randomuser.me/api/portraits/women/1.jpg" },
        { name: "Bob", avatarUrl: "https://randomuser.me/api/portraits/men/2.jpg" },
        { name: "Carol", avatarUrl: "https://randomuser.me/api/portraits/women/3.jpg" },
      ],
      [
        { name: "Dave", avatarUrl: "https://randomuser.me/api/portraits/men/4.jpg" },
        { name: "Eve", avatarUrl: "https://randomuser.me/api/portraits/women/5.jpg" },
        { name: "Frank", avatarUrl: "https://randomuser.me/api/portraits/men/6.jpg" },
        { name: "Grace", avatarUrl: "https://randomuser.me/api/portraits/women/7.jpg" },
        { name: "Heidi", avatarUrl: "https://randomuser.me/api/portraits/women/8.jpg" },
      ],
      [
        { name: "Ivan", avatarUrl: "https://randomuser.me/api/portraits/men/9.jpg" },
        { name: "Judy", avatarUrl: "https://randomuser.me/api/portraits/women/10.jpg" },
        { name: "Mallory", avatarUrl: "https://randomuser.me/api/portraits/women/11.jpg" },
        { name: "Oscar", avatarUrl: "https://randomuser.me/api/portraits/men/12.jpg" },
        { name: "Peggy", avatarUrl: "https://randomuser.me/api/portraits/women/13.jpg" },
        { name: "Sybil", avatarUrl: "https://randomuser.me/api/portraits/women/14.jpg" },
        { name: "Trent", avatarUrl: "https://randomuser.me/api/portraits/men/15.jpg" },
      ],
    ][i % 3],
    date: [
      "May 28, 2025", "May 28, 2025", "Feb 16, 2025", "Jan 25, 2025", "Jan 18, 2025", "Jan 18, 2025",
      "Mar 10, 2025", "Apr 2, 2025", "Feb 20, 2025", "Mar 5, 2025", "Apr 15, 2025", "May 1, 2025",
    ][i % 12],
    isNew: i % 5 === 0,
    isHot: i % 7 === 0,
  }));
}

// 이미지 없는 카드 분산: 이미지 없는 카드만 따로 추출 후, 일정 간격마다 삽입
function distributeNoImageCards(items: any[]) {
  const withImage = items.filter((item) => item.imageUrl);
  const noImage = items.filter((item) => !item.imageUrl);
  const result = [];
  let noImageIdx = 0;
  for (let i = 0; i < withImage.length; i++) {
    result.push(withImage[i]);
    // 5개마다 이미지 없는 카드 삽입
    if ((i + 1) % 5 === 0 && noImageIdx < noImage.length) {
      result.push(noImage[noImageIdx++]);
    }
  }
  // 남은 이미지 없는 카드 뒤에 추가
  while (noImageIdx < noImage.length) {
    result.push(noImage[noImageIdx++]);
  }
  return result;
}

// Masonry 카드 스타일 다양화
const cardVariants = [
  "rounded-xl shadow-xl border border-zinc-800 bg-zinc-900 p-2",
  "rounded-2xl shadow-lg border border-zinc-700 bg-zinc-900 p-2",
  "rounded-lg shadow-md border border-zinc-900 bg-zinc-900 p-1",
  "rounded-xl shadow border border-zinc-700 bg-zinc-900 p-2",
  "rounded-2xl shadow-xl border border-zinc-900 bg-zinc-900 p-2",
];

// CTA(추천) 카드 종류 및 테마
const ctaVariants = [
  {
    title: "Recommended Artists",
    desc: "Discover new styles and creators.",
    button: "View Recommendations",
    icon: (
      <svg width="32" height="32" fill="none" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#27272a"/><path d="M16 10v8m0 0v4m0-4h4m-4 0h-4" stroke="#f472b6" strokeWidth="2" strokeLinecap="round"/></svg>
    ),
  },
  {
    title: "Trending Now",
    desc: "Check out the most popular items.",
    button: "See Trending",
    icon: (
      <svg width="32" height="32" fill="none" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#18181b"/><path d="M10 18l4-4 4 4 4-4" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round"/></svg>
    ),
  },
  {
    title: "New Collection Open",
    desc: "Explore the latest collections now.",
    button: "View Collection",
    icon: (
      <svg width="32" height="32" fill="none" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#18181b"/><rect x="10" y="14" width="12" height="4" rx="2" fill="#a3e635"/></svg>
    ),
  },
];

// Masonry 레이아웃 + CTA 카드 랜덤 삽입
function insertSpecialCards<T>(items: T[], interval = 8) {
  const result: Array<T | { type: "cta"; id: string; ctaIdx: number }> = [];
  let ctaCount = 0;
  items.forEach((item, idx) => {
    if (idx !== 0 && idx % interval === 0) {
      // CTA 카드 종류를 순환/랜덤하게 삽입
      const ctaIdx = (ctaCount++) % ctaVariants.length;
      result.push({ type: "cta", id: `cta-${idx}`, ctaIdx });
    }
    result.push(item);
  });
  return result;
}

// CTA 카드 (테마 적용)
function CtaCard({ ctaIdx }: { ctaIdx: number }) {
  const cta = ctaVariants[ctaIdx % ctaVariants.length];
  return (
    <div
      className="mb-4 break-inside-avoid rounded-2xl border border-zinc-800 bg-zinc-950 p-6 flex flex-col items-center justify-center text-center shadow-lg hover:scale-105 hover:shadow-2xl transition-transform duration-200"
    >
      <div className="mb-2">{cta.icon}</div>
      <div className="text-base font-semibold text-zinc-100 mb-1">{cta.title}</div>
      <div className="text-zinc-400 text-sm mb-3">{cta.desc}</div>
      <button className="px-4 py-2 rounded-full bg-zinc-800 text-zinc-100 text-xs font-medium hover:bg-zinc-700 transition-colors border border-zinc-700">
        {cta.button}
      </button>
    </div>
  );
}

export function MasonryGrid() {
  // 카드 데이터 준비
  let items: any[] = getMockItems();
  items = distributeNoImageCards(items);
  items = insertSpecialCards(items, 8);

  return (
    <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 w-full">
      {items.map((item, idx) => {
        if ((item as any).type === "cta") {
          return <CtaCard key={(item as any).id} ctaIdx={(item as any).ctaIdx} />;
        }
        const cardClass = cardVariants[idx % cardVariants.length];
        // 아바타 테두리 컬러 랜덤
        const avatarBorder = pastelColors[idx % pastelColors.length];
        return (
          <div
            key={idx}
            className={cn(
              "mb-4 break-inside-avoid transition-transform duration-200 hover:scale-105 hover:shadow-2xl cursor-pointer group",
              cardClass
            )}
          >
            <GridItem
              imageUrl={(item as any).imageUrl}
              title={(item as any).title}
              category={(item as any).category}
              editors={(item as any).editors}
              date={(item as any).date}
              isNew={(item as any).isNew}
              isHot={(item as any).isHot}
              avatarBorder={avatarBorder}
            />
          </div>
        );
      })}
    </div>
  );
} 