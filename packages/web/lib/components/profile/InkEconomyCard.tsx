"use client";

import { motion } from "motion/react";

// TODO: Wire to ink_credits API
const MOCK_INK_BALANCE = 1250;

export function InkEconomyCard() {
  const handleSubscribe = () => {
    console.log("Subscribe button clicked - not yet implemented");
    alert("Coming soon");
  };

  const handleCharge = () => {
    console.log("Charge button clicked - not yet implemented");
    alert("Coming soon");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 md:p-6"
    >
      {/* Section Title */}
      <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-400 mb-3">
        Ink Balance
      </h3>

      {/* Balance */}
      <div className="text-2xl font-bold text-[#eafd67] mb-5">
        {MOCK_INK_BALANCE.toLocaleString()} INK
      </div>

      {/* CTA Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleSubscribe}
          className="flex-1 border border-[#eafd67] text-[#eafd67] rounded-full px-4 py-2 text-sm font-mono transition-colors hover:bg-[#eafd67]/10"
        >
          Subscribe
        </button>
        <button
          onClick={handleCharge}
          className="flex-1 bg-[#eafd67] text-black rounded-full px-4 py-2 text-sm font-mono font-medium transition-colors hover:bg-[#eafd67]/90"
        >
          Charge
        </button>
      </div>
    </motion.div>
  );
}
