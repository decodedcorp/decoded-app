import { Metadata } from "next";
import { ProfileSection } from "../components/ProfileSection";
import { ProfileTabs } from "../components/ProfileTabs";

export const metadata: Metadata = {
  title: "마이페이지 | DECODED",
  description: "내 프로필과 활동 내역을 확인할 수 있습니다.",
};

type ProfilePageProps = Promise<{ userId: string }>;

export default async function ProfilePage({
  params,
}: {
  params: ProfilePageProps;
}) {
  const { userId } = await params;

  return (
    <div className="container mx-auto px-4 py-8">
      <ProfileSection userDocId={userId} />
      <ProfileTabs userDocId={userId} />
    </div>
  );
}
