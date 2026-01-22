"use client";

import { SectionHeader } from "./SectionHeader";
import { StyleCard, type StyleCardData } from "./StyleCard";
import { ItemCard, type ItemCardData } from "./ItemCard";

const sampleNewStyles: StyleCardData[] = [
  {
    id: "1",
    title: "How Sweet 뮤비 속 다니엘",
    description:
      "뉴진스의 다니엘이 'How Sweet' 뮤비에서 Nike Cortes Nylon Midnight Navy를 매치해 스타일을 완성했다.",
    artistName: "뉴진스_다니엘",
    link: "/feed",
    items: [
      { id: "a", label: "A", brand: "Nike", name: "Cortez" },
      { id: "b", label: "B", brand: "Neighborhood", name: "Beanie" },
    ],
  },
  {
    id: "2",
    title: "How Sweet 뮤비 속 혜린",
    description: "뉴진스 혜린의 스위트한 스타일링.",
    artistName: "뉴진스_혜린",
    link: "/feed",
    items: [
      { id: "a", label: "A", brand: "Adidas", name: "Samba" },
      { id: "b", label: "B", brand: "Zara", name: "Cardigan" },
    ],
  },
];

const sampleNewItems: ItemCardData[] = [
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
  {
    id: "3",
    brand: "RON ARAD STUDIO",
    name: "Bookworm Table",
    link: "/items/3",
    badge: "TOP",
    relatedStyles: 4,
  },
  {
    id: "4",
    brand: "RON ARAD STUDIO",
    name: "Bookworm Table",
    link: "/items/4",
    relatedStyles: 2,
  },
];

interface WhatsNewSectionProps {
  styles?: StyleCardData[];
  items?: ItemCardData[];
}

export function WhatsNewSection({
  styles = sampleNewStyles,
  items = sampleNewItems,
}: WhatsNewSectionProps) {
  return (
    <section className="py-10 md:py-16 px-4 md:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          title="WHAT'S NEW"
          subtitle="새로운 스타일을 확인해보세요"
          viewMoreLink="/feed"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {styles.map((style, index) => (
            <div key={style.id} className="space-y-4">
              <StyleCard
                data={style}
                variant="medium"
                showItems={true}
                index={index}
              />
              <div className="grid grid-cols-2 gap-3">
                {items.slice(index * 2, index * 2 + 2).map((item, i) => (
                  <ItemCard key={item.id} data={item} index={i} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
