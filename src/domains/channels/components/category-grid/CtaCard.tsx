import React from 'react';
import { ctaVariants } from '../../constants/masonryConstants';

interface CtaCardProps {
  ctaIdx: number;
  onClick?: () => void;
}

function getCtaIcon(iconType: string) {
  switch (iconType) {
    case 'recommend':
      return (
        <svg width="32" height="32" fill="none" viewBox="0 0 32 32">
          <circle cx="16" cy="16" r="16" fill="#27272a" />
          <path
            d="M16 10v8m0 0v4m0-4h4m-4 0h-4"
            stroke="#f472b6"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );
    case 'trending':
      return (
        <svg width="32" height="32" fill="none" viewBox="0 0 32 32">
          <circle cx="16" cy="16" r="16" fill="#18181b" />
          <path d="M10 18l4-4 4 4 4-4" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'collection':
      return (
        <svg width="32" height="32" fill="none" viewBox="0 0 32 32">
          <circle cx="16" cy="16" r="16" fill="#18181b" />
          <rect x="10" y="14" width="12" height="4" rx="2" fill="#a3e635" />
        </svg>
      );
    case 'add-channel':
      return (
        <svg width="32" height="32" fill="none" viewBox="0 0 32 32">
          <circle cx="16" cy="16" r="16" fill="#27272a" />
          <path
            d="M16 8v16m-8-8h16"
            stroke="#52525b"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    default:
      return null;
  }
}

export function CtaCard({ ctaIdx, onClick }: CtaCardProps) {
  const cta = ctaVariants[ctaIdx % ctaVariants.length];
  return (
    <div className="w-full h-full rounded-2xl border border-zinc-800 bg-zinc-950 p-6 flex flex-col items-center justify-center text-center shadow-lg hover:scale-105 hover:shadow-2xl transition-transform duration-200">
      <div className="mb-2">{getCtaIcon(cta.iconType)}</div>
      <div className="text-base font-semibold text-zinc-100 mb-1">{cta.title}</div>
      <div className="text-zinc-400 text-sm mb-3">{cta.desc}</div>
      <button
        onClick={onClick}
        className="px-4 py-2 rounded-full bg-zinc-800 text-zinc-100 text-xs font-medium hover:bg-zinc-700 transition-colors border border-zinc-700"
      >
        {cta.button}
      </button>
    </div>
  );
}
