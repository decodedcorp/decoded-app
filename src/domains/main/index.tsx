'use client';

import React from 'react';

// 로컬 컴포넌트 import
import ThiingsGrid from './ThiingsGrid';

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
