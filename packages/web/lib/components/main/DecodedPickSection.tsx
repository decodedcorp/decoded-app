"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import type { StyleCardData } from "./StyleCard";
import type { ItemCardData } from "./ItemCard";

// Sample data - will be replaced with real data later
const sampleStyleData: StyleCardData = {
  id: "1",
  title: "Casual Street\nLook",
  description: "",
  artistName: "Blackpink Lisa",
  link: "/feed",
  imageUrl:
    "https://images.unsplash.com/photo-1699847061593-188987efcd3e?w=600",
  items: [],
};

const sampleItems: ItemCardData[] = [
  {
    id: "1",
    brand: "Prada",
    name: "Prada Bag",
    link: "/items/1",
    price: "$2,450",
    imageUrl:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400",
  },
  {
    id: "2",
    brand: "Celine",
    name: "Celine Shades",
    link: "/items/2",
    price: "$580",
    imageUrl:
      "https://images.unsplash.com/photo-1564848005333-590727c99921?w=400",
  },
  {
    id: "3",
    brand: "Nike",
    name: "Nike AF1",
    link: "/items/3",
    price: "$120",
    imageUrl:
      "https://images.unsplash.com/photo-1518738458435-19149697112a?w=400",
  },
  {
    id: "4",
    brand: "Gold",
    name: "Gold Chain",
    link: "/items/4",
    price: "$890",
    imageUrl:
      "https://images.unsplash.com/photo-1641206189215-9533ceb7a1df?w=400",
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
  // Limit items to 4 for mobile 2x2 grid, desktop shows all
  const displayItems = items.slice(0, 4);

  return (
    <section className="bg-card rounded-t-2xl p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 md:mb-8">
        <h2 className="text-2xl md:text-[32px] font-serif font-bold">
          Decoded's Pick
        </h2>
        <Link
          href="/feed"
          className="text-[13px] md:text-sm font-medium text-primary"
        >
          View All
        </Link>
      </div>

      {/* Content: Featured Card + Item Grid */}
      <div className="flex gap-3 md:gap-6">
        {/* Featured Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Link
            href={styleData.link}
            className="block relative w-[180px] h-[240px] md:w-[320px] md:h-[400px] rounded-xl overflow-hidden"
          >
            {styleData.imageUrl ? (
              <Image
                src={styleData.imageUrl}
                alt={styleData.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-neutral-700" />
            )}
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-3 md:p-5 flex flex-col gap-1 md:gap-2">
              <span className="text-sm md:text-lg font-semibold text-white leading-[1.2] whitespace-pre-line">
                {styleData.title}
              </span>
              <span className="text-[11px] md:text-sm text-neutral-400">
                {styleData.artistName}
              </span>
            </div>
          </Link>
        </motion.div>

        {/* Item Grid - 2x2 on mobile, horizontal row on desktop */}
        <div className="flex-1 grid grid-cols-2 gap-3 md:flex md:gap-4">
          {displayItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 * (index + 1) }}
            >
              <Link
                href={item.link}
                className="block relative h-[114px] md:h-[200px] md:w-full rounded-lg overflow-hidden"
              >
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-neutral-600" />
                )}
                {/* Content overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-2 md:p-3 flex flex-col gap-0.5 md:gap-1">
                  <span className="text-[11px] md:text-[13px] font-medium text-white">
                    {item.name}
                  </span>
                  {item.price && (
                    <span className="text-[10px] md:text-xs text-primary">
                      {item.price}
                    </span>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
