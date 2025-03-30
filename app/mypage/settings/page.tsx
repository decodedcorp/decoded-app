import { Metadata } from "next";
import { UserSettingsForm } from "@/app/mypage/settings/components/UserSettingsForm";

export default function SettingsPage() {
  return (
    <div className="mx-auto py-6 space-y-8 px-16 pt-20">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-white">프로필 설정</h1>
        <p className="text-white/60">개인 정보 및 프로필을 수정하세요</p>
      </div>
      
      <UserSettingsForm />
    </div>
  );
} 