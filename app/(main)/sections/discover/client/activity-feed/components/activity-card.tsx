'use client';

import { cn } from '@/lib/utils/style';
import { Activity } from '../types/activity';

interface ActivityCardProps {
  activity: Activity;
}

export function ActivityCard({ activity: { data } }: ActivityCardProps) {
  return (
    <div
      className={cn(
        "flex gap-4 p-3 rounded-xl transition-all duration-200",
        "hover:bg-white/5",
        "border border-transparent",
        "hover:border-zinc-700/50"
      )}
    >
      {/* 요청 이미지 */}
      <div
        className={cn(
          "w-16 h-16 rounded-xl overflow-hidden",
          "border border-zinc-700/50",
          "bg-zinc-900/50"
        )}
      >
        <img
          src={data.image_url}
          alt={`Image ${data.image_doc_id}`}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* 요청 정보 */}
      <div className="flex-1">
        <div className="flex items-center justify-between h-full">
          <p className="text-sm text-zinc-300 leading-snug">
            <span className="text-[#EAFD66] font-medium">
              {data.item_len}
            </span>
            <span className="ml-1">개의 아이템이 요청되었습니다</span>
          </p>

          <button
            className={cn(
              "px-3 py-1.5 rounded-lg text-sm font-medium",
              "border border-[#EAFD66]/20",
              "bg-[#EAFD66]/10 text-[#EAFD66]",
              "hover:bg-[#EAFD66]/20 transition-all duration-200",
              "flex items-center gap-1.5",
              "group"
            )}
            onClick={() => {
              // TODO: 제공 기능 구현
              console.log("Provide items for:", data.image_doc_id);
            }}
          >
            <span>제공하기</span>
            <svg
              className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
