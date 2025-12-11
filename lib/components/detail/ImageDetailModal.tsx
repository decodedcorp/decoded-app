"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { X, Maximize2 } from "lucide-react";
import { gsap } from "gsap";
import { Flip } from "gsap/Flip";
import { useImageById } from "@/lib/hooks/useImages";
import { ImageDetailContent } from "./ImageDetailContent";
import { useTransitionStore } from "@/lib/stores/transitionStore";

if (typeof window !== "undefined") {
  gsap.registerPlugin(Flip);
}

type Props = {
  imageId: string;
};

/**
 * Side Drawer version of image detail page
 * Used when navigating from grid (intercepting route)
 */
export function ImageDetailModal({ imageId }: Props) {
  const router = useRouter();
  const { data: image, isLoading, error } = useImageById(imageId);
  const { originRect, reset, imgSrc } = useTransitionStore();

  // Debug: Log imageId and data state
  useEffect(() => {
    if (imageId) {
      console.log("[ImageDetailModal] imageId:", imageId);
    }
    if (image) {
      console.log("[ImageDetailModal] image loaded:", image);
    }
    if (error) {
      console.error("[ImageDetailModal] error:", error);
    }
  }, [imageId, image, error]);

  // Refs for animation targets
  const containerRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLElement>(null);
  const floatingImageRef = useRef<HTMLImageElement>(null);

  // Ref for scroll container to checking scroll position for swipe gesture
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // State to track if we are currently closing to prevent multiple triggers
  const [isClosing, setIsClosing] = useState(false);

  // Swipe gesture state
  const touchStartY = useRef<number>(0);
  const touchCurrentY = useRef<number>(0);

  // GSAP Context for cleanup
  const ctxRef = useRef<gsap.Context>();

  const handleClose = useCallback(() => {
    if (isClosing || !ctxRef.current) return;
    setIsClosing(true);

    const isDesktop = window.matchMedia("(min-width: 768px)").matches;

    ctxRef.current.add(() => {
      // Exit Animation
      const tl = gsap.timeline({
        onComplete: () => {
          // Small delay to ensure floating image is completely hidden
          // before resetting state and showing grid image
          setTimeout(() => {
            reset();
            if (window.history.length > 1) {
              router.back();
            } else {
              router.push("/");
            }
          }, 50); // 50ms delay to ensure smooth transition
        },
      });

      // Ensure floating image is visible for exit animation (desktop only)
      // On mobile, floating image is not rendered, so skip this
      if (isDesktop && floatingImageRef.current) {
        tl.set(floatingImageRef.current, { opacity: 1 }, 0);
      }

      // 1. Fade out UI
      tl.to(
        [backdropRef.current, drawerRef.current],
        {
          opacity: 0,
          duration: 0.3,
          ease: "power3.in",
        },
        0
      );

      // 2. Fly image back to grid (if we have origin info)
      // Only animate floating image on desktop (it's hidden on mobile)
      if (isDesktop && originRect && floatingImageRef.current) {
        // FLIP animation back to grid
        tl.to(
          floatingImageRef.current,
          {
            top: originRect.top,
            left: originRect.left,
            width: originRect.width,
            height: originRect.height,
            borderRadius: "0.75rem", // Match grid card radius
            boxShadow: "none", // Remove shadow
            scale: 1, // Reset scale
            duration: 0.5,
            ease: "power3.inOut",
          },
          0
        )
          // Scale pulse for return trip
          .to(
            floatingImageRef.current,
            {
              scale: 0.98,
              duration: 0.25,
              ease: "sine.inOut",
              yoyo: true,
              repeat: 1,
            },
            0
          )
          // After image reaches grid position, fade it out
          .to(
            floatingImageRef.current,
            {
              opacity: 0,
              duration: 0.1,
              ease: "power2.in",
              yoyo: true,
              repeat: 1,
            },
            "-=0.05" // Start fading slightly before position animation completes
          );
      } else if (isDesktop && floatingImageRef.current) {
        // Fallback: fade out floating image (desktop only)
        tl.to(
          floatingImageRef.current,
          {
            opacity: 0,
            duration: 0.3,
          },
          0
        );
      }
    });
  }, [isClosing, router, originRect, reset]);

  // Swipe gesture handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    const isDesktop = window.matchMedia("(min-width: 768px)").matches;
    if (isDesktop) return;

    // Only allow swipe if we are at the top of the scroll container
    if (
      scrollContainerRef.current &&
      scrollContainerRef.current.scrollTop > 0
    ) {
      touchStartY.current = -1; // Invalid start
      return;
    }

    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartY.current === -1) return;

    const isDesktop = window.matchMedia("(min-width: 768px)").matches;
    if (isDesktop) return;

    touchCurrentY.current = e.touches[0].clientY;
    const diff = touchCurrentY.current - touchStartY.current;

    // Only allow dragging down
    if (diff > 0 && drawerRef.current) {
      // Provide visual feedback - transform the drawer down
      // Use GSAP set for performance
      gsap.set(drawerRef.current, { y: diff });
    }
  };

  const handleTouchEnd = () => {
    if (touchStartY.current === -1) return;

    const isDesktop = window.matchMedia("(min-width: 768px)").matches;
    if (isDesktop) return;

    const diff = touchCurrentY.current - touchStartY.current;

    if (diff > 100) {
      // Threshold passed, close
      handleClose();
    } else if (diff > 0 && drawerRef.current) {
      // Reset position if not passed threshold
      gsap.to(drawerRef.current, {
        y: 0,
        duration: 0.3,
        ease: "power2.out",
      });
    }

    // Reset trackers
    touchStartY.current = 0;
    touchCurrentY.current = 0;
  };

  const handleMaximize = useCallback(() => {
    // Hard navigation to force full page reload and break out of interception
    window.location.href = `/images/${imageId}`;
  }, [imageId]);

  // Mount/Enter Animation
  useEffect(() => {
    // Lock body scroll
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Initialize GSAP context
    ctxRef.current = gsap.context(() => {
      const isDesktop = window.matchMedia("(min-width: 768px)").matches;

      // Initial States
      gsap.set(backdropRef.current, { opacity: 0 });

      if (isDesktop) {
        gsap.set(drawerRef.current, { x: "100%", y: 0 }); // Slide in from right
      } else {
        gsap.set(drawerRef.current, { x: 0, y: "100%" }); // Slide in from bottom
      }

      // Animate Drawer & Backdrop
      const tl = gsap.timeline();

      tl.to(
        backdropRef.current,
        {
          opacity: 1,
          duration: 0.4,
          ease: "power2.out",
        },
        0
      ).to(
        drawerRef.current,
        {
          x: "0%",
          y: "0%",
          duration: 0.5,
          ease: "power3.out",
        },
        0.1
      ); // Slight delay for drawer
    }, containerRef);

    return () => {
      document.body.style.overflow = originalOverflow;
      ctxRef.current?.revert();
    };
  }, []);

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleClose]);

  // Content Rendering Logic
  const renderContent = () => {
    // Check if imageId is missing
    if (!imageId) {
      return (
        <div className="flex h-full items-center justify-center">
          <div className="text-center px-6">
            <p className="mb-4 text-lg text-destructive">Image ID is missing</p>
            <button
              onClick={() => handleClose()}
              className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
            >
              Close
            </button>
          </div>
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="flex h-full items-center justify-center">
          <div className="text-muted-foreground">Loading image data...</div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex h-full items-center justify-center">
          <div className="text-center px-6">
            <p className="mb-2 text-lg text-destructive">
              Failed to load image
            </p>
            <p className="mb-4 text-sm text-muted-foreground">
              {error instanceof Error
                ? error.message
                : "Unknown error occurred"}
            </p>
            <p className="mb-4 text-xs text-muted-foreground">
              Image ID: {imageId}
            </p>
            <button
              onClick={() => handleClose()}
              className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
            >
              Close
            </button>
          </div>
        </div>
      );
    }

    if (!image) {
      return (
        <div className="flex h-full items-center justify-center">
          <div className="text-center px-6">
            <p className="mb-4 text-lg text-destructive">Image not found</p>
            <p className="mb-4 text-xs text-muted-foreground">
              Image ID: {imageId}
            </p>
            <button
              onClick={() => handleClose()}
              className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
            >
              Close
            </button>
          </div>
        </div>
      );
    }

    return (
      <ImageDetailContent
        image={image}
        isModal={true}
        scrollContainerRef={scrollContainerRef}
      />
    );
  };

  // Image Source Resolution: Priority -> Store (Immediate) -> Fetched Data
  const activeImageSrc = imgSrc || image?.image_url;

  // Debug: Log image source
  useEffect(() => {
    if (activeImageSrc) {
      console.log("[ImageDetailModal] activeImageSrc:", activeImageSrc);
    } else {
      console.warn(
        "[ImageDetailModal] No image source available. imgSrc:",
        imgSrc,
        "image?.image_url:",
        image?.image_url
      );
    }
  }, [activeImageSrc, imgSrc, image?.image_url]);

  // Floating Image Animation (runs when image source becomes available)
  // Skip on mobile - Floating Image is not rendered on mobile
  useEffect(() => {
    if (!activeImageSrc || !floatingImageRef.current) return;

    const isDesktop = window.matchMedia("(min-width: 768px)").matches;

    // Skip animation on mobile - Floating Image is hidden on mobile
    if (!isDesktop) return;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    if (originRect) {
      // Start at grid position (FLIP animation)
      gsap.set(floatingImageRef.current, {
        position: "fixed",
        top: originRect.top,
        left: originRect.left,
        width: originRect.width,
        height: originRect.height,
        borderRadius: "0.75rem",
        zIndex: 60,
        opacity: 1,
      });

      // Calculate Target Position
      let targetProps = {};

      // Desktop: Center of Left 50%
      // (Mobile: Floating Image is not rendered, so no animation needed)
      const drawerWidth = Math.min(672, viewportWidth * 0.5);
      const leftSpace = viewportWidth - drawerWidth;

      const targetWidth = Math.min(leftSpace * 0.8, 600);
      const targetHeight = Math.min(viewportHeight * 0.8, targetWidth * 1.5);

      targetProps = {
        top: (viewportHeight - targetHeight) / 2,
        left: (leftSpace - targetWidth) / 2,
        width: targetWidth,
        height: targetHeight,
        borderRadius: "0.5rem",
      };

      // Animate Image from grid to target position
      const tl = gsap.timeline();

      // Main flight animation with 3D depth effects
      tl.to(floatingImageRef.current, {
        ...targetProps,
        duration: 0.6,
        ease: "power3.inOut",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)", // Lift effect shadow
      });

      // Add scale pulse for 3D "lift" feel
      // This creates a subtle parabolic motion on the Z-axis
      tl.to(
        floatingImageRef.current,
        {
          scale: 1.02,
          duration: 0.3,
          ease: "power1.out",
          yoyo: true,
          repeat: 1,
        },
        0
      );
    } else {
      // No originRect: Show image directly at target position (fallback, desktop only)
      const drawerWidth = Math.min(672, viewportWidth * 0.5);
      const leftSpace = viewportWidth - drawerWidth;
      const targetWidth = Math.min(leftSpace * 0.8, 600);
      const targetHeight = Math.min(viewportHeight * 0.8, targetWidth * 1.5);

      const targetProps = {
        position: "fixed",
        top: (viewportHeight - targetHeight) / 2,
        left: (leftSpace - targetWidth) / 2,
        width: targetWidth,
        height: targetHeight,
        borderRadius: "0.5rem",
        zIndex: 60,
        opacity: 1,
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
      };

      gsap.set(floatingImageRef.current, targetProps);
    }
  }, [activeImageSrc, originRect]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[10000] flex items-end md:items-stretch md:justify-end"
      role="dialog"
      aria-modal="true"
      style={{ perspective: "1200px" }} // Enable 3D perspective
    >
      {/* Backdrop (z-40) */}
      <div
        ref={backdropRef}
        onClick={handleClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm z-40"
        aria-hidden="true"
      />

      {/* Floating Image (z-60) - Desktop Only */}
      {/* On mobile, this is hidden - Drawer fills the screen instead */}
      {activeImageSrc && (
        <img
          ref={floatingImageRef}
          src={activeImageSrc}
          alt="Highlight"
          className="hidden md:block fixed object-cover shadow-2xl pointer-events-none"
          style={{
            opacity: 0, // Initially hidden, will be set by GSAP
            zIndex: 60,
            willChange: "transform, top, left, width, height, opacity",
          }}
        />
      )}

      {/* Drawer (z-50) */}
      <aside
        ref={drawerRef}
        className="relative z-50 flex h-full w-full flex-col bg-background shadow-2xl md:max-w-2xl translate-y-full md:translate-x-full md:translate-y-0"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Scrollable Content Area */}
        <div
          ref={scrollContainerRef}
          className="relative flex-1 overflow-y-auto overscroll-contain"
        >
          {renderContent()}
        </div>

        {/* Floating Controls */}
        <div className="absolute top-4 right-4 md:top-auto md:right-auto md:bottom-6 md:left-6 z-20 flex gap-3">
          <button
            onClick={handleMaximize}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-black/80 text-white backdrop-blur-sm transition-transform hover:scale-105 hover:bg-black active:scale-95 dark:bg-white/80 dark:text-black dark:hover:bg-white"
            aria-label="View Full Page"
            title="Open in full page"
          >
            <Maximize2 className="h-5 w-5" />
          </button>
          <button
            onClick={handleClose}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-background/80 text-foreground backdrop-blur-sm transition-transform hover:scale-105 hover:bg-accent active:scale-95"
            aria-label="Close"
            title="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </aside>
    </div>
  );
}
