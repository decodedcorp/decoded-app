"use client";

import { SectionHeader } from "./SectionHeader";
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
    <section className="py-10 md:py-16 px-4 md:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          title="DECODED'S PICK"
          subtitle="디코디드가 선택한 스타일을 확인해보세요"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Style Card */}
          <div className="lg:col-span-2">
            <StyleCard data={styleData} variant="large" showItems={true} />
          </div>

          {/* Item Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
            {items.map((item, index) => (
              <ItemCard key={item.id} data={item} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
