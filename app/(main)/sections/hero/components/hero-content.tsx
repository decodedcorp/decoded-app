"use client";

import { useLocaleContext } from "@/lib/contexts/locale-context";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function HeroContent() {
  const { t } = useLocaleContext();
  return (
    <div className="w-full flex flex-col items-center justify-center gap-6 px-4">
      <h1 className="text-2xl md:text-5xl font-bold text-foreground whitespace-pre-line text-center max-w-3xl">
        {t.home.hero.title}
      </h1>
      <Link href="/request">
        <Button className="inline-flex h-11 items-center justify-center px-8 py-3 bg-primary font-mono font-bold text-black hover:bg-primary/90 transition-colors">
          {t.home.hero.cta}
        </Button>
      </Link>
    </div>
  );
}
