"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { Lock, Trophy, Star, ShieldCheck } from "lucide-react";
import type { BadgeRow } from "@/lib/supabase/types";

interface BadgeGridSectionProps {
  badges: BadgeRow[];
}

interface BadgeItemProps {
  badge: BadgeRow;
  delay?: number;
}

function BadgeItem({ badge, delay = 0 }: BadgeItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex flex-col items-center gap-4 rounded-[32px] border border-white/5 bg-white/[0.03] p-5 transition-all duration-700 hover:bg-white/[0.07] hover:border-white/10 hover:-translate-y-1 shadow-xl"
    >
      <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-black/60 backdrop-blur-xl transition-all duration-700 group-hover:scale-110 group-hover:border-primary/40 shadow-2xl">
        {badge.icon_url ? (
          <div className="relative h-8 w-8">
            <Image
              src={badge.icon_url}
              alt={badge.name}
              fill
              className="object-contain grayscale group-hover:grayscale-0 transition-all duration-700"
            />
          </div>
        ) : (
          <div className="relative">
              <Trophy className="h-7 w-7 text-white/10 transition-colors duration-700 group-hover:text-primary" />
             <Star className="absolute -top-1 -right-1 h-4 w-4 text-primary/20 group-hover:text-primary animate-pulse" />
          </div>
        )}
        
        {/* Status Overlay */}
        <div className="absolute -bottom-0.5 -right-0.5 h-6 w-6 rounded-full border border-white/10 bg-black flex items-center justify-center shadow-lg group-hover:border-primary/20 transition-colors">
          <Lock className="h-2.5 w-2.5 text-white/30 group-hover:text-primary/50 transition-colors" />
        </div>
      </div>
      
      <div className="text-center space-y-2">
        <h4 className="line-clamp-1 text-xs font-sans font-bold tracking-[0.15em] text-white/80 group-hover:text-white transition-colors uppercase">
          {badge.name}
        </h4>
        <p className="line-clamp-2 text-[10px] font-sans font-medium uppercase tracking-[0.2em] text-white/20 group-hover:text-white/40 transition-colors px-2">
          {badge.description || "Experimental Challenge"}
        </p>
      </div>

      {/* Rarity Indicator */}
      <div className="absolute top-6 right-8">
        <div className="w-1.5 h-1.5 rounded-full bg-white/5 group-hover:bg-primary transition-all duration-700 shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
      </div>
    </motion.div>
  );
}

export function BadgeGridSection({ badges }: BadgeGridSectionProps) {
  if (!badges || badges.length === 0) return null;

  return (
    <section className="py-16 md:py-24 bg-black px-6 md:px-12 relative overflow-hidden">
      {/* Premium Background Decorative Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(var(--primary),0.08),transparent_70%)] pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-10">
          <div className="max-w-xl">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="text-primary font-sans font-bold tracking-[0.4em] text-[10px] md:text-xs uppercase mb-6 block">
                Achievements
              </span>
              <h2 className="text-4xl md:text-5xl font-serif font-bold italic tracking-tighter text-white leading-[0.9]">
                Challenge<br />& Achieve
              </h2>
            </motion.div>
          </div>
          <button className="group relative flex items-center gap-4 text-[10px] font-sans font-bold tracking-[0.4em] text-white/40 hover:text-white transition-all uppercase px-12 py-6 border border-white/10 rounded-full hover:border-primary/40 hover:bg-white/[0.02] shadow-2xl overflow-hidden">
            <span className="relative z-10">Discover goals</span>
            <div className="w-8 h-[1px] bg-white/10 group-hover:bg-primary transition-all group-hover:w-12 relative z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {badges.map((badge, index) => (
            <BadgeItem key={badge.id} badge={badge} delay={0.05 * (index % 6)} />
          ))}
        </div>
      </div>
    </section>
  );
}
