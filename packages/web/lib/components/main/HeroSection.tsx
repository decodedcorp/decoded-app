"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";

export interface HeroData {
  artistName: string;
  title: string;
  subtitle: string;
  imageUrl?: string;
  link: string;
  source?: "instagram" | "tiktok";
}

interface HeroSectionProps {
  data?: HeroData;
}

const defaultHeroData: HeroData = {
  artistName: "NewJeans Hanni",
  title: "Spring Vibes\nCollection",
  subtitle: "",
  link: "/feed",
  source: "instagram",
};

// Source badge gradient styles
const sourceBadgeStyles = {
  instagram: "bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#8134AF]",
  tiktok: "bg-gradient-to-r from-[#00f2ea] via-[#ff0050] to-[#00f2ea]",
};

export function HeroSection({ data = defaultHeroData }: HeroSectionProps) {
  return (
    <Link href={data.link}>
      <section className="relative w-full h-[700px] md:h-[600px] overflow-hidden">
        {/* Background Image */}
        <motion.div
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 z-0"
        >
          {data.imageUrl ? (
            <Image
              src={data.imageUrl}
              alt={data.artistName}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-900" />
          )}
        </motion.div>

        {/* Gradient Overlay - bottom to top */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />

        {/* Content */}
        <div className="absolute inset-0 z-20 flex flex-col justify-end px-6 pb-10 md:px-16 md:pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col gap-3 md:gap-4"
          >
            {/* Hero Title */}
            <h1 className="text-[42px] md:text-[64px] font-serif font-bold text-white leading-[1.1] whitespace-pre-line">
              {data.title}
            </h1>

            {/* Meta: Artist Name + Source Badge */}
            <div className="flex items-center gap-2 md:gap-3">
              <span className="text-sm md:text-lg font-medium text-neutral-400">
                {data.artistName}
              </span>
              <span className="text-sm md:text-lg text-neutral-400">·</span>
              {data.source && (
                <span
                  className={`px-2 py-1 md:px-3 md:py-1.5 text-[11px] md:text-[13px] font-semibold text-white rounded ${sourceBadgeStyles[data.source]}`}
                >
                  {data.source === "instagram" ? "Instagram" : "TikTok"}
                </span>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </Link>
  );
}
