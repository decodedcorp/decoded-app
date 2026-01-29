"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { StyleCard, type StyleCardData } from "./StyleCard";
import { ItemCard, type ItemCardData } from "./ItemCard";

// Sample data - will be replaced with real data later
const sampleStyleData: StyleCardData = {
  id: "1",
  title: "How Sweet 뮤비 속 다니엘",
  description:
    "뉴진스의 다니엘이 'How Sweet' 뮤비에서 Nike Cortes Nylon Midnight Navy, 핑크 아노락, Neighborhood 브라운 비니, North Works 악세서리, BIG BOY JEAN PALE TAUPE를 매치해 스타일을 완성했다.",
  artistName: "뉴진스_다니엘",
  link: "/feed",
  items: [
    { id: "a", label: "A", brand: "Nike", name: "Cortez" },
    { id: "b", label: "B", brand: "Neighborhood", name: "Beanie" },
  ],
};

const sampleItems: ItemCardData[] = [
  {
    id: "1",
    brand: "RON ARAD STUDIO",
    name: "Bookworm Table",
    link: "/items/1",
    badge: "TOP",
    relatedStyles: 5,
  },
  {
    id: "2",
    brand: "RON ARAD STUDIO",
    name: "Bookworm Table",
    link: "/items/2",
    relatedStyles: 3,
  },
];

interface DecodedPickSectionProps {
  styleData?: StyleCardData;
  items?: ItemCardData[];
}

export function DecodedPickSection({
  styleData = sampleStyleData,
  items = sampleItems,
}: DecodedPickSectionProps) {
  return (
    <section className="py-10 md:py-16 px-4 md:px-6 lg:px-8 bg-card overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-6xl font-serif font-bold italic mb-2">
              DECODED'S <span className="text-primary not-italic">PICK</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-md">
              디코디드가 큐레이션한 이달의 가장 감각적인 스타일과 아이코닉한
              아이템.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden md:block"
          >
            <div className="flex items-center gap-4 text-xs tracking-[0.2em] font-bold text-muted-foreground uppercase">
              <span className="w-12 h-[1px] bg-muted-foreground/30" />
              CURATED SELECTION
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Main Style Card - Elevated with shadow and offset */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="lg:col-span-7 relative z-10"
          >
            <div className="relative group">
              <div className="absolute -inset-4 bg-primary/5 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <StyleCard data={styleData} variant="large" showItems={true} />
            </div>
          </motion.div>

          {/* Item Cards - Stacked with staggered scroll effect */}
          <div className="lg:col-span-5 flex flex-col gap-6 lg:mt-24">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 + index * 0.2 }}
              >
                <div className="transform hover:-translate-y-2 transition-transform duration-500">
                  <ItemCard data={item} index={index} />
                </div>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-4"
            >
              <Link
                href="/feed"
                className="inline-flex items-center gap-4 group text-sm font-bold tracking-widest uppercase"
              >
                <span>VIEW ALL PICKS</span>
                <div className="w-10 h-[10px] relative overflow-hidden">
                  <div className="absolute top-1/2 left-0 w-full h-[1px] bg-foreground group-hover:translate-x-full transition-transform duration-500" />
                  <div className="absolute top-1/2 -left-full w-full h-[1px] bg-primary group-hover:left-0 transition-all duration-500" />
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
