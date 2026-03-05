"use client";

import React, { forwardRef } from "react";

interface MagazineTextProps {
  data: Record<string, unknown>;
  className?: string;
}

const variantStyles: Record<string, { tag: "h1" | "h2" | "p"; fontSize: string; fontFamily: string; fontWeight: number }> = {
  h1: {
    tag: "h1",
    fontSize: "clamp(2rem, 5vw, 3.5rem)",
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontWeight: 700,
  },
  h2: {
    tag: "h2",
    fontSize: "clamp(1.25rem, 3vw, 2rem)",
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontWeight: 600,
  },
  body: {
    tag: "p",
    fontSize: "clamp(0.875rem, 1.5vw, 1rem)",
    fontFamily: "system-ui, -apple-system, sans-serif",
    fontWeight: 400,
  },
};

const MagazineText = forwardRef<HTMLDivElement, MagazineTextProps>(
  ({ data, className }, ref) => {
    const content = data.content as string;
    const variant = (data.variant as string) || "body";
    const fontFamily = data.font_family as string | undefined;

    const style = variantStyles[variant] || variantStyles.body;
    const Tag = style.tag;

    return (
      <div ref={ref} className={`text-mag-text ${className ?? ""}`}>
        <Tag
          style={{
            fontSize: style.fontSize,
            fontFamily: fontFamily || style.fontFamily,
            fontWeight: style.fontWeight,
            lineHeight: 1.4,
          }}
        >
          {content}
        </Tag>
      </div>
    );
  },
);

MagazineText.displayName = "MagazineText";

export { MagazineText };
