"use client";

import { motion, type Variants } from "motion/react";
import type { BadgeRow } from "@/lib/supabase/types";
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
  BadgeGridSection,
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
  badges: BadgeRow[];
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
  badges,
}: HomeAnimatedContentProps) {
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
            items={decodedPickItems}
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
          <ArtistSpotlightSection data={artistSpotlightStyles} />
        </motion.div>

        {/* What's New Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariants}
        >
          <WhatsNewSection styles={whatsNewStyles} items={whatsNewItems} />
        </motion.div>

        {/* Achievement Badges Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariants}
        >
          <BadgeGridSection badges={badges} />
        </motion.div>

        {/* Discover Items Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariants}
        >
          <DiscoverItemsSection itemsByTab={discoverItemsByTab} />
        </motion.div>

        {/* Discover Products Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariants}
        >
          <DiscoverProductsSection items={bestItems} />
        </motion.div>

        {/* Best Item Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariants}
        >
          <BestItemSection items={bestItems} />
        </motion.div>

        {/* Weekly Best Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariants}
        >
          <WeeklyBestSection styles={weeklyBestStyles} />
        </motion.div>

        {/* Trending Now Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariants}
        >
          <TrendingNowSection keywords={trendingKeywords} />
        </motion.div>
      </main>
    </>
  );
}
