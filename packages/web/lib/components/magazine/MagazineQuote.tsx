"use client";

import React, { forwardRef } from "react";

interface MagazineQuoteProps {
  data: Record<string, unknown>;
  className?: string;
}

const MagazineQuote = forwardRef<HTMLDivElement, MagazineQuoteProps>(
  ({ data, className }, ref) => {
    const text = data.text as string;
    const attribution = data.attribution as string | undefined;

    return (
      <div ref={ref} className={`${className ?? ""}`}>
        <blockquote className="border-l-2 border-mag-accent pl-6">
          <p
            className="italic text-mag-text"
            style={{
              fontSize: "clamp(1.125rem, 2.5vw, 1.5rem)",
              fontFamily: "Georgia, 'Times New Roman', serif",
              lineHeight: 1.6,
            }}
          >
            {text}
          </p>
          {attribution && (
            <footer className="mt-3 text-sm text-mag-text/50">
              &mdash; {attribution}
            </footer>
          )}
        </blockquote>
      </div>
    );
  },
);

MagazineQuote.displayName = "MagazineQuote";

export { MagazineQuote };
