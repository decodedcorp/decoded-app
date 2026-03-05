"use client";

import { motion } from "motion/react";
import type { SocialAccount } from "@/lib/supabase/queries/profile";

const SUPPORTED_PROVIDERS = [
  { provider: "pinterest", label: "Pinterest", icon: "P" },
  { provider: "instagram", label: "Instagram", icon: "I" },
];

function formatLastSync(lastSyncedAt: string | null): string | null {
  if (!lastSyncedAt) return null;
  const diff = Date.now() - new Date(lastSyncedAt).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

interface DataSourcesCardProps {
  accounts: SocialAccount[];
}

export function DataSourcesCard({ accounts = [] }: Partial<DataSourcesCardProps>) {
  const handleUpdate = () => {
    console.log("Update Data button clicked - not yet implemented");
    alert("Syncing...");
  };

  const connectedMap = new Map(
    accounts.map((a) => [a.provider, a])
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 md:p-6"
    >
      <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-400 mb-4">
        Data Sources
      </h3>

      <div className="space-y-3 mb-4">
        {SUPPORTED_PROVIDERS.map(({ provider, label, icon }) => {
          const account = connectedMap.get(provider);
          const connected = !!account;
          const lastSync = account ? formatLastSync(account.last_synced_at) : null;

          return (
            <div key={provider} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-mono font-bold text-white">
                  {icon}
                </div>
                <span className="text-sm text-white font-medium">{label}</span>
              </div>

              <div className="flex items-center gap-2">
                {connected ? (
                  <span className="text-[11px] font-mono text-[#eafd67]">
                    Connected
                  </span>
                ) : (
                  <span className="text-[11px] font-mono text-neutral-500">
                    Not Connected
                  </span>
                )}
                {lastSync && (
                  <span className="text-[10px] text-neutral-600 font-mono">
                    {lastSync}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={handleUpdate}
        className="w-full border border-white/20 text-neutral-300 rounded-full px-4 py-2 text-sm font-mono transition-colors hover:border-[#eafd67]/50 hover:text-[#eafd67]"
      >
        Update Data
      </button>
    </motion.div>
  );
}
