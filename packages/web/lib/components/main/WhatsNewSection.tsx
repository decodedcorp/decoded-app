"use client";

import { SectionHeader } from "./SectionHeader";
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
    <section className="py-10 md:py-16 px-4 md:px-6 lg:px-8 bg-card">
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
