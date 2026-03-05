"use client";

import React, { forwardRef } from "react";

interface MagazineDividerProps {
  data: Record<string, unknown>;
  className?: string;
}

const MagazineDivider = forwardRef<HTMLDivElement, MagazineDividerProps>(
  ({ data, className }, ref) => {
    const style = (data.style as string) || "gradient";

    return (
      <div ref={ref} className={`w-full py-4 ${className ?? ""}`}>
        {style === "gradient" && (
          <div
            className="h-px w-full"
            style={{
              background:
                "linear-gradient(to right, transparent, var(--mag-accent), transparent)",
            }}
          />
        )}

        {style === "line" && (
          <div className="h-px w-full bg-mag-accent/60" />
        )}

        {style === "dots" && (
          <div className="flex items-center justify-center gap-2">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="block h-1.5 w-1.5 rounded-full bg-mag-accent"
              />
            ))}
          </div>
        )}
      </div>
    );
  },
);

MagazineDivider.displayName = "MagazineDivider";

export { MagazineDivider };
