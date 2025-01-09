import { ReactNode } from 'react';
import { HeroContent } from './components/hero-content';

interface HeroServerProps {
  children: ReactNode;
}

export function HeroServer({ children }: HeroServerProps) {
  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Static Background */}
      <div className="absolute inset-0 bg-background" />

      {/* Interactive Layers (Client Components) */}
      {children}

      {/* Static Content Container - Moved after children */}
      <div className="absolute inset-0 z-modalContent flex flex-col min-h-screen pointer-events-none">
        <div className="flex-1 flex items-center justify-center">
          <div className="pointer-events-auto">
            <HeroContent />
          </div>
        </div>
        <div className="h-24 pointer-events-none" />
      </div>
    </section>
  );
}
