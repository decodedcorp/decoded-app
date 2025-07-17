'use client';

import { useEffect, useState } from 'react';

export function ScrollIndicator({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLDivElement>;
}) {
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const handleScroll = () => {
      const scrollPercent = Math.min(container.scrollTop / 100, 1);
      setOpacity(1 - scrollPercent);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [containerRef]);

  if (opacity <= 0) return null;

  return (
    <div
      className="absolute -bottom-7 left-0 right-0 h-24 mb-2 pointer-events-none"
      style={{
        background:
          'linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.65) 40%, rgba(0, 0, 0, 0.95) 100%)',
        opacity,
      }}
    >
      <div className="absolute left-1/2 bottom-8 -translate-x-1/2 flex flex-col items-center gap-0.5 animate-floating">
        <style jsx>{`
          @keyframes floating {
            0%,
            100% {
              transform: translate(-50%, 0px);
            }
            50% {
              transform: translate(-50%, -4px);
            }
          }
          .animate-floating {
            animation: floating 2s ease-in-out infinite;
          }
        `}</style>
        <span className="text-[10px] tracking-wider font-medium text-gray-200">
          scroll
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-gray-200"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>
    </div>
  );
}
