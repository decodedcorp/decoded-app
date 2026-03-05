"use client";

import React, { useEffect, useRef, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import type { MagazineIssue, LayoutComponent } from "./types";
import { getComponent } from "./componentRegistry";
import { injectMagazineTheme, removeMagazineTheme } from "./theme";

gsap.registerPlugin(ScrollTrigger);

interface MagazineRendererProps {
  issue: MagazineIssue;
  className?: string;
}

/**
 * Core layout engine that interprets LayoutJSON and produces the
 * cinematic magazine experience with GSAP-orchestrated animations.
 */
export function MagazineRenderer({ issue, className }: MagazineRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const componentRefs = useRef<(HTMLDivElement | null)[]>([]);

  const components = issue.layout_json.components;

  // Group components into rows by y-coordinate for flow-based layout
  const rows = useMemo(() => {
    const Y_TOLERANCE = 2;
    const groups: {
      y: number;
      items: { comp: LayoutComponent; origIndex: number }[];
    }[] = [];

    components.forEach((comp, i) => {
      const existing = groups.find(
        (g) => Math.abs(g.y - comp.y) <= Y_TOLERANCE,
      );
      if (existing) {
        existing.items.push({ comp, origIndex: i });
      } else {
        groups.push({ y: comp.y, items: [{ comp, origIndex: i }] });
      }
    });

    // Sort rows by y ascending
    groups.sort((a, b) => a.y - b.y);
    // Sort items within each row by x ascending
    groups.forEach((g) => g.items.sort((a, b) => a.comp.x - b.comp.x));

    return groups;
  }, [components]);

  // Inject theme on mount, remove on unmount
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    injectMagazineTheme(issue.theme_palette, container);

    return () => {
      removeMagazineTheme(container);
    };
  }, [issue.theme_palette]);

  // GSAP orchestration
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      components.forEach((comp, i) => {
        const el = componentRefs.current[i];
        if (!el) return;

        const delay = comp.animation_delay || i * 0.15;

        switch (comp.animation_type) {
          case "fade-up":
            gsap.set(el, { opacity: 0, y: 30 });
            tl.to(
              el,
              { opacity: 1, y: 0, duration: 0.6 },
              delay,
            );
            break;

          case "scale-in":
            gsap.set(el, { opacity: 0, scale: 1.1 });
            tl.to(
              el,
              { opacity: 1, scale: 1, duration: 1.8 },
              delay,
            );
            break;

          case "slide-left":
            gsap.set(el, { opacity: 0, x: 40 });
            tl.to(
              el,
              { opacity: 1, x: 0, duration: 0.5 },
              delay,
            );
            break;

          case "parallax": {
            gsap.set(el, { opacity: 1 });
            const depth =
              (comp.data.parallax_depth as number) || 0.2;
            gsap.to(el, {
              y: -50 * depth,
              ease: "none",
              scrollTrigger: {
                trigger: el,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            });
            break;
          }

          case "none":
          default:
            gsap.set(el, { opacity: 1 });
            break;
        }
      });
    }, container);

    return () => {
      ctx.revert();
    };
  }, [components]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full bg-mag-bg text-mag-text ${className ?? ""}`}
      style={{ minHeight: "100vh" }}
    >
      {/* Flow-based layout: rows grouped by y-coordinate */}
      <div className="flex w-full flex-col space-y-6">
        {rows.map((row, rowIdx) => {
          if (row.items.length === 1) {
            // Single component row
            const { comp, origIndex } = row.items[0];
            const Component = getComponent(comp.type);
            if (!Component) return null;
            const isHero = rowIdx === 0 && comp.type === "hero-image";
            return (
              <div
                key={`row-${rowIdx}`}
                ref={(el) => {
                  componentRefs.current[origIndex] = el;
                }}
                className={isHero ? "-mt-6" : ""}
                style={{
                  width: `${comp.w}%`,
                  marginLeft: comp.x > 0 ? `${comp.x}%` : undefined,
                  opacity: 0,
                }}
              >
                <Component data={comp.data} />
              </div>
            );
          }

          // Multi-component row (side-by-side)
          return (
            <div
              key={`row-${rowIdx}`}
              className="flex w-full gap-4"
              style={{
                paddingLeft: `${Math.min(...row.items.map((it) => it.comp.x))}%`,
                paddingRight: `${100 - Math.max(...row.items.map((it) => it.comp.x + it.comp.w))}%`,
              }}
            >
              {row.items.map(({ comp, origIndex }) => {
                const Component = getComponent(comp.type);
                if (!Component) return null;
                return (
                  <div
                    key={`comp-${origIndex}`}
                    ref={(el) => {
                      componentRefs.current[origIndex] = el;
                    }}
                    className="flex-1"
                    style={{ opacity: 0 }}
                  >
                    <Component data={comp.data} />
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
