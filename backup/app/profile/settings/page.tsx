import { Metadata } from "next";
import { UserSettingsForm } from "@/backup/app/profile/settings/components/UserSettingsForm";
import { LogoutButton } from "@/backup/app/profile/settings/components/LogoutButton";

export default function SettingsPage() {
  return (
    <div className="mx-auto py-6 space-y-8 px-16 pt-20">
      <UserSettingsForm />
      <LogoutButton />
    </div>
  );
}
