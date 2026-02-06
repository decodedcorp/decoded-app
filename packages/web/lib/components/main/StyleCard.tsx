"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export interface StyleCardData {
  id: string;
  title: string;
  description: string;
  artistName: string;
  imageUrl?: string;
  link: string;
  items?: {
    id: string;
    label: string;
    brand: string;
    name: string;
    imageUrl?: string;
  }[];
  spots?: {
    id: string;
    x: number;
    y: number;
    label?: string;
  }[];
}

interface StyleCardProps {
  data: StyleCardData;
  variant?: "large" | "medium" | "small";
  showItems?: boolean;
  index?: number;
}

export function StyleCard({
  data,
  variant = "medium",
  showItems = true,
  index = 0,
}: StyleCardProps) {
  const aspectClasses = {
    large: "aspect-[4/3]",
    medium: "aspect-[3/4]",
    small: "aspect-square",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: index * 0.1 }}
      className={cn(
        "group relative overflow-hidden rounded-[24px] md:rounded-[40px] bg-neutral-900 transition-all duration-700 hover:shadow-[0_30px_60px_rgba(0,0,0,0.6)]",
        aspectClasses[variant]
      )}
    >
      <Link href={data.link} className="absolute inset-0 block">
        {/* Background Image with Hover Zoom */}
        <div className="absolute inset-0 overflow-hidden">
          {data.imageUrl ? (
            <Image
              src={data.imageUrl}
              alt={data.title}
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-110 group-hover:rotate-1"
            />
          ) : (
            <div className="absolute inset-0 bg-neutral-800" />
          )}
        </div>

        {/* Premium Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />

        {/* Content Container */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10 flex flex-col gap-3">
          {/* Label */}
          <div className="flex items-center gap-3 mb-1">
            <span className="w-6 h-[1px] bg-primary" />
            <p className="text-primary font-sans font-bold tracking-[0.25em] text-[10px] uppercase">
              Narrative
            </p>
          </div>

          {/* Artist Name */}
          <h4 className="text-sm md:text-base font-serif italic text-white/60 mb-1 group-hover:text-white transition-colors">
            {data.artistName}
          </h4>

          {/* Title */}
          <h3 className="text-2xl md:text-3xl font-sans font-bold text-white leading-tight tracking-tight line-clamp-2">
            {data.title}
          </h3>

          {/* Interaction Indicator */}
          <div className="flex items-center gap-6 mt-4 overflow-hidden h-8">
            <span className="text-[10px] font-sans font-bold tracking-[0.3em] text-primary uppercase transform translate-y-full group-hover:translate-y-0 transition-transform duration-600 ease-[0.16,1,0.3,1]">
              Explore details
            </span>
            <div className="flex-1 h-[1px] bg-white/10 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-800 delay-100" />
          </div>
        </div>

        {/* Spot Markers (Enhanced Pulse Overlay) */}
        {data.spots && data.spots.length > 0 && (
          <div className="absolute inset-0 pointer-events-none z-20">
            {data.spots.map((spot) => (
              <motion.div
                key={spot.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="absolute w-8 h-8 -ml-4 -mt-4 flex items-center justify-center"
                style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
              >
                <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-30 duration-[2000ms]" />
                <div className="relative w-3 h-3 bg-white rounded-full shadow-[0_0_25px_rgba(255,255,255,1)] border border-black/20" />
              </motion.div>
            ))}
          </div>
        )}
      </Link>
    </motion.div>
  );
}
