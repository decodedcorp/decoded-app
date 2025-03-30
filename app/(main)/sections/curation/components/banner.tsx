import Image from "next/image";
import Link from "next/link";
import { CurationContent } from "../types";
import { pretendardBold, pretendardRegular } from "@/lib/constants/fonts";

export function BannerCard({ content }: { content: CurationContent }) {
  return (
    <div className="group">
      <div className="relative h-[60vh] bg-black">
        <Image
          src={content.contents.sub_image_url}
          alt={content.contents.title}
          fill
          className="object-cover opacity-70"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black" />

        <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-8">
          <span
            className={`text-gray-400 text-sm tracking-[0.2em] uppercase mb-4 ${pretendardRegular.className}`}
          >
            BRAND FOCUS
          </span>
          <h2
            className={`text-3xl leading-none mb-6 ${pretendardBold.className}`}
          >
            {content.contents.title}
          </h2>
          <p className="text-lg text-zinc-300 max-w-2xl">
            {content.contents.description}
          </p>
        </div>
      </div>

      <div className="bg-black py-16">
        {/* 전체 너비를 사용하도록 수정 */}
        <div className="w-[200vw]">
          {" "}
          {/* 뷰포트 너비의 2배 */}
          <div className="flex whitespace-nowrap animate-marquee-infinite">
            {[...content.contents.docs, ...content.contents.docs].map(
              (doc, index) => (
                <Link
                  href={`/details/${doc.image_doc_id}`}
                  key={`${doc.image_doc_id}-${index}`}
                  className="relative w-[600px] aspect-[3/4] mx-4 group/item" // 이미지 크기 증가
                >
                  <Image
                    src={doc.image_url}
                    alt={`Style ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover/item:scale-105"
                    unoptimized
                    sizes="(max-width: 600px) 100vw, 600px"
                  />
                </Link>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
