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
    <section className="relative w-full min-h-[70vh] md:min-h-[85vh] overflow-hidden bg-black flex items-center">
      {/* Background Image with parallax effect */}
      <motion.div
        initial={{ scale: 1.1 }}
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
            className="object-cover opacity-60 grayscale-[30%]"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-blue-900/40 to-black/80" />
        )}
      </motion.div>

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 z-10" />

      {/* Decorative vertical line */}
      <motion.div
        initial={{ height: 0 }}
        animate={{ height: "100px" }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="absolute left-6 md:left-12 top-0 w-[1px] bg-white/30 z-20 hidden md:block"
      />

      {/* Content */}
      <div className="container mx-auto px-6 md:px-12 relative z-20 pt-20">
        <div className="max-w-5xl">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Artist Name - Large font-serif */}
            <span className="block text-primary font-medium tracking-[0.2em] mb-4 text-sm md:text-base">
              FEATURED ARTIST
            </span>
            <h2 className="text-6xl md:text-8xl lg:text-[10rem] font-serif font-bold text-white leading-[0.9] tracking-tighter mb-8 italic">
              {data.artistName}
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="flex flex-col md:flex-row md:items-end gap-8"
          >
            {/* Title */}
            <div className="max-w-xl">
              <p className="text-xl md:text-2xl text-white/80 font-light leading-relaxed mb-8">
                {data.title}
              </p>

              {/* CTA Button */}
              <Link
                href={data.link}
                className="group relative inline-flex items-center gap-4 px-10 py-5 bg-white text-black font-semibold overflow-hidden transition-all hover:pr-12"
              >
                <span className="relative z-10">EXPLORE THE STORY</span>
                <svg
                  className="w-5 h-5 transition-transform group-hover:translate-x-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
                <div className="absolute top-0 left-0 w-0 h-full bg-primary transition-all duration-300 group-hover:w-full z-0 opacity-10" />
              </Link>
            </div>

            {/* Scroll Indicator */}
            <div className="hidden lg:flex flex-col items-center gap-4 ml-auto pb-4">
              <span className="text-[10px] tracking-[0.3em] font-medium text-white/40 uppercase vertical-text">
                Scroll Down
              </span>
              <div className="w-[1px] h-12 bg-white/20 relative overflow-hidden">
                <motion.div
                  animate={{ y: ["-100%", "100%"] }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    ease: "linear",
                  }}
                  className="absolute top-0 left-0 w-full h-full bg-primary"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        .vertical-text {
          writing-mode: vertical-rl;
        }
      `}</style>
    </section>
  );
}
