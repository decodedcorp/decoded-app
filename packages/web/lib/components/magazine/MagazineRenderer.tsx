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

  // Calculate container height from max(y + h) of all components
  const containerHeight = useMemo(() => {
    if (components.length === 0) return 100;
    return Math.max(...components.map((c) => c.y + c.h));
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
      {/* Absolutely positioned layout components */}
      <div
        className="relative w-full"
        style={{ height: `${containerHeight}vh` }}
      >
        {components.map((comp, i) => {
          const Component = getComponent(comp.type);
          if (!Component) return null;

          return (
            <div
              key={`${comp.type}-${i}`}
              ref={(el) => {
                componentRefs.current[i] = el;
              }}
              style={{
                position: "absolute",
                left: `${comp.x}%`,
                top: `${comp.y}%`,
                width: `${comp.w}%`,
                height: comp.h ? `${comp.h}%` : "auto",
                opacity: 0, // hidden until GSAP animates
              }}
            >
              <Component data={comp.data} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
