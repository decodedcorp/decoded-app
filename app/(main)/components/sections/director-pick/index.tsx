"use client";

import { useEffect, useState } from "react";
import { PickInfo } from "@/types/model";
import { MainLeftGrid } from "../../layouts/grid-section/main-left";
import { MainRightGrid } from "../../layouts/grid-section/main-right";
import { SectionHeader } from "../../layouts/section-header";
import { mockPicks } from "@/lib/constants/mock-data";

export function DirectorPicks() {
  const [picks, setPicks] = useState<PickInfo[]>([]);

  useEffect(() => {
    const fetchPicks = async () => {
      setPicks(mockPicks);
    };
    fetchPicks();
  }, []);

  return (
    <div className="flex flex-col w-full mt-10 md:mt-20">
      <SectionHeader 
        title="DECODED'S PICK"
        subtitle="디코디드가 선택한 스타일을 확인하세요"
      />
      <div className="flex flex-col w-full mt-6 md:mt-10">
        {picks.map((pick, index) => (
          <div key={index}>
            <div className="flex flex-col lg:flex-row w-full mt-6 md:mt-10 justify-center px-4 md:px-20">
              {index % 2 === 0 ? (
                <MainLeftGrid pick={pick} />
              ) : (
                <MainRightGrid pick={pick} />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}