"use client";

import Link from "next/link";
import { motion } from "motion/react";

export interface HeroData {
  artistName: string;
  title: string;
  subtitle: string;
  imageUrl?: string;
  link: string;
}

interface HeroSectionProps {
  data?: HeroData;
}

const defaultHeroData: HeroData = {
  artistName: "NEWJEANS",
  title: "뉴진스 'Supernatural' 컨셉 엿보기",
  subtitle: "",
  link: "/feed",
};

export function HeroSection({ data = defaultHeroData }: HeroSectionProps) {
  return (
    <section className="relative w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden bg-card">
      {/* Background Image Placeholder */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-black" />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 lg:p-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl"
        >
          {/* Artist Name */}
          <h2 className="text-4xl md:text-6xl lg:text-8xl font-bold text-foreground tracking-tight mb-4">
            {data.artistName}
          </h2>

          {/* Title */}
          <p className="text-lg md:text-xl lg:text-2xl text-foreground/90 mb-6">
            {data.title}
          </p>

          {/* CTA Button */}
          <Link
            href={data.link}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-medium rounded-full
                     hover:bg-primary/90 transition-colors"
          >
            살펴보기
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
