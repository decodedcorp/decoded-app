// app/(main)/components/sections/discover/index.tsx
'use client';

import { useEffect, useState } from 'react';
import { DiscoverInfo } from '@/types/model';
import { ItemsGallery } from '../../layouts/gallery/items';
import { mockDiscover } from '@/lib/constants/mock-data';
import { SectionHeader } from '../../layouts/section-header';
import { pretendardBold } from '@/lib/constants/fonts';

export function DiscoverSection() {
  const [discover, setDiscover] = useState<DiscoverInfo[] | null>(null);
  const [sectionState, setSectionState] = useState<{
    sections: string[];
    currentSection: string;
  } | null>(null);
  const [items, setItems] = useState<Record<
    string,
    Array<{
      name: string;
      imageUrl: string;
      brand: string;
    }>
  > | null>(null);

  useEffect(() => {
    const fetchDiscover = async () => {
      setDiscover(mockDiscover);
      setSectionState({
        sections: mockDiscover.map((section) => section.section),
        currentSection: mockDiscover[0].section,
      });
      const itemsMap = mockDiscover.reduce(
        (acc, section) => ({
          ...acc,
          [section.section]: section.items,
        }),
        {}
      );
      setItems(itemsMap);
    };
    fetchDiscover();
  }, []);

  return (
    <div className="flex flex-col w-full mt-10 md:mt-20 bg-[#F2F2F2] p-4 md:p-20">
      <div className="flex flex-col md:flex-row w-full justify-between items-start md:items-center">
        <SectionHeader
          title="DISCOVER ITEMS"
          subtitle="카테고리에 따른 다양한 아이템을 확인해보세요"
          className="mb-4 md:mb-0"
          textColor="black"
        />
        <CategoryTabs
          sectionState={sectionState}
          onSectionChange={(section) => {
            if (sectionState) {
              setSectionState({
                ...sectionState,
                currentSection: section,
              });
            }
          }}
        />
      </div>
      {sectionState && items && (
        <ItemsGallery items={items[sectionState.currentSection]} />
      )}
    </div>
  );
}

interface CategoryTabsProps {
  sectionState: {
    sections: string[];
    currentSection: string;
  } | null;
  onSectionChange: (section: string) => void;
}

function CategoryTabs({ sectionState, onSectionChange }: CategoryTabsProps) {
  if (!sectionState) return null;

  return (
    <div className="flex flex-wrap md:flex-nowrap md:w-[20vw]">
      {sectionState.sections.map((section, index) => (
        <div
          key={index}
          className="flex flex-col mr-4 md:mr-0 md:w-full mb-2 md:mb-0"
        >
          <p
            className={`${
              pretendardBold.className
            } text-sm md:text-lg text-black cursor-pointer ${
              sectionState.currentSection === section
                ? 'text-black'
                : 'text-black/50'
            }`}
            onClick={() => onSectionChange(section)}
          >
            {section.toUpperCase()}
          </p>
        </div>
      ))}
    </div>
  );
}
