"use client";

import { useEffect, useRef, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Maximize2 } from 'lucide-react';
import { gsap } from 'gsap';
import { useImageById } from '@/lib/hooks/useImages';
import { ImageDetailContent } from './ImageDetailContent';

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
  
  // Refs for animation targets
  const containerRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLElement>(null);
  
  // State to track if we are currently closing to prevent multiple triggers
  const [isClosing, setIsClosing] = useState(false);

  // GSAP Context for cleanup
  const ctxRef = useRef<gsap.Context>();

  const handleClose = useCallback(() => {
    if (isClosing || !ctxRef.current) return;
    setIsClosing(true);

    const isDesktop = window.matchMedia("(min-width: 768px)").matches;
    
    ctxRef.current.add(() => {
      // Exit animation
      const tl = gsap.timeline({
        onComplete: () => {
          if (window.history.length > 1) {
            router.back();
          } else {
            router.push('/');
          }
        }
      });

      tl.to(backdropRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: "power3.in"
      }, 0)
      .to(drawerRef.current, {
        x: isDesktop ? '100%' : 0,
        y: isDesktop ? 0 : '100%',
        duration: 0.3,
        ease: "power3.in"
      }, 0);
    });
  }, [isClosing, router]);

  const handleMaximize = useCallback(() => {
    // Hard navigation to force full page reload and break out of interception
    window.location.href = `/images/${imageId}`;
  }, [imageId]);

  // Mount/Enter Animation
  useEffect(() => {
    // Lock body scroll
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Initialize GSAP context
    ctxRef.current = gsap.context(() => {
      const isDesktop = window.matchMedia("(min-width: 768px)").matches;

      // Initial states
      gsap.set(backdropRef.current, { opacity: 0 });
      gsap.set(drawerRef.current, { 
        x: isDesktop ? '100%' : 0,
        y: isDesktop ? 0 : '100%'
      });

      // Enter animation
      const tl = gsap.timeline();
      
      tl.to(backdropRef.current, {
        opacity: 1,
        duration: 0.4,
        ease: "power3.out"
      }, 0)
      .to(drawerRef.current, {
        x: '0%',
        y: '0%',
        duration: 0.4,
        ease: "power3.out"
      }, 0);
    }, containerRef);

    return () => {
      document.body.style.overflow = originalOverflow;
      ctxRef.current?.revert();
    };
  }, []);

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleClose]);

  // Content Rendering Logic
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex h-full items-center justify-center">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      );
    }

    if (error || !image) {
      return (
        <div className="flex h-full items-center justify-center">
          <div className="text-center px-6">
            <p className="mb-4 text-lg text-destructive">
              {error instanceof Error ? error.message : 'Failed to load image'}
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

    return <ImageDetailContent image={image} />;
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[10000] flex items-stretch justify-end"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        ref={backdropRef}
        onClick={handleClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        ref={drawerRef}
        className="relative z-10 flex h-full w-full flex-col bg-background shadow-2xl md:max-w-2xl"
      >
        {/* Scrollable Content Area */}
        <div className="relative flex-1 overflow-y-auto overscroll-contain">
          {renderContent()}
        </div>

        {/* Floating Controls (Bottom Left) */}
        <div className="absolute bottom-6 left-6 z-20 flex gap-3">
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
