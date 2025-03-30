import { Metadata } from "next";
import { Suspense } from "react";
import { MyPageClient } from "./components/MyPageClient";
import { Skeleton } from "../../components/ui/skeleton";
import { Settings } from "lucide-react";
import { ProfileSection } from "./components/ProfileSection";

export default function MyPagePage() {
  return (
    <main className="mx-auto pt-20 px-16">
      <ProfileSection />
      <Suspense fallback={<MyPageSkeleton />}>
        <MyPageClient />
      </Suspense>
    </main>
  );
}

function MyPageSkeleton() {
  return (
    <div className="space-y-8">
      {/* 탭 스켈레톤 */}
      <div className="border-b border-white/10 pb-4">
        <div className="flex space-x-4">
          <Skeleton className="h-8 w-14 rounded-md" />
          <Skeleton className="h-8 w-14 rounded-md" />
        </div>
      </div>
      
      {/* 필터 스켈레톤 */}
      <div className="flex border-b border-white/10 pb-4">
        <Skeleton className="h-8 w-16 rounded-md mr-4" />
        <Skeleton className="h-8 w-16 rounded-md mr-4" />
        <Skeleton className="h-8 w-16 rounded-md" />
      </div>
      
      {/* 콘텐츠 스켈레톤 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array(8).fill(0).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-[180px] w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
} 