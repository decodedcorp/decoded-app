// app/(main)/components/sections/spotlight/index.tsx
'use client';

import { useEffect, useState } from 'react';
import { SpotlightInfo } from '@/types/model';
import { SpotlightLayout } from '../../layouts/text-image';
import { mockSpotlight } from '@/lib/constants/mock-data';
import { SectionHeader } from '../../layouts/section-header';

export function SpotlightView() {
  const [spotlight, setSpotlight] = useState<SpotlightInfo | null>(null);

  useEffect(() => {
    const fetchSpotlight = async () => {
      setSpotlight(mockSpotlight);
    };
    fetchSpotlight();
  }, []);

  if (!spotlight) return null;

  return (
    <div className="flex flex-col w-full mt-20 bg-[#171717] p-20">
      <SectionHeader
        title="ARTIST SPOTLIGHT"
        subtitle="아티스트의 다양한 스타일을 확인해보세요"
        className="mb-10"
      />
      <SpotlightLayout spotlight={spotlight} />
    </div>
  );
}
