"use client";

import { useRef, useEffect, useState, useCallback, RefObject } from "react";
import type { UiItem } from "./types";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

type ConnectorData = {
  itemId: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
};

type Props = {
  items: UiItem[];
  activeIndex: number | null;
  imageContainerRef: React.RefObject<HTMLDivElement>;
  cardsContainerRef: React.RefObject<HTMLDivElement>;
  scrollContainerRef?: RefObject<HTMLElement>;
};

/**
 * ConnectorLayer - SVG lines connecting image items to cards
 *
 * Performance optimization:
 * - Coordinates are calculated only on resize events (cached)
 * - During scroll, cached coordinates are used
 * - SVG line drawing with GSAP drawSVG effect
 */
export function ConnectorLayer({
  items,
  activeIndex,
  imageContainerRef,
  cardsContainerRef,
  scrollContainerRef,
}: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [connectors, setConnectors] = useState<ConnectorData[]>([]);

  // Calculate connector coordinates (cached, only recalculated on resize)
  const calculateConnectors = useCallback(() => {
    if (
      !imageContainerRef.current ||
      !cardsContainerRef.current ||
      !svgRef.current
    ) {
      return;
    }

    const imageRect = imageContainerRef.current.getBoundingClientRect();
    const cardsRect = cardsContainerRef.current.getBoundingClientRect();
    const svgRect = svgRef.current.getBoundingClientRect();

    const newConnectors: ConnectorData[] = [];

    items.forEach((item, index) => {
      if (!item.normalizedCenter || !item.normalizedBox) return;

      // Get card element
      const cardElement = cardsContainerRef.current?.querySelector(
        `[data-item-index="${index}"]`
      ) as HTMLElement;

      if (!cardElement) return;

      const cardRect = cardElement.getBoundingClientRect();

      // Calculate start point (item center in image)
      const center = item.normalizedCenter;
      const startX = imageRect.left + center.x * imageRect.width - svgRect.left;
      const startY = imageRect.top + center.y * imageRect.height - svgRect.top;

      // Calculate end point (card center)
      const endX = cardRect.left + cardRect.width / 2 - svgRect.left;
      const endY = cardRect.top + cardRect.height / 2 - svgRect.top;

      newConnectors.push({
        itemId: item.id,
        startX,
        startY,
        endX,
        endY,
      });
    });

    setConnectors(newConnectors);
  }, [items, imageContainerRef, cardsContainerRef]);

  // Recalculate on resize and scroll
  useEffect(() => {
    calculateConnectors();

    let ticking = false;
    const handleUpdate = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          calculateConnectors();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("resize", handleUpdate);

    // Add scroll listener to specific container or window
    const scroller = scrollContainerRef?.current || window;
    scroller.addEventListener("scroll", handleUpdate as EventListener);

    return () => {
      window.removeEventListener("resize", handleUpdate);
      scroller.removeEventListener("scroll", handleUpdate as EventListener);
    };
  }, [calculateConnectors, scrollContainerRef]);

  // Animate connector lines with GSAP
  useGSAP(
    () => {
      if (!svgRef.current) return;

      connectors.forEach((connector) => {
        const line = svgRef.current?.querySelector(
          `[data-connector-id="${connector.itemId}"]`
        ) as SVGLineElement;

        if (!line) return;

        const isActive =
          items.findIndex((item) => item.id === connector.itemId) ===
          activeIndex;

        if (isActive) {
          // Draw line animation
          const length = Math.sqrt(
            Math.pow(connector.endX - connector.startX, 2) +
              Math.pow(connector.endY - connector.startY, 2)
          );

          gsap.fromTo(
            line,
            {
              strokeDasharray: length,
              strokeDashoffset: length,
              opacity: 0,
            },
            {
              strokeDashoffset: 0,
              opacity: 1,
              duration: 0.6,
              ease: "power2.out",
            }
          );
        } else {
          // Hide line
          gsap.to(line, {
            opacity: 0,
            duration: 0.3,
          });
        }
      });
    },
    { scope: svgRef, dependencies: [connectors, activeIndex] }
  );

  if (connectors.length === 0) {
    return null;
  }

  return (
    <svg
      ref={svgRef}
      className="absolute inset-0 pointer-events-none z-50" // z-10 -> z-50으로 변경
      style={{ width: "100%", height: "100%" }}
    >
      <defs>
        <marker
          id="dot"
          viewBox="0 0 10 10"
          refX="5"
          refY="5"
          markerWidth="4"
          markerHeight="4"
        >
          <circle
            cx="5"
            cy="5"
            r="5"
            fill="currentColor"
            className="text-foreground"
          />
        </marker>
      </defs>
      {connectors.map((connector) => {
        const isActive =
          items.findIndex((item) => item.id === connector.itemId) ===
          activeIndex;

        // Use visibility hidden instead of null to keep DOM node for GSAP
        return (
          <g key={connector.itemId} style={{ opacity: isActive ? 1 : 0 }}>
            <line
              data-connector-id={connector.itemId}
              x1={connector.startX}
              y1={connector.startY}
              x2={connector.endX}
              y2={connector.endY}
              stroke="currentColor"
              className="text-foreground/80 dark:text-white/90"
              strokeWidth="1.5"
              markerEnd="url(#dot)"
            />
          </g>
        );
      })}
    </svg>
  );
}
