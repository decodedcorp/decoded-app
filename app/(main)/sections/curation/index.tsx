"use client";

import { Suspense } from "react";
import Image from "next/image";
import { useCurationContents } from "./hooks/use-curation-contents";
import { CurationContent } from "./types";
import { useLocaleContext } from "@/lib/contexts/locale-context";
import {
  pretendardBold,
  pretendardRegular,
  pretendardSemiBold,
} from "@/lib/constants/fonts";
import { cn } from "@/lib/utils/style";

function CurationCard({ content }: { content: CurationContent }) {
  return (
    <div className="group cursor-pointer">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-zinc-900/30 rounded-2xl overflow-hidden hover:bg-zinc-900/50 transition-all">
        {/* 메인 이미지 섹션 */}
        <div className="lg:col-span-8 space-y-4">
          <div className="relative aspect-[16/9] overflow-hidden rounded-lg">
            <Image
              src={content.contents.sub_image_url}
              alt={content.contents.title}
              fill
              className="object-cover transform group-hover:scale-105 transition-transform duration-700"
              unoptimized
            />
          </div>
          {/* 서브 이미지 그리드 */}
          {content.contents.docs.length > 0 && (
            <div className="grid grid-cols-3 gap-4">
              {content.contents.docs.slice(0, 3).map((doc, index) => (
                <div
                  key={doc.image_doc_id}
                  className="relative aspect-[4/5] overflow-hidden rounded-lg"
                >
                  <Image
                    src={doc.image_url}
                    alt={`Style ${index + 1}`}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                    unoptimized
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 컨텐츠 섹션 */}
        <div className="lg:col-span-4 p-8 flex flex-col justify-center">
          <div className="space-y-6">
            {/* 타이틀 */}
            <div className="space-y-2">
              {content.contents.sub_title && (
                <span className="text-zinc-400 text-sm tracking-wider uppercase">
                  {content.contents.sub_title}
                </span>
              )}
              <h2 className="text-3xl font-bold tracking-tight">
                {content.contents.title}
              </h2>
            </div>

            {/* 설명 텍스트 */}
            <p className="text-zinc-300 whitespace-pre-line leading-relaxed">
              {content.contents.description}
            </p>

            {/* 액션 버튼 */}
            {/* <div className="pt-4">
              <button className="inline-flex items-center text-sm font-medium text-zinc-200 hover:text-white/80">
                View Collection
                <svg
                  className="ml-2 w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

function CurationList({ type }: { type: "identity" | "brand" | "context" }) {
  const { data: contents, isLoading, error } = useCurationContents(type);

  if (isLoading) {
    return (
      <div className="space-y-8">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="h-[600px] bg-zinc-800/50 rounded-2xl animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (error) return null;
  if (!contents?.length) return null;

  return (
    <div className="space-y-12">
      {contents.map((content) => (
        <CurationCard key={content._id} content={content} />
      ))}
    </div>
  );
}

export function CurationSection({
  type,
}: {
  type: "identity" | "brand" | "context";
}) {
  const { t } = useLocaleContext();

  return (
    <div className="container">
      <section className="py-8 max-w-4xl mx-auto">
        <Suspense
          fallback={
            <div className="space-y-8">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="h-[600px] bg-zinc-800/50 rounded-2xl animate-pulse"
                />
              ))}
            </div>
          }
        >
          <CurationList type={type} />
        </Suspense>
      </section>
    </div>
  );
}
