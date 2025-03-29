"use client";

import { useLocaleContext } from "@/lib/contexts/locale-context";
import { Button } from "@/components/ui/button";
import { useRequestModal } from "@/components/modals/request/hooks/use-request-modal";

export function HeroContent() {
  const { t } = useLocaleContext();
  const { onOpen: openRequestModal, RequestModal } = useRequestModal();

  return (
    <div className="w-full flex flex-col items-center justify-center gap-6 px-4 sm:px-4 lg:px-6">
      <h1 className="text-2xl md:text-5xl font-bold text-foreground whitespace-pre-line text-center max-w-3xl">
        {t.home.hero.title}
      </h1>
      <Button
        onClick={openRequestModal}
        className="inline-flex h-11 items-center justify-center px-8 py-3 bg-primary font-mono font-bold text-black hover:bg-primary/90 transition-colors"
      >
        {t.home.hero.cta}
      </Button>

      {/* 요청 모달 렌더링 */}
      {RequestModal}
    </div>
  );
}
