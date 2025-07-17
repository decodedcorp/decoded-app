"use client";

import { ChevronLeft } from "lucide-react";

interface DetailHeaderProps {
  onClose: () => void;
}

export function DetailHeader({ onClose }: DetailHeaderProps) {
  return (
    <button onClick={onClose} className="absolute left-2 z-10 text-white/80">
      <ChevronLeft className="w-6 h-6" />
    </button>
  );
}
