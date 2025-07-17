'use client';

export function LinkCardSkeleton() {
  return (
    <div className="relative w-full my-3 mx-auto max-w-[340px]">
      <div className="bg-[#111111] border border-white/5 rounded-lg overflow-hidden animate-pulse">
        <div className="w-full h-44 bg-[#1A1A1A]"></div>
        <div className="p-4">
          <div className="h-5 bg-[#1A1A1A] rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-[#1A1A1A] rounded w-full mb-1"></div>
          <div className="h-4 bg-[#1A1A1A] rounded w-2/3"></div>
          <div className="h-3 bg-[#1A1A1A] rounded w-1/3 mt-3"></div>
        </div>
      </div>
    </div>
  );
}
