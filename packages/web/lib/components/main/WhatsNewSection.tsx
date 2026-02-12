"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { StyleCard, type StyleCardData } from "./StyleCard";
import { ItemCard, type ItemCardData } from "./ItemCard";

interface WhatsNewSectionProps {
  styles?: StyleCardData[];
  items?: ItemCardData[];
}

export function WhatsNewSection({
  styles = [],
  items = [],
}: WhatsNewSectionProps) {
  // Hide section if no data
  if (styles.length === 0 && items.length === 0) {
    return null;
  }

  return (
    <section className="py-24 md:py-40 bg-[#050505] px-6 md:px-12 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-[-10%] w-[500px] h-[500px] bg-white/[0.02] rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 md:mb-32 gap-10">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="text-primary font-sans font-bold tracking-[0.4em] text-[10px] md:text-xs uppercase mb-6 block">
                Latest Arrivals
              </span>
              <h2 className="text-6xl md:text-8xl font-serif font-bold italic tracking-tighter text-white mb-10 leading-[0.85]">
                What's New
              </h2>
              <p className="text-white/40 font-sans font-light text-xl md:text-2xl leading-relaxed max-w-xl">
                Fresh narratives, captures, and curated styles from our global
                collective of visual storytellers.
              </p>
            </motion.div>
          </div>
          <Link
            href="/feed"
            className="group flex items-center gap-5 text-xs font-sans font-bold tracking-[0.3em] text-white/30 hover:text-white transition-all uppercase"
          >
            <span>Explore full feed</span>
            <div className="w-16 h-[1px] bg-white/10 group-hover:bg-primary transition-all group-hover:w-20" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24">
          {styles.map((style, index) => (
            <motion.div
              key={style.id}
              className="group/container"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 1,
                delay: index * 0.2,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <div className="relative mb-12 overflow-hidden rounded-[40px] shadow-[0_40px_100px_rgba(0,0,0,0.6)] transition-all duration-700 group-hover/container:-translate-y-3 group-hover/container:shadow-[0_50px_120px_rgba(0,0,0,0.8)]">
                <StyleCard
                  data={style}
                  variant="large"
                  showItems={false}
                  index={index}
                />
              </div>

              <div className="grid grid-cols-2 gap-8 px-2">
                {items.slice(index * 2, index * 2 + 2).map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.6,
                      delay: 0.3 + i * 0.1,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <ItemCard data={item} index={i} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
