"use client";

import { motion } from "motion/react";

// TODO: Wire to sns_connections API
const MOCK_SOURCES = [
  {
    name: "Pinterest",
    icon: "P",
    connected: true,
    lastSync: "2 hours ago",
  },
  {
    name: "Instagram",
    icon: "I",
    connected: false,
    lastSync: null,
  },
];

export function DataSourcesCard() {
  const handleUpdate = () => {
    console.log("Update Data button clicked - not yet implemented");
    alert("Syncing...");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 md:p-6"
    >
      {/* Section Title */}
      <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-400 mb-4">
        Data Sources
      </h3>

      {/* Source Rows */}
      <div className="space-y-3 mb-4">
        {MOCK_SOURCES.map((source) => (
          <div
            key={source.name}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              {/* Icon */}
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-mono font-bold text-white">
                {source.icon}
              </div>
              {/* Name */}
              <span className="text-sm text-white font-medium">
                {source.name}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Status Badge */}
              {source.connected ? (
                <span className="text-[11px] font-mono text-[#eafd67]">
                  Connected
                </span>
              ) : (
                <span className="text-[11px] font-mono text-neutral-500">
                  Not Connected
                </span>
              )}
              {/* Last Sync */}
              {source.lastSync && (
                <span className="text-[10px] text-neutral-600 font-mono">
                  {source.lastSync}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Update Button */}
      <button
        onClick={handleUpdate}
        className="w-full border border-white/20 text-neutral-300 rounded-full px-4 py-2 text-sm font-mono transition-colors hover:border-[#eafd67]/50 hover:text-[#eafd67]"
      >
        Update Data
      </button>
    </motion.div>
  );
}
