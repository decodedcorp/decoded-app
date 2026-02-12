"use client";

import { motion, type Variants } from "motion/react";
import {
  HeroSection,
  DecodedPickSection,
  ArtistSpotlightSection,
  WhatsNewSection,
  DiscoverItemsSection,
  DiscoverProductsSection,
  BestItemSection,
  WeeklyBestSection,
  TrendingNowSection,
  TodayDecodedSection,
} from "./";
import type { HeroData } from "./HeroSection";
import type { ItemCardData } from "./ItemCard";
import type { StyleCardData } from "./StyleCard";
import type {
  WeeklyBestStyle,
  TrendingKeyword,
} from "@/lib/utils/main-page-mapper";

interface HomeAnimatedContentProps {
  heroData?: HeroData;
  weeklyBestStyles: WeeklyBestStyle[];
  bestItems: ItemCardData[];
  whatsNewStyles: StyleCardData[];
  whatsNewItems: ItemCardData[];
  decodedPickStyle?: StyleCardData;
  decodedPickItems: ItemCardData[];
  artistSpotlightStyles: StyleCardData[];
  discoverItemsByTab: Record<string, ItemCardData[]>;
  trendingKeywords: TrendingKeyword[];
}

export function HomeAnimatedContent({
  heroData,
  weeklyBestStyles,
  bestItems,
  whatsNewStyles,
  whatsNewItems,
  decodedPickStyle,
  decodedPickItems,
  artistSpotlightStyles,
  discoverItemsByTab,
  trendingKeywords,
}: HomeAnimatedContentProps) {
  // Convert empty arrays to undefined so component default sample data kicks in
  const orUndef = <T,>(arr: T[]): T[] | undefined =>
    arr.length > 0 ? arr : undefined;
  const hasItems = (obj: Record<string, ItemCardData[]>): boolean =>
    Object.values(obj).some((arr) => arr.length > 0);

  const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <>
      <HeroSection data={heroData} />

      <main>
        {/* DECODED'S PICK Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariants}
        >
          <DecodedPickSection
            styleData={decodedPickStyle}
            items={orUndef(decodedPickItems)}
          />
        </motion.div>

        {/* TODAY'S DECODED Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariants}
        >
          <TodayDecodedSection />
        </motion.div>

        {/* Artist Spotlight Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariants}
        >
          <ArtistSpotlightSection data={orUndef(artistSpotlightStyles)} />
        </motion.div>

        {/* What's New Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariants}
        >
          <WhatsNewSection
            styles={orUndef(whatsNewStyles)}
            items={orUndef(whatsNewItems)}
          />
        </motion.div>

        {/* Discover Items Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariants}
        >
          <DiscoverItemsSection
            itemsByTab={hasItems(discoverItemsByTab) ? discoverItemsByTab : undefined}
          />
        </motion.div>

        {/* Discover Products Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariants}
        >
          <DiscoverProductsSection items={orUndef(bestItems)} />
        </motion.div>

        {/* Best Item Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariants}
        >
          <BestItemSection items={orUndef(bestItems)} />
        </motion.div>

        {/* Weekly Best Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariants}
        >
          <WeeklyBestSection styles={orUndef(weeklyBestStyles)} />
        </motion.div>

        {/* Trending Now Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariants}
        >
          <TrendingNowSection keywords={orUndef(trendingKeywords)} />
        </motion.div>
      </main>
    </>
  );
}
