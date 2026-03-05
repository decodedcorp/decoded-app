"use client";

import { useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

/**
 * Scroll-triggered CTA at the bottom of the daily editorial page.
 * Fades up when the user scrolls to ~90% of the page and links
 * to /magazine/personal for generating a personal edition.
 */
export function GenerateMyEdition() {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.set(el, { opacity: 0, y: 20 });

      ScrollTrigger.create({
        trigger: el,
        start: "top 90%",
        onEnter: () => {
          gsap.to(el, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" });
        },
        once: true,
      });
    });

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div ref={ref} className="mx-auto max-w-2xl px-6 py-16">
      <button
        type="button"
        onClick={() => router.push("/magazine/personal")}
        className="group flex w-full items-center justify-between rounded-lg border border-mag-accent bg-mag-bg px-6 py-5 text-mag-accent transition-colors hover:bg-mag-accent/10"
      >
        <div className="text-left">
          <p className="text-lg font-semibold">Generate My Edition</p>
          <p className="mt-1 text-sm text-mag-text/60">
            Get a personalized magazine curated just for you
          </p>
        </div>
        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
      </button>
    </div>
  );
}
