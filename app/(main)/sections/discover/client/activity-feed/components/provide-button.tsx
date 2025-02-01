"use client";

import { cn } from "@/lib/utils/style";
import { useLocaleContext } from "@/lib/contexts/locale-context";
import { useRouter } from "next/navigation";

interface ProvideButtonProps {
  imageDocId: string;
}

export function ProvideButton({ imageDocId }: ProvideButtonProps) {
  const { t } = useLocaleContext();
  const router = useRouter();

  return (
    <button
      className={cn(
        "px-3 py-1.5 rounded-lg text-sm font-medium",
        "border border-[#EAFD66]/20",
        "bg-[#EAFD66]/10 text-[#EAFD66]",
        "hover:bg-[#EAFD66]/20 transition-all duration-200",
        "flex items-center gap-1.5",
        "group"
      )}
      onClick={() => {
        router.push(`/details/${imageDocId}`);
      }}
    >
      <span>{t.common.actions.provide}</span>
      <svg
        className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M14 5l7 7m0 0l-7 7m7-7H3"
        />
      </svg>
    </button>
  );
}
