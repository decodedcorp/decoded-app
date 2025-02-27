"use client";

import { useEffect, useState } from "react";
import { useLocaleContext } from "@/lib/contexts/locale-context";
import { cn } from "@/lib/utils/style";
import Image from "next/image";
import { networkManager } from "@/lib/network/network";
import Link from "next/link";

interface RequestItem {
  category: string | null;
  is_provided: boolean;
}

interface Request {
  image_doc_id: string;
  image_url: string;
  items: RequestItem[];
  provided_num: number;
}

interface RequestsData {
  request_num: number;
  requests: Request[] | null;
  next_id: string | null;
}

export function RequestSection({
  data,
  isLoading,
}: {
  data: RequestsData;
  isLoading: boolean;
}) {
  const { t } = useLocaleContext();
  const [activeFilter, setActiveFilter] = useState<string>("all");

  if (!data) return null;

  const getRequestStatus = (request: Request) => {
    const totalItems = request.items.length;
    if (request.provided_num === 0) return "pending";
    if (request.provided_num === totalItems) return "completed";
    return "inProgress";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#EAFD66] border-r-2" />
      </div>
    );
  }

  if (!data.requests || data.requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] space-y-4">
        <div className="w-16 h-16 rounded-full bg-[#1A1A1A] flex items-center justify-center">
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <div className="text-gray-400 text-sm">{t.mypage.request.empty}</div>
      </div>
    );
  }

  const filteredRequests = data.requests.filter((request) => {
    if (activeFilter === "all") return true;
    const status = getRequestStatus(request);
    return status === activeFilter;
  });

  return (
    <div className="space-y-4">
      {/* 필터 */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {Object.entries(t.mypage.request.filter).map(([key, label]) => (
          <button
            key={key}
            onClick={(e) => {
              e.stopPropagation();
              setActiveFilter(key);
            }}
            className={cn(
              "px-3 py-1.5 rounded-lg text-sm whitespace-nowrap",
              "transition-colors duration-200",
              key === activeFilter
                ? "bg-[#EAFD66]/10 text-[#EAFD66]"
                : "bg-[#1A1A1A] text-gray-400 hover:bg-[#1A1A1A]/80"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 요청 목록 */}
      <div className="space-y-2 max-h-[500px] overflow-y-auto">
        {filteredRequests.map((request) => {
          const status = getRequestStatus(request);
          return (
            <Link
              key={request.image_doc_id}
              href={`/details/${request.image_doc_id}`}
              className="bg-[#1A1A1A] rounded-xl p-4 flex gap-4"
            >
              {/* 이미지 */}
              <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={request.image_url}
                  alt="Request image"
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* 정보 */}
              <div className="flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex gap-1.5">
                      {request.items.map((item, index) => (
                        <span
                          key={index}
                          className={cn(
                            "text-xs px-2 py-0.5 rounded-full",
                            item.is_provided
                              ? "bg-[#EAFD66]/10 text-[#EAFD66]"
                              : "bg-gray-500/10 text-gray-400"
                          )}
                        >
                          {item.category || "기타"}
                        </span>
                      ))}
                    </div>
                  </div>
                  <span
                    className={cn("text-xs px-2 py-1 rounded-full", {
                      "bg-yellow-500/10 text-yellow-500": status === "pending",
                      "bg-blue-500/10 text-blue-500": status === "inProgress",
                      "bg-green-500/10 text-green-500": status === "completed",
                    })}
                  >
                    {t.mypage.request.status[status]}
                  </span>
                </div>

                <div className="text-xs text-gray-400">
                  {request.provided_num}/{request.items.length} 제공됨
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
