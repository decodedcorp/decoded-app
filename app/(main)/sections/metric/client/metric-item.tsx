"use client";

import dynamic from "next/dynamic";

const Counter = dynamic(() => import("./counter").then((mod) => mod.Counter), {
  ssr: false,
});

interface MetricItemProps {
  label: string;
  value: number;
  suffix?: string;
  isLoading?: boolean;
}

export function MetricItem({
  label,
  value,
  suffix = "",
  isLoading = false,
}: MetricItemProps) {
  return (
    <div className="group relative">
      {/* Outer glow effect */}
      <div className="absolute -inset-[1px] bg-gradient-to-r from-[#EAFD66]/10 via-[#EAFD66]/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-all duration-700" />

      {/* Card */}
      <div className="relative bg-black/40 backdrop-blur-sm rounded-3xl overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(234,253,102,0.15),transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

        {/* Glass reflection effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

        <div className="relative p-6">
          {/* Label with animated bar */}
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-4 bg-[#EAFD66]/30 rounded-full group-hover:h-6 transition-all duration-300" />
            <p className="text-sm font-medium text-[#EAFD66]/50 tracking-wide group-hover:text-[#EAFD66]/70 transition-colors duration-300">
              {label}
            </p>
          </div>

          {/* Value with dynamic animation */}
          <div className="flex items-baseline gap-2">
            {isLoading ? (
              <div className="animate-pulse">
                <span className="text-6xl font-bold text-[#EAFD66]/20">00</span>
                {suffix && (
                  <span className="text-2xl text-[#EAFD66]/20">{suffix}</span>
                )}
              </div>
            ) : (
              <div className="flex items-baseline gap-2">
                <Counter
                  from={0}
                  to={value}
                  className="text-6xl font-bold text-[#EAFD66] tracking-tight"
                />
                {suffix && (
                  <span className="text-2xl font-medium text-[#EAFD66]/70 group-hover:text-[#EAFD66] transition-colors duration-300">
                    {suffix}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#EAFD66]/5 rounded-full blur-3xl group-hover:bg-[#EAFD66]/10 transition-colors duration-700" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#EAFD66]/20 to-transparent" />

          {/* Corner accent */}
          <div className="absolute top-2 right-2 w-1 h-1 rounded-full bg-[#EAFD66]/30 group-hover:bg-[#EAFD66] transition-colors duration-300" />
        </div>
      </div>
    </div>
  );
}
