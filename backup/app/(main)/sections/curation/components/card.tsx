import { CurationContent } from "../types";
import Image from "next/image";
import Link from "next/link";
import { pretendardBold } from "@/lib/constants/fonts";

export function CurationCard({ content }: { content: CurationContent }) {
  return (
    <div className="group">
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
                <Link
                  key={doc.image_doc_id}
                  href={`/details/${doc.image_doc_id}`}
                >
                  <div className="relative aspect-[4/5] overflow-hidden rounded-lg">
                    <Image
                      src={doc.image_url}
                      alt={`Style ${index + 1}`}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-500"
                      unoptimized
                    />
                  </div>
                </Link>
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
              <h2
                className={`text-3xl ${pretendardBold.className} tracking-tight`}
              >
                {content.contents.title}
              </h2>
            </div>

            {/* 설명 텍스트 */}
            <p className="text-gray-400 whitespace-pre-line leading-relaxed">
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
