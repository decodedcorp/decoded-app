'use client';

import React from 'react';

// 레거시 컴포넌트 임시 import (실제 마이그레이션 시 src/domains/main/로 복사/리팩터 필요)
import ThiingsGrid from '../../../backup/app/(main)/_components/ThiingsGrid';
import { ImageSidebar } from '../../../backup/app/(main)/_components/sidebar/ImageSidebar';
import FabMenu from '../../../backup/app/(main)/_components/footer/FabMenu';

export function MainPage() {
  return (
    <main className="w-full h-full flex flex-col bg-black relative">
      <div className="flex w-full h-full relative">
        {/* 그리드 영역 */}
        <div className="h-full relative bg-black w-full">
          <ThiingsGrid gridWidth={100} gridHeight={100} renderItem={() => <div />} />
        </div>
        {/* 사이드바 영역 */}
        {/* <div className="h-full bg-white w-0">
          <ImageSidebar
            isOpen={false}
            onClose={() => {}}
            imageDetail={null}
            isFetchingDetail={false}
            detailError={null}
          />
        </div> */}
      </div>
      {/* <FabMenu /> */}
    </main>
  );
}
