"use client";

import { Button } from "@/components/ui/button";
import { pretendardBold } from "@/lib/constants/fonts";
import { useLocaleContext } from "@/lib/contexts/locale-context";

function handleLogout() {
  window.sessionStorage.removeItem("USER_DOC_ID");
  window.sessionStorage.removeItem("SUI_ACCOUNT");
  window.sessionStorage.removeItem("ACCESS_TOKEN");
  window.sessionStorage.removeItem("USER_EMAIL");
  window.sessionStorage.removeItem("USER_NICKNAME");

  window.dispatchEvent(new CustomEvent("auth:state-changed"));

  setTimeout(() => {
    window.location.href = "/";
  }, 100);
}

export function LogoutButton() {
  const { t } = useLocaleContext();
  return (
    <Button
      onClick={handleLogout}
      className={`w-full sm:w-auto hover:text-[#eafd66] bg-transparent border border-[#eafd66] text-gray-400 border-none hover:bg-transparent ${pretendardBold.className}`}
    >
      {t.header.nav.login.button.logout}
    </Button>
  );
}
