"use client";

import type { ImageRow } from '@/lib/supabase/types';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

type Props = {
  image: ImageRow;
};

/**
 * Shared content component for image detail view
 * Used by both modal and full page versions
 */
export function ImageDetailContent({ image }: Props) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;

    const ctx = gsap.context(() => {
      // Parallax effect for image
      gsap.to('.detail-image', {
        yPercent: -30,
        ease: 'none',
        scrollTrigger: {
          trigger: '.detail-content',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      // Fade in text elements as they scroll into view
      gsap.utils.toArray('.detail-text').forEach((element: any) => {
        gsap.fromTo(
          element,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: element,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }, contentRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={contentRef} className="detail-content">
      {/* Hero Image Section */}
      <div className="relative h-screen w-full overflow-hidden">
        {image.image_url && (
          <img
            src={image.image_url}
            alt={`Image ${image.id}`}
            className="detail-image h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      </div>

      {/* Content Section */}
      <div className="mx-auto max-w-4xl px-4 py-16 md:px-8">
        {/* Metadata */}
        <div className="detail-text mb-8">
          <div className="mb-4 flex flex-wrap gap-2">
            {image.status && (
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wide ${
                  image.status === 'pending'
                    ? 'bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-100'
                    : image.status === 'extracted'
                      ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-100'
                      : 'bg-slate-100 text-slate-900 dark:bg-slate-800/80 dark:text-slate-100'
                }`}
              >
                {image.status}
              </span>
            )}
            {image.with_items && (
              <span className="rounded-full bg-blue-500/80 px-3 py-1 text-xs font-medium uppercase tracking-wide text-blue-100">
                Items Detected
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            Created: {new Date(image.created_at).toLocaleDateString()}
          </p>
        </div>

        {/* Image Info */}
        <div className="detail-text mb-12">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">
            Image Details
          </h1>
          <p className="text-lg text-muted-foreground">
            Image ID: <code className="rounded bg-muted px-2 py-1 text-sm">{image.id}</code>
          </p>
        </div>

        {/* Additional Content Placeholder */}
        <div className="detail-text">
          <h2 className="mb-4 text-2xl font-semibold">Details</h2>
          <p className="text-muted-foreground">
            Additional content and metadata will be displayed here.
          </p>
        </div>
      </div>
    </div>
  );
}

