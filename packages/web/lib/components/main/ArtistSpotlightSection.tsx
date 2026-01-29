"use client";

import { SectionHeader } from "./SectionHeader";
import { StyleCard, type StyleCardData } from "./StyleCard";

const sampleSpotlightData: StyleCardData[] = [
  {
    id: "1",
    title: "ROSE x FUMA",
    description:
      "뉴진스의 다니엘이 'How Sweet' 뮤비에서 Nike Cortes Nylon Midnight Navy, 핑크 아노락을 매치해 스타일을 완성했다.",
    artistName: "뉴진스_다니엘",
    link: "/feed",
  },
  {
    id: "2",
    title: "IVE 장원영 공항패션",
    description: "IVE 장원영이 공항에서 착용한 럭셔리 브랜드 아이템들.",
    artistName: "IVE_장원영",
    link: "/feed",
  },
];

interface ArtistSpotlightSectionProps {
  data?: StyleCardData[];
}

export function ArtistSpotlightSection({
  data = sampleSpotlightData,
}: ArtistSpotlightSectionProps) {
  return (
    <section className="py-10 md:py-16 px-4 md:px-6 lg:px-8 bg-card">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          title="ARTIST SPOTLIGHT"
          subtitle="아티스트의 다양한 스타일을 확인해보세요"
          viewMoreLink="/artist"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.map((item, index) => (
            <StyleCard
              key={item.id}
              data={item}
              variant="medium"
              showItems={false}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
