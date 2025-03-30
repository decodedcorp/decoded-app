"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { CurationContent } from "../types";
import { pretendardBold, pretendardSemiBold } from "@/lib/constants/fonts";

interface StoryCardProps {
  content: CurationContent;
}

export function StoryCard({ content }: StoryCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const docs = content.contents.docs;
  const SLIDE_DURATION = 4000;

  const handleSlideChange = useCallback(
    (direction: "left" | "right") => {
      setCurrentIndex((prev) => {
        if (direction === "right") {
          return (prev + 1) % docs.length;
        }
        return (prev - 1 + docs.length) % docs.length;
      });
      setProgress(0);
    },
    [docs.length]
  );

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;

    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    if (Math.abs(diff) > 50) {
      handleSlideChange(diff > 0 ? "right" : "left");
    }
    setTouchStart(null);
  };

  // 프로그레스 업데이트
  useEffect(() => {
    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = (elapsed / SLIDE_DURATION) * 100;

      if (newProgress >= 100) {
        handleSlideChange("right");
      } else {
        setProgress(newProgress);
      }
    }, 16); // 약 60fps

    return () => clearInterval(timer);
  }, [currentIndex, handleSlideChange]);

  return (
    <div className="w-full flex items-center justify-center h-full">
      <div className="relative w-full max-w-[390px] aspect-[9/16] bg-black rounded-xl overflow-hidden shadow-lg">
        {/* 애니메이션 레이어 - 최하단 */}
        <AnimatePresence initial={false}>
          <motion.div
            key={currentIndex}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="absolute inset-0"
          >
            {/* 이미지와 링크 */}
            <Link
              href={`/details/${docs[currentIndex].image_doc_id}`}
              className="absolute inset-0 block"
            >
              <Image
                src={docs[currentIndex].image_url}
                alt={`Style ${currentIndex + 1}`}
                fill
                className="object-cover"
                unoptimized
                sizes="(max-width: 390px) 100vw, 390px"
              />
            </Link>
          </motion.div>
        </AnimatePresence>

        {/* 그라데이션 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black pointer-events-none" />

        {/* 터치 이벤트 레이어 - 측면에만 배치 */}
        <div
          className="absolute inset-y-0 left-0 w-1/4"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        />
        <div
          className="absolute inset-y-0 right-0 w-1/4"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        />

        {/* UI 요소들 - 최상단 */}
        <div className="absolute inset-0 pointer-events-none">
          {/* 프로그레스바 */}
          <div className="absolute top-0 left-0 right-0 p-2 flex gap-1">
            {docs.map((_, idx) => (
              <div
                key={idx}
                className="h-0.5 flex-1 bg-gray-600 rounded-full overflow-hidden"
              >
                {idx === currentIndex && (
                  <motion.div
                    className="h-full bg-[#eafd66]"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0, ease: "linear" }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* 텍스트 */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="text-right">
              <h2
                className={`text-4xl sm:text-6xl mb-2 ${pretendardBold.className}`}
              >
                {content.contents.title}
              </h2>
              <p
                className={`text-sm text-white/80 ${pretendardSemiBold.className}`}
              >
                {content.contents.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
