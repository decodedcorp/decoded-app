import { Metadata } from "next";
import { Skeleton } from "../../../components/ui/skeleton";
import { ProfileSection } from "../components/ProfileSection";
import { ActivityTabs } from "../components/ActivityTabs";

export const metadata: Metadata = {
  title: "마이페이지 | DECODED",
  description: "내 프로필과 활동 내역을 확인할 수 있습니다.",
};

interface ProfilePageProps {
  params: {
    userId: string;
  };
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const { userId } = params;

  return (
    <div className="container mx-auto px-4 py-8">
      <ProfileSection userDocId={userId} />
      <ActivityTabs userDocId={userId} />
    </div>
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
        {Array(8)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-[180px] w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4 rounded" />
            </div>
          ))}
      </div>
    </div>
  );
}
