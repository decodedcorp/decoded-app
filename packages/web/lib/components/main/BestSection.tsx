"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { SectionHeader } from "./SectionHeader";
import { ItemCard, type ItemCardData } from "./ItemCard";

const sampleBestItems: ItemCardData[] = [
  {
    id: "1",
    brand: "RON ARAD STUDIO",
    name: "Bookworm Table",
    link: "/items/1",
    badge: "BEST",
    relatedStyles: 12,
  },
  {
    id: "2",
    brand: "RON ARAD STUDIO",
    name: "Bookworm Chair",
    link: "/items/2",
    badge: "BEST",
    relatedStyles: 8,
  },
  {
    id: "3",
    brand: "RON ARAD STUDIO",
    name: "Bookworm Lamp",
    link: "/items/3",
    relatedStyles: 6,
  },
  {
    id: "4",
    brand: "RON ARAD STUDIO",
    name: "Bookworm Shelf",
    link: "/items/4",
    relatedStyles: 5,
  },
  {
    id: "5",
    brand: "RON ARAD STUDIO",
    name: "Bookworm Desk",
    link: "/items/5",
    relatedStyles: 4,
  },
  {
    id: "6",
    brand: "RON ARAD STUDIO",
    name: "Bookworm Sofa",
    link: "/items/6",
    relatedStyles: 3,
  },
];

interface BestItemSectionProps {
  items?: ItemCardData[];
}

export function BestItemSection({ items = sampleBestItems }: BestItemSectionProps) {
  return (
    <section className="py-10 md:py-16 px-4 md:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          title="BEST ITEM"
          subtitle="관심을 많이 받은 아이템을 확인해보세요"
        />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {items.map((item, index) => (
            <ItemCard key={item.id} data={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

// Weekly Best Styles
interface WeeklyBestStyle {
  id: string;
  artistName: string;
  imageUrl?: string;
  link: string;
}

const sampleWeeklyStyles: WeeklyBestStyle[] = [
  { id: "1", artistName: "뉴진스_다니엘", link: "/feed" },
  { id: "2", artistName: "뉴진스_혜인", link: "/feed" },
  { id: "3", artistName: "뉴진스_민지", link: "/feed" },
  { id: "4", artistName: "뉴진스_하니", link: "/feed" },
  { id: "5", artistName: "블랙핑크_제니", link: "/feed" },
  { id: "6", artistName: "블랙핑크_로제", link: "/feed" },
  { id: "7", artistName: "IVE_장원영", link: "/feed" },
  { id: "8", artistName: "IVE_안유진", link: "/feed" },
];

interface WeeklyBestSectionProps {
  styles?: WeeklyBestStyle[];
  itemsPerPage?: number;
}

export function WeeklyBestSection({
  styles = sampleWeeklyStyles,
  itemsPerPage = 4,
}: WeeklyBestSectionProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = Math.ceil(styles.length / itemsPerPage);

  const currentStyles = styles.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const goToPrevious = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : totalPages - 1));
  };

  const goToNext = () => {
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : 0));
  };

  return (
    <section className="py-10 md:py-16 px-4 md:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">
              WEEKLY BEST
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              일주일간 가장 관심을 많이 받은 스타일을 확인해보세요
            </p>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">
              {currentPage + 1} / {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                onClick={goToPrevious}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={goToNext}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                aria-label="Next page"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Styles Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {currentStyles.map((style, index) => (
              <motion.a
                key={style.id}
                href={style.link}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group block"
              >
                <div className="aspect-[3/4] bg-gray-200 rounded-xl overflow-hidden mb-2">
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 group-hover:scale-105 transition-transform duration-300" />
                </div>
                <p className="text-sm font-medium text-gray-900 text-center">
                  {style.artistName}
                </p>
              </motion.a>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
