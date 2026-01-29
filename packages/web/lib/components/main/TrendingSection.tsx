"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { SectionHeader } from "./SectionHeader";
import type { TrendingKeyword } from "@/lib/utils/main-page-mapper";

const sampleKeywords: TrendingKeyword[] = [
  { id: "1", label: "뉴진스 다니엘", href: "/search?q=뉴진스+다니엘" },
  { id: "2", label: "나이키", href: "/search?q=나이키" },
  { id: "3", label: "뉴진스 혜인", href: "/search?q=뉴진스+혜인" },
  { id: "4", label: "블랙핑크 지수", href: "/search?q=블랙핑크+지수" },
  { id: "5", label: "아디다스", href: "/search?q=아디다스" },
  { id: "6", label: "RON ARAD STUDIO", href: "/search?q=RON+ARAD+STUDIO" },
  { id: "7", label: "뉴발란스", href: "/search?q=뉴발란스" },
];

interface TrendingNowSectionProps {
  keywords?: TrendingKeyword[];
}

export function TrendingNowSection({
  keywords = sampleKeywords,
}: TrendingNowSectionProps) {
  return (
    <section className="py-10 md:py-16 px-4 md:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          title="TRENDING NOW"
          subtitle="인기있는 키워드를 확인해보세요"
        />

        <div className="flex flex-wrap gap-3">
          {keywords.map((keyword, index) => (
            <motion.div
              key={keyword.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                href={keyword.href}
                className="inline-block px-5 py-2.5 bg-muted text-muted-foreground text-sm font-medium rounded-full
                         hover:bg-accent hover:text-foreground transition-colors"
              >
                {keyword.label}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
