"use client";

import { motion } from "motion/react";

// TODO: Replace with API data from user style_dna
const MOCK_KEYWORDS = ["Minimal", "Monochrome", "Avant-Garde", "Urban"];
const MOCK_COLORS = ["#1a1a1a", "#eafd67", "#f5f5f0", "#8b7355", "#c9302c"];
const MOCK_PROGRESS = 72;

function CircularGauge({ percentage }: { percentage: number }) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="100" height="100" viewBox="0 0 100 100" className="-rotate-90">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="6"
        />
        {/* Progress circle */}
        <motion.circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="#eafd67"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-bold text-[#eafd67]">{percentage}%</span>
        <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
          Decoded
        </span>
      </div>
    </div>
  );
}

export function StyleDNACard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 md:p-6"
    >
      {/* Section Title */}
      <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-400 mb-4">
        Style DNA
      </h3>

      <div className="flex items-start justify-between gap-4">
        {/* Left: Keywords + Colors */}
        <div className="flex-1 space-y-4">
          {/* DNA Keywords */}
          <div className="flex flex-wrap gap-2">
            {MOCK_KEYWORDS.map((keyword) => (
              <span
                key={keyword}
                className="border border-[#eafd67]/30 text-[#eafd67] rounded-full px-3 py-1 text-xs font-mono"
              >
                {keyword}
              </span>
            ))}
          </div>

          {/* Color Palette */}
          <div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-500 mb-2 block">
              Palette
            </span>
            <div className="flex gap-2">
              {MOCK_COLORS.map((color) => (
                <div
                  key={color}
                  className="w-6 h-6 rounded-full border border-white/10"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right: Circular Gauge */}
        <CircularGauge percentage={MOCK_PROGRESS} />
      </div>
    </motion.div>
  );
}
