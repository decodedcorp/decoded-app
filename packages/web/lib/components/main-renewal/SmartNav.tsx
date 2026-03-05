"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import Link from "next/link";

interface SmartNavProps {
  className?: string;
}

/**
 * SmartNav -- Scroll-responsive navigation overlay for the renewed main page.
 *
 * - Fixed at top of viewport
 * - Hides on scroll down (past 100px), reappears on scroll up
 * - Transparent background at very top, blurred bg once scrolled
 */
export function SmartNav({ className }: SmartNavProps) {
  const navRef = useRef<HTMLElement>(null);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;

      requestAnimationFrame(() => {
        const currentY = window.scrollY;
        const direction = currentY > lastScrollY.current ? "down" : "up";

        // At very top -- fully transparent, always visible
        if (currentY < 50) {
          setIsAtTop(true);
          gsap.to(nav, { y: 0, duration: 0.3, ease: "power2.out" });
        } else {
          setIsAtTop(false);

          if (direction === "down" && currentY > 100) {
            // Scroll down past 100px -- hide
            gsap.to(nav, { y: -100, duration: 0.3, ease: "power2.in" });
          } else if (direction === "up") {
            // Scroll up -- show
            gsap.to(nav, { y: 0, duration: 0.3, ease: "power2.out" });
          }
        }

        lastScrollY.current = currentY;
        ticking.current = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      ref={navRef}
      className={[
        "fixed top-0 left-0 right-0 z-50",
        "flex items-center justify-between px-6 py-4",
        "transition-colors duration-300",
        isAtTop ? "bg-transparent" : "bg-[#050505]/80 backdrop-blur-md",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Logo */}
      <Link href="/" className="text-[#eafd67] font-bold tracking-[0.3em] text-sm uppercase">
        DECODED
      </Link>

      {/* Nav links */}
      <div className="flex items-center gap-6">
        <Link
          href="/magazine/daily"
          className="text-[#f5f5f5]/70 text-xs tracking-[0.2em] uppercase hover:text-[#f5f5f5] transition-colors"
        >
          Magazine
        </Link>
        <Link
          href="/explore"
          className="text-[#f5f5f5]/70 text-xs tracking-[0.2em] uppercase hover:text-[#f5f5f5] transition-colors"
        >
          Explore
        </Link>
        <Link
          href="/profile"
          className="text-[#f5f5f5]/70 text-xs tracking-[0.2em] uppercase hover:text-[#f5f5f5] transition-colors"
        >
          Profile
        </Link>
      </div>
    </nav>
  );
}
