"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface StudioHUDProps {
  issueCount: number;
}

export function StudioHUD({ issueCount }: StudioHUDProps) {
  return (
    <header className="absolute top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3 bg-black/40 backdrop-blur-sm">
      <Link
        href="/"
        className="flex items-center gap-1 text-white/60 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
      </Link>

      <h1 className="text-sm font-bold tracking-[0.2em] text-white/90 uppercase">
        The Decoded Studio
      </h1>

      <div className="min-w-[24px] text-right">
        {issueCount > 0 && (
          <span className="inline-flex items-center justify-center px-2 py-0.5 text-[10px] font-semibold rounded-full bg-[#eafd67] text-black">
            {issueCount}
          </span>
        )}
      </div>
    </header>
  );
}
