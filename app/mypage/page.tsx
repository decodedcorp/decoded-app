import { Metadata } from "next";
import { Suspense } from "react";
import { MyPageClient } from "./components/MyPageClient";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "마이페이지 | Decoded",
  description: "Decoded 서비스의 마이페이지입니다. 계정 정보, 활동 내역, 요청 및 제공 목록을 확인할 수 있습니다.",
};

export default function MyPagePage() {
  return (
    <main className="container max-w-screen-xl mx-auto px-4 py-8">
      <Suspense fallback={<MyPageSkeleton />}>
        <MyPageClient />
      </Suspense>
    </main>
  );
}

function MyPageSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-60 w-full rounded-lg" />
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-60 w-full rounded-lg" />
    </div>
  );
} 