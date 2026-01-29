"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SectionHeader } from "./SectionHeader";
import { ItemCard, type ItemCardData } from "./ItemCard";

type CategoryTab = {
  id: string;
  label: string;
};

const itemTabs: CategoryTab[] = [
  { id: "newjeans", label: "#뉴진스 아이템" },
  { id: "blackpink", label: "#블랙핑크 아이템" },
];

const productTabs: CategoryTab[] = [
  { id: "clothes", label: "CLOTHES" },
  { id: "acc", label: "ACC" },
];

const sampleItems: ItemCardData[] = [
  {
    id: "1",
    brand: "RON ARAD STUDIO",
    name: "Bookworm Table",
    link: "/items/1",
    relatedStyles: 5,
  },
  {
    id: "2",
    brand: "RON ARAD STUDIO",
    name: "Bookworm Table",
    link: "/items/2",
    relatedStyles: 3,
  },
  {
    id: "3",
    brand: "RON ARAD STUDIO",
    name: "Bookworm Table",
    link: "/items/3",
    relatedStyles: 4,
  },
  {
    id: "4",
    brand: "RON ARAD STUDIO",
    name: "Bookworm Table",
    link: "/items/4",
    relatedStyles: 2,
  },
  {
    id: "5",
    brand: "RON ARAD STUDIO",
    name: "Bookworm Table",
    link: "/items/5",
    relatedStyles: 6,
  },
  {
    id: "6",
    brand: "RON ARAD STUDIO",
    name: "Bookworm Table",
    link: "/items/6",
    relatedStyles: 1,
  },
];

interface DiscoverItemsSectionProps {
  tabs?: CategoryTab[];
  items?: ItemCardData[];
  itemsByTab?: Record<string, ItemCardData[]>;
}

export function DiscoverItemsSection({
  tabs = itemTabs,
  items = sampleItems,
  itemsByTab,
}: DiscoverItemsSectionProps) {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  // Use itemsByTab if provided, otherwise fall back to items
  const displayItems = itemsByTab?.[activeTab] ?? items;

  return (
    <section className="py-10 md:py-16 px-4 md:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          title="DISCOVER ITEMS"
          subtitle="카테고리에 따른 다양한 아이템을 확인해보세요"
        />

        {/* Tabs */}
        <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-accent"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Items Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
          >
            {displayItems.map((item, index) => (
              <ItemCard key={item.id} data={item} index={index} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

interface DiscoverProductsSectionProps {
  tabs?: CategoryTab[];
  items?: ItemCardData[];
}

export function DiscoverProductsSection({
  tabs = productTabs,
  items = sampleItems,
}: DiscoverProductsSectionProps) {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  return (
    <section className="py-10 md:py-16 px-4 md:px-6 lg:px-8 bg-card">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          title="DISCOVER PRODUCTS"
          subtitle="카테고리에 따른 다양한 아이템을 확인해보세요"
        />

        {/* Category Tabs */}
        <div className="flex gap-3 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-accent"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Items Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
          >
            {items.map((item, index) => (
              <ItemCard key={item.id} data={item} index={index} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
